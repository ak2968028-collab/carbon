'use client';
import { useEffect, useMemo, useState } from 'react';

export interface MonthlyRow {
  vlcode: string;
  village_name: string;
  activity: string;
  unit: string;
  monthly_quantity: string;
}

const ACTIVITY_COLORS: Record<string, string> = {
  'LPG Consumption': '#f97316',
  'Firewood Consumption': '#78716c',
  'Electricity Consumption': '#eab308',
  'Solid Waste': '#8b5cf6',
  'Petrol Consumption': '#ef4444',
  'Vehicles (2-wheelers)': '#3b82f6',
  Livestock: '#22c55e',
};

type ChartItem = {
  activity: string;
  unit: string;
  val: number;
  color: string;
};

function truncate(text: string, max = 22): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function MonthlyActivity({ rows }: { rows: MonthlyRow[] | null | undefined }) {
  const [isNarrow, setIsNarrow] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const safeRows = rows || [];
  const items = useMemo<ChartItem[]>(() => {
    return safeRows
      .map((r) => ({
        activity: r.activity,
        unit: r.unit,
        val: parseFloat(r.monthly_quantity || '0') || 0,
        color: ACTIVITY_COLORS[r.activity] || '#9ca3af',
      }))
      .filter((i) => i.val > 0)
      .sort((a, b) => b.val - a.val);
  }, [safeRows]);

  if (!rows || rows.length === 0 || items.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 13 }}>No monthly data available</div>
        </div>
      </div>
    );
  }

  const max = Math.max(...items.map((i) => i.val), 1);
  const total = items.reduce((sum, i) => sum + i.val, 0);
  const top = items[0];
  const avg = total / items.length;

  // Annual projection
  const annualTotal = total * 12;

  // Unit groups
  const unitGroups: Record<string, { unit: string; total: number; count: number }> = {};
  items.forEach((item) => {
    if (!unitGroups[item.unit]) unitGroups[item.unit] = { unit: item.unit, total: 0, count: 0 };
    unitGroups[item.unit].total += item.val;
    unitGroups[item.unit].count += 1;
  });

  const W = isNarrow ? 600 : 820;
  const leftPad = isNarrow ? 120 : 162;
  const rightPad = 28;
  const topPad = 14;
  const bottomPad = 36;
  const rowH = isNarrow ? 36 : 40;
  const plotW = W - leftPad - rightPad;
  const chartH = topPad + bottomPad + rowH * items.length;
  const xTicks = 5;

  const LABEL = '#334155';

  return (
    <div className="card">
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Monthly Activity
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Consumption ranked by monthly quantity
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Total / Month', value: total.toLocaleString(), sub: 'all units' },
            { label: 'Annual Est.', value: annualTotal.toLocaleString(), sub: 'projected' },
            { label: 'Avg / Activity', value: avg.toFixed(1), sub: 'monthly' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: '8px 12px',
              minWidth: 90,
            }}>
              <div style={{ fontSize: 10, color: LABEL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: 10, color: LABEL, marginTop: 1 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.01)', marginBottom: 16 }}>
        <svg
          viewBox={`0 0 ${W} ${chartH}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <rect x={0} y={0} width={W} height={chartH} fill="transparent" />

          {/* Grid */}
          {Array.from({ length: xTicks + 1 }).map((_, i) => {
            const t = i / xTicks;
            const v = t * max;
            const x = leftPad + t * plotW;
            return (
              <g key={`tick-${i}`}>
                <line x1={x} y1={topPad} x2={x} y2={chartH - bottomPad}
                  stroke={i === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}
                  strokeWidth={i === 0 ? 1.5 : 1}
                  strokeDasharray={i === 0 ? '' : '3 3'}
                />
                <text x={x} y={chartH - 12} textAnchor="middle" fontSize="10"
                  fill={LABEL} fontFamily="JetBrains Mono, monospace">
                  {Math.round(v).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {items.map((item, idx) => {
            const y = topPad + idx * rowH;
            const barH = 24;
            const barY = y + (rowH - barH) / 2;
            const barW = Math.max((item.val / max) * plotW, 2);
            const pct = (item.val / total) * 100;
            const isHov = hovered === item.activity;

            return (
              <g
                key={`${item.activity}-${idx}`}
                onMouseEnter={() => setHovered(item.activity)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Row bg on hover */}
                {isHov && (
                  <rect x={0} y={y} width={W} height={rowH} fill="rgba(255,255,255,0.03)" rx={0} />
                )}

                {/* Activity label */}
                <text x={8} y={barY + 16}
                  fontSize={isNarrow ? 10 : 11}
                  fill={isHov ? item.color : LABEL}
                  fontFamily="Syne, sans-serif"
                  fontWeight={isHov ? '700' : '500'}
                >
                  {truncate(item.activity, isNarrow ? 17 : 22)}
                </text>

                {/* Bar track */}
                <rect x={leftPad} y={barY} width={plotW} height={barH} rx={999} fill="rgba(255,255,255,0.04)" />

                {/* Bar fill */}
                <rect x={leftPad} y={barY} width={barW} height={barH} rx={999} fill={`${item.color}${isHov ? 'ff' : 'bb'}`}>
                  <title>{`${item.activity}: ${item.val.toLocaleString()} ${item.unit} (${pct.toFixed(1)}%)`}</title>
                </rect>

                {/* Percent badge inside bar if wide enough */}
                {barW > 44 && (
                  <text x={leftPad + barW - 6} y={barY + 16} textAnchor="end"
                    fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                    {pct.toFixed(0)}%
                  </text>
                )}

                {/* Value + unit label */}
                <text
                  x={Math.min(leftPad + barW + 7, W - rightPad - 2)}
                  y={barY + 16}
                  fontSize={isNarrow ? 9 : 10}
                  fill={isHov ? item.color : LABEL}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isHov ? '700' : '400'}
                >
                  {item.val.toLocaleString()} {item.unit}
                </text>
              </g>
            );
          })}

          {/* X axis baseline */}
          <line x1={leftPad} y1={chartH - bottomPad + 1} x2={W - rightPad} y2={chartH - bottomPad + 1}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.2} />
          <text x={W / 2} y={chartH - 2} textAnchor="middle" fontSize="11"
            fill={LABEL} fontFamily="Syne, sans-serif">
            Monthly Quantity
          </text>
        </svg>
      </div>

      {/* Bottom: Top activity spotlight + unit breakdown side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: 12 }}>

        {/* Top activity spotlight */}
        <div style={{
          padding: '12px 14px',
          borderRadius: 12,
          border: `1px solid ${top.color}33`,
          background: `${top.color}0d`,
        }}>
          <div style={{ fontSize: 10, color: LABEL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Highest Activity
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: top.color, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>
            {top.activity}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: LABEL, marginBottom: 1 }}>Monthly</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: top.color, fontFamily: 'JetBrains Mono, monospace' }}>
                {top.val.toLocaleString()}
                <span style={{ fontSize: 11, marginLeft: 4, fontWeight: 500 }}>{top.unit}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: LABEL, marginBottom: 1 }}>Share</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: top.color, fontFamily: 'JetBrains Mono, monospace' }}>
                {((top.val / total) * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: LABEL, marginBottom: 1 }}>Annual</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: top.color, fontFamily: 'JetBrains Mono, monospace' }}>
                {(top.val * 12).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Unit breakdown */}
        <div style={{
          padding: '12px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ fontSize: 10, color: LABEL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            By Unit Type
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.values(unitGroups).sort((a, b) => b.total - a.total).map(({ unit, total: uTotal, count }) => {
              const pct = (uTotal / total) * 100;
              return (
                <div key={unit}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{unit}</span>
                    <span style={{ fontSize: 11, color: LABEL, fontFamily: 'JetBrains Mono, monospace' }}>
                      {uTotal.toLocaleString()} · {count} {count === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}