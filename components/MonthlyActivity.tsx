'use client';

export interface MonthlyRow { vlcode: string; village_name: string; activity: string; unit: string; monthly_quantity: string; }

const A: Record<string, { icon: string; color: string; bg: string }> = {
  'LPG Consumption':         { icon: '🔥', color: '#f97316', bg: '#fff7ed' },
  'Firewood Consumption':    { icon: '🪵', color: '#78716c', bg: '#fafaf9' },
  'Electricity Consumption': { icon: '⚡', color: '#eab308', bg: '#fefce8' },
  'Solid Waste':             { icon: '🗑️', color: '#8b5cf6', bg: '#faf5ff' },
  'Petrol Consumption':      { icon: '⛽', color: '#ef4444', bg: '#fef2f2' },
  'Vehicles (2-wheelers)':   { icon: '🛵', color: '#3b82f6', bg: '#eff6ff' },
  'Livestock':               { icon: '🐄', color: '#22c55e', bg: '#f0fdf4' },
};

export default function MonthlyActivity({ rows }: { rows: MonthlyRow[] | null | undefined }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}><div style={{ fontSize: 28, marginBottom: 8 }}>📅</div><div style={{ fontSize: 13 }}>No monthly data available</div></div>
      </div>
    );
  }

  const items = rows.map(r => ({ ...r, val: parseFloat(r.monthly_quantity || '0') }));
  const max = Math.max(...items.map(i => i.val), 1);

  return (
    <div className="card">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Monthly Activity</h3>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>Resource consumption per month</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => {
          const st = A[item.activity] || { icon: '•', color: '#9ca3af', bg: '#f9fafb' };
          return (
            <div key={i} style={{ background: st.bg, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{st.icon}</span>
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{item.activity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>{item.val.toLocaleString()}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{item.unit}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 99, height: 4 }}>
                <div style={{ background: st.color, height: 4, borderRadius: 99, width: `${(item.val / max) * 100}%` }} className="bar-fill" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
