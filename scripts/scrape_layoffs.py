#!/usr/bin/env python3
"""
Hourly layoff scraper — writes to techpulse/public/layoffs-cache.json
Sources: Crunchbase, HN Algolia, Google News RSS
"""
import json, re, time, os, sys
from datetime import datetime, timedelta
from pathlib import Path
import urllib.request
import urllib.parse

CACHE_PATH = Path(__file__).parent.parent / "public" / "layoffs-cache.json"

GEO = {
    'block': (37.7749, -122.4194), 'square': (37.7749, -122.4194),
    'ebay': (37.4532, -121.9347), 'riot games': (34.0522, -118.2437),
    'supernal': (33.6695, -117.8229), 'microvision': (47.6062, -122.3321),
    'google': (37.4220, -122.0841), 'alphabet': (37.4220, -122.0841),
    'meta': (37.4845, -122.1477), 'amazon': (47.6062, -122.3321),
    'microsoft': (47.6423, -122.1391), 'apple': (37.3346, -122.0090),
    'tesla': (30.2265, -97.7742), 'salesforce': (37.7951, -122.3993),
    'snap': (34.0195, -118.4912), 'spotify': (40.7589, -73.9851),
    'netflix': (37.2431, -121.9690), 'uber': (37.7749, -122.4194),
    'airbnb': (37.7749, -122.4194), 'stripe': (37.7749, -122.4194),
    'coinbase': (37.7749, -122.4194), 'intel': (37.3875, -121.9633),
    'cisco': (37.4070, -121.9680), 'ibm': (40.7128, -74.0060),
    'workday': (37.6879, -122.0616), 'dropbox': (37.7749, -122.4194),
    'zoom': (37.3875, -121.9633), 'paypal': (37.3688, -121.9250),
    'shopify': (45.4215, -75.6919), 'wayfair': (42.3601, -71.0589),
    'chegg': (37.3688, -121.9250), 'verizon': (40.7128, -74.0060),
    'disney': (34.1341, -118.3215), 'twilio': (37.7749, -122.4194),
    'rivian': (41.8827, -87.6233), 'sap': (48.5424, 9.0546),
    'klarna': (59.3293, 18.0686), 'verint': (40.7128, -74.0060),
}

def get_coords(company: str):
    key = company.lower()
    for k, v in GEO.items():
        if k in key or key in k:
            return v
    return (None, None)

def fetch_url(url, timeout=15):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"Fetch error for {url}: {e}", file=sys.stderr)
        return ''

def scrape_google_news():
    """Google News RSS — layoff stories from last 7 days"""
    results = []
    cutoff = datetime.now() - timedelta(days=7)
    queries = [
        'tech layoffs 2026 employees cut',
        'startup layoffs workforce reduction 2026',
        'company lays off employees AI 2026',
    ]
    for q in queries:
        url = f"https://news.google.com/rss/search?q={urllib.parse.quote(q)}&hl=en-US&gl=US&ceid=US:en"
        xml = fetch_url(url)
        if not xml:
            continue
        items = re.findall(r'<item>([\s\S]*?)</item>', xml)
        for item in items:
            title_m = re.search(r'<title><!\[CDATA\[(.*?)\]\]></title>|<title>(.*?)</title>', item)
            pub_m = re.search(r'<pubDate>(.*?)</pubDate>', item)
            link_m = re.search(r'<link>(.*?)</link>', item)
            if not title_m:
                continue
            title = (title_m.group(1) or title_m.group(2) or '').strip()
            pub_date = datetime.now()
            if pub_m:
                try:
                    pub_date = datetime.strptime(pub_m.group(1).strip(), '%a, %d %b %Y %H:%M:%S %Z')
                except:
                    pass
            if pub_date < cutoff:
                continue
            low = title.lower()
            if not any(w in low for w in ['laid off', 'layoff', 'lay off', 'workforce reduction', 'job cut', 'eliminat']):
                continue

            count_m = re.search(r'(\d[\d,]+)\s+(?:employees|workers|jobs|roles|positions)', title, re.I)
            count = int(count_m.group(1).replace(',', '')) if count_m else 0

            # Strict company extraction
            co_m = re.match(r'^([A-Z][a-zA-Z0-9\s&\'.-]{1,28}?)\s+(?:laid off|is laying off|lays off|to lay off|cuts|cutting|eliminates)\b', title, re.I)
            if not co_m:
                continue
            company = co_m.group(1).strip()
            if len(company) < 2 or len(company.split()) > 4:
                continue
            if re.match(r'^(the|a|an|this|that|tech|report|data|new|top)', company, re.I):
                continue

            lat, lng = get_coords(company)
            results.append({
                'company': company,
                'count': count,
                'pct': None,
                'date': pub_date.strftime('%Y-%m-%d'),
                'sector': 'Technology',
                'url': (link_m.group(1) or '').strip(),
                'isBreaking': (datetime.now() - pub_date).total_seconds() < 86400,
                'slug': re.sub(r'[^a-z0-9]', '-', company.lower()),
                'lat': lat, 'lng': lng,
            })
    return results

def scrape_hn():
    """HN Algolia — high-signal layoff stories last 7 days"""
    results = []
    since = int(time.time()) - 7 * 86400
    url = f"https://hn.algolia.com/api/v1/search?query=layoffs+laid+off&tags=story&numericFilters=created_at_i>{since},points>30&hitsPerPage=25"
    raw = fetch_url(url)
    if not raw:
        return results
    try:
        data = json.loads(raw)
    except:
        return results
    for hit in data.get('hits', []):
        title = hit.get('title', '')
        if not re.search(r'layoff|laid.?off', title, re.I):
            continue
        count_m = re.search(r'(\d[\d,]+)\s+(?:employees|workers|jobs)', title, re.I)
        count = int(count_m.group(1).replace(',', '')) if count_m else 0
        co_m = re.match(r'^([A-Z][a-zA-Z0-9\s&]+?)\s+(?:laid off|lays off|is laying|cuts|cut)\b', title, re.I)
        company = co_m.group(1).strip() if co_m else None
        if not company or len(company) > 35:
            continue
        created_at = hit.get('created_at', '')
        try:
            dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            date_str = dt.strftime('%Y-%m-%d')
            is_breaking = (datetime.now().timestamp() - dt.timestamp()) < 86400
        except:
            date_str = datetime.now().strftime('%Y-%m-%d')
            is_breaking = True
        lat, lng = get_coords(company)
        results.append({
            'company': company, 'count': count, 'pct': None,
            'date': date_str, 'sector': 'Technology',
            'url': hit.get('url') or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
            'isBreaking': is_breaking,
            'slug': re.sub(r'[^a-z0-9]', '-', company.lower()),
            'lat': lat, 'lng': lng,
        })
    return results

def main():
    print(f"[{datetime.now().isoformat()}] Starting layoff scrape...")

    gn = scrape_google_news()
    print(f"  Google News: {len(gn)} items")

    hn = scrape_hn()
    print(f"  HN Algolia:  {len(hn)} items")

    all_items = gn + hn
    seen = set()
    deduped = []
    for item in sorted(all_items, key=lambda x: x['date'], reverse=True):
        key = item['company'].lower()[:10]
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)

    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    cache = {
        'layoffs': deduped,
        'total': len(deduped),
        'updatedAt': datetime.now().isoformat(),
        'sources': {'googleNews': len(gn), 'hn': len(hn)},
    }
    CACHE_PATH.write_text(json.dumps(cache, indent=2))
    print(f"  Written {len(deduped)} items to {CACHE_PATH}")

if __name__ == '__main__':
    main()
