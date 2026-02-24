'use client';
import { useState, useEffect } from 'react';

// ── SEQUESTRATION CARD ────────────────────────────────────────────────────────
export interface SeqBeforeRow { vlcode: string; village_name: string; source: string; area_ha: string; annual_co2_sequestered_kg: string; }
export interface SeqAfterRow  { vlcode: string; village_name: string; type: string; intervention: string; area_added_ha: string; sequestration_factor: string; annual_co2_sequestration_kg: string; }

const TYPE_COLORS: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  Forestry:      { bg: 'rgba(0,230,118,0.05)',  border: 'rgba(0,230,118,0.15)',  color: '#00e676', icon: '🌲' },
  Agroforestry:  { bg: 'rgba(255,184,77,0.05)', border: 'rgba(255,184,77,0.15)', color: '#ffb84d', icon: '🌳' },
  'Soil Carbon': { bg: 'rgba(255,184,77,0.04)', border: 'rgba(255,184,77,0.1)',  color: '#d4a04d', icon: '🌱' },
  'Green Belt':  { bg: 'rgba(0,212,255,0.04)',  border: 'rgba(0,212,255,0.12)',  color: '#00d4ff', icon: '🌿' },
};

export function SequestrationCard({ before, after }: { before: SeqBeforeRow[] | null | undefined; after: SeqAfterRow[] | null | undefined }) {
  const [tab, setTab] = useState<'before' | 'after'>('before');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);

  const afterRows = (after || []).filter(r => r.type);
  const total = afterRows.reduce((s, r) => s + parseFloat(r.annual_co2_sequestration_kg || '0'), 0);

  const noData = (
    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
      <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>🌲</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No data available</div>
    </div>
  );

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Sequestration</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>Carbon sink sources</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 99, padding: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['before', 'after'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', border: 'none',
              transition: 'all 0.2s',
              background: tab === t ? (t === 'before' ? 'rgba(255,184,77,0.15)' : 'rgba(0,230,118,0.15)') : 'transparent',
              color: tab === t ? (t === 'before' ? '#ffb84d' : '#00e676') : 'var(--text-muted)',
            }}>
              {t === 'before' ? 'Existing' : 'Added'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'before' ? (
        !before || before.length === 0 ? noData :
        before.map((r, i) => (
          <div key={i} style={{
            background: 'rgba(255,184,77,0.05)',
            border: '1px solid rgba(255,184,77,0.15)',
            borderRadius: 16, padding: '20px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,230,118,0.04)', filter: 'blur(30px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌲</div>
              <div>
                <div style={{ fontSize: 10, color: '#ffb84d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{r.source}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>{r.area_ha} ha</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  <span style={{ color: '#00e676', fontWeight: 600 }}>{(parseFloat(r.annual_co2_sequestered_kg || '0') / 1000).toFixed(1)}t</span> CO₂ absorbed / year
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        afterRows.length === 0 ? noData :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#00e676', fontWeight: 600 }}>Total Sequestration Added</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#00e676', fontFamily: 'Syne, sans-serif' }}>{(total / 1000).toFixed(1)}t/yr</span>
          </div>
          {afterRows.map((r, i) => {
            const val = parseFloat(r.annual_co2_sequestration_kg || '0');
            const st = TYPE_COLORS[r.type] || { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', color: '#8b9ab0', icon: '🌿' };
            return (
              <div key={i} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{st.icon} {r.intervention}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: st.color, fontFamily: 'JetBrains Mono, monospace' }}>{(val / 1000).toFixed(2)}t</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 6 }}>{r.area_added_ha} ha · {r.sequestration_factor} kg/ha/yr</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 99, height: 4 }}>
                  <div style={{ background: st.color, height: 4, borderRadius: 99, width: mounted && total > 0 ? `${(val / total) * 100}%` : '0%', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 6px ${st.color}60` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MONTHLY ACTIVITY ──────────────────────────────────────────────────────────
export interface MonthlyRow { vlcode: string; village_name: string; activity: string; unit: string; monthly_quantity: string; }

const ACTIVITY_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  'LPG Consumption':         { icon: '🔥', color: '#ff7b4d', bg: 'rgba(255,123,77,0.06)'  },
  'Firewood Consumption':    { icon: '🪵', color: '#b89a7a', bg: 'rgba(184,154,122,0.06)' },
  'Electricity Consumption': { icon: '⚡', color: '#ffd24d', bg: 'rgba(255,210,77,0.06)'  },
  'Solid Waste':             { icon: '🗑️', color: '#b084ff', bg: 'rgba(176,132,255,0.06)' },
  'Petrol Consumption':      { icon: '⛽', color: '#ff4d4d', bg: 'rgba(255,77,77,0.06)'   },
  'Vehicles (2-wheelers)':   { icon: '🛵', color: '#4d9fff', bg: 'rgba(77,159,255,0.06)'  },
  'Livestock':               { icon: '🐄', color: '#00e676', bg: 'rgba(0,230,118,0.05)'   },
};

export function MonthlyActivity({ rows }: { rows: MonthlyRow[] | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 150); }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>📅</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No monthly data</div>
        </div>
      </div>
    );
  }

  const items = rows.map(r => ({ ...r, val: parseFloat(r.monthly_quantity || '0') }));
  const max = Math.max(...items.map(i => i.val), 1);

  return (
    <div className="card fade-up">
      <div style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Monthly Activity</h3>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>Resource consumption per month</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((item, i) => {
          const st = ACTIVITY_STYLE[item.activity] || { icon: '•', color: '#8b9ab0', bg: 'rgba(255,255,255,0.03)' };
          return (
            <div key={i} style={{ background: st.bg, borderRadius: 12, padding: '11px 14px', border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = st.color + '30'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.04)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{st.icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.activity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.val.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.unit}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 99, height: 4 }}>
                <div style={{
                  background: `linear-gradient(90deg, ${st.color}80, ${st.color})`,
                  height: 4, borderRadius: 99,
                  width: mounted ? `${(item.val / max) * 100}%` : '0%',
                  transition: `width ${0.6 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)`,
                  boxShadow: `0 0 6px ${st.color}40`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EMISSION FACTORS ──────────────────────────────────────────────────────────
export interface FactorRow { category: string; emission_factor: string; source: string; }

const ICONS: Record<string, string> = { LPG: '🔥', Firewood: '🪵', Electricity: '⚡', 'Petrol/Diesel': '⛽', Waste: '🗑️', Rice: '🌾', Wheat: '🌾' };
const SRC: Record<string, { bg: string; color: string }> = {
  'IPCC 2006': { bg: 'rgba(77,159,255,0.1)',  color: '#4d9fff' },
  'CEA India': { bg: 'rgba(255,123,77,0.1)',  color: '#ff7b4d' },
  'CPCB':      { bg: 'rgba(176,132,255,0.1)', color: '#b084ff' },
  'EX-ACT':    { bg: 'rgba(0,230,118,0.1)',   color: '#00e676' },
};

export function EmissionFactors({ rows }: { rows: FactorRow[] | null | undefined }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>🧪</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No emission factors</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-up">
      <div style={{ marginBottom: 22 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Emission Factors</h3>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>Reference values used in calculations</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {rows.map((r, i) => {
          const ss = SRC[r.source] || { bg: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' };
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'; }}
            >
              <span style={{ width: 20, textAlign: 'center', flexShrink: 0, fontSize: 14 }}>{ICONS[r.category] || '•'}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, fontWeight: 500 }}>{r.category}</span>
              <span style={{ fontSize: 11, color: '#00e676', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{r.emission_factor}</span>
              <span style={{ fontSize: 9, padding: '3px 9px', borderRadius: 99, background: ss.bg, color: ss.color, fontWeight: 700, flexShrink: 0, letterSpacing: '0.04em' }}>{r.source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}