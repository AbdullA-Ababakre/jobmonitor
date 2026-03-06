import { NextResponse } from 'next/server';
export const revalidate = 600;

// Tech roles filter
const TECH_ROLE = /engineer|developer|scientist|architect|ml|machine learning|data|backend|frontend|fullstack|full.?stack|devops|platform|infrastructure|security|mobile|ios|android|ai|software|research|sre|site reliability|analytics|product manager|pm|design|designer|embedded|firmware|hardware|compiler|kernel|systems/i;

// Tech-focused companies with Greenhouse public job boards
const GREENHOUSE_COMPANIES = [
  'anthropic', 'openai', 'stripe', 'airbnb', 'discord', 'notion',
  'figma', 'databricks', 'scale', 'cohere', 'mistral', 'huggingface',
  'linear', 'vercel', 'supabase', 'planetscale', 'replicate',
];

async function getGreenhouseJobs(): Promise<any[]> {
  const results: any[] = [];
  const fetches = GREENHOUSE_COMPANIES.slice(0, 8).map(async (slug) => {
    try {
      const res = await fetch(
        `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=false`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const jobs = (data.jobs || []).filter((j: any) => TECH_ROLE.test(j.title || '')).slice(0, 3);
      for (const j of jobs) {
        results.push({
          company: slug.charAt(0).toUpperCase() + slug.slice(1),
          role: j.title,
          location: j.location?.name || 'Remote / US',
          remote: /remote/i.test(j.location?.name || ''),
          source: 'Greenhouse',
          badge: '⚡',
          url: j.absolute_url,
          applyUrl: j.absolute_url,
          postedAt: j.updated_at || new Date().toISOString(),
          freshnessMs: Date.now() - new Date(j.updated_at || 0).getTime(),
        });
      }
    } catch (_) {}
  });
  await Promise.all(fetches);
  return results.sort((a, b) => a.freshnessMs - b.freshnessMs);
}

async function getRemoteOKJobs(): Promise<any[]> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'TechPulse/1.0 (+https://techpulse.ai)' },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const jobs = data.filter((j: any) => j.company && j.position);

    // Filter to SWE/ML/Data/PM roles
    const techRoles = /engineer|developer|scientist|ml|machine learning|data|product manager|backend|frontend|fullstack|full.?stack|devops|platform|infrastructure|security|mobile|ios|android|ai|design/i;

    return jobs
      .filter((j: any) => techRoles.test(j.position || '') || techRoles.test((j.tags || []).join(' ')))
      .slice(0, 20)
      .map((j: any) => ({
        company: j.company,
        role: j.position,
        location: 'Remote',
        remote: true,
        source: 'RemoteOK',
        badge: '🆕',
        url: j.apply_url || j.url,
        applyUrl: j.apply_url || j.url,
        postedAt: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
        freshnessMs: j.date ? Date.now() - new Date(j.date).getTime() : 0,
        tags: (j.tags || []).slice(0, 3),
        salary: j.salary,
      }))
      .sort((a: any, b: any) => a.freshnessMs - b.freshnessMs);
  } catch (e) {
    return [];
  }
}

async function getHNHiringJobs(): Promise<any[]> {
  try {
    // Get latest "Who is Hiring" thread
    const s = await fetch(
      'https://hn.algolia.com/api/v1/search?query=Ask+HN:+Who+is+hiring&tags=ask_hn&hitsPerPage=1',
      { next: { revalidate: 3600 } }
    );
    const sd = await s.json();
    const thread = sd?.hits?.[0];
    if (!thread) return [];

    const threadId = thread.objectID;
    const since = Math.floor((Date.now() - 7 * 86400000) / 1000);
    const cr = await fetch(
      `https://hn.algolia.com/api/v1/search?tags=comment,story_${threadId}&numericFilters=created_at_i>${since}&hitsPerPage=30`,
      { next: { revalidate: 600 } }
    );
    const cd = await cr.json();

    return (cd?.hits || [])
      .filter((h: any) => h.comment_text && h.comment_text.length > 100)
      .map((h: any) => {
        const clean = h.comment_text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const companyM = clean.match(/^([^|({\n]{2,35}?)\s*[|(]/);
        const company = companyM?.[1]?.trim() || clean.slice(0, 25).trim();
        const roleM = clean.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)* (?:Engineer|Developer|Designer|Scientist|Manager|Lead|Architect|Researcher)[^\n.]{0,30})/);
        const role = roleM?.[1]?.trim() || 'Software Engineer';
        const remote = /\bremote\b/i.test(clean);
        const locM = clean.match(/\b(New York|San Francisco|London|Berlin|Austin|Seattle|Boston|Toronto|Singapore|NYC|SF|Remote)\b/i);
        return {
          company: company.slice(0, 35),
          role: role.slice(0, 55),
          location: locM?.[1] || (remote ? 'Remote' : 'US'),
          remote,
          source: 'HN Hiring',
          badge: '🆕',
          url: `https://news.ycombinator.com/item?id=${h.objectID}`,
          applyUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
          postedAt: h.created_at,
          freshnessMs: Date.now() - new Date(h.created_at).getTime(),
        };
      })
      .sort((a: any, b: any) => a.freshnessMs - b.freshnessMs)
      .slice(0, 15);
  } catch (_) {
    return [];
  }
}

export async function GET() {
  const [greenhouse, remoteok, hn] = await Promise.all([
    getGreenhouseJobs(),
    getRemoteOKJobs(),
    getHNHiringJobs(),
  ]);

  // Merge: Greenhouse first (most credible apply links), then RemoteOK, then HN
  const all = [...greenhouse, ...remoteok, ...hn];
  const seen = new Set<string>();
  const deduped = all.filter(j => {
    const k = j.company.toLowerCase().slice(0, 12);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 35);

  return NextResponse.json({
    jobs: deduped,
    date: new Date().toISOString().slice(0, 10),
    sources: { greenhouse: greenhouse.length, remoteok: remoteok.length, hn: hn.length },
    updatedAt: new Date().toISOString(),
  });
}
