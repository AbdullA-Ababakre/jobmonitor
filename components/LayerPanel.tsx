'use client';

interface Layers {
  layoffs: boolean;
  hiring: boolean;
  topTC: boolean;
  talent: boolean;
}

interface Props {
  layers: Layers;
  onChange: (layers: Layers) => void;
}

const LAYER_CONFIG = [
  { key: 'layoffs', label: 'Layoffs', emoji: '🔴', color: '#ef4444', count: '428k cut' },
  { key: 'hiring', label: 'Hiring', emoji: '🟢', color: '#22c55e', count: '3.6k roles' },
  { key: 'topTC', label: 'Top TC', emoji: '💰', color: '#fbbf24', count: 'up to $900k' },
  { key: 'talent', label: 'Talent Flow', emoji: '🔄', color: '#818cf8', count: 'arcs' },
] as const;

export default function LayerPanel({ layers, onChange }: Props) {
  const toggle = (key: keyof Layers) => {
    onChange({ ...layers, [key]: !layers[key] });
  };

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(6,13,26,0.88)',
      backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '16px 14px', display: 'flex',
      flexDirection: 'column', gap: 6, minWidth: 168,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
        color: '#334155', textTransform: 'uppercase', marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>🎛</span> LAYERS
      </div>
      {LAYER_CONFIG.map(({ key, label, emoji, color, count }) => {
        const active = layers[key as keyof Layers];
        return (
          <button
            key={key}
            onClick={() => toggle(key as keyof Layers)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, background: active ? `${color}11` : 'transparent',
              border: `1px solid ${active ? color + '44' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
              transition: 'all 0.2s', width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 14 }}>{emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#e2e8f0' : '#64748b' }}>
                  {label}
                </div>
                <div style={{ fontSize: 10, color: active ? color : '#334155' }}>{count}</div>
              </div>
            </div>
            {/* Toggle */}
            <div style={{
              width: 32, height: 18, borderRadius: 9,
              background: active ? color : '#1e293b',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3, left: active ? 16 : 3,
                width: 12, height: 12, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
