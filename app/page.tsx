'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import LayerPanel from '@/components/LayerPanel';
import BottomPanels from '@/components/BottomPanels';

const GlobeWrapper = dynamic(() => import('@/components/GlobeWrapper'), { ssr: false });

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }

export default function Home() {
  const [layers, setLayers] = useState<Layers>({ layoffs: true, hiring: true, topTC: false, talent: true });
  const [selected, setSelected] = useState<any>(null);
  const [liveLayoffs, setLiveLayoffs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/layoffs').then(r => r.json()).then(d => setLiveLayoffs(d.layoffs || [])).catch(() => {});
  }, []);

  return (
    <main style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#080e1a', display: 'flex', flexDirection: 'column',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      <Header />

      {/* Map — top 55% */}
      <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <GlobeWrapper layers={layers} onSelectCompany={setSelected} liveLayoffs={liveLayoffs} />

        {/* Layer panel — overlaid top-left on map */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 500 }}>
          <LayerPanel layers={layers} onChange={setLayers} />
        </div>

        {/* Company tooltip — overlaid bottom-center on map */}
        {selected && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 600, width: 380 }}>
            <CompanyCard company={selected} onClose={() => setSelected(null)} />
          </div>
        )}

        {/* Map timestamp */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 400,
          fontSize: 10, color: '#334155', fontFamily: 'monospace', letterSpacing: '0.06em',
        }}>
          {new Date().toUTCString().replace('GMT', 'UTC')}
        </div>
      </div>

      {/* Bottom panels — 4 columns */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <BottomPanels onSelectCompany={setSelected} />
      </div>
    </main>
  );
}

function CompanyCard({ company, onClose }: { company: any; onClose: () => void }) {
  const isLayoff = company.type === 'layoff';
  const isHiring = company.type === 'hiring';
  const color = isLayoff ? '#ef4444' : isHiring ? '#22c55e' : '#fbbf24';
  const slug = company.slug || company.company?.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div style={{
      background: 'rgba(5,10,20,0.97)', backdropFilter: 'blur(20px)',
      border: `1px solid ${color}40`, borderTop: `2px solid ${color}`,
      borderRadius: 10, padding: '12px 16px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.7)`,
      display: 'flex', alignItems: 'center', gap: 14,
      animation: 'slideUp 0.2s ease',
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{isLayoff ? '🔴' : isHiring ? '🟢' : '💰'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{company.company}</div>
        <div style={{ fontSize: 11, color, marginTop: 2 }}>
          {isLayoff ? `${company.count?.toLocaleString()} laid off · ${company.pct}% workforce · ${company.date}` :
           isHiring ? `${company.openRoles} open roles · ${company.sector}` :
           `Avg TC $${(company.avgTC/1000).toFixed(0)}k · ${company.sector}`}
        </div>
      </div>
      <a href={`https://interviewcoder.co${isLayoff ? `/questions?company=${slug}` : ''}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          padding: '8px 14px', background: color, borderRadius: 6,
          fontSize: 11, fontWeight: 700, color: '#fff', textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
        {isLayoff ? 'Practice interviews →' : 'Get hired →'}
      </a>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>×</button>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}
