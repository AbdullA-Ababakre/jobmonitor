'use client';
import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { window.location.reload(); return 300; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      height: 56,
      zIndex: 50, background: 'rgba(6,13,26,0.90)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 10px #22c55e', animation: 'hpulse 2s infinite',
        }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.03em' }}>
          🌍 JobMonitor
        </span>
        <span style={{ fontSize: 11, color: '#334155', marginLeft: 2 }}>
          Real-time tech job market intelligence
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* LIVE badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: 6, padding: '4px 10px',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'hpulse 1.5s infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>LIVE</span>
      </div>

      {/* Date badge */}
      <div style={{
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 6, padding: '4px 10px',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>{date}</span>
      </div>

      {/* Clock */}
      <span style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace' }}>🕐 {time} EST</span>

      {/* Refresh countdown */}
      <span style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>
        ↻ {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
      </span>

      <style>{`
        @keyframes hpulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px currentColor; }
          50% { opacity: 0.5; box-shadow: 0 0 3px currentColor; }
        }
      `}</style>
    </div>
  );
}
