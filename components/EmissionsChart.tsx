'use client';
import { useState } from 'react';

export interface EmissionRow {
  vlcode: string; village_name: string;
  sector: string; activity: string; annual_co2_kg: string;
}

const SECTOR_COLORS: Record<string, string> = {
  Residential: '#f97316', Energy: '#eab308', Transport: '#3b82f6',
  Agriculture: '#22c55e', Waste: '#8b5cf6', Livestock: '#ec4899',
};

export default function EmissionsChart({ rows }: { rows: EmissionRow[] | null | undefined }) {
  const [hover, setHover] = useState<string | null>(null);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 13 }}>No emissions data available</div>
        </div>
      </div>
    );
  }

  const items = rows
    .map(r => ({ key: r.activity, label: r.activity, sector: r.sector, val: parseFloat(r.annual_co2_kg || '0'), color: SECTOR_COLORS[r.sector] || '#9ca3af', pct: 0, start: 0 }))
    .filter(i => i.val > 0)
    .sort((a, b) => b.val - a.val);

  const total = items.reduce((s, i) => s + i.val, 0);
  if (total === 0) return null;

  // Donut
  const cx = 80, cy = 80, R = 62, IR = 38;
  const toRad = (d: number) => (d - 90) * Math.PI / 180;
  const pt = (a: number, rad: number) => ({ x: cx + rad * Math.cos(toRad(a)), y: cy + rad * Math.sin(toRad(a)) });
  let cum = 0;
  const segs = items.map(s => {
    const pct = s.val / total;
    const start = cum * 360;
    cum += pct;
    return { ...s, pct, start };
  });
  const arc = (seg: typeof segs[0]) => {
    const end = seg.start + seg.pct * 360 - 0.5;
    const s = pt(seg.start + 0.5, R), e = pt(end, R), si = pt(seg.start + 0.5, IR), ei = pt(end, IR);
    const lg = seg.pct * 360 > 180 ? 1 : 0;
    return `M${s.x} ${s.y} A${R} ${R} 0 ${lg} 1 ${e.x} ${e.y} L${ei.x} ${ei.y} A${IR} ${IR} 0 ${lg} 0 ${si.x} ${si.y}Z`;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Annual Emissions Breakdown</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>By sector and activity · CO₂e per year</p>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', fontFamily: 'Outfit, sans-serif' }}>{(total/1000).toFixed(0)}t</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Donut */}
        <div style={{ flexShrink: 0 }}>
          <svg width="160" height="160">
            {segs.map(s => (
              <path key={s.key} d={arc(s)} fill={s.color}
                opacity={hover === null || hover === s.key ? 1 : 0.2}
                onMouseEnter={() => setHover(s.key)} onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s', filter: hover === s.key ? 'brightness(1.1)' : 'none' }} />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="600">TOTAL</text>
            <text x={cx} y={cx + 10} textAnchor="middle" fill="#111827" fontSize="16" fontWeight="700">{(total/1000).toFixed(0)}t</text>
            <text x={cx} y={cx + 22} textAnchor="middle" fill="#9ca3af" fontSize="8">CO₂e/yr</text>
          </svg>
        </div>

        {/* Legend + bars */}
        <div style={{ flex: 1 }}>
          {items.map(s => (
            <div key={s.key} onMouseEnter={() => setHover(s.key)} onMouseLeave={() => setHover(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 8px', borderRadius: 8, cursor: 'pointer', background: hover === s.key ? '#f9fafb' : 'transparent', marginBottom: 4, transition: 'background 0.15s' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{s.label}</span>
              <div style={{ width: 80, background: '#f3f4f6', borderRadius: 99, height: 5, flexShrink: 0 }}>
                <div style={{ height: 5, borderRadius: 99, background: s.color, width: `${(s.val/total)*100}%` }} className="bar-fill" />
              </div>
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 600, width: 36, textAlign: 'right', flexShrink: 0 }}>{(s.pct*100).toFixed(0)}%</span>
              <span style={{ fontSize: 11, color: '#9ca3af', width: 44, textAlign: 'right', flexShrink: 0, fontFamily: 'DM Mono, monospace' }}>{(s.val/1000).toFixed(1)}t</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
