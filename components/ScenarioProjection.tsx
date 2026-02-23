'use client';
import { useState } from 'react';

interface ScenarioRow {
  Year: string;
  'Business as Usual': string;
  'Line of Sight': string;
  Accelerated: string;
}

const SCENARIOS = [
  { key: 'Business as Usual', color: '#ef4444', label: 'BAU', desc: 'No change', icon: '📈' },
  { key: 'Line of Sight', color: '#f97316', label: 'LoS', desc: 'Moderate action', icon: '📊' },
  { key: 'Accelerated', color: '#22c55e', label: 'ACC', desc: 'Full intervention', icon: '🚀' },
];

export default function ScenarioProjection({ data }: { data: ScenarioRow[] }) {
  const [active, setActive] = useState<string[]>(['Business as Usual', 'Line of Sight', 'Accelerated']);

  const toggle = (key: string) => setActive(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const allValues = data.flatMap(r =>
    SCENARIOS.map(s => parseFloat(r[s.key as keyof ScenarioRow]))
  );
  const minVal = Math.min(...allValues) * 0.95;
  const maxVal = Math.max(...allValues) * 1.02;
  const years = data.map(r => r.Year);

  const W = 400, H = 200, padL = 50, padR = 20, padT = 10, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xPos = (i: number) => padL + (i / (years.length - 1)) * chartW;
  const yPos = (val: number) => padT + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const makePath = (key: string) =>
    data.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yPos(parseFloat(r[key as keyof ScenarioRow]))}`).join(' ');

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
        <span className="text-2xl">🔮</span> Emission Scenario Projections
      </h2>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {SCENARIOS.map(s => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${active.includes(s.key) ? 'border-transparent text-white' : 'border-gray-600 text-gray-500 bg-transparent'}`}
            style={active.includes(s.key) ? { backgroundColor: s.color + '33', borderColor: s.color, color: s.color } : {}}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* SVG Line Chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <g key={t}>
              <line x1={padL} y1={padT + t * chartH} x2={W - padR} y2={padT + t * chartH}
                stroke="#374151" strokeWidth="0.5" strokeDasharray="4,4" />
              <text x={padL - 4} y={padT + t * chartH + 3} textAnchor="end" fill="#6b7280" fontSize="8">
                {((maxVal - t * (maxVal - minVal)) / 1000).toFixed(0)}t
              </text>
            </g>
          ))}

          {/* Year labels */}
          {years.map((y, i) => (
            <text key={y} x={xPos(i)} y={H - 5} textAnchor="middle" fill="#9ca3af" fontSize="9">{y}</text>
          ))}

          {/* Lines */}
          {SCENARIOS.filter(s => active.includes(s.key)).map(s => (
            <g key={s.key}>
              <path d={makePath(s.key)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((r, i) => (
                <circle key={i} cx={xPos(i)} cy={yPos(parseFloat(r[s.key as keyof ScenarioRow]))}
                  r="4" fill={s.color} stroke="#111827" strokeWidth="1.5">
                  <title>{s.key}: {(parseFloat(r[s.key as keyof ScenarioRow]) / 1000).toFixed(1)}t in {r.Year}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* 2035 comparison */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SCENARIOS.map(s => {
          const val2035 = parseFloat(data[data.length - 1]?.[s.key as keyof ScenarioRow] || '0');
          const val2023 = parseFloat(data[0]?.[s.key as keyof ScenarioRow] || '0');
          const delta = ((val2035 - val2023) / val2023 * 100).toFixed(1);
          const positive = val2035 > val2023;
          return (
            <div key={s.key} className="bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{s.icon} {s.label} 2035</div>
              <div className="text-white text-sm font-bold">{(val2035 / 1000).toFixed(0)}t</div>
              <div className={`text-xs mt-1 ${positive ? 'text-red-400' : 'text-green-400'}`}>
                {positive ? '▲' : '▼'} {Math.abs(parseFloat(delta))}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
