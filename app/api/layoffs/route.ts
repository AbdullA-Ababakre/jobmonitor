import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const revalidate = 0; // Always fresh — cron writes the cache file

const GEO: Record<string, [number, number]> = {
  'Google': [37.4220, -122.0841], 'Alphabet': [37.4220, -122.0841],
  'Meta': [37.4845, -122.1477], 'Facebook': [37.4845, -122.1477],
  'Amazon': [47.6062, -122.3321], 'Microsoft': [47.6423, -122.1391],
  'Apple': [37.3346, -122.0090], 'Tesla': [30.2265, -97.7742],
  'Salesforce': [37.7951, -122.3993], 'Snap': [34.0195, -118.4912],
  'Spotify': [40.7589, -73.9851], 'Netflix': [37.2431, -121.9690],
  'Lyft': [37.7749, -122.4194], 'Uber': [37.7749, -122.4194],
  'Airbnb': [37.7749, -122.4194], 'Stripe': [37.7749, -122.4194],
  'Block': [37.7749, -122.4194], 'Square': [37.7749, -122.4194],
  'Coinbase': [37.7749, -122.4194], 'Rivian': [41.8827, -87.6233],
  'Intel': [37.3875, -121.9633], 'Cisco': [37.4070, -121.9680],
  'IBM': [40.7128, -74.0060], 'Dell': [30.2265, -97.7742],
  'HP': [37.3875, -121.9633], 'Workday': [37.6879, -122.0616],
  'Dropbox': [37.7749, -122.4194], 'Discord': [37.7749, -122.4194],
  'Reddit': [37.7749, -122.4194], 'Pinterest': [37.7749, -122.4194],
  'Robinhood': [37.7749, -122.4194], 'Peloton': [40.7128, -74.0060],
  'Zoom': [37.3875, -121.9633], 'Okta': [37.7749, -122.4194],
  'Palantir': [39.7392, -104.9903], 'Snowflake': [45.5051, -122.6750],
  'Unity': [37.7749, -122.4194], 'Roblox': [37.7749, -122.4194],
  'EA': [37.4532, -121.9347], 'Riot Games': [34.0522, -118.2437],
  'Activision': [34.0522, -118.2437], 'Disney': [34.1341, -118.3215],
  'CNN': [33.7490, -84.3880], 'Wayfair': [42.3601, -71.0589],
  'eBay': [37.4532, -121.9347], 'PayPal': [37.3688, -121.9250],
  'Shopify': [45.4215, -75.6919], 'Twilio': [37.7749, -122.4194],
  'HubSpot': [42.3601, -71.0589], 'Klarna': [59.3293, 18.0686],
  'SAP': [48.5424, 9.0546], 'Nokia': [60.2241, 24.7584],
  'Ericsson': [59.4044, 17.9514], 'Ford': [42.3223, -83.1763],
  'GM': [42.3314, -83.0458], 'Boeing': [47.5480, -122.3129],
  'Qualcomm': [32.7157, -117.1611], 'Nvidia': [37.3688, -121.9250],
  'AMD': [37.3688, -121.9250], 'Verizon': [40.7128, -74.0060],
  'Warner Bros': [34.0522, -118.2437], 'Paramount': [34.0522, -118.2437],
  'Supernal': [33.6695, -117.8229], 'Microvision': [47.6062, -122.3321],
  'Verint': [40.7128, -74.0060], 'Chegg': [37.3688, -121.9250],
  'Zillow': [47.6062, -122.3321], 'Redfin': [47.6062, -122.3321],
  'Instacart': [37.7749, -122.4194], 'DoorDash': [37.7749, -122.4194],
  'Opendoor': [37.7749, -122.4194], 'WeWork': [40.7128, -74.0060],
  'Zendesk': [37.7749, -122.4194], 'Twitch': [37.7749, -122.4194],
};

function getCoords(name: string): [number, number] | null {
  if (GEO[name]) return GEO[name];
  for (const [k, v] of Object.entries(GEO)) {
    if (name.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(name.toLowerCase())) return v;
  }
  return null;
}

// Up-to-date hardcoded list — manually maintained, sorted newest first
const KNOWN_LAYOFFS = [
  // March 2026
  { company: 'Block', count: 4000, pct: 40, date: '2026-02-26', sector: 'Fintech', location: 'San Francisco, CA', url: 'https://www.cnbc.com/2026/02/26/block-laying-off-about-4000-employees-nearly-half-of-its-workforce.html' },
  { company: 'eBay', count: 800, pct: 6, date: '2026-03-04', sector: 'E-commerce', location: 'San Jose, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Supernal', count: 296, pct: 80, date: '2026-03-04', sector: 'eVTOL / Aerospace', location: 'Irvine, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Riot Games', count: 80, pct: 3, date: '2026-02-10', sector: 'Gaming', location: 'Los Angeles, CA', url: 'https://www.gamedeveloper.com/business/riot-games-lays-off-roughly-80-employees-from-2xko-team' },
  // Feb 2026
  { company: 'Workday', count: 1750, pct: 8.5, date: '2026-02-14', sector: 'HR Tech', location: 'Pleasanton, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Meta', count: 3600, pct: 5, date: '2026-02-11', sector: 'Social Media', location: 'Menlo Park, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Snap', count: 500, pct: 10, date: '2026-02-05', sector: 'Social Media', location: 'Santa Monica, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Salesforce', count: 1000, pct: 1, date: '2026-02-01', sector: 'SaaS / CRM', location: 'San Francisco, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Dropbox', count: 500, pct: 20, date: '2026-02-01', sector: 'Cloud Storage', location: 'San Francisco, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  // Jan 2026
  { company: 'Wayfair', count: 1650, pct: 13, date: '2026-01-31', sector: 'E-commerce', location: 'Boston, MA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Chegg', count: 300, pct: 23, date: '2026-01-28', sector: 'EdTech', location: 'Santa Clara, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Microsoft', count: 1900, pct: 1, date: '2026-01-13', sector: 'Enterprise Tech', location: 'Redmond, WA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Google', count: 1000, pct: 1, date: '2026-01-15', sector: 'Big Tech', location: 'Mountain View, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Amazon', count: 16000, pct: 1, date: '2026-01-18', sector: 'E-commerce / Cloud', location: 'Seattle, WA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  // 2025 (notable)
  { company: 'Intel', count: 15000, pct: 15, date: '2025-08-01', sector: 'Semiconductors', location: 'Santa Clara, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Verizon', count: 15000, pct: 6, date: '2025-09-01', sector: 'Telecom', location: 'New York, NY', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Cisco', count: 4250, pct: 5, date: '2025-10-15', sector: 'Networking', location: 'San Jose, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Tesla', count: 3000, pct: 4, date: '2025-10-12', sector: 'EV / Energy', location: 'Austin, TX', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'PayPal', count: 2500, pct: 9, date: '2025-09-20', sector: 'Fintech', location: 'San Jose, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Spotify', count: 1500, pct: 17, date: '2025-07-03', sector: 'Music Streaming', location: 'New York, NY', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'IBM', count: 3900, pct: 3.9, date: '2025-01-22', sector: 'Enterprise Tech', location: 'Armonk, NY', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'SAP', count: 8000, pct: 8, date: '2025-02-10', sector: 'Enterprise Tech', location: 'Walldorf, Germany', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Disney', count: 7000, pct: 3.5, date: '2025-03-01', sector: 'Media / Tech', location: 'Burbank, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Rivian', count: 1100, pct: 10, date: '2025-06-20', sector: 'EV', location: 'Irvine, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { company: 'Twilio', count: 1400, pct: 17, date: '2025-02-14', sector: 'Cloud Comms', location: 'San Francisco, CA', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
].map(l => ({
  ...l,
  isBreaking: Date.now() - new Date(l.date).getTime() < 7 * 86400000,
  slug: l.company.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  lat: getCoords(l.company)?.[0] ?? null,
  lng: getCoords(l.company)?.[1] ?? null,
}));

// Try to read from hourly cron-written cache
function readCache(): any[] {
  try {
    const cachePath = join(process.cwd(), 'public', 'layoffs-cache.json');
    const raw = readFileSync(cachePath, 'utf-8');
    const data = JSON.parse(raw);
    // Only use cache if freshened within last 2 hours
    if (data.updatedAt && Date.now() - new Date(data.updatedAt).getTime() < 7200000) {
      return data.layoffs || [];
    }
  } catch (_) {}
  return [];
}

// Scrape Crunchbase layoffs tracker (best source — updates weekly)
async function scrapeCrunchbase(): Promise<any[]> {
  try {
    const res = await fetch('https://news.crunchbase.com/startups/tech-layoffs/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const results: any[] = [];
    // Parse list items with company links — Crunchbase uses <li> with company names and counts
    // Pattern: "Company laid off X employees"
    const patterns = [
      /href="[^"]*crunchbase\.com\/organization\/([^"]+)"[^>]*>([^<]+)<\/a>[^,]*,\s*(?:which is |will |is )?(?:laying off|laid off|cutting|slashing)[^.]*?(\d[\d,]*)\s*(?:employees|workers|roles|jobs|positions)/gi,
      /\[([^\]]+)\]\([^)]*crunchbase\.com\/organization\/[^)]+\)[^.]*?(\d[\d,]*)\s*(?:employees|workers|roles|jobs)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const company = (match[2] || match[1]).trim();
        const count = parseInt((match[3] || match[2]).replace(/,/g, ''));
        if (!company || isNaN(count) || count < 10) continue;

        const coords = getCoords(company);
        results.push({
          company,
          count,
          pct: null,
          date: new Date().toISOString().slice(0, 10),
          sector: 'Technology',
          url: 'https://news.crunchbase.com/startups/tech-layoffs/',
          isBreaking: true,
          slug: company.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          lat: coords?.[0] ?? null,
          lng: coords?.[1] ?? null,
        });
      }
    }
    return results;
  } catch (_) {
    return [];
  }
}

// HN layoff stories last 7 days
async function hnLayoffs(): Promise<any[]> {
  try {
    const since = Math.floor((Date.now() - 7 * 86400000) / 1000);
    const r = await fetch(
      `https://hn.algolia.com/api/v1/search?query=layoffs+laid+off&tags=story&numericFilters=created_at_i>${since},points>20&hitsPerPage=20`
    );
    const d = await r.json();
    return (d?.hits || [])
      .filter((h: any) => /layoff|laid.?off/i.test(h.title || ''))
      .map((h: any) => {
        const countM = h.title.match(/(\d[\d,]+)\s+(?:employees|workers|jobs)/i);
        const coM = h.title.match(/^([A-Z][a-zA-Z0-9\s&]+?)\s+(?:laid off|is laying|lays off|cuts|cut)\b/i);
        const co = coM?.[1]?.trim();
        if (!co || co.length > 35) return null;
        const coords = getCoords(co);
        return {
          company: co,
          count: countM ? parseInt(countM[1].replace(/,/g, '')) : 0,
          pct: null,
          date: new Date(h.created_at).toISOString().slice(0, 10),
          sector: 'Technology',
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          isBreaking: Date.now() - new Date(h.created_at).getTime() < 86400000,
          slug: co.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          lat: coords?.[0] ?? null,
          lng: coords?.[1] ?? null,
        };
      }).filter(Boolean);
  } catch (_) { return []; }
}

export async function GET() {
  // 1. Try hourly cache first
  const cached = readCache();

  // 2. Scrape live sources
  const [cb, hn] = await Promise.all([scrapeCrunchbase(), hnLayoffs()]);

  // 3. Merge: cache + scraped + hardcoded fallback
  // Hardcoded is always the backbone; scraped fills in new items
  const knownCos = new Set(KNOWN_LAYOFFS.map(l => l.company.toLowerCase().slice(0, 8)));
  const newFromScrape = [...cached, ...cb, ...hn].filter(l => {
    const k = l.company?.toLowerCase().slice(0, 8);
    return k && !knownCos.has(k);
  });

  const all = [...newFromScrape, ...KNOWN_LAYOFFS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Deduplicate
  const seen = new Set<string>();
  const deduped = all.filter(l => {
    const k = (l.company || '').toLowerCase().slice(0, 10);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const withCoords = deduped.filter(l => l.lat && l.lng);
  const noCoords = deduped.filter(l => !l.lat || !l.lng);

  return NextResponse.json({
    layoffs: withCoords,
    noCoords,
    total: deduped.length,
    sources: { cached: cached.length, crunchbase: cb.length, hn: hn.length, hardcoded: KNOWN_LAYOFFS.length },
    updatedAt: new Date().toISOString(),
  });
}
