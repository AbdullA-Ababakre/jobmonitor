import { LayoffEntry, FeedItem } from './types'

/**
 * Parses a single CSV line, handling quoted fields and escaped quotes.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

/**
 * Parses the layoffs.fyi CSV export into structured LayoffEntry objects.
 */
export function parseLayoffsCSV(csv: string): LayoffEntry[] {
  const lines = csv.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const rawHeaders = parseCSVLine(lines[0])
  const headers = rawHeaders.map(h => h.trim().replace(/^\uFEFF/, ''))

  const entries: LayoffEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim()
    })

    // Support multiple possible column name conventions from the sheet
    const company =
      row['Company'] || row['company'] || row['COMPANY'] || ''

    if (!company) continue

    const rawLayoffs =
      row['Laid Off #'] ||
      row['laid_off'] ||
      row['# Laid Off'] ||
      row['Layoffs'] ||
      ''

    const rawPercentage =
      row['% Workforce Laid Off'] ||
      row['Percentage'] ||
      row['% Laid Off'] ||
      row['Pct'] ||
      ''

    const rawDate =
      row['Date'] ||
      row['date'] ||
      row['DATE'] ||
      row['Date Added'] ||
      ''

    const rawCountry =
      row['Country'] ||
      row['country'] ||
      row['Location (HQ)']?.split(',').pop()?.trim() ||
      ''

    const industry =
      row['Industry'] || row['industry'] || row['Sector'] || ''

    const stage =
      row['Stage'] || row['stage'] || row['Funding Stage'] || ''

    const source =
      row['Source'] || row['source'] || row['Source URL'] || ''

    const rawFunds =
      row['Funds Raised (M$)'] ||
      row['Funding'] ||
      row['Funds Raised'] ||
      ''

    // Parse numbers — strip commas and non-numeric chars
    const parseNum = (s: string): number | null => {
      const n = parseFloat(s.replace(/,/g, '').replace(/[^0-9.]/g, ''))
      return isNaN(n) ? null : n
    }

    entries.push({
      company,
      layoffs: parseNum(rawLayoffs),
      percentage: parseNum(rawPercentage),
      date: rawDate,
      country: rawCountry,
      industry,
      stage,
      source,
      fundsRaised: parseNum(rawFunds),
      slug: company
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    })
  }

  // Sort: most recent first, then alphabetically for ties
  return entries
    .filter(e => e.company)
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      if (isNaN(dateA) || isNaN(dateB)) return 0
      return dateB - dateA
    })
}

/**
 * Parses an RSS/Atom XML string into FeedItem objects.
 */
export function parseRSSXML(xml: string, source: string): FeedItem[] {
  try {
    // Dynamic import to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
    })
    const parsed = parser.parse(xml)

    // Handle RSS 2.0
    const rssItems = parsed?.rss?.channel?.item
    if (rssItems) {
      const arr = Array.isArray(rssItems) ? rssItems : [rssItems]
      return arr.map((item: Record<string, unknown>) => ({
        title: extractText(item.title) || '',
        link: extractLink(item) || '',
        pubDate: extractText(item.pubDate) || new Date().toISOString(),
        description: extractText(item.description) || '',
        source,
      }))
    }

    // Handle Atom
    const atomEntries = parsed?.feed?.entry
    if (atomEntries) {
      const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries]
      return arr.map((entry: Record<string, unknown>) => ({
        title: extractText(entry.title) || '',
        link: extractAtomLink(entry) || '',
        pubDate:
          extractText(entry.updated) ||
          extractText(entry.published) ||
          new Date().toISOString(),
        description: extractText(entry.summary) || extractText(entry.content) || '',
        source,
      }))
    }

    return []
  } catch (e) {
    console.error(`RSS parse error for ${source}:`, e)
    return []
  }
}

function extractText(val: unknown): string {
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>
    if (obj['#text']) return String(obj['#text'])
    if (obj['_']) return String(obj['_'])
  }
  return ''
}

function extractLink(item: Record<string, unknown>): string {
  if (typeof item.link === 'string') return item.link
  if (typeof item.guid === 'string' && item.guid.startsWith('http'))
    return item.guid
  return ''
}

function extractAtomLink(entry: Record<string, unknown>): string {
  const link = entry.link
  if (typeof link === 'string') return link
  if (link && typeof link === 'object') {
    const obj = link as Record<string, unknown>
    if (obj['@_href']) return String(obj['@_href'])
    if (Array.isArray(link)) {
      const first = link[0]
      if (first?.['@_href']) return String(first['@_href'])
    }
  }
  return ''
}

/**
 * Returns a human-readable "time ago" string from a date.
 */
export function timeAgo(dateStr: string): string {
  try {
    const now = Date.now()
    const date = new Date(dateStr).getTime()
    const diff = now - date

    const minutes = Math.floor(diff / 60_000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`

    const months = Math.floor(days / 30)
    return `${months}mo ago`
  } catch {
    return 'recently'
  }
}

/**
 * Formats a date string into a readable format.
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Formats a number with commas.
 */
export function formatNumber(num: number | null): string {
  if (num === null || num === undefined) return '—'
  return num.toLocaleString('en-US')
}
