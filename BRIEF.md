# TechPulse — Real-Time Tech Job Market Intelligence
## Stack: Next.js 14 (App Router) + Tailwind + globe.gl + Three.js

## CRITICAL: The Globe is the Hero
The entire site centers around a full-screen interactive 3D globe (globe.gl library).
This is the #1 most important feature. Everything else is secondary.

## Globe Implementation (`components/Globe.tsx`)
- Use `globe.gl` npm package
- Must be loaded with `dynamic(() => import('./GlobeInner'), { ssr: false })`
- Full viewport: `width: 100vw, height: 100vh, position: fixed`
- Dark space background: `#060d1a`
- Globe atmosphere color: `#1a3a5c`

### Globe Data Layers (toggleable via sidebar)
1. **🔴 LAYOFFS** (default ON)
   - Red pulsing dots at company HQ coordinates
   - Dot size proportional to headcount laid off
   - Altitude = 0.01
   - Color: `rgba(239,68,68,0.8)`
   - Pulse animation using pointsData

2. **🟢 HIRING** (default ON)
   - Green dots at companies actively hiring
   - Color: `rgba(34,197,94,0.8)`

3. **💰 TOP TC** (default OFF)
   - Gold dots for highest-paying company HQs
   - Color: `rgba(251,191,36,0.8)`

4. **🔄 TALENT FLOW** (default OFF)
   - Animated arcs between cities showing talent movement
   - Example: "1,200 Google engineers → OpenAI, Anthropic, startups"
   - Arc color: `rgba(99,102,241,0.6)`
   - Use globe's arcsData

### Globe Interactions
- Click a dot → opens CompanyCard panel (right side)
- Auto-rotate slowly when idle (globe.controls().autoRotate = true, speed 0.3)
- Zoom in on click
- Custom HTML labels on hover showing: Company, # laid off, date

## Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  HEADER (sticky, translucent blur backdrop)              │
│  ⚡ TechPulse  [● LIVE]  [clock]  [layer toggles]       │
├────────┬──────────────────────────────────┬──────────────┤
│        │                                  │              │
│ LAYER  │     3D GLOBE (full screen)       │  LIVE FEED   │
│ PANEL  │                                  │  PANEL       │
│ (left) │  Red/green dots pulsing          │  (right)     │
│        │  on real company locations        │              │
│ Toggle │  Click → company card            │  Scrolling   │
│ each   │                                  │  events      │
│ layer  │                                  │              │
├────────┴──────────────────────────────────┴──────────────┤
│  STATS BAR: Total laid off | Hiring | Top TC | Recovery  │
└─────────────────────────────────────────────────────────┘
```

## Company Hardcoded Data (use this, no API needed for globe)
Map these companies to lat/lng for the globe dots:

LAYOFFS (recent, use this exact data array):
```js
const LAYOFFS = [
  { company: "Google", lat: 37.4220, lng: -122.0841, count: 12000, pct: 6, date: "2024-01", sector: "Big Tech" },
  { company: "Meta", lat: 37.4845, lng: -122.1477, count: 11000, pct: 13, date: "2023-03", sector: "Big Tech" },
  { company: "Amazon", lat: 47.6062, lng: -122.3321, count: 27000, pct: 9, date: "2023-01", sector: "Big Tech" },
  { company: "Microsoft", lat: 47.6423, lng: -122.1391, count: 10000, pct: 5, date: "2023-01", sector: "Big Tech" },
  { company: "Salesforce", lat: 37.7946, lng: -122.3999, count: 8000, pct: 10, date: "2023-01", sector: "SaaS" },
  { company: "Twitter/X", lat: 37.7768, lng: -122.4168, count: 6000, pct: 80, date: "2022-11", sector: "Social" },
  { company: "Stripe", lat: 37.7749, lng: -122.4194, count: 1100, pct: 14, date: "2022-11", sector: "Fintech" },
  { company: "Lyft", lat: 37.7749, lng: -122.4194, count: 1072, pct: 26, date: "2023-04", sector: "Mobility" },
  { company: "Zoom", lat: 37.3861, lng: -122.0839, count: 1300, pct: 15, date: "2023-02", sector: "SaaS" },
  { company: "Intel", lat: 37.3875, lng: -121.9636, count: 15000, pct: 15, date: "2024-08", sector: "Semiconductor" },
  { company: "Cisco", lat: 37.3990, lng: -121.9990, count: 4000, pct: 5, date: "2024-02", sector: "Networking" },
  { company: "PayPal", lat: 37.3772, lng: -121.9665, count: 2500, pct: 9, date: "2024-01", sector: "Fintech" },
  { company: "eBay", lat: 37.3769, lng: -121.9674, count: 1000, pct: 9, date: "2024-01", sector: "E-commerce" },
  { company: "Spotify", lat: 59.3293, lng: 18.0686, count: 1500, pct: 17, date: "2023-12", sector: "Media" },
  { company: "Twitch", lat: 37.7749, lng: -122.4194, count: 500, pct: 35, date: "2024-01", sector: "Streaming" },
  { company: "Discord", lat: 37.7749, lng: -122.4194, count: 170, pct: 17, date: "2023-12", sector: "Social" },
  { company: "Snap", lat: 34.0195, lng: -118.4912, count: 1300, pct: 20, date: "2023-08", sector: "Social" },
  { company: "ByteDance", lat: 39.9042, lng: 116.4074, count: 3000, pct: 2, date: "2024-03", sector: "Social" },
  { company: "Shopify", lat: 45.4215, lng: -75.6972, count: 2000, pct: 20, date: "2023-05", sector: "E-commerce" },
  { company: "Coinbase", lat: 37.7749, lng: -122.4194, count: 950, pct: 20, date: "2023-01", sector: "Crypto" },
]

const HIRING = [
  { company: "OpenAI", lat: 37.7749, lng: -122.4194, openRoles: 200, sector: "AI" },
  { company: "Anthropic", lat: 37.7749, lng: -122.4194, openRoles: 150, sector: "AI" },
  { company: "Nvidia", lat: 37.3635, lng: -121.9690, openRoles: 500, sector: "Semiconductor" },
  { company: "Apple", lat: 37.3346, lng: -122.0090, openRoles: 800, sector: "Big Tech" },
  { company: "Tesla", lat: 30.2240, lng: -97.6985, openRoles: 1200, sector: "EV/Auto" },
  { company: "SpaceX", lat: 33.9206, lng: -118.3281, openRoles: 900, sector: "Aerospace" },
  { company: "Mistral", lat: 48.8566, lng: 2.3522, openRoles: 80, sector: "AI" },
  { company: "Perplexity", lat: 37.7749, lng: -122.4194, openRoles: 50, sector: "AI" },
]

const TALENT_ARCS = [
  { startLat: 37.4220, startLng: -122.0841, endLat: 37.7749, endLng: -122.4194, label: "Ex-Google → OpenAI", count: 340 },
  { startLat: 37.4845, startLng: -122.1477, endLat: 37.7749, endLng: -122.4194, label: "Ex-Meta → Anthropic", count: 210 },
  { startLat: 47.6062, startLng: -122.3321, endLat: 37.3635, endLng: -121.9690, label: "Ex-Amazon → Nvidia", count: 180 },
  { startLat: 37.4220, startLng: -122.0841, endLat: 48.8566, endLng: 2.3522, label: "Ex-Google → Mistral", count: 95 },
]

const TOP_TC = [
  { company: "Jane Street", lat: 40.7128, lng: -74.0060, avgTC: 900000, sector: "Finance/Tech" },
  { company: "Citadel", lat: 41.8781, lng: -87.6298, avgTC: 750000, sector: "Finance/Tech" },
  { company: "OpenAI", lat: 37.7749, lng: -122.4194, avgTC: 600000, sector: "AI" },
  { company: "Google DeepMind", lat: 51.5074, lng: -0.1278, avgTC: 550000, sector: "AI" },
  { company: "Anthropic", lat: 37.7749, lng: -122.4194, avgTC: 500000, sector: "AI" },
  { company: "Nvidia", lat: 37.3635, lng: -121.9690, avgTC: 480000, sector: "Semiconductor" },
  { company: "Meta", lat: 37.4845, lng: -122.1477, avgTC: 450000, sector: "Big Tech" },
  { company: "Google", lat: 37.4220, lng: -122.0841, avgTC: 420000, sector: "Big Tech" },
]
```

## Layer Toggle Panel (left sidebar, `components/LayerPanel.tsx`)
```
┌──────────────────┐
│ 🎛 LAYERS        │
├──────────────────┤
│ 🔴 Layoffs    ●  │  ← toggle switch
│ 🟢 Hiring     ●  │
│ 💰 Top TC     ○  │
│ 🔄 Talent     ○  │
└──────────────────┘
```
- Glassmorphism style: `background: rgba(10,15,26,0.85), backdrop-filter: blur(12px)`
- Clicking toggle updates globe in real-time

## Live Feed Panel (right sidebar, `components/LiveFeed.tsx`)
- Shows last 20 events (layoffs + hiring + talent moves)
- Each card: company logo placeholder (colored square), company name, event type badge, count, time ago
- Auto-scroll on new events
- Click event → globe zooms to that company's location

## Company Card (appears on globe dot click, `components/CompanyCard.tsx`)
- Slides in from right, overlays feed panel
- Shows: Company name, sector badge, # laid off, % of workforce, date, source link
- **InterviewCoder CTA button**: "Practice [Company] interviews →" links to https://interviewcoder.co
- Map of office locations

## Stats Bar (bottom, `components/StatsBar.tsx`)
```
Total Laid Off 2024: 428,000  |  Currently Hiring: 3,640 roles  |  Top TC: Jane Street $900k  |  Market: 📈 Recovering
```

## Header (`components/Header.tsx`)
- Logo: `⚡ TechPulse`
- Tagline: `Real-time tech job market intelligence`
- `● LIVE` with CSS pulse animation
- Live clock (updates every second)
- Auto-refresh countdown (5 min)

## Pages
- `/` — Main globe dashboard
- `/company/[slug]` — Company deep-dive page
  - All layoff events timeline
  - Salary data (TC ranges by level)
  - Recent news
  - InterviewCoder CTA: "Interviewing at [Company]? Practice their exact questions →"

## API Routes
- `GET /api/layoffs` — returns LAYOFFS array as JSON (later: fetch from layoffs.fyi CSV)
- `GET /api/feed` — fetches TechCrunch + HN RSS, filters for job market keywords

## Style
- Dark: `#060d1a` background
- Cards: `rgba(10,15,26,0.85)` + `border: 1px solid rgba(255,255,255,0.08)`
- Glassmorphism throughout
- Monospace for numbers
- Smooth animations everywhere
- Mobile: hide sidepanels, show bottom sheet on dot click

## npm packages needed
- globe.gl
- three
- react-globe.gl (wrapper for React)
- date-fns (for time formatting)

## Run command
`npm run dev` → port 3000

