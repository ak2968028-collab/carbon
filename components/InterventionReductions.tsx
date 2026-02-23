'use client';

interface ReductionRow {
  Sector: string;
  Intervention: string;
  'Activity Reduction': string;
  'Emission Factor': string;
  'Annual CO2 Reduction (kg)': string;
}

const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  Energy: { bg: 'bg-yellow-950/40', border: 'border-yellow-700', text: 'text-yellow-400', bar: '#eab308' },
  Cooking: { bg: 'bg-orange-950/40', border: 'border-orange-700', text: 'text-orange-400', bar: '#f97316' },
  Biomass: { bg: 'bg-lime-950/40', border: 'border-lime-700', text: 'text-lime-400', bar: '#84cc16' },
  Transport: { bg: 'bg-blue-950/40', border: 'border-blue-700', text: 'text-blue-400', bar: '#3b82f6' },
  Agriculture: { bg: 'bg-green-950/40', border: 'border-green-700', text: 'text-green-400', bar: '#22c55e' },
  Waste: { bg: 'bg-purple-950/40', border: 'border-purple-700', text: 'text-purple-400', bar: '#a855f7' },
};

const SECTOR_ICONS: Record<string, string> = {
  Energy: '☀️', Cooking: '🍳', Biomass: '🪵', Transport: '🚗', Agriculture: '🌾', Waste: '♻️',
};

export default function InterventionReductions({ data }: { data: ReductionRow[] }) {
  const filtered = data.filter(r => r.Sector && r.Sector !== 'Sector' && !r.Sector.includes('Total'));
  const total = filtered.reduce((s, r) => s + parseFloat(r['Annual CO2 Reduction (kg)'] || '0'), 0);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">⚡</span> Intervention Reductions
        </h2>
        <div className="bg-green-900/40 border border-green-700 rounded-xl px-4 py-2 text-center">
          <div className="text-green-300 text-xs">Total Reduction</div>
          <div className="text-green-400 text-xl font-bold">{(total / 1000).toFixed(1)}t</div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => {
          const val = parseFloat(r['Annual CO2 Reduction (kg)'] || '0');
          const pct = (val / total) * 100;
          const style = SECTOR_COLORS[r.Sector] || SECTOR_COLORS.Energy;
          return (
            <div key={i} className={`${style.bg} border ${style.border} rounded-xl p-4 transition-all hover:scale-[1.01]`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{SECTOR_ICONS[r.Sector] || '•'}</span>
                    <span className={`${style.text} text-xs font-bold uppercase tracking-wide`}>{r.Sector}</span>
                  </div>
                  <div className="text-white text-sm font-semibold">{r.Intervention}</div>
                </div>
                <div className="text-right">
                  <div className={`${style.text} text-base font-bold`}>{(val / 1000).toFixed(1)}t</div>
                  <div className="text-gray-500 text-xs">{pct.toFixed(1)}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: style.bar }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
