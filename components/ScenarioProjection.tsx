'use client';
import { useState } from 'react';

export interface ScenarioRow {
  vlcode: string; village_name: string;
  year: string; business_as_usual: string; line_of_sight: string; accelerated: string;
}

const S = [
  { key: 'business_as_usual' as const, label: 'Business as Usual', short: 'BAU', color: '#ef4444', dash: '' },
  { key: 'line_of_sight'     as const, label: 'Line of Sight',     short: 'LoS', color: '#f97316', dash: '6,3' },
  { key: 'accelerated'       as const, label: 'Accelerated',       short: 'ACC', color: '#22c55e', dash: '2,2' },
];

export default function ScenarioProjection({ rows }: { rows: ScenarioRow[] | null | undefined }) {
  const [active, setActive] = useState(['business_as_usual', 'line_of_sight', 'accelerated']);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}><div style={{ fontSize: 28, marginBottom: 8 }}>🔮</div><div style={{ fontSize: 13 }}>No scenario data available</div></div>
      </div>
    );
  }

  const toggle = (k: string) => setActive(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  const allVals = rows.flatMap(r => S.map(s => parseFloat(r[s.key] || '0')));
  const minV = Math.min(...allVals) * 0.96, maxV = Math.max(...allVals) * 1.02;
  const W = 440, H = 200, pL = 52, pR = 16, pT = 12, pB = 28;
  const cW = W - pL - pR, cH = H - pT - pB;
  const xP = (i: number) => pL + (i / Math.max(rows.length - 1, 1)) * cW;
  const yP = (v: number) => pT + cH - ((v - minV) / Math.max(maxV - minV, 1)) * cH;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Emission Scenario Projections</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>Projected CO₂e under different intervention pathways</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {S.map(s => (
            <button key={s.key} onClick={() => toggle(s.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                border: `1px solid ${active.includes(s.key) ? s.color : '#e5e7eb'}`,
                background: active.includes(s.key) ? `${s.color}12` : 'white',
                color: active.includes(s.key) ? s.color : '#9ca3af' }}>
              <span style={{ width: 12, height: 2, background: active.includes(s.key) ? s.color : '#d1d5db', display: 'inline-block', borderRadius: 1 }} />
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <g key={t}>
            <line x1={pL} y1={pT + t * cH} x2={W - pR} y2={pT + t * cH} stroke="#f3f4f6" strokeWidth="1.5" />
            <text x={pL - 6} y={pT + t * cH + 3} textAnchor="end" fill="#9ca3af" fontSize="9">{((maxV - t * (maxV - minV)) / 1000).toFixed(0)}t</text>
          </g>
        ))}
        {rows.map((r, i) => (
          <text key={r.year} x={xP(i)} y={H - 4} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="Outfit">{r.year}</text>
        ))}
        {/* Lines */}
        {S.filter(s => active.includes(s.key)).map(s => (
          <g key={s.key}>
            <path d={rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xP(i)} ${yP(parseFloat(r[s.key] || '0'))}`).join(' ')}
              fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dash} />
            {rows.map((r, i) => (
              <g key={i}>
                <circle cx={xP(i)} cy={yP(parseFloat(r[s.key] || '0'))} r="5" fill="white" stroke={s.color} strokeWidth="2" />
                <title>{s.label}: {(parseFloat(r[s.key] || '0') / 1000).toFixed(1)}t ({r.year})</title>
              </g>
            ))}
          </g>
        ))}
      </svg>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
        {S.map(s => {
          const last = parseFloat(rows[rows.length - 1]?.[s.key] || '0');
          const first = parseFloat(rows[0]?.[s.key] || '0');
          const delta = first > 0 ? ((last - first) / first * 100) : 0;
          return (
            <div key={s.key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{s.short} · {rows[rows.length - 1]?.year}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'Outfit, sans-serif' }}>{(last/1000).toFixed(0)}t</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: delta > 0 ? '#ef4444' : '#22c55e', marginTop: 2 }}>{delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
