'use client';

interface Props {
  company: any;
  onClose: () => void;
}

const SECTOR_COLORS: Record<string, string> = {
  'Big Tech': '#6366f1', 'AI': '#8b5cf6', 'Fintech': '#06b6d4',
  'Social': '#ec4899', 'SaaS': '#3b82f6', 'Semiconductor': '#f59e0b',
  'Crypto': '#f97316', 'Mobility': '#14b8a6', 'E-commerce': '#84cc16',
  'Media': '#a855f7', 'Streaming': '#ef4444', 'Networking': '#22c55e',
  'Aerospace': '#64748b', 'EV/Auto': '#10b981', 'Finance/Tech': '#fbbf24',
};

export default function CompanyCard({ company, onClose }: Props) {
  const isLayoff = company.type === 'layoff' || company.count !== undefined;
  const isHiring = company.type === 'hiring' || company.openRoles !== undefined;
  const isTC = company.type === 'topTC' || company.avgTC !== undefined;
  const color = isLayoff ? '#ef4444' : isHiring ? '#22c55e' : isTC ? '#fbbf24' : '#818cf8';
  const sectorColor = SECTOR_COLORS[company.sector] || '#64748b';
  const icSlug = company.slug || company.company?.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div style={{
      position: 'fixed', right: 310, top: '50%', transform: 'translateY(-50%)',
      zIndex: 30, width: 300,
      background: 'rgba(6,13,26,0.96)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${color}33`,
      borderTop: `3px solid ${color}`,
      borderRadius: 14, padding: '20px',
      boxShadow: `0 0 40px ${color}15`,
      animation: 'slideIn 0.28s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 12, right: 12, background: 'none',
        border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, lineHeight: 1,
      }}>×</button>

      {/* Company name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}22`, border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {isLayoff ? '🔴' : isHiring ? '🟢' : isTC ? '💰' : '🔄'}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{company.company}</div>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            color: sectorColor, letterSpacing: '0.08em',
          }}>{company.sector}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {isLayoff && <>
          <Stat label="Laid off" value={company.count?.toLocaleString()} color={color} />
          <Stat label="% of workforce" value={`${company.pct}%`} color={color} />
          <Stat label="Date" value={company.date} color="#64748b" />
        </>}
        {isHiring && <>
          <Stat label="Open roles" value={company.openRoles?.toLocaleString()} color={color} />
          <Stat label="Status" value="Actively hiring" color={color} />
        </>}
        {isTC && <>
          <Stat label="Avg Total Comp" value={`$${(company.avgTC/1000).toFixed(0)}k/yr`} color={color} />
          <Stat label="Sector" value={company.sector} color="#64748b" />
        </>}
      </div>

      {/* InterviewCoder CTA */}
      <a
        href={`https://interviewcoder.co${isLayoff ? `/questions?company=${icSlug}` : ''}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'block', width: '100%', padding: '11px 16px',
          background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
          border: 'none', borderRadius: 8, cursor: 'pointer',
          textDecoration: 'none', textAlign: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
          letterSpacing: '0.02em', transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {isLayoff ? `Practice ${company.company} interviews →` :
         isTC ? `Interview at ${company.company} →` :
         `Get hired at ${company.company} →`}
      </a>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#334155', marginTop: 6 }}>
        via interviewcoder.co
      </div>

      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-50%) translateX(20px); } to { opacity:1; transform:translateY(-50%) translateX(0); } }`}</style>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
