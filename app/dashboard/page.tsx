'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import VillageHeader from '@/components/VillageHeader';
import EmissionsChart from '@/components/EmissionsChart';
import CarbonBudgetCard from '@/components/CarbonBudgetCard';
import ScenarioProjection from '@/components/ScenarioProjection';
import SequestrationCard from '@/components/SequestrationCard';
import InterventionReductions from '@/components/InterventionReductions';
import MonthlyActivity from '@/components/MonthlyActivity';
import EmissionFactors from '@/components/EmissionFactors';

const VILLAGES = [
  { name: 'Hasudi Ausanpur', code: 'VL001', dist: 'Siddharth Nagar', active: true },
  { name: 'Rampur Karkhana', code: 'VL002', dist: 'Gorakhpur', active: false },
  { name: 'Bhaironpur', code: 'VL003', dist: 'Varanasi', active: false },
  { name: 'Lakhanpur', code: 'VL004', dist: 'Lucknow', active: false },
  { name: 'Chandpur Neem', code: 'VL005', dist: 'Prayagraj', active: false },
];

export default function Dashboard() {
  const [selectedVillage, setSelectedVillage] = useState(VILLAGES[0]);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastUpdated] = useState(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

  useEffect(() => {
    if (!selectedVillage.active) return;
    setLoading(true);
    const endpoints = ['village', 'emissions', 'carbon-budget', 'sequestration', 'reductions', 'scenario', 'monthly', 'emission-factors'];
    Promise.all(endpoints.map(e => fetch(`/api/${e}`).then(r => r.json())))
      .then(results => {
        const d: Record<string, unknown> = {};
        endpoints.forEach((e, i) => { d[e] = results[i]; });
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedVillage]);

  const villageData = (data.village as { data: unknown[] })?.data?.[0] as Parameters<typeof VillageHeader>[0]['village'];
  const emissionsData = (data.emissions as { data: unknown[] })?.data as Parameters<typeof EmissionsChart>[0]['data'];
  const budgetBefore = (data['carbon-budget'] as { before: unknown[] })?.before as Parameters<typeof CarbonBudgetCard>[0]['before'];
  const budgetAfter = (data['carbon-budget'] as { after: unknown[] })?.after as Parameters<typeof CarbonBudgetCard>[0]['after'];
  const seqBefore = (data.sequestration as { before: unknown[] })?.before as Parameters<typeof SequestrationCard>[0]['before'];
  const seqAfter = (data.sequestration as { after: unknown[] })?.after as Parameters<typeof SequestrationCard>[0]['after'];
  const reductionsData = (data.reductions as { data: unknown[] })?.data as Parameters<typeof InterventionReductions>[0]['data'];
  const scenarioData = (data.scenario as { data: unknown[] })?.data as Parameters<typeof ScenarioProjection>[0]['data'];
  const monthlyData = (data.monthly as { data: unknown[] })?.data as Parameters<typeof MonthlyActivity>[0]['data'];
  const factorsData = (data['emission-factors'] as { data: unknown[] })?.data as Parameters<typeof EmissionFactors>[0]['data'];

  const netBefore = parseFloat((budgetBefore as { Parameter: string; Value: string }[] | undefined)?.find(r => r.Parameter.includes('Net Emission'))?.Value || '0');
  const netAfter = parseFloat((budgetAfter as { Parameter: string; Value: string }[] | undefined)?.find(r => r.Parameter.includes('New Net'))?.Value || '0');
  const pctReduction = parseFloat((budgetAfter as { Parameter: string; Value: string }[] | undefined)?.find(r => r.Parameter.includes('Percentage'))?.Value || '0');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712', color: 'white', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Sora', sans-serif !important; }
        .sidebar { background: #080f1e; border-right: 1px solid rgba(255,255,255,0.06); }
        .village-item { border-radius: 10px; padding: 12px 14px; cursor: pointer; transition: all 0.2s; }
        .village-item:hover { background: rgba(255,255,255,0.05); }
        .village-item.active { background: rgba(234,136,0,0.12); border: 1px solid rgba(234,136,0,0.3); }
        .village-item.disabled { opacity: 0.4; cursor: not-allowed; }
        .topbar { background: rgba(8,15,30,0.95); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); }
        .kpi-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .glow-dot { width:8px; height:8px; background:#22c55e; border-radius:50%; box-shadow:0 0 8px #22c55e; animation: pdot 2s infinite; flex-shrink:0; }
        @keyframes pdot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .orange-text { background:linear-gradient(90deg,#ea8800,#f5a623); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="sidebar" style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(234,136,0,0.12)', border: '1px solid rgba(234,136,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌊</div>
              <div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>CarbonWatch</div>
                <div style={{ fontSize: 9, color: '#ea8800', letterSpacing: '0.1em' }}>SLCR · VARANASI</div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div style={{ padding: '12px 12px 8px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', color: '#9ca3af', fontSize: 12, transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}>
              ← Back to Home
            </Link>
          </div>

          {/* Village selection */}
          <div style={{ padding: '8px 12px 12px' }}>
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, padding: '0 2px' }}>Villages</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {VILLAGES.map(v => (
                <div key={v.code}
                  className={`village-item${selectedVillage.code === v.code ? ' active' : ''}${!v.active ? ' disabled' : ''}`}
                  onClick={() => v.active && setSelectedVillage(v)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {v.active ? <div className="glow-dot" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#374151', flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selectedVillage.code === v.code ? '#fbbf24' : 'white' }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{v.dist}{!v.active ? ' · Soon' : ''}</div>
                    </div>
                  </div>
                  {!v.active && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4, marginLeft: 16 }}>Survey pending</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, padding: '0 2px' }}>Navigation</div>
            {[
              { icon: '📊', label: 'Emissions', href: '#emissions' },
              { icon: '💰', label: 'Carbon Budget', href: '#budget' },
              { icon: '🔮', label: 'Scenarios', href: '#scenario' },
              { icon: '🌲', label: 'Sequestration', href: '#sequestration' },
              { icon: '⚡', label: 'Interventions', href: '#interventions' },
            ].map(n => (
              <a key={n.label} href={n.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, color: '#9ca3af', fontSize: 12, textDecoration: 'none', marginBottom: 2, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}>
                <span>{n.icon}</span>{n.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div className="topbar" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '6px 10px', cursor: 'pointer', fontSize: 14 }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>
                {selectedVillage.name} <span className="orange-text">Dashboard</span>
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{selectedVillage.dist}, Uttar Pradesh · {selectedVillage.code}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="glow-dot" />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Live</span>
            </div>
            <span style={{ fontSize: 11, color: '#6b7280' }}>{lastUpdated}</span>
            <Link href="/" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, textDecoration: 'none', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>← Home</Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
          {!selectedVillage.active ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏘️</div>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>Data Coming Soon</div>
              <p style={{ color: '#6b7280', maxWidth: 360 }}>Carbon data for <strong style={{ color: '#9ca3af' }}>{selectedVillage.name}</strong> is currently being collected. Please select Hasudi Ausanpur to view available data.</p>
              <button onClick={() => setSelectedVillage(VILLAGES[0])} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#ea8800,#f5a623)', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>
                View Hasudi Ausanpur →
              </button>
            </div>
          ) : loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <div className="spin" style={{ width: 48, height: 48, border: '3px solid #1f2937', borderTop: '3px solid #22c55e', borderRadius: '50%', marginBottom: 16 }} />
              <p style={{ color: '#4ade80', fontWeight: 600 }}>Loading Carbon Data...</p>
            </div>
          ) : (
            <>
              {/* Village Header */}
              {villageData && <VillageHeader village={villageData} />}

              {/* KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Net Emissions (Before)', value: `${(netBefore / 1000).toFixed(1)}t`, unit: 'CO₂e/yr', icon: '💨', border: '#7f1d1d', bg: 'rgba(127,29,29,0.12)', color: '#f87171' },
                  { label: 'Net Emissions (After)', value: `${(netAfter / 1000).toFixed(1)}t`, unit: 'CO₂e/yr', icon: '✅', border: '#14532d', bg: 'rgba(20,83,45,0.12)', color: '#4ade80' },
                  { label: 'Reduction Achieved', value: `${pctReduction.toFixed(1)}%`, unit: 'via interventions', icon: '📉', border: '#1e3a5f', bg: 'rgba(30,58,95,0.12)', color: '#60a5fa' },
                  { label: 'Forest Sequestration', value: '69.3t', unit: 'CO₂e/yr', icon: '🌲', border: '#14532d', bg: 'rgba(20,83,45,0.12)', color: '#34d399' },
                ].map(k => (
                  <div key={k.label} style={{ border: `1px solid ${k.border}`, background: k.bg, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{k.icon}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{k.label}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: 'Sora, sans-serif' }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: '#4b5563', marginTop: 3 }}>{k.unit}</div>
                  </div>
                ))}
              </div>

              {/* Charts grid */}
              <div id="emissions" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                {emissionsData && <EmissionsChart data={emissionsData} />}
                {budgetBefore && budgetAfter && <CarbonBudgetCard before={budgetBefore} after={budgetAfter} />}
              </div>
              <div id="scenario" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                {scenarioData && <ScenarioProjection data={scenarioData} />}
                {seqBefore && seqAfter && <div id="sequestration"><SequestrationCard before={seqBefore} after={seqAfter} /></div>}
              </div>
              <div id="interventions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {monthlyData && <MonthlyActivity data={monthlyData} />}
                {reductionsData && <InterventionReductions data={reductionsData} />}
                {factorsData && <EmissionFactors data={factorsData} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
