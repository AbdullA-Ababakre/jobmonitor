import { NextResponse } from 'next/server';

export const revalidate = 900; // 15 min

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

// Normalize company names for display
function cleanCompany(raw: string): string {
  return raw
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaced
    .replace(/^(goldmansachs)$/i, 'Goldman Sachs')
    .replace(/^(openai)$/i, 'OpenAI')
    .replace(/^(bytedance)$/i, 'ByteDance')
    .replace(/^(tiktok)$/i, 'TikTok')
    .replace(/^(docusign)$/i, 'DocuSign')
    .replace(/^(linkedin)$/i, 'LinkedIn')
    .replace(/^(paypal)$/i, 'PayPal')
    .replace(/^(doordash)$/i, 'DoorDash')
    .replace(/^(ebay)$/i, 'eBay')
    .replace(/^(grubhub)$/i, 'Grubhub')
    .replace(/^(hubspot)$/i, 'HubSpot')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const COMPANY_LOGO: Record<string, string> = {
  'google': '🔵', 'meta': '🔷', 'amazon': '📦', 'apple': '🍎',
  'microsoft': '🪟', 'netflix': '🎬', 'stripe': '💳', 'openai': '🤖',
  'anthropic': '🧠', 'airbnb': '🏠', 'uber': '🚗', 'lyft': '🚕',
  'twitter': '🐦', 'linkedin': '💼', 'salesforce': '☁️', 'adobe': '🎨',
  'spotify': '🎵', 'discord': '💬', 'figma': '✏️', 'notion': '📝',
  'databricks': '⚡', 'snowflake': '❄️', 'palantir': '🔮', 'coinbase': '₿',
  'shopify': '🛍️', 'zoom': '📹', 'slack': '💬', 'dropbox': '📁',
  'twilio': '📞', 'pinterest': '📌', 'reddit': '🤖', 'snap': '👻',
  'roblox': '🎮', 'unity': '🎮', 'twitch': '🎮', 'playstation': '🎮',
  'tesla': '⚡', 'spacex': '🚀', 'nvidia': '🖥️', 'intel': '💻',
  'amd': '💻', 'qualcomm': '📱', 'axon': '🔫', 'goldmansachs': '💰',
  'goldman sachs': '💰', 'jpmorgan': '💰', 'morgan stanley': '💰',
  'bytedance': '📱', 'tiktok': '📱', 'doordash': '🍕', 'instacart': '🛒',
};

function getEmoji(company: string): string {
  const key = company.toLowerCase();
  for (const [k, v] of Object.entries(COMPANY_LOGO)) {
    if (key.includes(k)) return v;
  }
  return '🏢';
}

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ questions: [], error: 'Missing Supabase config' });
  }

  try {
    // Fetch recent posts with at least 1 question, varied companies
    const postsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_posts?select=id,title,company,position,category,created_at&order=created_at.desc&limit=60`,
      { headers, next: { revalidate: 900 } }
    );
    if (!postsRes.ok) throw new Error(`Posts fetch failed: ${postsRes.status}`);
    const posts: any[] = await postsRes.json();

    // Deduplicate by company — pick 1 per company for variety
    const seenCompanies = new Set<string>();
    const selectedPosts: any[] = [];
    for (const p of posts) {
      const co = (p.company || '').toLowerCase().slice(0, 12);
      if (!co || seenCompanies.has(co)) continue;
      if (!p.title || /asking for forum|for forum credits/i.test(p.title)) continue;
      seenCompanies.add(co);
      selectedPosts.push(p);
      if (selectedPosts.length >= 15) break;
    }

    // Fetch questions for each post
    const withQuestions = await Promise.all(
      selectedPosts.map(async (post) => {
        try {
          const qRes = await fetch(
            `${SUPABASE_URL}/rest/v1/interview_questions?select=description,tags&post_id=eq.${post.id}&limit=2`,
            { headers, next: { revalidate: 900 } }
          );
          if (!qRes.ok) return null;
          const questions: any[] = await qRes.json();
          if (!questions.length) return null;

          // Truncate description for preview
          const preview = questions[0]?.description
            ?.replace(/#+\s?/g, '')       // remove markdown headers
            ?.replace(/\*\*/g, '')         // remove bold
            ?.replace(/\n+/g, ' ')         // flatten newlines
            ?.trim()
            ?.slice(0, 120) || '';

          const allTags = Array.from(new Set(questions.flatMap((q: any) => q.tags || []))).slice(0, 4);
          const company = cleanCompany(post.company || 'Unknown');

          return {
            postId: post.id,
            company,
            emoji: getEmoji(post.company || ''),
            position: post.position || 'Software Engineer',
            title: post.title?.slice(0, 70) || '',
            preview: preview ? preview + (preview.length >= 120 ? '...' : '') : '',
            tags: allTags,
            questionCount: questions.length,
            url: `https://interviewcoder.co/questions?postId=${post.id}`,
            postedAt: post.created_at,
          };
        } catch (_) {
          return null;
        }
      })
    );

    const results = withQuestions.filter(Boolean);

    return NextResponse.json({
      questions: results,
      total: results.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ questions: [], error: err.message }, { status: 500 });
  }
}
