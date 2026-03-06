'use client';
import { useEffect, useRef } from 'react';
import { LAYOFFS, HIRING, TOP_TC } from '@/lib/data';

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }
interface Props { layers: Layers; onSelectCompany: (c: any) => void; liveLayoffs?: any[]; }

declare global { interface Window { L: any } }

export default function MapInner({ layers, onSelectCompany, liveLayoffs = [] }: Props) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapRef.current) return; // already initialized

    const L = window.L;
    if (!L) return;

    // Init map
    const map = L.map('jobmonitor-map', {
      center: [30, 10],
      zoom: 2.4,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 8,
    });
    mapRef.current = map;

    // Dark tiles — CartoDB Dark Matter (no API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Attribution tiny
    L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map);

    renderMarkers(L, map);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;
    const L = window.L;
    if (!L) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    renderMarkers(L, mapRef.current);
  }, [layers, liveLayoffs]);

  function renderMarkers(L: any, map: any) {
    const all: any[] = [];

    // Use live data if available, fall back to static
    const layoffData = liveLayoffs.length > 0 ? liveLayoffs.filter(l => l.lat && l.lng) : LAYOFFS;

    if (layers.layoffs) {
      layoffData.forEach(d => {
        const r = Math.max(6, Math.min(28, d.count / 700));
        const m = L.circleMarker([d.lat, d.lng], {
          radius: r, fillColor: '#ef4444', color: '#fca5a5',
          weight: 1.5, fillOpacity: 0.75,
        }).addTo(map);
        m.bindTooltip(`
          <div style="font-family:monospace;font-size:12px;background:#0a0f1a;color:#e2e8f0;border:1px solid #ef444466;border-radius:8px;padding:8px 12px;min-width:160px">
            <b>${d.company}</b><br>
            <span style="color:#ef4444">🔴 ${d.count.toLocaleString()} laid off (${d.pct}%)</span><br>
            <span style="color:#475569">${d.date} · ${d.sector}</span>
          </div>`, { className: 'jm-tooltip', sticky: true });
        m.on('click', () => onSelectCompany({ ...d, type: 'layoff' }));
        all.push(m);

        // Pulse ring
        const pulse = L.circleMarker([d.lat, d.lng], {
          radius: r + 4, fillColor: 'transparent',
          color: '#ef4444', weight: 1, fillOpacity: 0, opacity: 0.3,
        }).addTo(map);
        all.push(pulse);
      });
    }

    if (layers.hiring) {
      HIRING.forEach(d => {
        const r = Math.max(5, Math.min(18, d.openRoles / 60));
        const m = L.circleMarker([d.lat, d.lng], {
          radius: r, fillColor: '#22c55e', color: '#86efac',
          weight: 1.5, fillOpacity: 0.75,
        }).addTo(map);
        m.bindTooltip(`
          <div style="font-family:monospace;font-size:12px;background:#0a0f1a;color:#e2e8f0;border:1px solid #22c55e66;border-radius:8px;padding:8px 12px">
            <b>${d.company}</b><br>
            <span style="color:#22c55e">🟢 ${d.openRoles} open roles</span><br>
            <span style="color:#475569">${d.sector}</span>
          </div>`, { className: 'jm-tooltip', sticky: true });
        m.on('click', () => onSelectCompany({ ...d, type: 'hiring' }));
        all.push(m);
      });
    }

    if (layers.topTC) {
      TOP_TC.forEach(d => {
        const m = L.circleMarker([d.lat, d.lng], {
          radius: 9, fillColor: '#fbbf24', color: '#fde68a',
          weight: 1.5, fillOpacity: 0.85,
        }).addTo(map);
        m.bindTooltip(`
          <div style="font-family:monospace;font-size:12px;background:#0a0f1a;color:#e2e8f0;border:1px solid #fbbf2466;border-radius:8px;padding:8px 12px">
            <b>${d.company}</b><br>
            <span style="color:#fbbf24">💰 Avg TC: $${(d.avgTC/1000).toFixed(0)}k/yr</span><br>
            <span style="color:#475569">${d.sector}</span>
          </div>`, { className: 'jm-tooltip', sticky: true });
        m.on('click', () => onSelectCompany({ ...d, type: 'topTC' }));
        all.push(m);
      });
    }

    markersRef.current = all;
  }

  return (
    <>
      <div id="jobmonitor-map" style={{ width: '100%', height: '100%', background: '#060d1a' }} />
      <style>{`
        .leaflet-container { background: #060d1a !important; }
        .jm-tooltip .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip { background: transparent; border: none; padding: 0; box-shadow: none; }
        .leaflet-tooltip-left::before, .leaflet-tooltip-right::before { display: none; }
      `}</style>
    </>
  );
}
