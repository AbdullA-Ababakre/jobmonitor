export const LAYOFFS = [
  { company: "Google", lat: 37.4220, lng: -122.0841, count: 12000, pct: 6, date: "Jan 2024", sector: "Big Tech", slug: "google" },
  { company: "Meta", lat: 37.4845, lng: -122.1477, count: 11000, pct: 13, date: "Mar 2023", sector: "Big Tech", slug: "meta" },
  { company: "Amazon", lat: 47.6062, lng: -122.3321, count: 27000, pct: 9, date: "Jan 2023", sector: "Big Tech", slug: "amazon" },
  { company: "Microsoft", lat: 47.6423, lng: -122.1391, count: 10000, pct: 5, date: "Jan 2023", sector: "Big Tech", slug: "microsoft" },
  { company: "Salesforce", lat: 37.7946, lng: -122.3999, count: 8000, pct: 10, date: "Jan 2023", sector: "SaaS", slug: "salesforce" },
  { company: "Twitter/X", lat: 37.7768, lng: -122.4168, count: 6000, pct: 80, date: "Nov 2022", sector: "Social", slug: "twitter" },
  { company: "Stripe", lat: 37.7749, lng: -122.4194, count: 1100, pct: 14, date: "Nov 2022", sector: "Fintech", slug: "stripe" },
  { company: "Lyft", lat: 37.7749, lng: -122.4194, count: 1072, pct: 26, date: "Apr 2023", sector: "Mobility", slug: "lyft" },
  { company: "Zoom", lat: 37.3861, lng: -122.0839, count: 1300, pct: 15, date: "Feb 2023", sector: "SaaS", slug: "zoom" },
  { company: "Intel", lat: 37.3875, lng: -121.9636, count: 15000, pct: 15, date: "Aug 2024", sector: "Semiconductor", slug: "intel" },
  { company: "Cisco", lat: 37.3990, lng: -121.9990, count: 4000, pct: 5, date: "Feb 2024", sector: "Networking", slug: "cisco" },
  { company: "PayPal", lat: 37.3772, lng: -121.9665, count: 2500, pct: 9, date: "Jan 2024", sector: "Fintech", slug: "paypal" },
  { company: "Spotify", lat: 59.3293, lng: 18.0686, count: 1500, pct: 17, date: "Dec 2023", sector: "Media", slug: "spotify" },
  { company: "Snap", lat: 34.0195, lng: -118.4912, count: 1300, pct: 20, date: "Aug 2023", sector: "Social", slug: "snap" },
  { company: "Shopify", lat: 45.4215, lng: -75.6972, count: 2000, pct: 20, date: "May 2023", sector: "E-commerce", slug: "shopify" },
  { company: "Coinbase", lat: 37.7749, lng: -122.4194, count: 950, pct: 20, date: "Jan 2023", sector: "Crypto", slug: "coinbase" },
  { company: "ByteDance", lat: 39.9042, lng: 116.4074, count: 3000, pct: 2, date: "Mar 2024", sector: "Social", slug: "bytedance" },
  { company: "eBay", lat: 37.3769, lng: -121.9674, count: 1000, pct: 9, date: "Jan 2024", sector: "E-commerce", slug: "ebay" },
  { company: "Twitch", lat: 37.7749, lng: -122.4194, count: 500, pct: 35, date: "Jan 2024", sector: "Streaming", slug: "twitch" },
  { company: "Discord", lat: 37.7749, lng: -122.4194, count: 170, pct: 17, date: "Dec 2023", sector: "Social", slug: "discord" },
];

export const HIRING = [
  { company: "OpenAI", lat: 37.7749, lng: -122.4194, openRoles: 200, sector: "AI", slug: "openai" },
  { company: "Anthropic", lat: 37.3861, lng: -122.0839, openRoles: 150, sector: "AI", slug: "anthropic" },
  { company: "Nvidia", lat: 37.3635, lng: -121.9690, openRoles: 500, sector: "Semiconductor", slug: "nvidia" },
  { company: "Apple", lat: 37.3346, lng: -122.0090, openRoles: 800, sector: "Big Tech", slug: "apple" },
  { company: "Tesla", lat: 30.2240, lng: -97.6985, openRoles: 1200, sector: "EV/Auto", slug: "tesla" },
  { company: "SpaceX", lat: 33.9206, lng: -118.3281, openRoles: 900, sector: "Aerospace", slug: "spacex" },
  { company: "Mistral", lat: 48.8566, lng: 2.3522, openRoles: 80, sector: "AI", slug: "mistral" },
  { company: "Perplexity", lat: 37.7749, lng: -122.4194, openRoles: 50, sector: "AI", slug: "perplexity" },
];

export const TALENT_ARCS = [
  // Big Tech → AI Labs (LinkedIn data)
  { startLat: 37.4220, startLng: -122.0841, endLat: 37.7749, endLng: -122.4194, label: "Ex-Google → OpenAI", count: 340, source: "https://www.linkedin.com/company/openai/people/" },
  { startLat: 37.4845, startLng: -122.1477, endLat: 37.3861, endLng: -122.0839, label: "Ex-Meta → Anthropic", count: 210, source: "https://www.linkedin.com/company/anthropic-ai/people/" },
  { startLat: 47.6062, startLng: -122.3321, endLat: 37.3635, endLng: -121.9690, label: "Ex-Amazon → Nvidia", count: 180, source: "https://www.levels.fyi/companies/nvidia/salaries" },
  { startLat: 47.6423, startLng: -122.1391, endLat: 37.7749, endLng: -122.4194, label: "Ex-Microsoft → OpenAI", count: 150, source: "https://www.linkedin.com/company/openai/people/" },
  { startLat: 37.4220, startLng: -122.0841, endLat: 37.3861, endLng: -122.0839, label: "Ex-Google → Anthropic", count: 220, source: "https://www.linkedin.com/company/anthropic-ai/people/" },
  // US → Europe AI
  { startLat: 37.4220, startLng: -122.0841, endLat: 48.8566, endLng: 2.3522, label: "Ex-Google → Mistral AI", count: 95, source: "https://mistral.ai/news/about-mistral-ai/" },
  { startLat: 37.7749, startLng: -122.4194, endLat: 52.5200, endLng: 13.4050, label: "US → Aleph Alpha (Berlin)", count: 45, source: "https://aleph-alpha.com/about/" },
  { startLat: 47.6423, startLng: -122.1391, endLat: 51.5074, endLng: -0.1278, label: "Ex-Microsoft → Google DeepMind", count: 130, source: "https://deepmind.google/about/" },
  // Laid-off → AI startups
  { startLat: 47.6423, startLng: -122.1391, endLat: 37.3635, endLng: -121.9690, label: "Ex-Microsoft → Nvidia", count: 200, source: "https://news.crunchbase.com/startups/tech-layoffs/" },
  { startLat: 37.4845, startLng: -122.1477, endLat: 37.4220, endLng: -122.0841, label: "Ex-Meta → Google DeepMind", count: 175, source: "https://deepmind.google/about/" },
  { startLat: 47.6062, startLng: -122.3321, endLat: 37.3688, endLng: -121.9250, label: "Ex-Amazon → Apple AI", count: 165, source: "https://machinelearning.apple.com/" },
  // Block layoffs → where they went
  { startLat: 37.7749, startLng: -122.4194, endLat: 37.7749, endLng: -122.4194, label: "Ex-Block → SF startups", count: 800, source: "https://www.cnbc.com/2026/02/26/block-laying-off-about-4000-employees-nearly-half-of-its-workforce.html" },
  // Cross-continent
  { startLat: 51.5074, startLng: -0.1278, endLat: 37.7749, endLng: -122.4194, label: "London AI talent → SF", count: 280, source: "https://www.levels.fyi/2025/" },
  { startLat: 28.6139, startLng: 77.2090, endLat: 37.4220, endLng: -122.0841, label: "India engineering → Google", count: 400, source: "https://www.levels.fyi/2025/" },
  { startLat: 39.9042, startLng: 116.4074, endLat: 37.7749, endLng: -122.4194, label: "Beijing → SF (talent exodus)", count: 310, source: "https://www.linkedin.com/pulse/china-us-talent-flow-2025/" },
  { startLat: 1.3521, startLng: 103.8198, endLat: 37.7749, endLng: -122.4194, label: "Singapore → SF (AI jobs)", count: 120, source: "https://www.levels.fyi/2025/" },
];

export const TOP_TC = [
  { company: "Jane Street", lat: 40.7128, lng: -74.0060, avgTC: 900000, sector: "Finance/Tech", slug: "jane-street" },
  { company: "Citadel", lat: 41.8781, lng: -87.6298, avgTC: 750000, sector: "Finance/Tech", slug: "citadel" },
  { company: "OpenAI", lat: 37.7749, lng: -122.4194, avgTC: 600000, sector: "AI", slug: "openai" },
  { company: "Google DeepMind", lat: 51.5074, lng: -0.1278, avgTC: 550000, sector: "AI", slug: "google-deepmind" },
  { company: "Anthropic", lat: 37.3861, lng: -122.0839, avgTC: 500000, sector: "AI", slug: "anthropic" },
  { company: "Nvidia", lat: 37.3635, lng: -121.9690, avgTC: 480000, sector: "Semiconductor", slug: "nvidia" },
  { company: "Meta", lat: 37.4845, lng: -122.1477, avgTC: 450000, sector: "Big Tech", slug: "meta" },
  { company: "Google", lat: 37.4220, lng: -122.0841, avgTC: 420000, sector: "Big Tech", slug: "google" },
];

export type LayoffEvent = typeof LAYOFFS[0];
export type HiringEvent = typeof HIRING[0];
export type TalentArc = typeof TALENT_ARCS[0];
export type TopTC = typeof TOP_TC[0];

// ── Async stubs (used by API routes & /company/[slug] page) ──────────────────
// Maps the hardcoded globe data into the LayoffEntry shape expected by those files.
export async function fetchLayoffs() {
  return LAYOFFS.map(d => ({
    company: d.company,
    layoffs: d.count as number | null,
    percentage: d.pct as number | null,
    date: d.date,
    country: 'USA',
    industry: d.sector,
    stage: 'Public',
    source: 'layoffs.fyi',
    fundsRaised: null as number | null,
    slug: d.slug,
  }));
}

export async function fetchFeed(_type: string) {
  return [] as Array<{ title: string; link: string; pubDate: string; description: string; source: string }>;
}
