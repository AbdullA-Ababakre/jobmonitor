import Link from 'next/link'
import { LayoffEntry } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

interface MarketPulseProps {
  data: LayoffEntry[]
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub: string
  color: string
}) {
  const styles: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    red: {
      border: 'rgba(239,68,68,0.25)',
      glow: 'rgba(239,68,68,0.06)',
      text: '#f87171',
      bg: 'rgba(239,68,68,0.06)',
    },
    orange: {
      border: 'rgba(249,115,22,0.25)',
      glow: 'rgba(249,115,22,0.06)',
      text: '#fb923c',
      bg: 'rgba(249,115,22,0.06)',
    },
    blue: {
      border: 'rgba(59,130,246,0.25)',
      glow: 'rgba(59,130,246,0.06)',
      text: '#60a5fa',
      bg: 'rgba(59,130,246,0.06)',
    },
    green: {
      border: 'rgba(34,197,94,0.25)',
      glow: 'rgba(34,197,94,0.06)',
      text: '#4ade80',
      bg: 'rgba(34,197,94,0.06)',
    },
  }
  const s = styles[color] || styles.blue

  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: `0 0 20px ${s.glow}`,
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className="mt-1 font-mono text-2xl font-bold tabular-nums"
        style={{ color: s.text }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-600">{sub}</p>
    </div>
  )
}

export default function MarketPulse({ data }: MarketPulseProps) {
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()

  // ── Compute stats ──
  const totalThisYear = data
    .filter((e) => {
      try {
        return new Date(e.date).getFullYear() === thisYear
      } catch {
        return false
      }
    })
    .reduce((sum, e) => sum + (e.layoffs || 0), 0)

  const totalThisMonth = data
    .filter((e) => {
      try {
        const d = new Date(e.date)
        return d.getFullYear() === thisYear && d.getMonth() === thisMonth
      } catch {
        return false
      }
    })
    .reduce((sum, e) => sum + (e.layoffs || 0), 0)

  // ── Sector breakdown ──
  const sectorMap: Record<string, number> = {}
  data.forEach((e) => {
    if (e.industry && e.layoffs) {
      sectorMap[e.industry] = (sectorMap[e.industry] || 0) + e.layoffs
    }
  })
  const topSectors = Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxSector = topSectors[0]?.[1] || 1

  // ── Top companies ──
  const companyMap: Record<string, { count: number; slug: string }> = {}
  data.forEach((e) => {
    if (e.company && e.layoffs) {
      if (!companyMap[e.company]) {
        companyMap[e.company] = { count: 0, slug: e.slug }
      }
      companyMap[e.company].count += e.layoffs
    }
  })
  const topCompanies = Object.entries(companyMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
  const maxCompany = topCompanies[0]?.[1].count || 1

  const monthName = now.toLocaleDateString('en-US', { month: 'long' })

  return (
    <section
      id="market-pulse"
      className="flex flex-col gap-4"
    >
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={`${thisYear} Total`}
          value={totalThisYear >= 1000 ? `${(totalThisYear / 1000).toFixed(1)}K` : formatNumber(totalThisYear)}
          sub={`jobs eliminated in ${thisYear}`}
          color="orange"
        />
        <StatCard
          label={`${monthName}`}
          value={totalThisMonth >= 1000 ? `${(totalThisMonth / 1000).toFixed(1)}K` : formatNumber(totalThisMonth)}
          sub="this month"
          color="red"
        />
      </div>

      {/* ── Sector chart ── */}
      <div
        className="rounded-xl p-4"
        style={{
          background: '#080e1d',
          border: '1px solid rgba(59,130,246,0.18)',
          boxShadow: '0 0 30px rgba(59,130,246,0.05)',
        }}
      >
        <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400">
          <span>📊</span>
          <span>Worst Affected Sectors</span>
        </h3>
        {topSectors.length === 0 ? (
          <p className="text-xs text-slate-600">No sector data available.</p>
        ) : (
          <div className="space-y-3">
            {topSectors.map(([sector, count]) => {
              const pct = (count / maxSector) * 100
              return (
                <div key={sector}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-300 truncate max-w-[60%]">
                      {sector}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      {count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="bar-fill h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, #ef4444 0%, #f97316 100%)`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Top companies ── */}
      <div
        className="rounded-xl p-4"
        style={{
          background: '#080e1d',
          border: '1px solid rgba(100,116,139,0.15)',
        }}
      >
        <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <span>🏢</span>
          <span>Top Companies by Layoffs</span>
        </h3>
        {topCompanies.length === 0 ? (
          <p className="text-xs text-slate-600">Loading data…</p>
        ) : (
          <div className="space-y-3">
            {topCompanies.map(([company, { count, slug }], idx) => {
              const pct = (count / maxCompany) * 100
              const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
              return (
                <div key={company} className="flex items-center gap-3">
                  <span className="text-sm">{medals[idx]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <Link
                        href={`/company/${slug}`}
                        className="truncate text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        {company}
                      </Link>
                      <span className="shrink-0 font-mono text-[11px] text-red-400">
                        {count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="h-1 w-full overflow-hidden rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <div
                        className="bar-fill h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: `rgba(239, 68, 68, ${0.4 + (1 - idx * 0.1) * 0.5})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── InterviewCoder CTA ── */}
      <a
        href="https://interviewcoder.co"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl p-4 transition-all hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(139,92,246,0.12) 100%)',
          border: '1px solid rgba(239,68,68,0.25)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <p className="text-sm font-bold text-white">Prep for your next interview</p>
            <p className="text-xs text-slate-400">
              Practice real questions from top tech companies
            </p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
              Start Free →
            </span>
          </div>
        </div>
      </a>
    </section>
  )
}
