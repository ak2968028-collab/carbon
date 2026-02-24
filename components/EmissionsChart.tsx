'use client';
import { useState, useEffect } from 'react';

export interface EmissionRow {
  vlcode: string; village_name: string;
  sector: string; activity: string; annual_co2_kg: string;
}

const SECTOR_COLORS: Record<string, string> = {
  Residential: '#ff7b4d',
  Energy:      '#ffd24d',
  Transport:   '#4d9fff',
  Agriculture: '#00e676',
  Waste:       '#b084ff',
  Livestock:   '#ff6eb4',
};

const SECTOR_ICONS: Record<string, string> = {
  Residential: '🏠',
  Energy:      '⚡',
  Transport:   '🚗',
  Agriculture: '🌾',
  Waste:       '🗑️',
  Livestock:   '🐄',
};

export default function EmissionsChart({ rows }: { rows: EmissionRow[] | null | undefined }) {
  const [hover, setHover] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; val: number; pct: number } | null>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>📊</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No emissions data available</div>
        </div>
      </div>
    );
  }

  const items = rows
    .map(r => ({
      key: r.activity,
      label: r.activity,
      sector: r.sector,
      val: parseFloat(r.annual_co2_kg || '0'),
      color: SECTOR_COLORS[r.sector] || '#8b9ab0',
      icon: SECTOR_ICONS[r.sector] || '•',
      pct: 0, start: 0,
    }))
    .filter(i => i.val > 0)
    .sort((a, b) => b.val - a.val);

  const total = items.reduce((s, i) => s + i.val, 0);
  if (total === 0) return null;

  const cx = 90, cy = 90, R = 70, IR = 44;
  const toRad = (d: number) => (d - 90) * Math.PI / 180;
  const pt = (a: number, rad: number) => ({ x: cx + rad * Math.cos(toRad(a)), y: cy + rad * Math.sin(toRad(a)) });

  let cum = 0;
  const segs = items.map(s => {
    const pct = s.val / total;
    const start = cum * 360;
    cum += pct;
    return { ...s, pct, start };
  });

  const arc = (seg: typeof segs[0], animated: boolean) => {
    const realEnd = seg.start + seg.pct * 360 - 0.8;
    const end = animated ? realEnd : seg.start;
    const s = pt(seg.start + 0.4, R), e = pt(end, R);
    const si = pt(seg.start + 0.4, IR), ei = pt(end, IR);
    const lg = seg.pct * 360 > 180 ? 1 : 0;
    return `M${s.x} ${s.y} A${R} ${R} 0 ${lg} 1 ${e.x} ${e.y} L${ei.x} ${ei.y} A${IR} ${IR} 0 ${lg} 0 ${si.x} ${si.y}Z`;
  };

  const midAngle = (seg: typeof segs[0]) => seg.start + seg.pct * 180;

  return (
    <div className="card fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Annual Emissions
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
            CO₂ equivalent · by sector & activity
          </p>
        </div>
        <div style={{
          background: 'rgba(255,77,77,0.08)',
          border: '1px solid rgba(255,77,77,0.2)',
          borderRadius: 12,
          padding: '10px 16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: '#ff4d4d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total / year</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#ff6b6b', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
            {(total / 1000).toFixed(1)}t
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>CO₂e</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        {/* Donut chart */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <svg width="180" height="180" style={{ overflow: 'visible' }}>
            {/* Background ring */}
            <circle cx={cx} cy={cy} r={(R + IR) / 2} fill="none"
              stroke="rgba(255,255,255,0.04)" strokeWidth={R - IR} />

            {segs.map(s => (
              <path
                key={s.key}
                d={arc(s, mounted)}
                fill={s.color}
                opacity={hover === null || hover === s.key ? 1 : 0.15}
                onMouseEnter={(e) => {
                  setHover(s.key);
                  setTooltip({ x: e.clientX, y: e.clientY, label: s.label, val: s.val, pct: s.pct * 100 });
                }}
                onMouseMove={(e) => {
                  setTooltip({ x: e.clientX, y: e.clientY, label: s.label, val: s.val, pct: s.pct * 100 });
                }}
                onMouseLeave={() => { setHover(null); setTooltip(null); }}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.25s, filter 0.2s',
                  filter: hover === s.key
                    ? `drop-shadow(0 0 8px ${s.color}80) brightness(1.15)`
                    : 'none',
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: hover === s.key ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            ))}

            {/* Center label */}
            <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.35)"
              fontSize="8" fontWeight="700" letterSpacing="1" fontFamily="JetBrains Mono">TOTAL</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#f0f6ff"
              fontSize="18" fontWeight="800" fontFamily="Syne">{(total / 1000).toFixed(0)}t</text>
            <text x={cx} y={cy + 23} textAnchor="middle" fill="rgba(255,255,255,0.3)"
              fontSize="8" fontFamily="Space Grotesk">CO₂e/yr</text>
          </svg>

          {/* Floating tooltip */}
          {tooltip && (
            <div style={{
              position: 'fixed',
              left: tooltip.x + 12,
              top: tooltip.y - 40,
              background: 'rgba(13,17,23,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 12,
              color: '#f0f6ff',
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{tooltip.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                {(tooltip.val / 1000).toFixed(2)}t · {tooltip.pct.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* Legend + bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(s => (
            <div
              key={s.key}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 10,
                cursor: 'pointer',
                background: hover === s.key ? `${s.color}0d` : 'transparent',
                border: `1px solid ${hover === s.key ? `${s.color}25` : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 13, flexShrink: 0, width: 18, textAlign: 'center' }}>{s.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 90, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, flexShrink: 0 }}>
                <div style={{
                  height: 5, borderRadius: 99,
                  background: `linear-gradient(90deg, ${s.color}cc, ${s.color})`,
                  width: mounted ? `${(s.val / total) * 100}%` : '0%',
                  transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: hover === s.key ? `0 0 8px ${s.color}80` : 'none',
                }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, width: 30, textAlign: 'right', flexShrink: 0 }}>
                {(s.pct * 100).toFixed(0)}%
              </span>
              <span style={{
                fontSize: 10, color: 'var(--text-muted)',
                width: 40, textAlign: 'right', flexShrink: 0,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {(s.val / 1000).toFixed(1)}t
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector summary bar */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Distribution
        </div>
        <div style={{ display: 'flex', borderRadius: 99, overflow: 'hidden', height: 8, gap: '1px' }}>
          {segs.map(s => (
            <div
              key={s.key}
              title={`${s.label}: ${(s.pct * 100).toFixed(1)}%`}
              style={{
                flex: s.pct,
                background: s.color,
                transition: 'filter 0.2s',
                filter: hover === s.key ? 'brightness(1.3)' : 'none',
              }}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}