export interface LayoffEntry {
  company: string
  lat: number
  lng: number
  count: number
  pct: number
  date: string
  sector: string
}

export interface HiringEntry {
  company: string
  lat: number
  lng: number
  openRoles: number
  sector: string
}

export interface TalentArc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  label: string
  count: number
}

export interface TopTCEntry {
  company: string
  lat: number
  lng: number
  avgTC: number
  sector: string
}

export const LAYOFFS: LayoffEntry[] = [
  { company: 'Google', lat: 37.4220, lng: -122.0841, count: 12000, pct: 6, date: '2024-01', sector: 'Big Tech' },
  { company: 'Meta', lat: 37.4845, lng: -122.1477, count: 11000, pct: 13, date: '2023-03', sector: 'Big Tech' },
  { company: 'Amazon', lat: 47.6062, lng: -122.3321, count: 27000, pct: 9, date: '2023-01', sector: 'Big Tech' },
  { company: 'Microsoft', lat: 47.6423, lng: -122.1391, count: 10000, pct: 5, date: '2023-01', sector: 'Big Tech' },
  { company: 'Salesforce', lat: 37.7946, lng: -122.3999, count: 8000, pct: 10, date: '2023-01', sector: 'SaaS' },
  { company: 'Twitter/X', lat: 37.7768, lng: -122.4168, count: 6000, pct: 80, date: '2022-11', sector: 'Social' },
  { company: 'Stripe', lat: 37.7749, lng: -122.4194, count: 1100, pct: 14, date: '2022-11', sector: 'Fintech' },
  { company: 'Lyft', lat: 37.7749, lng: -122.4194, count: 1072, pct: 26, date: '2023-04', sector: 'Mobility' },
  { company: 'Zoom', lat: 37.3861, lng: -122.0839, count: 1300, pct: 15, date: '2023-02', sector: 'SaaS' },
  { company: 'Intel', lat: 37.3875, lng: -121.9636, count: 15000, pct: 15, date: '2024-08', sector: 'Semiconductor' },
  { company: 'Cisco', lat: 37.3990, lng: -121.9990, count: 4000, pct: 5, date: '2024-02', sector: 'Networking' },
  { company: 'PayPal', lat: 37.3772, lng: -121.9665, count: 2500, pct: 9, date: '2024-01', sector: 'Fintech' },
  { company: 'eBay', lat: 37.3769, lng: -121.9674, count: 1000, pct: 9, date: '2024-01', sector: 'E-commerce' },
  { company: 'Spotify', lat: 59.3293, lng: 18.0686, count: 1500, pct: 17, date: '2023-12', sector: 'Media' },
  { company: 'Twitch', lat: 37.7749, lng: -122.4194, count: 500, pct: 35, date: '2024-01', sector: 'Streaming' },
  { company: 'Discord', lat: 37.7749, lng: -122.4194, count: 170, pct: 17, date: '2023-12', sector: 'Social' },
  { company: 'Snap', lat: 34.0195, lng: -118.4912, count: 1300, pct: 20, date: '2023-08', sector: 'Social' },
  { company: 'ByteDance', lat: 39.9042, lng: 116.4074, count: 3000, pct: 2, date: '2024-03', sector: 'Social' },
  { company: 'Shopify', lat: 45.4215, lng: -75.6972, count: 2000, pct: 20, date: '2023-05', sector: 'E-commerce' },
  { company: 'Coinbase', lat: 37.7749, lng: -122.4194, count: 950, pct: 20, date: '2023-01', sector: 'Crypto' },
]

export const HIRING: HiringEntry[] = [
  { company: 'OpenAI', lat: 37.7749, lng: -122.4194, openRoles: 200, sector: 'AI' },
  { company: 'Anthropic', lat: 37.7749, lng: -122.4194, openRoles: 150, sector: 'AI' },
  { company: 'Nvidia', lat: 37.3635, lng: -121.9690, openRoles: 500, sector: 'Semiconductor' },
  { company: 'Apple', lat: 37.3346, lng: -122.0090, openRoles: 800, sector: 'Big Tech' },
  { company: 'Tesla', lat: 30.2240, lng: -97.6985, openRoles: 1200, sector: 'EV/Auto' },
  { company: 'SpaceX', lat: 33.9206, lng: -118.3281, openRoles: 900, sector: 'Aerospace' },
  { company: 'Mistral', lat: 48.8566, lng: 2.3522, openRoles: 80, sector: 'AI' },
  { company: 'Perplexity', lat: 37.7749, lng: -122.4194, openRoles: 50, sector: 'AI' },
]

export const TALENT_ARCS: TalentArc[] = [
  { startLat: 37.4220, startLng: -122.0841, endLat: 37.7749, endLng: -122.4194, label: 'Ex-Google → OpenAI', count: 340 },
  { startLat: 37.4845, startLng: -122.1477, endLat: 37.7749, endLng: -122.4194, label: 'Ex-Meta → Anthropic', count: 210 },
  { startLat: 47.6062, startLng: -122.3321, endLat: 37.3635, endLng: -121.9690, label: 'Ex-Amazon → Nvidia', count: 180 },
  { startLat: 37.4220, startLng: -122.0841, endLat: 48.8566, endLng: 2.3522, label: 'Ex-Google → Mistral', count: 95 },
]

export const TOP_TC: TopTCEntry[] = [
  { company: 'Jane Street', lat: 40.7128, lng: -74.0060, avgTC: 900000, sector: 'Finance/Tech' },
  { company: 'Citadel', lat: 41.8781, lng: -87.6298, avgTC: 750000, sector: 'Finance/Tech' },
  { company: 'OpenAI', lat: 37.7749, lng: -122.4194, avgTC: 600000, sector: 'AI' },
  { company: 'Google DeepMind', lat: 51.5074, lng: -0.1278, avgTC: 550000, sector: 'AI' },
  { company: 'Anthropic', lat: 37.7749, lng: -122.4194, avgTC: 500000, sector: 'AI' },
  { company: 'Nvidia', lat: 37.3635, lng: -121.9690, avgTC: 480000, sector: 'Semiconductor' },
  { company: 'Meta', lat: 37.4845, lng: -122.1477, avgTC: 450000, sector: 'Big Tech' },
  { company: 'Google', lat: 37.4220, lng: -122.0841, avgTC: 420000, sector: 'Big Tech' },
]

export const TOTAL_LAID_OFF = LAYOFFS.reduce((sum, e) => sum + e.count, 0)
export const TOTAL_HIRING = HIRING.reduce((sum, e) => sum + e.openRoles, 0)
export const TOP_TC_ENTRY = TOP_TC.reduce((max, e) => e.avgTC > max.avgTC ? e : max, TOP_TC[0])
