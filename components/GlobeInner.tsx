'use client';
import { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';
import { LAYOFFS, HIRING, TALENT_ARCS, TOP_TC } from '@/lib/data';

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }
interface Props {
  layers: Layers;
  onSelectCompany: (c: any) => void;
  liveLayoffs?: any[];
}

function ptRadius(n: number) { return Math.max(0.3, Math.log(n + 1) / 5.8); }

function layoffTooltip(d: any) {
  return `<div style="background:rgba(6,13,26,0.97);border:1px solid rgba(239,68,68,0.4);border-radius:10px;padding:11px 14px;font-family:-apple-system,sans-serif;min-width:190px;backdrop-filter:blur(16px);">
    <div style="color:#ef4444;font-weight:700;font-size:14px;margin-bottom:4px;">${d.company}</div>
    <div style="color:#fca5a5;font-size:12px;">🔴 ${(d.count||0).toLocaleString()} laid off${d.pct ? ` · ${d.pct}%` : ''}</div>
    <div style="color:#94a3b8;font-size:11px;margin-top:3px;">${d.date} · ${d.sector||''}</div>
    ${d.url ? `<a href="${d.url}" target="_blank" style="display:block;margin-top:7px;font-size:10px;color:#6366f1;border-top:1px solid rgba(255,255,255,0.06);padding-top:5px;text-decoration:none;">📰 Source article →</a>` : ''}
  </div>`;
}

function hiringTooltip(d: any) {
  return `<div style="background:rgba(6,13,26,0.97);border:1px solid rgba(34,197,94,0.4);border-radius:10px;padding:11px 14px;font-family:-apple-system,sans-serif;min-width:175px;backdrop-filter:blur(16px);">
    <div style="color:#22c55e;font-weight:700;font-size:14px;margin-bottom:4px;">${d.company}</div>
    <div style="color:#86efac;font-size:12px;">🟢 ${d.openRoles} open roles</div>
    <div style="color:#64748b;font-size:11px;margin-top:3px;">${d.sector}</div>
  </div>`;
}

function tcTooltip(d: any) {
  return `<div style="background:rgba(6,13,26,0.97);border:1px solid rgba(251,191,36,0.4);border-radius:10px;padding:11px 14px;font-family:-apple-system,sans-serif;min-width:175px;backdrop-filter:blur(16px);">
    <div style="color:#fbbf24;font-weight:700;font-size:14px;margin-bottom:4px;">${d.company}</div>
    <div style="color:#fde68a;font-size:12px;">💰 Avg TC: $${(d.avgTC/1000).toFixed(0)}k/yr</div>
    <div style="color:#64748b;font-size:11px;margin-top:3px;">${d.sector}</div>
  </div>`;
}

function arcTooltip(d: any) {
  return `<div style="background:rgba(6,13,26,0.97);border:1px solid rgba(99,102,241,0.5);border-radius:10px;padding:10px 14px;font-family:-apple-system,sans-serif;min-width:190px;backdrop-filter:blur(16px);">
    <div style="color:#818cf8;font-weight:700;font-size:13px;">🔄 ${d.label}</div>
    <div style="color:#94a3b8;font-size:11px;margin-top:3px;">${d.count.toLocaleString()} engineers relocated</div>
    ${d.source ? `<a href="${d.source}" target="_blank" style="display:block;margin-top:7px;font-size:10px;color:#6366f1;border-top:1px solid rgba(255,255,255,0.06);padding-top:5px;text-decoration:none;">📰 Source →</a>` : ''}
  </div>`;
}

export default function GlobeInner({ layers, onSelectCompany, liveLayoffs = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  // Compute point datasets
  const pointsData = useMemo(() => {
    const pts: any[] = [];
    if (layers.layoffs) {
      const src = liveLayoffs.filter(l => l.lat && l.lng).length > 0
        ? liveLayoffs.filter(l => l.lat && l.lng)
        : LAYOFFS;
      src.forEach(d => pts.push({ ...d, __type: 'layoff', color: 'rgba(239,68,68,0.92)', size: ptRadius(d.count || 100) }));
    }
    if (layers.hiring) {
      HIRING.forEach(d => pts.push({ ...d, __type: 'hiring', color: 'rgba(34,197,94,0.92)', size: ptRadius(d.openRoles) }));
    }
    if (layers.topTC) {
      TOP_TC.forEach(d => pts.push({ ...d, __type: 'topTC', color: 'rgba(251,191,36,0.95)', size: 0.55 }));
    }
    return pts;
  }, [layers.layoffs, layers.hiring, layers.topTC, liveLayoffs]);

  const arcsData = useMemo(() => (layers.talent ? TALENT_ARCS : []), [layers.talent]);

  // Init globe once
  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    const globe = Globe({ animateIn: false })(containerRef.current)
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .atmosphereColor('#1e4a7a')
      .atmosphereAltitude(0.22)
      .showGraticules(false)
      // Points
      .pointLat('lat').pointLng('lng')
      .pointColor('color').pointAltitude(0.01)
      .pointRadius('size').pointResolution(10)
      .pointLabel((d: any) => {
        if (d.__type === 'layoff') return layoffTooltip(d);
        if (d.__type === 'hiring') return hiringTooltip(d);
        return tcTooltip(d);
      })
      .onPointClick((d: any) => {
        onSelectCompany(d);
        globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.5 }, 900);
        const ctrl = globe.controls();
        if (ctrl) { ctrl.autoRotate = false; setTimeout(() => { ctrl.autoRotate = true; }, 7000); }
      })
      // Arcs
      .arcStartLat('startLat').arcStartLng('startLng')
      .arcEndLat('endLat').arcEndLng('endLng')
      .arcColor(() => ['rgba(99,102,241,0.05)', 'rgba(139,92,246,0.95)', 'rgba(99,102,241,0.05)'])
      .arcAltitudeAutoScale(0.4)
      .arcStroke(1.2)
      .arcDashLength(0.45)
      .arcDashGap(0.15)
      .arcDashAnimateTime(2000)
      .arcLabel((d: any) => arcTooltip(d));

    globeRef.current = globe;

    // Initial POV + auto-rotate
    setTimeout(() => {
      globe.pointOfView({ lat: 35, lng: -40, altitude: 2.2 }, 1200);
      const ctrl = globe.controls();
      if (ctrl) {
        ctrl.autoRotate = true;
        ctrl.autoRotateSpeed = 0.3;
        ctrl.enableDamping = true;
        ctrl.dampingFactor = 0.07;
      }
    }, 600);

    // Resize handler
    const onResize = () => {
      if (containerRef.current) {
        globe.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      globeRef.current = null;
    };
  }, []); // run once

  // Imperatively update points when layers change
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(pointsData);
  }, [pointsData]);

  // Imperatively update arcs when talent toggle changes
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.arcsData(arcsData);
  }, [arcsData]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#060d1a' }} />;
}
