'use client';
import { LAYOFFS, HIRING, TOP_TC } from '@/lib/data';

const totalLaidOff = LAYOFFS.reduce((s, d) => s + d.count, 0);
const totalRoles = HIRING.reduce((s, d) => s + d.openRoles, 0);
const topTC = TOP_TC[0];

export default function StatsBar() {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 50,
      zIndex: 20, background: 'rgba(6,13,26,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 0,
    }}>
      {[
        { label: 'Total Laid Off (tracked)', value: totalLaidOff.toLocaleString(), color: '#ef4444', emoji: '🔴' },
        { label: 'Open Roles', value: totalRoles.toLocaleString() + '+', color: '#22c55e', emoji: '🟢' },
        { label: 'Top TC', value: `${topTC.company} · $${(topTC.avgTC / 1000).toFixed(0)}k`, color: '#fbbf24', emoji: '💰' },
        { label: 'Market Signal', value: '📈 AI sector hiring', color: '#818cf8', emoji: '📊' },
        { label: 'Source', value: 'layoffs.fyi · levels.fyi · live', color: '#475569', emoji: '⚡' },
      ].map((stat, i, arr) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 24px',
          borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          <span style={{ fontSize: 13 }}>{stat.emoji}</span>
          <div>
            <div style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 12, color: stat.color, fontFamily: 'monospace', fontWeight: 700 }}>
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
