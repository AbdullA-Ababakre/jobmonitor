import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://jobmonitor.co'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'JobMonitor — The CIA for the Tech Job Market',
  description:
    '49,000 tech layoffs in 57 days. AI is eating the job market alive. JobMonitor tracks every layoff, talent flow, hot job, and leaked interview question — live, on one map. Free. Open source.',
  keywords: [
    'tech layoffs 2026', 'tech layoffs map', 'job market intelligence',
    'AI layoffs', 'hiring trends', 'interview questions', 'talent flow',
    'Block layoffs', 'Amazon layoffs', 'Meta layoffs', 'jobmonitor'
  ],
  authors: [{ name: 'InterviewCoder', url: 'https://interviewcoder.co' }],
  creator: 'InterviewCoder',
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'JobMonitor',
    title: 'JobMonitor — The CIA for the Tech Job Market 🌍',
    description:
      '49,000 tech layoffs in 57 days. Live layoffs, global talent flow, hot jobs & leaked interview questions — all on one map. Free & open source.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1280,
        height: 687,
        alt: 'JobMonitor — Real-time tech job market intelligence dashboard',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@interviewcoder',
    creator: '@interviewcoder',
    title: 'JobMonitor — The CIA for the Tech Job Market 🌍',
    description:
      '49,000 tech layoffs in 57 days. Live layoffs, global talent flow, hot jobs & leaked interview questions — all on one map. Free & open source.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#060d1a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  )
}
