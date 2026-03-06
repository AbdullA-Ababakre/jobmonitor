import { FeedItem } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface TalentRadarProps {
  items: FeedItem[]
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  TechCrunch: {
    bg: 'rgba(16,185,129,0.12)',
    text: '#34d399',
    border: 'rgba(16,185,129,0.25)',
  },
  'The Verge': {
    bg: 'rgba(139,92,246,0.12)',
    text: '#a78bfa',
    border: 'rgba(139,92,246,0.25)',
  },
  'Hacker News': {
    bg: 'rgba(249,115,22,0.12)',
    text: '#fb923c',
    border: 'rgba(249,115,22,0.25)',
  },
}

function SourceBadge({ source }: { source: string }) {
  const style = SOURCE_COLORS[source] || {
    bg: 'rgba(100,116,139,0.12)',
    text: '#94a3b8',
    border: 'rgba(100,116,139,0.25)',
  }
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {source}
    </span>
  )
}

export default function TalentRadar({ items }: TalentRadarProps) {
  return (
    <section
      id="talent-radar"
      className="panel-blue flex h-full flex-col rounded-xl"
      style={{ background: '#080e1d', minHeight: 420 }}
    >
      {/* ── Panel header ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Talent Radar
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-600">
            {items.length} stories
          </span>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            Live Feed
          </span>
        </div>
      </div>

      {/* ── Feed items ── */}
      <div className="flex-1 divide-y overflow-auto" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-600">
            <svg className="h-8 w-8 animate-spin text-blue-500/30" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs">Fetching talent news…</span>
          </div>
        ) : (
          items.slice(0, 25).map((item, idx) => (
            <a
              key={idx}
              href={typeof item.link === 'string' ? item.link : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="feed-item flex flex-col gap-2 px-5 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
            >
              <p className="text-sm font-medium leading-snug text-slate-200 transition-colors group-hover:text-blue-300">
                {item.title}
              </p>
              <div className="flex items-center gap-2">
                <SourceBadge source={item.source} />
                <span className="font-mono text-[10px] text-slate-600">
                  {timeAgo(item.pubDate)}
                </span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center gap-3 px-5 py-2"
        style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
      >
        <span className="text-[11px] text-slate-600">
          Sources: TechCrunch · The Verge · Hacker News
        </span>
      </div>
    </section>
  )
}
