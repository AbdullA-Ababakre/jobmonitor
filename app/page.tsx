'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import LayerPanel from '@/components/LayerPanel';
import BottomPanels from '@/components/BottomPanels';

const MapWrapper = dynamic(() => import('@/components/MapWrapper'), { ssr: false });

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }

export default function Home() {
  const [layers, setLayers] = useState<Layers>({ layoffs: true, hiring: true, topTC: false, talent: true });
  const [selected, setSelected] = useState<any>(null);
  const [liveLayoffs, setLiveLayoffs] = useState<any[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [layerOpen, setLayerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    fetch('/api/layoffs').then(r => r.json()).then(d => setLiveLayoffs(d.layoffs || [])).catch(() => {});
  }, []);

  const mapHeight = isMobile
    ? (mapExpanded ? '55vh' : '38vh')
    : '55%';

  return (
    <main style={{
      width: '100vw', height: '100vh', overflow: isMobile ? 'auto' : 'hidden',
      background: '#080e1a', display: 'flex', flexDirection: 'column',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      <Header />

      {/* Map */}
      <div style={{
        flexShrink: 0,
        height: mapHeight,
        transition: 'height 0.3s ease',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <MapWrapper layers={layers} onSelectCompany={setSelected} liveLayoffs={liveLayoffs} />

        {/* Layer toggle button (mobile) */}
        {isMobile && (
          <button
            onClick={() => setLayerOpen(o => !o)}
            style={{
              position: 'absolute', top: 10, left: 10, zIndex: 600,
              background: 'rgba(6,13,26,0.92)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '6px 12px', color: '#e2e8f0',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ⚙ LAYERS {layerOpen ? '▲' : '▼'}
          </button>
        )}

        {/* Layer panel — desktop always visible, mobile collapsible */}
        {(!isMobile || layerOpen) && (
          <div style={{
            position: 'absolute',
            top: isMobile ? 42 : 12,
            left: 12, zIndex: 500,
          }}>
            <LayerPanel layers={layers} onChange={(l) => { setLayers(l); if (isMobile) setLayerOpen(false); }} />
          </div>
        )}

        {/* Map expand/collapse button (mobile) */}
        {isMobile && (
          <button
            onClick={() => setMapExpanded(e => !e)}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 600,
              background: 'rgba(6,13,26,0.92)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '6px 10px', color: '#94a3b8',
              fontSize: 11, cursor: 'pointer',
            }}
          >
            {mapExpanded ? '▼ Less' : '▲ More'}
          </button>
        )}

        {/* Company tooltip */}
        {selected && (
          <div style={{
            position: 'absolute', bottom: 12,
            left: isMobile ? 8 : '50%',
            right: isMobile ? 8 : 'auto',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            zIndex: 600,
            width: isMobile ? 'auto' : 380,
          }}>
            <CompanyCard company={selected} onClose={() => setSelected(null)} isMobile={isMobile} />
          </div>
        )}

        {/* Timestamp — desktop only */}
        {!isMobile && (
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 400,
            fontSize: 10, color: '#334155', fontFamily: 'monospace', letterSpacing: '0.06em',
          }}>
            {new Date().toUTCString().replace('GMT', 'UTC')}
          </div>
        )}
      </div>

      {/* Bottom panels */}
      <div style={{
        flex: isMobile ? 'none' : 1,
        overflow: isMobile ? 'visible' : 'hidden',
        minHeight: isMobile ? 0 : undefined,
      }}>
        <BottomPanels onSelectCompany={setSelected} isMobile={isMobile} />
      </div>

      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width: 767px) {
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        }
      `}</style>
    </main>
  );
}

function CompanyCard({ company, onClose, isMobile }: { company: any; onClose: () => void; isMobile?: boolean }) {
  const isLayoff = company.type === 'layoff';
  const isHiring = company.type === 'hiring';
  const color = isLayoff ? '#ef4444' : isHiring ? '#22c55e' : '#fbbf24';
  const slug = company.slug || company.company?.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div style={{
      background: 'rgba(5,10,20,0.97)', backdropFilter: 'blur(20px)',
      border: `1px solid ${color}40`, borderTop: `2px solid ${color}`,
      borderRadius: 10, padding: isMobile ? '10px 12px' : '12px 16px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.7)`,
      display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14,
      animation: 'slideUp 0.2s ease',
    }}>
      <span style={{ fontSize: isMobile ? 18 : 22, flexShrink: 0 }}>{isLayoff ? '🔴' : isHiring ? '🟢' : '💰'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: '#e2e8f0' }}>{company.company}</div>
        <div style={{ fontSize: isMobile ? 10 : 11, color, marginTop: 2 }}>
          {isLayoff ? `${company.count?.toLocaleString()} laid off · ${company.date}` :
           isHiring ? `${company.openRoles} open roles · ${company.sector}` :
           `Avg TC $${(company.avgTC/1000).toFixed(0)}k`}
        </div>
      </div>
      <a href={`https://interviewcoder.co${isLayoff ? `/questions?company=${slug}` : ''}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          padding: isMobile ? '6px 10px' : '8px 14px',
          background: color, borderRadius: 6,
          fontSize: isMobile ? 10 : 11, fontWeight: 700, color: '#fff',
          textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
        {isLayoff ? 'Practice →' : 'Apply →'}
      </a>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: '#475569',
        cursor: 'pointer', fontSize: isMobile ? 20 : 18,
        flexShrink: 0, padding: '4px', lineHeight: 1,
      }}>×</button>
    </div>
  );
}
