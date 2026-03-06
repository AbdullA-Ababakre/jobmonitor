import { NextResponse } from 'next/server'
import { fetchFeed } from '@/lib/data'

export const revalidate = 300

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') === 'hiring' ? 'hiring' : 'layoff'

  try {
    const items = await fetchFeed(type)
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API /api/feed error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed data' },
      { status: 500 }
    )
  }
}
