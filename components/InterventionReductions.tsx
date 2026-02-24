'use client';
import { useState, useEffect } from 'react';

export interface ReductionRow {
  vlcode: string; village_name: string; sector: string; intervention: string;
  activity_reduction: string; emission_factor: string; annual_co2_reduction_kg: string;
}

const SECTOR: Record<string, { bg: string; border: string; color: string; icon: string; glow: string }> = {
  Energy:      { bg: 'rgba(255,184,77,0.06)',  border: 'rgba(255,184,77,0.15)',  color: '#ffb84d', icon: '☀️', glow: 'rgba(255,184,77,0.3)' },
  Cooking:     { bg: 'rgba(255,126,77,0.06)',  border: 'rgba(255,126,77,0.15)',  color: '#ff7e4d', icon: '🍳', glow: 'rgba(255,126,77,0.3)' },
  Biomass:     { bg: 'rgba(0,230,118,0.05)',   border: 'rgba(0,230,118,0.12)',   color: '#00e676', icon: '🪵', glow: 'rgba(0,230,118,0.3)' },
  Transport:   { bg: 'rgba(77,159,255,0.06)',  border: 'rgba(77,159,255,0.12)',  color: '#4d9fff', icon: '🚗', glow: 'rgba(77,159,255,0.3)' },
  Agriculture: { bg: 'rgba(0,230,118,0.05)',   border: 'rgba(0,230,118,0.12)',   color: '#7cfc00', icon: '🌾', glow: 'rgba(124,252,0,0.3)'  },
  Waste:       { bg: 'rgba(176,132,255,0.06)', border: 'rgba(176,132,255,0.12)', color: '#b084ff', icon: '♻️', glow: 'rgba(176,132,255,0.3)' },
};

export default function InterventionReductions({ rows }: { rows: ReductionRow[] | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>⚡</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No intervention data available</div>
        </div>
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
    <div className="card fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Intervention Reductions
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
            CO₂ savings per sector intervention
          </p>
        </div>
        <div style={{
          background: 'rgba(0,230,118,0.07)',
          border: '1px solid rgba(0,230,118,0.18)',
          borderRadius: 12, padding: '10px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: '#00e676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Saved</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00e676', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
            {(total / 1000).toFixed(1)}t
          </div>
        </div>
      </div>

      {/* Summary stacked bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 10, borderRadius: 99, overflow: 'hidden', display: 'flex', gap: 1 }}>
          {items.map((r, i) => {
            const st = SECTOR[r.sector] || { color: '#8b9ab0', glow: 'transparent' };
            const pct = total > 0 ? (r.val / total) * 100 : 0;
            return (
              <div key={i} style={{
                flex: r.val,
                background: st.color,
                filter: hovered === i ? `brightness(1.4) drop-shadow(0 0 6px ${st.glow})` : 'brightness(0.85)',
                transition: 'filter 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              title={`${r.sector}: ${(r.val/1000).toFixed(1)}t`}
              />
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((r, i) => {
          const pct = total > 0 ? (r.val / total) * 100 : 0;
          const st = SECTOR[r.sector] || { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', color: '#8b9ab0', icon: '•', glow: 'transparent' };
          const isHov = hovered === i;

          return (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov ? `rgba(255,255,255,0.03)` : st.bg,
                border: `1px solid ${isHov ? st.color + '40' : st.border}`,
                borderRadius: 14, padding: '13px 16px',
                transition: 'all 0.2s',
                transform: isHov ? 'translateX(3px)' : 'none',
                boxShadow: isHov ? `inset 0 0 0 1px ${st.color}20, 0 4px 16px rgba(0,0,0,0.3)` : 'none',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 9, color: st.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                    {st.icon} {r.sector}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.intervention}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: st.color, fontFamily: 'Syne, sans-serif' }}>{(r.val / 1000).toFixed(1)}t</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{pct.toFixed(1)}% of total</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 99, height: 5 }}>
                <div style={{
                  background: `linear-gradient(90deg, ${st.color}99, ${st.color})`,
                  height: 5, borderRadius: 99,
                  width: mounted ? `${pct}%` : '0%',
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: isHov ? `0 0 8px ${st.color}60` : 'none',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}