'use client';

interface ActivityRow {
  Activity: string;
  Unit: string;
  'Monthly Quantity': string;
}

const ACTIVITY_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  'LPG Consumption': { icon: '🔥', color: '#f97316', bg: 'bg-orange-950/40' },
  'Firewood Consumption': { icon: '🪵', color: '#a3a3a3', bg: 'bg-gray-800' },
  'Electricity Consumption': { icon: '⚡', color: '#eab308', bg: 'bg-yellow-950/40' },
  'Solid Waste': { icon: '🗑️', color: '#8b5cf6', bg: 'bg-purple-950/40' },
  'Petrol Consumption': { icon: '⛽', color: '#ef4444', bg: 'bg-red-950/40' },
  'Vehicles (2-wheelers)': { icon: '🛵', color: '#3b82f6', bg: 'bg-blue-950/40' },
  Livestock: { icon: '🐄', color: '#22c55e', bg: 'bg-green-950/40' },
};

export default function MonthlyActivity({ data }: { data: ActivityRow[] }) {
  const filtered = data.filter(r => r.Activity && r['Monthly Quantity']);
  const maxQty = Math.max(...filtered.map(r => parseFloat(r['Monthly Quantity'] || '0')));

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
        <span className="text-2xl">📅</span> Monthly Activity Data
      </h2>
      <div className="space-y-3">
        {filtered.map((r, i) => {
          const qty = parseFloat(r['Monthly Quantity']);
          const pct = (qty / maxQty) * 100;
          const config = ACTIVITY_CONFIG[r.Activity] || { icon: '•', color: '#6b7280', bg: 'bg-gray-800' };
          return (
            <div key={i} className={`${config.bg} rounded-xl p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <span className="text-gray-300 text-sm">{r.Activity}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-sm">{qty.toLocaleString()}</span>
                  <span className="text-gray-500 text-xs ml-1">{r.Unit}</span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: config.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
