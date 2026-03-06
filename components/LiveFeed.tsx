'use client';
import { LAYOFFS, HIRING, TALENT_ARCS } from '@/lib/data';

interface Props {
  onSelectCompany: (c: any) => void;
}

const FEED = [
  // Layoffs sorted newest→oldest (date format "Mon YYYY")
  ...LAYOFFS
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(d => ({ type: 'layoff', company: d.company, detail: `${d.count.toLocaleString()} laid off (${d.pct}%)`, date: d.date, color: '#ef4444', emoji: '🔴', data: { ...d, __type: 'layoff' } })),
  ...HIRING.map(d => ({ type: 'hiring', company: d.company, detail: `${d.openRoles} open roles`, date: 'Active now', color: '#22c55e', emoji: '🟢', data: { ...d, __type: 'hiring' } })),
  ...TALENT_ARCS.map(d => ({ type: 'talent', company: d.label, detail: `${d.count} engineers moved`, date: 'Recent', color: '#818cf8', emoji: '🔄', data: d })),
];

export default function LiveFeed({ onSelectCompany }: Props) {
  return (
    <div style={{
      position: 'fixed', right: 16, top: 64, bottom: 52,
      width: 276, zIndex: 20,
      background: 'rgba(6,13,26,0.88)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 8px #22c55e', animation: 'livePulse 2s infinite',
        }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#334155', textTransform: 'uppercase' }}>
          Live Feed
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#22c55e', fontFamily: 'monospace' }}>● LIVE</span>
      </div>

      {/* Events */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '6px 8px' }}>
        {FEED.map((item, i) => (
          <button
            key={i}
            onClick={() => ('lat' in item.data) && onSelectCompany(item.data)}
            style={{
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '9px 8px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{item.emoji}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.company}
              </div>
              <div style={{ fontSize: 11, color: item.color, marginTop: 1 }}>{item.detail}</div>
              <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{item.date}</div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
