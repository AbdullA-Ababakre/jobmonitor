export interface LayoffEntry {
  company: string
  layoffs: number | null
  percentage: number | null
  date: string
  country: string
  industry: string
  stage: string
  source: string
  fundsRaised: number | null
  slug: string
}

export interface FeedItem {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
}

export interface MarketStats {
  totalThisYear: number
  totalThisMonth: number
  topSectors: Array<{ sector: string; count: number }>
  topCompanies: Array<{ company: string; count: number; slug: string }>
}
