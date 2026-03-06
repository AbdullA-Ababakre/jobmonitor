'use client';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useState } from 'react';

const MapInner = dynamic(() => import('./MapInner'), { ssr: false });

interface Layers { layoffs: boolean; hiring: boolean; topTC: boolean; talent: boolean; }
interface Props { layers: Layers; onSelectCompany: (c: any) => void; liveLayoffs?: any[]; }

export default function MapWrapper({ layers, onSelectCompany, liveLayoffs = [] }: Props) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={() => setReady(true)}
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div style={{ width: '100%', height: '100%', background: '#060d1a', position: 'relative' }}>
        {ready
          ? <MapInner layers={layers} onSelectCompany={onSelectCompany} liveLayoffs={liveLayoffs} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#334155', fontFamily: 'monospace', fontSize: 13 }}>
              Loading map...
            </div>
        }
      </div>
    </>
  );
}
