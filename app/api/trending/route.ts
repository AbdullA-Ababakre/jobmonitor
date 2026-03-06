import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 min

export async function GET() {
  try {
    const since24h = Math.floor((Date.now() - 86400000) / 1000);
    const since6h = Math.floor((Date.now() - 21600000) / 1000);

    // HN Top Stories right now
    const [topRes, newRes, techRes] = await Promise.all([
      fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 300 } }),
      // HN Algolia: tech/AI/jobs stories from last 6h
      fetch(
        `https://hn.algolia.com/api/v1/search?query=AI+OR+layoffs+OR+hiring+OR+tech&tags=story&numericFilters=created_at_i>${since6h},points>10&hitsPerPage=15`,
        { next: { revalidate: 300 } }
      ),
      // Google News: top tech headlines today
      fetch(
        `https://news.google.com/rss/search?q=tech+AI+startup+today&hl=en-US&gl=US&ceid=US:en&tbs=qdr:d`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 300 } }
      ),
    ]);

    // HN top stories (last 24h filter)
    const topIds: number[] = await topRes.json();
    const topStories = await Promise.all(
      topIds.slice(0, 20).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 300 } })
          .then(r => r.json()).catch(() => null)
      )
    );

    const hnTop = topStories
      .filter(s => s && s.title && s.score > 30 && s.time > since24h)
      .map(s => ({
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        score: s.score,
        comments: s.descendants || 0,
        source: 'HN',
        postedAt: new Date(s.time * 1000).toISOString(),
        freshnessMs: Date.now() - s.time * 1000,
        badge: s.score > 300 ? '🔥' : s.score > 100 ? '⚡' : '🆕',
      }))
      .sort((a, b) => a.freshnessMs - b.freshnessMs);

    // HN Algolia recent
    const algoliaData = await newRes.json();
    const hnRecent = (algoliaData?.hits || [])
      .filter((h: any) => h.title && h.url)
      .map((h: any) => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        score: h.points || 0,
        comments: h.num_comments || 0,
        source: 'HN',
        postedAt: h.created_at,
        freshnessMs: Date.now() - new Date(h.created_at).getTime(),
        badge: '🆕',
      }));

    // Google News tech headlines today
    const gnXml = await techRes.text();
    const gnItems = gnXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    const gnStories = gnItems.slice(0, 8).map(item => {
      const titleM = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
      const linkM = item.match(/<link>(.*?)<\/link>/);
      const pubM = item.match(/<pubDate>(.*?)<\/pubDate>/);
      if (!titleM) return null;
      const postedAt = pubM ? new Date(pubM[1]).toISOString() : new Date().toISOString();
      return {
        title: titleM[1].replace(/<[^>]+>/g, '').trim(),
        url: linkM?.[1]?.trim() || '#',
        score: 0,
        comments: 0,
        source: 'News',
        postedAt,
        freshnessMs: Date.now() - new Date(postedAt).getTime(),
        badge: '📰',
      };
    }).filter(Boolean);

    // Merge all, sort by freshness, deduplicate by title prefix
    const all = [...hnRecent, ...hnTop, ...gnStories as any[]];
    const seenTitles = new Set<string>();
    const deduped = all
      .filter(t => {
        const key = t.title.toLowerCase().slice(0, 30);
        if (seenTitles.has(key)) return false;
        seenTitles.add(key);
        return true;
      })
      .sort((a, b) => a.freshnessMs - b.freshnessMs)
      .slice(0, 20);

    return NextResponse.json({
      trending: deduped,
      date: new Date().toISOString().slice(0, 10),
      sources: { hnTop: hnTop.length, hnRecent: hnRecent.length, news: gnStories.length },
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, trending: [] }, { status: 500 });
  }
}
