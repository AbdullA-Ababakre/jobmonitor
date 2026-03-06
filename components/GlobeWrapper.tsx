'use client';
import dynamic from 'next/dynamic';

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }
interface Props { layers: Layers; onSelectCompany: (c: any) => void; liveLayoffs?: any[]; }

const GlobeInner = dynamic(() => import('./GlobeInner'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', background: '#060d1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        border: '3px solid rgba(99,102,241,0.25)',
        borderTop: '3px solid #6366f1',
        animation: 'spin 1s linear infinite',
      }} />
      <div style={{ color: '#334155', fontFamily: 'monospace', fontSize: 13 }}>Rendering globe...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function GlobeWrapper(props: Props) {
  return <GlobeInner {...props} />;
}
