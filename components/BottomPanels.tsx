'use client';
import { useState, useEffect } from 'react';
import { TOP_TC, TALENT_ARCS } from '@/lib/data';

interface Props { onSelectCompany: (c: any) => void; }

const SALARY = [
  { city: 'San Francisco', avg: 285, yoy: +4.2 },
  { city: 'New York', avg: 265, yoy: +2.8 },
  { city: 'Seattle', avg: 255, yoy: +3.1 },
  { city: 'Remote (US)', avg: 235, yoy: +6.4 },
  { city: 'Boston', avg: 220, yoy: +2.1 },
  { city: 'Austin', avg: 195, yoy: +1.9 },
  { city: 'London', avg: 175, yoy: -0.8 },
  { city: 'Singapore', avg: 165, yoy: +5.1 },
];
const maxSal = 285;

const MARKET_STATS = [
  { label: 'Total 2026 Layoffs', value: '62k+', color: '#ef4444', icon: '🔴', sub: 'YTD 2026' },
  { label: 'Open VC-Backed Roles', value: '3,640+', color: '#22c55e', icon: '🟢', sub: 'YC + a16z + Seq.' },
  { label: 'AI Sector Job Growth', value: '+340%', color: '#818cf8', icon: '🤖', sub: 'vs 2022' },
  { label: 'Median SWE TC (US)', value: '$245k', color: '#fbbf24', icon: '💰', sub: 'All levels' },
  { label: 'Avg Hiring Timeline', value: '6.2w', color: '#94a3b8', icon: '⏱', sub: 'Up from 4.1w' },
  { label: 'Remote Jobs Share', value: '38%', color: '#06b6d4', icon: '🌐', sub: 'Down from 61%' },
];

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const panelStyle = {
  borderRight: '1px solid rgba(255,255,255,0.06)',
  display: 'flex' as const, flexDirection: 'column' as const,
  height: '100%', overflow: 'hidden',
};

function PanelHeader({ label, badge, sub }: { label: string; badge?: string; sub?: string }) {
  return (
    <div style={{
      padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
      background: 'rgba(255,255,255,0.02)',
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase' as const }}>{label}</span>
      {badge && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 700 }}>{badge}</span>}
      {sub && <span style={{ fontSize: 9, color: '#334155', marginLeft: 4 }}>{sub}</span>}
      <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'blink 2s infinite' }} />
    </div>
  );
}

function Spinner() {
  return <div style={{ padding: 20, textAlign: 'center', color: '#334155', fontSize: 11, fontFamily: 'monospace' }}>Fetching live data...</div>;
}

export default function BottomPanels({ onSelectCompany }: Props) {
  const [layoffs, setLayoffs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState({ layoffs: true, jobs: true, questions: true });

  useEffect(() => {
    fetch('/api/layoffs')
      .then(r => r.json())
      .then(d => {
        const all = [...(d.layoffs || []), ...(d.noCoords || [])];
        setLayoffs(all);
        setLoading(l => ({ ...l, layoffs: false }));
      })
      .catch(() => setLoading(l => ({ ...l, layoffs: false })));

    fetch('/api/jobs')
      .then(r => r.json())
      .then(d => {
        setJobs(d.jobs || []);
        setLoading(l => ({ ...l, jobs: false }));
      })
      .catch(() => setLoading(l => ({ ...l, jobs: false })));

    fetch('/api/questions')
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setLoading(l => ({ ...l, questions: false }));
      })
      .catch(() => setLoading(l => ({ ...l, questions: false })));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', background: '#060d1a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Col 1: LAYOFFS — 27% */}
      <div style={{ ...panelStyle, flex: '0 0 27%' }}>
        <PanelHeader label="Recent Layoffs" badge="● LIVE" sub="Last 30 days" />
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading.layoffs ? <Spinner /> : layoffs.length === 0 ? (
            <div style={{ padding: '16px 12px', color: '#334155', fontSize: 11 }}>No layoff data found. Checking sources...</div>
          ) : layoffs.map((item, i) => (
            <button key={i}
              onClick={() => item.lat && onSelectCompany({ ...item, type: 'layoff' })}
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                padding: '8px 12px', cursor: item.lat ? 'pointer' : 'default',
                display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (item.lat) e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 7, flexShrink: 0, marginTop: 1,
                background: item.isBreaking ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${item.isBreaking ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>🔴</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {item.company}
                  </span>
                  {item.isBreaking && <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: '#ef4444', color: '#fff', fontWeight: 800, flexShrink: 0 }}>BREAKING</span>}
                </div>
                {item.count > 0 && (
                  <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 2, fontWeight: 600 }}>
                    {item.count.toLocaleString()} laid off{item.pct ? ` · ${item.pct}% of workforce` : ''}
                  </div>
                )}
                <div style={{ fontSize: 10, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {item.title || item.sector}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ fontSize: 9, color: '#334155', whiteSpace: 'nowrap' as const }}>{timeAgo(item.date)}</div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(99,102,241,0.12)', color: '#818cf8',
                      textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' as const,
                    }}>📰 Source</a>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Col 2: HOT JOBS — 32% */}
      <div style={{ ...panelStyle, flex: '0 0 32%' }}>
        <PanelHeader label="Hot Jobs" sub={`Greenhouse · RemoteOK · HN Hiring`} />
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading.jobs ? <Spinner /> : jobs.length === 0 ? (
            <div style={{ padding: 16, color: '#334155', fontSize: 11 }}>Loading job listings...</div>
          ) : (
            <>
              {jobs.map((j, i) => (
                <a key={i} href={j.applyUrl || j.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    padding: '8px 12px', textDecoration: 'none', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, flexShrink: 0, marginTop: 1,
                    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                  }}>{j.badge || '🆕'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        {j.company}
                      </span>
                      <span style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 3, flexShrink: 0,
                        background: j.source === 'Greenhouse' ? 'rgba(34,197,94,0.2)' :
                                    j.source === 'RemoteOK' ? 'rgba(251,146,60,0.2)' : 'rgba(99,102,241,0.2)',
                        color: j.source === 'Greenhouse' ? '#22c55e' :
                               j.source === 'RemoteOK' ? '#fb923c' : '#818cf8',
                        fontWeight: 700,
                      }}>{j.source}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{j.role}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 9, color: '#475569' }}>{j.remote ? '🌐 Remote' : `📍 ${j.location}`}</span>
                      {j.salary && <span style={{ fontSize: 9, color: '#22c55e', fontFamily: 'monospace', fontWeight: 700 }}>{j.salary}</span>}
                      {j.tags?.length > 0 && j.tags.slice(0, 2).map((t: string) => (
                        <span key={t} style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#334155' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: '#334155', marginBottom: 4 }}>{timeAgo(j.postedAt)}</div>
                    <div style={{
                      fontSize: 9, padding: '2px 7px', borderRadius: 4,
                      background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 700,
                    }}>Apply →</div>
                  </div>
                </a>
              ))}
              <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#334155' }}>{jobs.length} open roles</span>
                <a href="https://interviewcoder.co" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
                  Prep for these interviews →
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Col 3: LEAKED QUESTIONS — 28% */}
      <div style={{ ...panelStyle, flex: '0 0 28%' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase' as const }}>🔓 Leaked Questions</span>
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(251,191,36,0.2)', color: '#fbbf24', fontWeight: 700 }}>REAL</span>
          <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'blink 2s infinite' }} />
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading.questions ? <Spinner /> : questions.length === 0 ? (
            <div style={{ padding: 16, color: '#334155', fontSize: 11 }}>Loading questions...</div>
          ) : questions.map((q, i) => (
            <a key={i} href={q.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', borderBottom: '1px solid rgba(255,255,255,0.04)',
                padding: '9px 12px', textDecoration: 'none', transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,191,36,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {/* Company + Position */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{q.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {q.company}
                    </span>
                    <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 3, background: 'rgba(99,102,241,0.15)', color: '#818cf8', flexShrink: 0 }}>
                      {q.position?.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                  background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 700,
                }}>Practice →</span>
              </div>

              {/* Question preview */}
              {q.preview && (
                <div style={{
                  fontSize: 10, color: '#94a3b8', lineHeight: 1.5, marginBottom: 5,
                  borderLeft: '2px solid rgba(251,191,36,0.3)', paddingLeft: 8,
                  fontStyle: 'italic',
                }}>
                  "{q.preview}"
                </div>
              )}

              {/* Tags */}
              {q.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                  {q.tags.map((t: string) => (
                    <span key={t} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#475569' }}>{t}</span>
                  ))}
                </div>
              )}
            </a>
          ))}

          {/* CTA footer */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(251,191,36,0.03)' }}>
            <a href="https://interviewcoder.co" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>InterviewCoder</div>
                <div style={{ fontSize: 9, color: '#475569' }}>AI assistance for your next interview</div>
              </div>
              <div style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#000',
              }}>Try Free →</div>
            </a>
          </div>
        </div>
      </div>

      {/* Col 4: TALENT FLOW + SALARY + MARKET — 13% */}
      <div style={{ ...panelStyle, flex: '0 0 13%', borderRight: 'none' }}>

        {/* Talent Flow Stats */}
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', color: '#818cf8', textTransform: 'uppercase' as const }}>🔄 Talent Flow</span>
          </div>
          {/* Total number */}
          <div style={{ padding: '6px 12px 4px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#a5b4fc', fontFamily: 'monospace', lineHeight: 1 }}>
              {TALENT_ARCS.reduce((s, a) => s + a.count, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>engineers tracked globally</div>
          </div>
          {/* Top flows list */}
          <div style={{ overflowY: 'auto', maxHeight: 160 }}>
            {[...TALENT_ARCS]
              .sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((arc, i) => (
                <a key={i} href={arc.source} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '4px 12px', textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: 9, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1, marginRight: 6 }}>
                    {arc.label}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', fontFamily: 'monospace', flexShrink: 0 }}>
                    {arc.count.toLocaleString()}
                  </span>
                </a>
              ))}
          </div>
        </div>

        {/* Salary section */}
        <div style={{ flex: '0 0 30%', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase' as const }}>Salary Intel</span>
            <span style={{ fontSize: 9, color: '#334155', marginLeft: 8 }}>Avg TC · SWE L4-L5</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px 10px' }}>
            {SALARY.map((s, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{s.city}</span>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: s.yoy >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>{s.yoy >= 0 ? '▲' : '▼'}{Math.abs(s.yoy)}%</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>${s.avg}k</span>
                  </div>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${(s.avg / maxSal) * 100}%`, background: `hsl(${Math.round((s.avg / maxSal) * 50 + 30)}, 85%, 55%)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market stats section */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase' as const }}>Market Pulse</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {MARKET_STATS.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 7, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: 'monospace', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: '#334155', marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        div::-webkit-scrollbar { width: 2px }
        div::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px }
      `}</style>
    </div>
  );
}
