'use client';
import { useState, useEffect, useRef } from 'react';

export interface ScenarioRow {
  vlcode: string; village_name: string;
  year: string; business_as_usual: string; line_of_sight: string; accelerated: string;
}

const S = [
  { key: 'business_as_usual' as const, label: 'Business as Usual', short: 'BAU', color: '#ff4d4d', dash: '' },
  { key: 'line_of_sight'     as const, label: 'Line of Sight',     short: 'LoS', color: '#ffb84d', dash: '6 3' },
  { key: 'accelerated'       as const, label: 'Accelerated',       short: 'ACC', color: '#00e676', dash: '3 3' },
];

export default function ScenarioProjection({ rows }: { rows: ScenarioRow[] | null | undefined }) {
  const [active, setActive] = useState(['business_as_usual', 'line_of_sight', 'accelerated']);
  const [hoveredPt, setHoveredPt] = useState<{ x: number; y: number; year: string; values: Record<string, number> } | null>(null);
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 150); }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>📈</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No scenario data available</div>
        </div>
      </div>
    );
  }

  const toggle = (k: string) => setActive(p => p.includes(k) ? (p.length > 1 ? p.filter(x => x !== k) : p) : [...p, k]);

  const allVals = rows.flatMap(r => S.map(s => parseFloat(r[s.key] || '0')));
  const minV = Math.min(...allVals) * 0.9;
  const maxV = Math.max(...allVals) * 1.05;
  const W = 520, H = 220, pL = 58, pR = 20, pT = 16, pB = 32;
  const cW = W - pL - pR, cH = H - pT - pB;
  const xP = (i: number) => pL + (i / Math.max(rows.length - 1, 1)) * cW;
  const yP = (v: number) => pT + cH - ((v - minV) / Math.max(maxV - minV, 1)) * cH;

  const gridLines = 5;

  return (
    <div className="card fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Scenario Projections
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
            CO₂e projections under different intervention pathways
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {S.map(s => (
            <button key={s.key} onClick={() => toggle(s.key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
              border: `1px solid ${active.includes(s.key) ? s.color + '60' : 'rgba(255,255,255,0.08)'}`,
              background: active.includes(s.key) ? `${s.color}12` : 'transparent',
              color: active.includes(s.key) ? s.color : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
              <span style={{
                width: 20, height: 2, display: 'inline-block', borderRadius: 1,
                background: active.includes(s.key) ? s.color : 'rgba(255,255,255,0.2)',
                borderTop: s.dash ? `2px dashed ${s.color}` : 'none',
              }} />
              {s.short}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
          <defs>
            {S.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {Array.from({ length: gridLines }).map((_, i) => {
            const t = i / (gridLines - 1);
            const y = pT + t * cH;
            const v = maxV - t * (maxV - minV);
            return (
              <g key={i}>
                <line x1={pL} y1={y} x2={W - pR} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <text x={pL - 8} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="JetBrains Mono">
                  {(v / 1000).toFixed(0)}t
                </text>
              </g>
            );
          })}

          {/* Year labels */}
          {rows.map((r, i) => (
            <text key={r.year} x={xP(i)} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="Space Grotesk">
              {r.year}
            </text>
          ))}

          {/* Area fills + lines */}
          {S.filter(s => active.includes(s.key)).map(s => {
            const pts = rows.map((r, i) => ({ x: xP(i), y: yP(parseFloat(r[s.key] || '0')) }));
            const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
            const areaPath = linePath + ` L${pts[pts.length - 1].x} ${pT + cH} L${pts[0].x} ${pT + cH} Z`;
            return (
              <g key={s.key}>
                <path d={areaPath} fill={`url(#grad-${s.key})`} />
                <path d={linePath} fill="none" stroke={s.color} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={s.dash}
                  style={{ transition: 'opacity 0.2s' }}
                />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={hoveredPt?.year === rows[i].year ? 5 : 3.5}
                    fill={hoveredPt?.year === rows[i].year ? s.color : 'var(--bg-card, #111820)'}
                    stroke={s.color} strokeWidth="2"
                    style={{ transition: 'r 0.1s, fill 0.1s', filter: hoveredPt?.year === rows[i].year ? `drop-shadow(0 0 6px ${s.color})` : 'none' }}
                  />
                ))}
              </g>
            );
          })}

          {/* Hover detector strips */}
          {rows.map((r, i) => (
            <rect key={r.year}
              x={i === 0 ? pL : (xP(i - 1) + xP(i)) / 2}
              y={pT}
              width={i === 0
                ? (xP(0) + xP(1)) / 2 - pL
                : i === rows.length - 1
                  ? W - pR - (xP(i - 1) + xP(i)) / 2
                  : (xP(i) + xP(i + 1)) / 2 - (xP(i - 1) + xP(i)) / 2}
              height={cH}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={(e) => {
                const values: Record<string, number> = {};
                S.forEach(s => { values[s.key] = parseFloat(r[s.key] || '0'); });
                const rect = svgRef.current?.getBoundingClientRect();
                setHoveredPt({ x: xP(i), y: pT, year: r.year, values });
              }}
              onMouseLeave={() => setHoveredPt(null)}
            />
          ))}

          {/* Hover vertical line */}
          {hoveredPt && (
            <line
              x1={hoveredPt.x} y1={pT}
              x2={hoveredPt.x} y2={pT + cH}
              stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 2"
            />
          )}
        </svg>

        {/* Hover tooltip */}
        {hoveredPt && (
          <div style={{
            position: 'absolute',
            left: `calc(${(hoveredPt.x / W) * 100}% + 8px)`,
            top: 0,
            background: 'rgba(13,17,23,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            zIndex: 10,
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            minWidth: 140,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>
              {hoveredPt.year}
            </div>
            {S.filter(s => active.includes(s.key)).map(s => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                <span style={{ color: s.color, fontSize: 10, fontWeight: 600 }}>{s.short}</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                  {(hoveredPt.values[s.key] / 1000).toFixed(1)}t
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {S.map(s => {
          const last  = parseFloat(rows[rows.length - 1]?.[s.key] || '0');
          const first = parseFloat(rows[0]?.[s.key] || '0');
          const delta = first > 0 ? ((last - first) / first * 100) : 0;
          const isActive = active.includes(s.key);
          return (
            <div key={s.key} style={{ textAlign: 'center', opacity: isActive ? 1 : 0.35, transition: 'opacity 0.2s' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                {s.short} · {rows[rows.length - 1]?.year}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                {(last / 1000).toFixed(0)}t
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: delta > 0 ? '#ff4d4d' : '#00e676', marginTop: 3 }}>
                {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}