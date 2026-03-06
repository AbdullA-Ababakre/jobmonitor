'use client';
import { useEffect, useRef } from 'react';
import { LAYOFFS, HIRING, TOP_TC, TALENT_ARCS } from '@/lib/data';

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }
interface Props { layers: Layers; onSelectCompany: (c: any) => void; liveLayoffs?: any[]; }

declare global { interface Window { L: any } }

// Convert lat/lng to SVG pixel coords given map bounds + SVG size
function latLngToSvgPoint(map: any, lat: number, lng: number): [number, number] {
  const pt = map.latLngToContainerPoint([lat, lng]);
  return [pt.x, pt.y];
}

export default function MapInner({ layers, onSelectCompany, liveLayoffs = [] }: Props) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Init map once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map('jm-map', {
      center: [25, 10],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 8,
    });
    mapRef.current = map;

    // CartoDB Dark Matter — clean dark map, no labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);

    // Minimal attribution
    L.control.attribution({ position: 'bottomright', prefix: '' })
      .addTo(map)
      .setPrefix('<span style="color:#1e293b;font-size:9px">© CartoDB</span>');

    // Create SVG overlay for arcs
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:400;overflow:visible;';
    document.getElementById('jm-map')!.appendChild(svgEl);
    svgRef.current = svgEl;

    // Re-render on map move/zoom
    map.on('move zoom', () => { renderArcs(map, svgEl); });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render markers when layers/data change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof window === 'undefined') return;
    const L = window.L;
    if (!L) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const all: any[] = [];
    const layoffSrc = liveLayoffs.filter(l => l.lat && l.lng).length > 0
      ? liveLayoffs.filter(l => l.lat && l.lng)
      : LAYOFFS;

    if (layers.layoffs) {
      layoffSrc.forEach(d => {
        const r = Math.max(5, Math.min(22, (d.count || 100) / 800));
        const m = L.circleMarker([d.lat, d.lng], {
          radius: r, fillColor: '#ef4444', color: '#fca5a5',
          weight: 1, fillOpacity: 0.80,
        }).addTo(map);
        m.bindTooltip(`
          <div style="background:#060d1a;color:#e2e8f0;border:1px solid #ef444455;border-radius:8px;padding:9px 13px;font-family:-apple-system,sans-serif;min-width:160px">
            <div style="font-weight:700;color:#ef4444;font-size:13px;margin-bottom:3px;">${d.company}</div>
            <div style="font-size:11px;color:#fca5a5;">🔴 ${(d.count||0).toLocaleString()} laid off${d.pct ? ` · ${d.pct}%` : ''}</div>
            <div style="font-size:10px;color:#475569;margin-top:2px;">${d.date}${d.sector ? ' · ' + d.sector : ''}</div>
            ${d.url ? `<div style="margin-top:5px;font-size:10px;"><a href="${d.url}" target="_blank" style="color:#818cf8;text-decoration:none;">📰 Source →</a></div>` : ''}
          </div>`, { className: 'jm-tip', sticky: true, offset: [12, 0] });
        m.on('click', () => onSelectCompany({ ...d, type: 'layoff' }));
        all.push(m);
      });
    }

    if (layers.hiring) {
      HIRING.forEach(d => {
        const r = Math.max(4, Math.min(16, d.openRoles / 70));
        const m = L.circleMarker([d.lat, d.lng], {
          radius: r, fillColor: '#22c55e', color: '#86efac',
          weight: 1, fillOpacity: 0.80,
        }).addTo(map);
        m.bindTooltip(`
          <div style="background:#060d1a;color:#e2e8f0;border:1px solid #22c55e55;border-radius:8px;padding:9px 13px;font-family:-apple-system,sans-serif;">
            <div style="font-weight:700;color:#22c55e;font-size:13px;margin-bottom:3px;">${d.company}</div>
            <div style="font-size:11px;color:#86efac;">🟢 ${d.openRoles} open roles</div>
            <div style="font-size:10px;color:#475569;margin-top:2px;">${d.sector}</div>
          </div>`, { className: 'jm-tip', sticky: true, offset: [12, 0] });
        m.on('click', () => onSelectCompany({ ...d, type: 'hiring' }));
        all.push(m);
      });
    }

    if (layers.topTC) {
      TOP_TC.forEach(d => {
        const m = L.circleMarker([d.lat, d.lng], {
          radius: 8, fillColor: '#fbbf24', color: '#fde68a',
          weight: 1, fillOpacity: 0.90,
        }).addTo(map);
        m.bindTooltip(`
          <div style="background:#060d1a;color:#e2e8f0;border:1px solid #fbbf2455;border-radius:8px;padding:9px 13px;font-family:-apple-system,sans-serif;">
            <div style="font-weight:700;color:#fbbf24;font-size:13px;margin-bottom:3px;">${d.company}</div>
            <div style="font-size:11px;color:#fde68a;">💰 Avg TC: $${(d.avgTC/1000).toFixed(0)}k/yr</div>
            <div style="font-size:10px;color:#475569;margin-top:2px;">${d.sector}</div>
          </div>`, { className: 'jm-tip', sticky: true, offset: [12, 0] });
        m.on('click', () => onSelectCompany({ ...d, type: 'topTC' }));
        all.push(m);
      });
    }

    markersRef.current = all;

    // Store arc data on map instance for renderArcs
    map._arcsData = layers.talent ? TALENT_ARCS : [];
    map._layers_talent = layers.talent;
    if (svgRef.current) renderArcs(map, svgRef.current);
  }, [layers, liveLayoffs]);

  return (
    <>
      <div id="jm-map" style={{ width: '100%', height: '100%', background: '#060d1a', position: 'relative' }} />
      <style>{`
        .leaflet-container { background: #060d1a !important; }
        .jm-tip.leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip-left::before, .leaflet-tooltip-right::before { display: none !important; }
        @keyframes arcDash { to { stroke-dashoffset: -80; } }
      `}</style>
    </>
  );
}

function cubicBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Control point: perpendicular offset proportional to distance
  const offset = dist * 0.35;
  const cx = mx - dy * offset / dist;
  const cy = my + dx * offset / dist;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function renderArcs(map: any, svg: SVGSVGElement) {
  // Clear old arcs
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  if (!(map as any)._layers_talent || !(map as any)._arcsData?.length) return;

  const arcs: typeof TALENT_ARCS = (map as any)._arcsData || [];
  arcs.forEach((arc, i) => {
    try {
      const [sx, sy] = [map.latLngToContainerPoint([arc.startLat, arc.startLng]).x, map.latLngToContainerPoint([arc.startLat, arc.startLng]).y];
      const [ex, ey] = [map.latLngToContainerPoint([arc.endLat, arc.endLng]).x, map.latLngToContainerPoint([arc.endLat, arc.endLng]).y];

      const pathD = cubicBezierPath(sx, sy, ex, ey);
      const pathLen = 80;

      // Glow path (thick, faded)
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glow.setAttribute('d', pathD);
      glow.setAttribute('fill', 'none');
      glow.setAttribute('stroke', 'rgba(139,92,246,0.15)');
      glow.setAttribute('stroke-width', '3');
      svg.appendChild(glow);

      // Animated dashed path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(139,92,246,0.75)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-dasharray', '12 8');
      path.setAttribute('stroke-dashoffset', String(-(i * 15) % 80));
      path.style.animation = `arcDash ${1.8 + (i % 3) * 0.4}s linear infinite`;
      svg.appendChild(path);

      // Moving dot at head
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '2.5');
      dot.setAttribute('fill', '#a78bfa');
      const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
      anim.setAttribute('dur', `${2.2 + (i % 4) * 0.5}s`);
      anim.setAttribute('repeatCount', 'indefinite');
      anim.setAttribute('calcMode', 'linear');
      const mp = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
      // Reference the animated path
      path.setAttribute('id', `arc-path-${i}`);
      mp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#arc-path-${i}`);
      anim.appendChild(mp);
      dot.appendChild(anim);
      svg.appendChild(dot);
    } catch (_) {}
  });
}
