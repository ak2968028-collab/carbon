'use client';

interface FactorRow {
  Category: string;
  'Emission Factor': string;
  Source: string;
}

const CAT_ICONS: Record<string, string> = {
  LPG: '🔥', Firewood: '🪵', Electricity: '⚡', 'Petrol/Diesel': '⛽', Waste: '🗑️', Rice: '🌾', Wheat: '🌾',
};

const SOURCE_COLORS: Record<string, string> = {
  'IPCC 2006': 'bg-blue-900/40 text-blue-300 border-blue-700',
  'CEA India': 'bg-orange-900/40 text-orange-300 border-orange-700',
  'CPCB': 'bg-purple-900/40 text-purple-300 border-purple-700',
  'EX-ACT': 'bg-green-900/40 text-green-300 border-green-700',
};

export default function EmissionFactors({ data }: { data: FactorRow[] }) {
  const filtered = data.filter(r => r.Category);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
        <span className="text-2xl">🧪</span> Emission Factors Reference
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 text-xs uppercase tracking-wide pb-3 pr-4">Category</th>
              <th className="text-left text-gray-400 text-xs uppercase tracking-wide pb-3 pr-4">Factor</th>
              <th className="text-left text-gray-400 text-xs uppercase tracking-wide pb-3">Source</th>
            </tr>
          </thead>
          <tbody className="space-y-1">
            {filtered.map((r, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span>{CAT_ICONS[r.Category] || '•'}</span>
                    <span className="text-white text-sm">{r.Category}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-green-400 text-xs font-mono">{r['Emission Factor']}</span>
                </td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${SOURCE_COLORS[r.Source] || 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                    {r.Source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
