// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../dashboard.css';
import VillageHeader, { VillageRow } from '@/components/VillageHeader';
import EmissionsChart, { EmissionRow } from '@/components/EmissionsChart';
import CarbonBudgetCard, { BudgetRow } from '@/components/CarbonBudgetCard';
import ScenarioProjection, { ScenarioRow } from '@/components/ScenarioProjection';
import SequestrationCard, { SeqBeforeRow, SeqAfterRow } from '@/components/SequestrationCard';
import InterventionReductions, { ReductionRow } from '@/components/InterventionReductions';
import MonthlyActivity, { MonthlyRow } from '@/components/MonthlyActivity';
import EmissionFactors, { FactorRow } from '@/components/EmissionFactors';

interface DashData {
  emissions:    EmissionRow[];
  budgetBefore: BudgetRow[];
  budgetAfter:  BudgetRow[];
  seqBefore:    SeqBeforeRow[];
  seqAfter:     SeqAfterRow[];
  reductions:   ReductionRow[];
  scenario:     ScenarioRow[];
  monthly:      MonthlyRow[];
  factors:      FactorRow[];
}

type Tab = 'overview' | 'emissions' | 'budget' | 'scenario' | 'sequestration' | 'interventions' | 'activity';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'overview',      label: 'Overview',       icon: '🏠', desc: 'Key metrics & summary' },
  { id: 'emissions',     label: 'Emissions',      icon: '💨', desc: 'Annual CO₂ breakdown' },
  { id: 'budget',        label: 'Carbon Budget',  icon: '⚖️', desc: 'Before & after balance' },
  { id: 'scenario',      label: 'Scenarios',      icon: '📈', desc: 'Projection pathways' },
  { id: 'sequestration', label: 'Sequestration',  icon: '🌲', desc: 'Carbon sinks' },
  { id: 'interventions', label: 'Interventions',  icon: '⚡', desc: 'Reduction actions' },
  { id: 'activity',      label: 'Activity',       icon: '📅', desc: 'Monthly data & factors' },
];

export default function Dashboard() {
  const [villages, setVillages]             = useState<VillageRow[]>([]);
  const [selected, setSelected]             = useState<VillageRow | null>(null);
  const [dashData, setDashData]             = useState<DashData | null>(null);
  const [loading, setLoading]               = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [activeTab, setActiveTab]           = useState<Tab>('overview');
  const [lastUpdated] = useState(() => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

  useEffect(() => {
    fetch('/api/village').then(r => r.json()).then(res => {
      const vList: VillageRow[] = res.data || [];
      setVillages(vList);
      if (vList.length > 0) setSelected(vList[0]);
      setVillagesLoading(false);
    }).catch(() => setVillagesLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setDashData(null);
    const q = `?vlcode=${selected.vlcode}`;
    Promise.all([
      fetch(`/api/emissions${q}`).then(r => r.json()),
      fetch(`/api/carbon-budget${q}`).then(r => r.json()),
      fetch(`/api/sequestration${q}`).then(r => r.json()),
      fetch(`/api/reductions${q}`).then(r => r.json()),
      fetch(`/api/scenario${q}`).then(r => r.json()),
      fetch(`/api/monthly${q}`).then(r => r.json()),
      fetch('/api/emission-factors').then(r => r.json()),
    ]).then(([em, bud, seq, red, scen, mon, fac]) => {
      setDashData({
        emissions:    em.data   || [],
        budgetBefore: bud.before || [],
        budgetAfter:  bud.after  || [],
        seqBefore:    seq.before || [],
        seqAfter:     seq.after  || [],
        reductions:   red.data   || [],
        scenario:     scen.data  || [],
        monthly:      mon.data   || [],
        factors:      fac.data   || [],
      });
      setLoading(false);
    }).catch(() => { setDashData(null); setLoading(false); });
  }, [selected]);

  const getBV = (rows: BudgetRow[], param: string) =>
    parseFloat(rows.find(r => r.parameter?.toLowerCase().includes(param.toLowerCase()))?.value || '0');

  const netBefore    = dashData ? getBV(dashData.budgetBefore, 'net emission') : 0;
  const netAfter     = dashData ? getBV(dashData.budgetAfter, 'new net') : 0;
  const pctRed       = dashData ? getBV(dashData.budgetAfter, 'percentage') : 0;
  const totalEm      = dashData ? getBV(dashData.budgetBefore, 'total emission') : 0;
  const totalSeq     = dashData ? getBV(dashData.budgetBefore, 'total sequestration') : 0;
  const forestSeq    = dashData?.seqBefore?.[0] ? parseFloat(dashData.seqBefore[0].annual_co2_sequestered_kg || '0') : 0;
  const totalRed     = dashData?.reductions?.reduce((s, r) => s + parseFloat(r.annual_co2_reduction_kg || '0'), 0) ?? 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <div className="sidebar-light" style={{ width: 236, flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌊</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', letterSpacing: '-0.01em' }}>CarbonWatch</div>
                <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em' }}>SLCR · VARANASI</div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div style={{ padding: '10px 12px 6px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#6b7280', fontSize: 12, fontWeight: 500 }}>
              ← Back to Home
            </Link>
          </div>

          {/* Village list */}
          <div style={{ padding: '12px 12px 8px' }}>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Villages</div>
            {villagesLoading ? (
              <div style={{ color: '#9ca3af', fontSize: 12, padding: 8 }}>Loading…</div>
            ) : villages.length === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: 12, padding: 8 }}>No villages found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {villages.map(v => (
                  <div key={v.vlcode} className={`village-item-light${selected?.vlcode === v.vlcode ? ' active' : ''}`}
                    onClick={() => { setSelected(v); setActiveTab('overview'); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: selected?.vlcode === v.vlcode ? '#22c55e' : '#d1d5db', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: selected?.vlcode === v.vlcode ? '#15803d' : '#374151' }}>{v.village_name}</div>
                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>{v.district} · {v.vlcode}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav sections */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f3f4f6', marginTop: 8 }}>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Sections</div>
            {TABS.map(t => (
              <button key={t.id} className={`nav-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)} style={{ marginBottom: 2 }}>
                <span className="tab-icon">{t.icon}</span>
                <div>
                  <div style={{ lineHeight: 1.2 }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 400, marginTop: 1 }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Topbar */}
        <div className="topbar-light">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', letterSpacing: '-0.01em' }}>
                {selected?.village_name ?? 'Select a Village'}
                <span style={{ color: '#15803d', marginLeft: 8 }}>· {TABS.find(t => t.id === activeTab)?.label}</span>
              </div>
              {selected && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{selected.district}, {selected.state} · {selected.vlcode}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="dot-green" />
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>Live monitoring</span>
            </div>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>{lastUpdated}</span>
            <Link href="/" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, textDecoration: 'none', color: '#374151', border: '1px solid #e5e7eb', background: 'white', fontWeight: 500 }}>← Home</Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px' }}>
          {loading || villagesLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420 }}>
              <div className="spin" style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTop: '3px solid #22c55e', borderRadius: '50%', marginBottom: 14 }} />
              <p style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>Loading village data…</p>
            </div>
          ) : !selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🏘️</div>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Select a village from the sidebar to get started</p>
            </div>
          ) : (
            <div className="fade-in">
              <VillageHeader v={selected} />

              {/* ── OVERVIEW TAB ── */}
              {activeTab === 'overview' && (
                <div>
                  {/* KPI cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
                    {[
                      { label: 'Total Emissions',     value: totalEm > 0 ? `${(totalEm/1000).toFixed(1)}t` : '—',    sub: 'CO₂e / year',     accent: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '💨' },
                      { label: 'Net After Reduction',  value: netAfter > 0 ? `${(netAfter/1000).toFixed(1)}t` : '—', sub: 'CO₂e / year',     accent: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
                      { label: 'Reduction Achieved',   value: pctRed > 0 ? `${pctRed.toFixed(1)}%` : '—',            sub: 'via interventions', accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: '📉' },
                      { label: 'Forest Sequestration', value: forestSeq > 0 ? `${(forestSeq/1000).toFixed(1)}t` : '—', sub: 'CO₂e / year',   accent: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: '🌲' },
                    ].map(k => (
                      <div key={k.label} className="kpi-light" style={{ borderTop: `3px solid ${k.accent}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</span>
                          <span style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: 8, padding: '4px 8px', fontSize: 16 }}>{k.icon}</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>{k.value}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{k.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quick summary tiles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
                    {[
                      { label: 'Net Emission (Before)', val: netBefore > 0 ? `${(netBefore/1000).toFixed(1)}t` : '—', color: '#dc2626' },
                      { label: 'Sequestration (Existing)', val: totalSeq > 0 ? `${(totalSeq/1000).toFixed(1)}t` : '—', color: '#15803d' },
                      { label: 'Total CO₂ Saved', val: totalRed > 0 ? `${(totalRed/1000).toFixed(1)}t` : '—', color: '#2563eb' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Explore Sections</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {TABS.filter(t => t.id !== 'overview').map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                          style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; (e.currentTarget as HTMLElement).style.borderColor = '#bbf7d0'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── EMISSIONS TAB ── */}
              {activeTab === 'emissions' && (
                <EmissionsChart rows={dashData?.emissions} />
              )}

              {/* ── BUDGET TAB ── */}
              {activeTab === 'budget' && (
                <CarbonBudgetCard before={dashData?.budgetBefore} after={dashData?.budgetAfter} />
              )}

              {/* ── SCENARIO TAB ── */}
              {activeTab === 'scenario' && (
                <ScenarioProjection rows={dashData?.scenario} />
              )}

              {/* ── SEQUESTRATION TAB ── */}
              {activeTab === 'sequestration' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <SequestrationCard before={dashData?.seqBefore} after={dashData?.seqAfter} />
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Outfit, sans-serif' }}>What is Carbon Sequestration?</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: '0 0 14px' }}>
                      Carbon sequestration is the process of capturing and storing atmospheric CO₂. Forests, agroforestry, and soil practices all contribute to sequestration, helping offset the village's emissions.
                    </p>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Current Forest Cover</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
                        {dashData?.seqBefore?.[0]?.area_ha || '—'} ha
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        Absorbing {dashData?.seqBefore?.[0] ? `${(parseFloat(dashData.seqBefore[0].annual_co2_sequestered_kg || '0')/1000).toFixed(1)}t` : '—'} CO₂e per year
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── INTERVENTIONS TAB ── */}
              {activeTab === 'interventions' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                  <InterventionReductions rows={dashData?.reductions} />
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Outfit, sans-serif' }}>Impact Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Total CO₂ Reduced',  val: `${(totalRed/1000).toFixed(1)}t`, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                        { label: 'Before Intervention', val: netBefore > 0 ? `${(netBefore/1000).toFixed(1)}t` : '—', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                        { label: 'After Intervention',  val: netAfter > 0 ? `${(netAfter/1000).toFixed(1)}t` : '—', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
                        { label: 'Net Reduction',       val: pctRed > 0 ? `${pctRed.toFixed(1)}%` : '—', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                      ].map(s => (
                        <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ACTIVITY TAB ── */}
              {activeTab === 'activity' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <MonthlyActivity rows={dashData?.monthly} />
                  <EmissionFactors rows={dashData?.factors} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
