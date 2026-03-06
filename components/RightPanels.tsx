'use client';
import { useState } from 'react';
import { LAYOFFS, HIRING, TOP_TC } from '@/lib/data';

interface Props { onSelectCompany: (c: any) => void; }

const TABS = ['LAYOFFS', 'HOT JOBS', 'SALARY', 'MARKET'] as const;
type Tab = typeof TABS[number];

// Mock hot jobs from YC/a16z
const HOT_JOBS = [
  { company: 'OpenAI', role: 'Staff Engineer, Inference', source: 'YC', tc: '$500k+', badge: '🔥', tags: ['AI', 'Infra'] },
  { company: 'Anthropic', role: 'Research Engineer, Safety', source: 'a16z', tc: '$450k+', badge: '🔥', tags: ['AI', 'Safety'] },
  { company: 'Perplexity', role: 'Senior Frontend Engineer', source: 'YC', tc: '$280k+', badge: '⚡', tags: ['Frontend'] },
  { company: 'Mistral AI', role: 'ML Engineer', source: 'a16z', tc: '€200k+', badge: '🆕', tags: ['AI', 'EU'] },
  { company: 'Anduril', role: 'Software Engineer, Defense', source: 'a16z', tc: '$350k+', badge: '⚡', tags: ['Defense'] },
  { company: 'Cohere', role: 'Platform Engineer', source: 'YC', tc: '$320k+', badge: '🆕', tags: ['AI', 'Infra'] },
  { company: 'Together AI', role: 'ML Infra Engineer', source: 'YC', tc: '$300k+', badge: '🆕', tags: ['AI'] },
  { company: 'Replit', role: 'Senior Engineer', source: 'YC', tc: '$280k+', badge: '🆕', tags: ['Dev Tools'] },
  { company: 'Groq', role: 'Compiler Engineer', source: 'a16z', tc: '$400k+', badge: '⚡', tags: ['Hardware'] },
  { company: 'Scale AI', role: 'Data Platform Engineer', source: 'a16z', tc: '$350k+', badge: '🔥', tags: ['Data'] },
];

const SALARY_DATA = [
  { city: 'San Francisco', avg: 285000, yoy: +4.2 },
  { city: 'New York', avg: 265000, yoy: +2.8 },
  { city: 'Seattle', avg: 255000, yoy: +3.1 },
  { city: 'Austin', avg: 195000, yoy: +1.9 },
  { city: 'Boston', avg: 220000, yoy: +2.1 },
  { city: 'London', avg: 175000, yoy: -0.8 },
  { city: 'Berlin', avg: 115000, yoy: +1.2 },
  { city: 'Toronto', avg: 155000, yoy: +0.9 },
  { city: 'Singapore', avg: 165000, yoy: +5.1 },
  { city: 'Remote (US)', avg: 235000, yoy: +6.4 },
];

const maxSal = Math.max(...SALARY_DATA.map(s => s.avg));

export default function RightPanels({ onSelectCompany }: Props) {
  const [tab, setTab] = useState<Tab>('LAYOFFS');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#070d1c', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer',
            fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent',
            color: tab === t ? '#e2e8f0' : '#334155',
            borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>

        {/* LAYOFFS tab */}
        {tab === 'LAYOFFS' && LAYOFFS.map((d, i) => (
          <button key={i} onClick={() => onSelectCompany({ ...d, type: 'layoff' })} style={{
            width: '100%', textAlign: 'left', background: 'none', border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '9px 14px',
            cursor: 'pointer', transition: 'background 0.12s',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 14, flexShrink: 0,
            }}>🔴</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.company}
              </div>
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 1 }}>
                {d.count.toLocaleString()} laid off · {d.pct}%
              </div>
              <div style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>{d.date} · {d.sector}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>
                -{d.pct}%
              </div>
            </div>
          </button>
        ))}

        {/* HOT JOBS tab */}
        {tab === 'HOT JOBS' && (
          <>
            <div style={{ padding: '6px 14px 10px', fontSize: 10, color: '#334155' }}>
              Updated hourly · Sources: YC WorkAtAStartup · a16z Jobs · HN Who's Hiring
            </div>
            {HOT_JOBS.map((j, i) => (
              <div key={i} style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                padding: '9px 14px', transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{j.badge}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{j.company}</span>
                  <span style={{
                    fontSize: 9, padding: '1px 5px', borderRadius: 4,
                    background: j.source === 'YC' ? 'rgba(251,146,60,0.2)' : 'rgba(99,102,241,0.2)',
                    color: j.source === 'YC' ? '#fb923c' : '#818cf8',
                    fontWeight: 700, letterSpacing: '0.06em',
                  }}>{j.source}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22c55e', fontFamily: 'monospace', fontWeight: 700 }}>{j.tc}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 20 }}>{j.role}</div>
                <div style={{ paddingLeft: 20, marginTop: 4, display: 'flex', gap: 4 }}>
                  {j.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 3,
                      background: 'rgba(255,255,255,0.05)', color: '#475569',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* SALARY tab */}
        {tab === 'SALARY' && (
          <>
            <div style={{ padding: '6px 14px 10px', fontSize: 10, color: '#334155' }}>
              Avg Total Comp (SWE L4-L5) · Source: H1B DOL data + levels.fyi
            </div>
            {SALARY_DATA.map((s, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.city}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, color: s.yoy >= 0 ? '#22c55e' : '#ef4444',
                      fontFamily: 'monospace',
                    }}>{s.yoy >= 0 ? '▲' : '▼'} {Math.abs(s.yoy)}%</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
                      ${(s.avg / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                {/* Bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${(s.avg / maxSal) * 100}%`,
                    background: `hsl(${Math.round((s.avg / maxSal) * 50 + 30)}, 90%, 55%)`,
                    transition: 'width 0.4s',
                  }} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* MARKET tab */}
        {tab === 'MARKET' && (
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total tracked layoffs', value: '428,000', sub: 'Since Jan 2023', color: '#ef4444', icon: '🔴' },
              { label: 'Layoffs this year', value: '106,000', sub: '2025 YTD', color: '#f97316', icon: '📉' },
              { label: 'Open VC-backed roles', value: '3,640+', sub: 'YC + a16z + Sequoia', color: '#22c55e', icon: '🟢' },
              { label: 'Avg time to hire', value: '6.2 weeks', sub: 'Up from 4.1 in 2022', color: '#94a3b8', icon: '⏱' },
              { label: 'AI sector growth', value: '+340%', sub: 'Roles vs 2022', color: '#818cf8', icon: '🤖' },
              { label: 'Median SWE TC (US)', value: '$245k', sub: 'All levels combined', color: '#fbbf24', icon: '💰' },
              { label: 'Remote jobs share', value: '38%', sub: 'Down from 61% in 2021', color: '#06b6d4', icon: '🏠' },
              { label: 'Recovery signal', value: 'Cautious ↑', sub: 'AI hiring offsetting cuts', color: '#22c55e', icon: '📈' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>{stat.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: stat.color, fontFamily: 'monospace', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`div::-webkit-scrollbar{width:3px}div::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}`}</style>
    </div>
  );
}
