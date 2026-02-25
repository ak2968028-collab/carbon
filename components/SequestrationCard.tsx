'use client';
import { useState, useEffect } from 'react';

// Sequestration card
export interface SeqBeforeRow { vlcode: string; village_name: string; source: string; area_ha: string; annual_co2_sequestered_kg: string; }
export interface SeqAfterRow  { vlcode: string; village_name: string; type: string; intervention: string; area_added_ha: string; sequestration_factor: string; annual_co2_sequestration_kg: string; }

const TYPE_COLORS: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  Forestry:      { bg: 'rgba(0,230,118,0.06)',  border: 'rgba(0,230,118,0.18)',  color: '#00e676', icon: 'FR' },
  Agroforestry:  { bg: 'rgba(255,184,77,0.06)', border: 'rgba(255,184,77,0.18)', color: '#ffb84d', icon: 'AF' },
  'Soil Carbon': { bg: 'rgba(193,139,74,0.06)', border: 'rgba(193,139,74,0.18)', color: '#d4a04d', icon: 'SC' },
  'Green Belt':  { bg: 'rgba(0,212,255,0.06)',  border: 'rgba(0,212,255,0.18)',  color: '#00d4ff', icon: 'GB' },
};

export function SequestrationCard({ before, after }: { before: SeqBeforeRow[] | null | undefined; after: SeqAfterRow[] | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(id);
  }, []);

  const beforeRows = before || [];
  const afterRows = (after || []).filter((r) => r.type);

  const existingTotalKg = beforeRows.reduce((s, r) => s + (parseFloat(r.annual_co2_sequestered_kg || '0') || 0), 0);
  const addedTotalKg = afterRows.reduce((s, r) => s + (parseFloat(r.annual_co2_sequestration_kg || '0') || 0), 0);
  const addedArea = afterRows.reduce((s, r) => s + (parseFloat(r.area_added_ha || '0') || 0), 0);
  const topAdded = afterRows.reduce((m, r) => Math.max(m, parseFloat(r.annual_co2_sequestration_kg || '0') || 0), 0);

  const noData = (title: string) => (
    <div style={{
      textAlign: 'center',
      color: 'var(--text-muted)',
      padding: '40px 0',
      border: '1px dashed rgba(255,255,255,0.12)',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.01)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14 }}>No data available</div>
    </div>
  );

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Sequestration</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>Existing sink on left, added interventions on right</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        <div style={{
          borderRadius: 16,
          padding: 14,
          border: '1px solid rgba(255,184,77,0.2)',
          background: 'radial-gradient(120% 120% at 10% 10%, rgba(255,184,77,0.12), rgba(255,184,77,0.04) 40%, rgba(255,255,255,0.01) 100%)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#ffb84d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Existing Sequestration</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#ffd089', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
              {(existingTotalKg / 1000).toFixed(1)}t
            </div>
          </div>

          {beforeRows.length === 0 ? noData('Existing') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {beforeRows.map((r, i) => {
                const kg = parseFloat(r.annual_co2_sequestered_kg || '0') || 0;
                const pct = existingTotalKg > 0 ? (kg / existingTotalKg) * 100 : 0;
                const key = `${r.source}-${i}`;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoverKey(key)}
                    onMouseLeave={() => setHoverKey(null)}
                    style={{
                      borderRadius: 12,
                      padding: '12px 12px',
                      border: `1px solid ${hoverKey === key ? 'rgba(255,184,77,0.34)' : 'rgba(255,184,77,0.16)'}`,
                      background: hoverKey === key ? 'rgba(255,184,77,0.1)' : 'rgba(255,184,77,0.06)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700 }}>{r.source || 'Source'}</div>
                      <div style={{ fontSize: 16, color: '#ffd089', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{(kg / 1000).toFixed(2)}t</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>
                      <span>{parseFloat(r.area_ha || '0').toFixed(1)} ha</span>
                      <span>{pct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        width: mounted ? `${Math.max(pct, 2)}%` : '0%',
                        height: '100%',
                        borderRadius: 99,
                        background: 'linear-gradient(90deg, #ffb84d, #ffe0a3)',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{
          borderRadius: 16,
          padding: 14,
          border: '1px solid rgba(0,230,118,0.24)',
          background: 'radial-gradient(130% 130% at 90% 0%, rgba(0,230,118,0.12), rgba(0,230,118,0.05) 42%, rgba(255,255,255,0.01) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -44, right: -30, width: 170, height: 170, borderRadius: '50%', background: 'rgba(0,230,118,0.08)', filter: 'blur(28px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, marginBottom: 12, position: 'relative' }}>
            <div>
              <div style={{ fontSize: 11, color: '#00e676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Added Interventions</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Area added: {addedArea.toFixed(1)} ha</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#00f08a', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{(addedTotalKg / 1000).toFixed(1)}t</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CO2e / year</div>
            </div>
          </div>

          {afterRows.length === 0 ? noData('Added') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, position: 'relative' }}>
              {afterRows.map((r, i) => {
                const val = parseFloat(r.annual_co2_sequestration_kg || '0') || 0;
                const st = TYPE_COLORS[r.type] || { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', color: '#8b9ab0', icon: 'OT' };
                const pct = addedTotalKg > 0 ? (val / addedTotalKg) * 100 : 0;
                const rel = topAdded > 0 ? (val / topAdded) * 100 : 0;
                const key = `${r.intervention}-${i}`;

                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoverKey(key)}
                    onMouseLeave={() => setHoverKey(null)}
                    style={{
                      background: st.bg,
                      border: `1px solid ${hoverKey === key ? st.color + '66' : st.border}`,
                      borderRadius: 12,
                      padding: '12px 12px',
                      transition: 'all 0.2s ease',
                      boxShadow: hoverKey === key ? `0 0 18px ${st.color}26` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          color: st.color,
                          border: `1px solid ${st.color}66`,
                          background: 'rgba(0,0,0,0.15)',
                          flexShrink: 0,
                        }}>{st.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.intervention}</span>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 900, color: st.color, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>{(val / 1000).toFixed(2)}t</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>
                      <span>{parseFloat(r.area_added_ha || '0').toFixed(1)} ha</span>
                      <span>{(parseFloat(r.sequestration_factor || '0') || 0).toFixed(0)} kg/ha/yr</span>
                    </div>

                    <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{
                        width: mounted ? `${Math.max(rel, 3)}%` : '0%',
                        height: '100%',
                        borderRadius: 99,
                        background: `linear-gradient(90deg, ${st.color}aa, ${st.color})`,
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>{pct.toFixed(1)}% of added sequestration</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// â”€â”€ MONTHLY ACTIVITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface MonthlyRow { vlcode: string; village_name: string; activity: string; unit: string; monthly_quantity: string; }

const ACTIVITY_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  'LPG Consumption':         { icon: 'ðŸ”¥', color: '#ff7b4d', bg: 'rgba(255,123,77,0.06)'  },
  'Firewood Consumption':    { icon: 'ðŸªµ', color: '#b89a7a', bg: 'rgba(184,154,122,0.06)' },
  'Electricity Consumption': { icon: 'âš¡', color: '#ffd24d', bg: 'rgba(255,210,77,0.06)'  },
  'Solid Waste':             { icon: 'ðŸ—‘ï¸', color: '#b084ff', bg: 'rgba(176,132,255,0.06)' },
  'Petrol Consumption':      { icon: 'â›½', color: '#ff4d4d', bg: 'rgba(255,77,77,0.06)'   },
  'Vehicles (2-wheelers)':   { icon: 'ðŸ›µ', color: '#4d9fff', bg: 'rgba(77,159,255,0.06)'  },
  'Livestock':               { icon: 'ðŸ„', color: '#00e676', bg: 'rgba(0,230,118,0.05)'   },
};

export function MonthlyActivity({ rows }: { rows: MonthlyRow[] | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 150); }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>ðŸ“…</div>
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
          const st = ACTIVITY_STYLE[item.activity] || { icon: 'â€¢', color: '#8b9ab0', bg: 'rgba(255,255,255,0.03)' };
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

// â”€â”€ EMISSION FACTORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface FactorRow { category: string; emission_factor: string; source: string; }

const ICONS: Record<string, string> = { LPG: 'ðŸ”¥', Firewood: 'ðŸªµ', Electricity: 'âš¡', 'Petrol/Diesel': 'â›½', Waste: 'ðŸ—‘ï¸', Rice: 'ðŸŒ¾', Wheat: 'ðŸŒ¾' };
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
          <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>ðŸ§ª</div>
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
              <span style={{ width: 20, textAlign: 'center', flexShrink: 0, fontSize: 14 }}>{ICONS[r.category] || 'â€¢'}</span>
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
