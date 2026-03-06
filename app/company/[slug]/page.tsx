import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchLayoffs } from '@/lib/data'
import { formatDate, formatNumber } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const allLayoffs = await fetchLayoffs()
  const entry = allLayoffs.find((e) => e.slug === params.slug)
  const company = entry?.company || params.slug
  return {
    title: `${company} Layoffs | JobMonitor`,
    description: `Full layoff history and timeline for ${company}. Track every round of layoffs, percentages, and dates.`,
  }
}

export const revalidate = 300

export default async function CompanyPage({ params }: PageProps) {
  const allLayoffs = await fetchLayoffs()
  const events = allLayoffs
    .filter((e) => e.slug === params.slug)
    .sort((a, b) => {
      const dA = a.date ? new Date(a.date).getTime() : 0
      const dB = b.date ? new Date(b.date).getTime() : 0
      return dB - dA
    })

  if (events.length === 0) {
    notFound()
  }

  const company = events[0].company
  const totalLayoffs = events.reduce((sum, e) => sum + (e.layoffs || 0), 0)
  const industries = Array.from(new Set(events.map((e) => e.industry).filter(Boolean)))
  const countries = Array.from(new Set(events.map((e) => e.country).filter(Boolean)))
  const latestDate = events[0]?.date

  return (
    <main className="min-h-screen" style={{ background: '#060d1a', color: '#e2e8f0' }}>
      {/* ── Nav bar ── */}
      <div
        className="sticky top-0 z-50 px-6 py-3 backdrop-blur-xl"
        style={{
          background: 'rgba(6,13,26,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs text-slate-400">{company}</span>
          </div>
          <Link href="/" className="text-sm font-bold text-white">
            ⚡ JobMonitor
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* ── Company header ── */}
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {company}
            </h1>
            {industries.map((ind) => (
              <span
                key={ind}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: '#60a5fa',
                }}
              >
                {ind}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            {countries.join(', ')} ·{' '}
            {events.length === 1 ? '1 layoff event' : `${events.length} layoff events`} ·
            Most recent: {formatDate(latestDate)}
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: 'Total Laid Off',
              value: totalLayoffs >= 1000 ? `${(totalLayoffs / 1000).toFixed(1)}K` : formatNumber(totalLayoffs),
              color: '#f87171',
              border: 'rgba(239,68,68,0.25)',
              bg: 'rgba(239,68,68,0.06)',
            },
            {
              label: 'Rounds',
              value: String(events.length),
              color: '#60a5fa',
              border: 'rgba(59,130,246,0.25)',
              bg: 'rgba(59,130,246,0.06)',
            },
            {
              label: 'First Layoff',
              value: formatDate(events[events.length - 1]?.date),
              color: '#94a3b8',
              border: 'rgba(100,116,139,0.25)',
              bg: 'rgba(100,116,139,0.06)',
            },
            {
              label: 'Latest Layoff',
              value: formatDate(latestDate),
              color: '#fb923c',
              border: 'rgba(249,115,22,0.25)',
              bg: 'rgba(249,115,22,0.06)',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                {s.label}
              </p>
              <p
                className="mt-1 font-mono text-xl font-bold tabular-nums"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── InterviewCoder CTA ── */}
        <a
          href={`https://interviewcoder.co/questions?company=${params.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-8 flex items-center justify-between rounded-xl p-5 transition-all hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <p className="font-bold text-white">
                Interviewing at {company}?
              </p>
              <p className="text-sm text-slate-400">
                Practice their exact interview questions on InterviewCoder
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-white"
            style={{ background: '#ef4444' }}
          >
            Practice Now →
          </span>
        </a>

        {/* ── Timeline ── */}
        <div>
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            Layoff Timeline
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-5 top-0 h-full w-px"
              style={{ background: 'rgba(239,68,68,0.2)' }}
            />

            <div className="space-y-5">
              {events.map((event, idx) => (
                <div key={idx} className="relative flex gap-8 pl-14">
                  {/* Dot */}
                  <div
                    className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full"
                    style={{
                      background: '#ef4444',
                      boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />

                  {/* Card */}
                  <div
                    className="flex-1 rounded-xl p-5"
                    style={{
                      background: '#080e1d',
                      border: '1px solid rgba(239,68,68,0.12)',
                    }}
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-slate-500">
                          {formatDate(event.date)}
                        </p>
                        <p className="mt-1 font-mono text-2xl font-bold text-red-400">
                          {event.layoffs
                            ? `${formatNumber(event.layoffs)} laid off`
                            : 'Layoff announced'}
                        </p>
                        {event.percentage && (
                          <p className="mt-0.5 text-sm text-orange-400">
                            {event.percentage}% of workforce
                          </p>
                        )}
                      </div>
                      {idx === 0 && (
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.3)',
                          }}
                        >
                          Most Recent
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {event.country && (
                        <span
                          className="rounded px-2 py-0.5 text-xs text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          📍 {event.country}
                        </span>
                      )}
                      {event.industry && (
                        <span
                          className="rounded px-2 py-0.5 text-xs text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          🏭 {event.industry}
                        </span>
                      )}
                      {event.stage && (
                        <span
                          className="rounded px-2 py-0.5 text-xs text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          📈 {event.stage}
                        </span>
                      )}
                      {event.fundsRaised && (
                        <span
                          className="rounded px-2 py-0.5 text-xs text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          💰 ${event.fundsRaised}M raised
                        </span>
                      )}
                    </div>

                    {/* Source link */}
                    {event.source && event.source.startsWith('http') && (
                      <a
                        href={event.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs text-blue-500 hover:text-blue-400"
                      >
                        View source report →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-slate-500">
            Preparing for an interview at {company}?
          </p>
          <a
            href={`https://interviewcoder.co/questions?company=${params.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 0 30px rgba(239,68,68,0.3)',
            }}
          >
            🎯 Practice {company} Interview Questions on InterviewCoder
          </a>
        </div>
      </div>
    </main>
  )
}
