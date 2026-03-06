import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🌍 JobMonitor — Real-Time Tech Job Market Intelligence',
  description:
    'Live tech layoffs, hiring trends, and job market signals — Bloomberg Terminal meets layoffs.fyi. Track every layoff, hiring surge, and talent move in real time.',
  keywords: ['tech layoffs', 'hiring', 'job market', 'tech industry', 'layoffs 2024', 'tech news'],
  openGraph: {
    title: '🌍 JobMonitor — Real-Time Tech Job Market Intelligence',
    description: 'Live tech layoffs and hiring trends. Updated every 5 minutes.',
    type: 'website',
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
