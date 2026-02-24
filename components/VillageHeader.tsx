'use client';

export interface VillageRow {
  vlcode: string; village_name: string; district: string; state: string;
  total_population: string; total_area_ha: string; builtup_area_ha: string;
  agricultural_area_ha: string; water_bodies_area_ha: string;
  total_households: string; total_livestock: string; total_vehicles: string;
}

export default function VillageHeader({ v }: { v: VillageRow | null | undefined }) {
  if (!v) return null;

  const stats = [
    { label: 'Population',  value: Number(v.total_population || 0).toLocaleString(), icon: '👥', accent: '#3b82f6' },
    { label: 'Total Area',  value: `${v.total_area_ha || '—'} ha`,                   icon: '🗺️',  accent: '#8b5cf6' },
    { label: 'Agri Area',   value: `${v.agricultural_area_ha || '—'} ha`,             icon: '🌾',  accent: '#f59e0b' },
    { label: 'Water Bodies',value: `${v.water_bodies_area_ha || '—'} ha`,             icon: '💧',  accent: '#06b6d4' },
    { label: 'Households',  value: v.total_households || '—',                         icon: '🏠',  accent: '#ec4899' },
    { label: 'Livestock',   value: v.total_livestock || '—',                          icon: '🐄',  accent: '#10b981' },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header banner */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ecfdf5 100%)', border: '1px solid #bbf7d0', borderRadius: 16, padding: '20px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'white', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>🌿</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{v.village_name}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{v.district}, {v.state}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: 'white', border: '1px solid #d1d5db', color: '#374151', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, fontFamily: 'DM Mono, monospace' }}>VL · {v.vlcode}</span>
          <span style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            Active Monitoring
          </span>
        </div>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 12px', textAlign: 'center', transition: 'box-shadow 0.2s' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
