'use client';
import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [countdown, setCountdown] = useState(300);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
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
      height: isMobile ? 48 : 56,
      flexShrink: 0,
      zIndex: 50, background: 'rgba(6,13,26,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 12px' : '0 20px',
      gap: isMobile ? 8 : 16,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 8px #22c55e', animation: 'hpulse 2s infinite', flexShrink: 0,
        }} />
        <span style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
          🌍 JobMonitor
        </span>
        {!isMobile && (
          <span style={{ fontSize: 11, color: '#334155', marginLeft: 2 }}>
            Real-time tech job market intelligence
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* LIVE badge — always visible */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: 6, padding: '3px 8px',
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'hpulse 1.5s infinite' }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>LIVE</span>
      </div>

      {/* Date — hidden on mobile */}
      {!isMobile && (
        <div style={{
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 6, padding: '3px 10px',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>{date}</span>
        </div>
      )}

      {/* Clock — compact on mobile */}
      <span style={{ fontSize: isMobile ? 10 : 12, color: '#475569', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
        {isMobile ? time : `🕐 ${time} EST`}
      </span>

      {/* Refresh countdown — desktop only */}
      {!isMobile && (
        <span style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>
          ↻ {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </span>
      )}

      <style>{`
        @keyframes hpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
