'use client';

interface VillageData {
  'Village Name': string;
  vlcode: string;
  District: string;
  State: string;
  'Total Population(Person)': string;
  'Total Area(Hectares)': string;
  'Built-up Area(Hectares)': string;
  'Agricultural Area(Hectares)': string;
  'Water Bodies Area(Hectares)': string;
  'Total Households(Number)': string;
  'Total Livestock(Number)': string;
  'Total Vehicles(Number)': string;
}

export default function VillageHeader({ village }: { village: VillageData }) {
  const stats = [
    { label: 'Population', value: Number(village['Total Population(Person)']).toLocaleString(), icon: '👥', color: 'from-blue-500 to-blue-700' },
    { label: 'Total Area', value: `${village['Total Area(Hectares)']} ha`, icon: '🗺️', color: 'from-emerald-500 to-emerald-700' },
    { label: 'Agricultural Area', value: `${village['Agricultural Area(Hectares)']} ha`, icon: '🌾', color: 'from-yellow-500 to-yellow-700' },
    { label: 'Households', value: village['Total Households(Number)'], icon: '🏠', color: 'from-purple-500 to-purple-700' },
    { label: 'Livestock', value: village['Total Livestock(Number)'], icon: '🐄', color: 'from-orange-500 to-orange-700' },
    { label: 'Vehicles', value: village['Total Vehicles(Number)'], icon: '🛵', color: 'from-red-500 to-red-700' },
  ];

  return (
    <div className="mb-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 rounded-2xl p-8 mb-6 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🌿</span>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{village['Village Name']}</h1>
                  <p className="text-green-300 text-sm mt-1">{village.District}, {village.State}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="bg-green-700/60 text-green-200 text-xs font-semibold px-3 py-1 rounded-full border border-green-600">
                  VL Code: {village.vlcode || 'VL001'}
                </span>
                <span className="bg-emerald-700/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600">
                  Carbon Monitoring Active
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-300 text-xs uppercase tracking-widest mb-1">Water Bodies</div>
              <div className="text-white text-2xl font-bold">{village['Water Bodies Area(Hectares)']} ha</div>
              <div className="text-green-400 text-xs mt-1">Natural Carbon Sink</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 shadow-lg text-white`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs opacity-80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
