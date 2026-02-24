'use client';

export interface ReductionRow { vlcode: string; village_name: string; sector: string; intervention: string; activity_reduction: string; emission_factor: string; annual_co2_reduction_kg: string; }

const SECTOR: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  Energy:      { bg: '#fefce8', border: '#fde68a', color: '#92400e', icon: '☀️' },
  Cooking:     { bg: '#fff7ed', border: '#fed7aa', color: '#9a3412', icon: '🍳' },
  Biomass:     { bg: '#f0fdf4', border: '#bbf7d0', color: '#14532d', icon: '🪵' },
  Transport:   { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', icon: '🚗' },
  Agriculture: { bg: '#f0fdf4', border: '#bbf7d0', color: '#14532d', icon: '🌾' },
  Waste:       { bg: '#faf5ff', border: '#e9d5ff', color: '#581c87', icon: '♻️' },
};

export default function InterventionReductions({ rows }: { rows: ReductionRow[] | null | undefined }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}><div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div><div style={{ fontSize: 13 }}>No intervention data available</div></div>
      </div>
    );
  }

  const items = rows
    .filter(r => r.sector)
    .map(r => ({ ...r, val: parseFloat(r.annual_co2_reduction_kg || '0') }))
    .filter(r => r.val > 0)
    .sort((a, b) => b.val - a.val);

  const total = items.reduce((s, r) => s + r.val, 0);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Intervention Reductions</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>CO₂ saved per sector</p>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Saved</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>{(total/1000).toFixed(1)}t</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((r, i) => {
          const pct = total > 0 ? (r.val / total) * 100 : 0;
          const st = SECTOR[r.sector] || { bg: '#f9fafb', border: '#e5e7eb', color: '#374151', icon: '•' };
          return (
            <div key={i} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, color: st.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                    {st.icon} {r.sector}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.intervention}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: st.color, fontFamily: 'DM Mono, monospace' }}>{(r.val/1000).toFixed(1)}t</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>{pct.toFixed(1)}%</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 99, height: 5 }}>
                <div style={{ background: st.color, height: 5, borderRadius: 99, width: `${pct}%` }} className="bar-fill" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
