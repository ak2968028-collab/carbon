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
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export default function MonthlyActivity({ rows }: { rows: MonthlyRow[] | null | undefined }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
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

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 13 }}>No monthly data available</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 13 }}>Monthly quantities are empty</div>
        </div>
      </div>
    );
  }

  const max = Math.max(...items.map((i) => i.val), 1);
  const total = items.reduce((sum, i) => sum + i.val, 0);
  const top = items[0];

  const W = isNarrow ? 620 : 860;
  const leftPad = isNarrow ? 126 : 170;
  const rightPad = 26;
  const topPad = 16;
  const bottomPad = 40;
  const rowH = isNarrow ? 34 : 38;
  const plotW = W - leftPad - rightPad;
  const chartH = topPad + bottomPad + rowH * items.length;
  const xTicks = 5;

  return (
    <div className="card">
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              fontFamily: 'Outfit, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Monthly Activity Graph
            <span
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#e5e7eb',
                color: '#374151',
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                border: '1px solid #d1d5db',
                userSelect: 'none',
              }}
            >
              i
            </span>
          </h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Ranked by monthly quantity for faster comparison</p>

          {showInfo && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                left: 0,
                zIndex: 20,
                width: isNarrow ? 240 : 290,
                background: 'rgba(17,24,39,0.95)',
                color: '#f3f4f6',
                borderRadius: 10,
                padding: '10px 12px',
                border: '1px solid rgba(255,255,255,0.14)',
                fontSize: 11,
                lineHeight: 1.45,
                boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
              }}
            >
              Y-axis shows activity categories. X-axis shows monthly quantity. Longer bar means higher monthly usage.
              Hover any bar to see exact value and share.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', minWidth: isNarrow ? 110 : 120 }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Total / Month</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', fontFamily: 'DM Mono, monospace' }}>{total.toLocaleString()}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', minWidth: isNarrow ? 140 : 160 }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Highest Activity</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{truncate(top.activity, 20)}</div>
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#ffffff' }}>
        <svg viewBox={`0 0 ${W} ${chartH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <rect x={0} y={0} width={W} height={chartH} fill="#ffffff" />

          {Array.from({ length: xTicks + 1 }).map((_, i) => {
            const t = i / xTicks;
            const v = t * max;
            const x = leftPad + t * plotW;
            return (
              <g key={`tick-${i}`}>
                <line x1={x} y1={topPad} x2={x} y2={chartH - bottomPad} stroke="#f1f5f9" strokeWidth={1} />
                <text x={x} y={chartH - 14} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="DM Mono, monospace">
                  {Math.round(v).toLocaleString()}
                </text>
              </g>
            );
          })}

          {items.map((item, idx) => {
            const y = topPad + idx * rowH;
            const barH = 22;
            const barY = y + (rowH - barH) / 2;
            const barW = (item.val / max) * plotW;
            const pct = (item.val / total) * 100;

            return (
              <g key={`${item.activity}-${idx}`}>
                <text x={8} y={barY + 15} fontSize={isNarrow ? 10 : 11} fill="#374151" fontFamily="Outfit, sans-serif">
                  {truncate(item.activity)}
                </text>

                <rect x={leftPad} y={barY} width={plotW} height={barH} rx={999} fill="#f8fafc" />
                <rect x={leftPad} y={barY} width={barW} height={barH} rx={999} fill={item.color}>
                  <title>{`${item.activity}: ${item.val.toLocaleString()} ${item.unit} (${pct.toFixed(1)}%)`}</title>
                </rect>

                <text x={Math.min(leftPad + barW + 8, W - rightPad - 2)} y={barY + 15} fontSize={isNarrow ? 9 : 10} fill="#111827" fontFamily="DM Mono, monospace">
                  {item.val.toLocaleString()} {item.unit}
                </text>
              </g>
            );
          })}

          <line x1={leftPad} y1={chartH - bottomPad + 1} x2={W - rightPad} y2={chartH - bottomPad + 1} stroke="#e5e7eb" strokeWidth={1.2} />
          <text x={W / 2} y={chartH - 2} textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="Outfit, sans-serif">
            Monthly Quantity
          </text>
        </svg>
      </div>
    </div>
  );
}
