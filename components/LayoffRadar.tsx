import Link from 'next/link'
import { LayoffEntry } from '@/lib/types'
import { formatDate, formatNumber } from '@/lib/utils'

interface LayoffRadarProps {
  data: LayoffEntry[]
}

function PercentageBadge({ pct }: { pct: number | null }) {
  if (!pct) return <span className="text-slate-600">—</span>
  const color =
    pct >= 50
      ? 'text-red-400'
      : pct >= 20
      ? 'text-orange-400'
      : 'text-yellow-500'
  return <span className={`font-mono font-semibold ${color}`}>{pct}%</span>
}

function LayoffCount({ n }: { n: number | null }) {
  if (!n) return <span className="text-slate-600">—</span>
  const color =
    n >= 10000
      ? 'text-red-400'
      : n >= 1000
      ? 'text-orange-400'
      : 'text-slate-300'
  return <span className={`font-mono font-bold ${color}`}>{formatNumber(n)}</span>
}

export default function LayoffRadar({ data }: LayoffRadarProps) {
  return (
    <section
      id="layoff-radar"
      className="panel-red flex h-full flex-col rounded-xl"
      style={{ background: '#080e1d', minHeight: 520 }}
    >
      {/* ── Panel header ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(239,68,68,0.15)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-400">
            Layoff Radar
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-600">
            {data.length.toLocaleString()} events
          </span>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            Most Recent First
          </span>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-2.5"
        style={{
          background: 'rgba(239,68,68,0.07)',
          borderBottom: '1px solid rgba(239,68,68,0.12)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">🚨</span>
          <p className="truncate text-xs text-slate-300">
            Just laid off?{' '}
            <span className="text-slate-400">
              Practice real interview questions from these companies
            </span>
          </p>
        </div>
        <a
          href="https://interviewcoder.co"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 cta-btn cta-btn-red"
        >
          interviewcoder.co →
        </a>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10" style={{ background: '#060d1a' }}>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Company', '# Laid Off', '% WF', 'Date', 'Country', ''].map(
                (h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 ${
                      i === 0 ? 'text-left' : i < 5 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-600">
                  Loading layoff data…
                </td>
              </tr>
            ) : (
              data.slice(0, 80).map((entry, idx) => (
                <tr
                  key={`${entry.slug}-${idx}`}
                  className="table-row-hover group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                  {/* Company */}
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        href={`/company/${entry.slug}`}
                        className="font-semibold text-white transition-colors hover:text-red-400"
                      >
                        {entry.company}
                      </Link>
                      {entry.industry && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] text-slate-500"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          {entry.industry}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* # Laid off */}
                  <td className="px-4 py-2.5 text-right">
                    <LayoffCount n={entry.layoffs} />
                  </td>
                  {/* % Workforce */}
                  <td className="px-4 py-2.5 text-right">
                    <PercentageBadge pct={entry.percentage} />
                  </td>
                  {/* Date */}
                  <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                    {formatDate(entry.date)}
                  </td>
                  {/* Country */}
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {entry.country || '—'}
                  </td>
                  {/* CTA */}
                  <td className="px-4 py-2.5">
                    <a
                      href="https://interviewcoder.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-btn cta-btn-red opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Practice →
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between px-5 py-2"
        style={{ borderTop: '1px solid rgba(239,68,68,0.1)' }}
      >
        <span className="text-[11px] text-slate-600">
          Source:{' '}
          <a
            href="https://layoffs.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400"
          >
            layoffs.fyi
          </a>
        </span>
        <a
          href="https://interviewcoder.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-red-500 hover:text-red-400"
        >
          Practice interviews at any of these companies →
        </a>
      </div>
    </section>
  )
}
