'use client';
import { useState } from 'react';

interface EmissionRow {
  Sector: string;
  Activity: string;
  'Annual CO2 (kg)': string;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const SECTOR_ICONS: Record<string, string> = {
  Residential: '🏠',
  Energy: '⚡',
  Transport: '🚗',
  Agriculture: '🌾',
  Waste: '🗑️',
  Livestock: '🐄',
  Total: '📊',
};

export default function EmissionsChart({ data }: { data: EmissionRow[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const filtered = data.filter(r => r.Sector !== 'Total' && r.Activity && r['Annual CO2 (kg)']);
  const total = filtered.reduce((s, r) => s + parseFloat(r['Annual CO2 (kg)'] || '0'), 0);

  // Group by sector
  const bySector = filtered.reduce((acc: Record<string, number>, r) => {
    acc[r.Sector] = (acc[r.Sector] || 0) + parseFloat(r['Annual CO2 (kg)']);
    return acc;
  }, {});

  const sectors = Object.entries(bySector).sort(([, a], [, b]) => b - a);

  let cumulative = 0;
  const segments = sectors.map(([sector, val], i) => {
    const pct = (val / total) * 100;
    const startAngle = (cumulative / total) * 360;
    cumulative += val;
    return { sector, val, pct, startAngle, color: COLORS[i % COLORS.length] };
  });

  // SVG donut chart
  const cx = 90, cy = 90, r = 70, innerR = 45;
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const polarToXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle)),
  });

  const makeArc = (seg: typeof segments[0]) => {
    const start = polarToXY(seg.startAngle, r);
    const end = polarToXY(seg.startAngle + (seg.pct / 100) * 360, r);
    const startIn = polarToXY(seg.startAngle, innerR);
    const endIn = polarToXY(seg.startAngle + (seg.pct / 100) * 360, innerR);
    const large = (seg.pct / 100) * 360 > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} L ${endIn.x} ${endIn.y} A ${innerR} ${innerR} 0 ${large} 0 ${startIn.x} ${startIn.y} Z`;
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
        <span className="text-2xl">📊</span> Annual Emissions Breakdown
      </h2>
      <div className="flex gap-6 items-center">
        {/* Donut */}
        <div className="flex-shrink-0">
          <svg width="180" height="180">
            {segments.map((seg) => (
              <path
                key={seg.sector}
                d={makeArc(seg)}
                fill={seg.color}
                opacity={hover === null || hover === seg.sector ? 1 : 0.3}
                onMouseEnter={() => setHover(seg.sector)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ filter: hover === seg.sector ? 'brightness(1.3)' : 'none' }}
              />
            ))}
            <text x={cx} y={cy - 10} textAnchor="middle" className="fill-white text-xs" fontSize="11" fontWeight="bold">Total</text>
            <text x={cx} y={cy + 8} textAnchor="middle" className="fill-white" fontSize="13" fontWeight="bold">{(total / 1000).toFixed(0)}t</text>
            <text x={cx} y={cy + 22} textAnchor="middle" fill="#9ca3af" fontSize="8">CO₂e/yr</text>
          </svg>
        </div>
        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((seg) => (
            <div
              key={seg.sector}
              onMouseEnter={() => setHover(seg.sector)}
              onMouseLeave={() => setHover(null)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${hover === seg.sector ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-xs text-gray-300">{SECTOR_ICONS[seg.sector] || '•'} {seg.sector}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-white font-semibold">{seg.pct.toFixed(1)}%</span>
                <span className="text-xs text-gray-500 ml-2">{(seg.val / 1000).toFixed(0)}t</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity breakdown */}
      <div className="mt-5 pt-4 border-t border-gray-700">
        <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Activity Detail</h3>
        <div className="space-y-2">
          {filtered.map((r, i) => {
            const val = parseFloat(r['Annual CO2 (kg)']);
            const pct = (val / total) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-32 truncate">{r.Activity}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
                <span className="text-gray-300 text-xs w-16 text-right">{(val / 1000).toFixed(1)}t</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
