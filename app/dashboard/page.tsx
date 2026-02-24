'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import '../dashboard.css';

import VillageHeader, { VillageRow } from '@/components/VillageHeader';
import EmissionsChart, { EmissionRow } from '@/components/EmissionsChart';
import CarbonBudgetCard, { BudgetRow } from '@/components/CarbonBudgetCard';
import ScenarioProjection, { ScenarioRow } from '@/components/ScenarioProjection';
import {
  SequestrationCard,
  SeqBeforeRow,
  SeqAfterRow,
  MonthlyActivity,
  MonthlyRow,
  EmissionFactors,
  FactorRow,
} from '@/components/SequestrationCard';
import InterventionReductions, { ReductionRow } from '@/components/InterventionReductions';

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

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',      label: 'Overview'      },
  { id: 'budget',        label: 'Carbon Budget' },
  { id: 'emissions',     label: 'Emissions'     },
  { id: 'sequestration', label: 'Sequestration' },
  { id: 'scenario',      label: 'Scenarios'     },
  
  { id: 'interventions', label: 'Interventions' },
  { id: 'activity',      label: 'Activity'      },
];

// ──────────────────────────────────────────────────────────────
// Village Dropdown
// ──────────────────────────────────────────────────────────────
function VillageDropdown({
  villages,
  selected,
  onSelect,
  loading,
}: {
  villages: VillageRow[];
  selected: VillageRow | null;
  onSelect: (v: VillageRow) => void;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="village-dropdown">
      <button
        className={`village-dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
      >
        <span className="village-trigger-icon">🌿</span>
        <div className="village-trigger-content">
          {loading ? (
            <span className="village-loading-text">Loading villages…</span>
          ) : selected ? (
            <>
              <div className="village-trigger-title">{selected.village_name}</div>
              <div className="village-trigger-meta">
                {selected.district} · {selected.vlcode}
              </div>
            </>
          ) : (
            <span className="village-loading-text">Select village…</span>
          )}
        </div>
        <span className={`village-trigger-arrow ${open ? 'open' : ''}`}>▼</span>
      </button>

      {open && villages.length > 0 && (
        <div className="village-dropdown-menu">
          {villages.map((v) => (
            <div
              key={v.vlcode}
              className={`village-item ${selected?.vlcode === v.vlcode ? 'selected' : ''}`}
              onClick={() => { onSelect(v); setOpen(false); }}
            >
              <div className="village-icon">🏘️</div>
              <div className="village-item-content">
                <div className={`village-item-title ${selected?.vlcode === v.vlcode ? 'selected' : ''}`}>
                  {v.village_name}
                </div>
                <div className="village-item-meta">
                  {v.district}, {v.state}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// KPI Card – light + glass + premium style
// ──────────────────────────────────────────────────────────────
function KPICard({
  label,
  value,
  sub,
  accent,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  icon: string;
  delay?: number;
}) {
  return (
    <div className="kpi-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon" style={{ color: accent }}>{icon}</div>
      <div className="kpi-content">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value" style={{ color: accent }}>{value}</div>
        <div className="kpi-sub">{sub}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Dashboard Component
// ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [villages, setVillages] = useState<VillageRow[]>([]);
  const [selected, setSelected] = useState<VillageRow | null>(null);
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetch('/api/village')
      .then(r => r.json())
      .then(res => {
        const list = res.data || [];
        setVillages(list);
        if (list.length) setSelected(list[0]);
        setVillagesLoading(false);
      })
      .catch(() => setVillagesLoading(false));
  }, []);

  useEffect(() => {
    if (!selected?.vlcode) return;
    setLoading(true);

    const q = `?vlcode=${selected.vlcode}`;

    Promise.all([
      fetch(`/api/emissions${q}`)     .then(r => r.json()),
      fetch(`/api/carbon-budget${q}`) .then(r => r.json()),
      fetch(`/api/sequestration${q}`) .then(r => r.json()),
      fetch(`/api/reductions${q}`)    .then(r => r.json()),
      fetch(`/api/scenario${q}`)      .then(r => r.json()),
      fetch(`/api/monthly${q}`)       .then(r => r.json()),
      fetch('/api/emission-factors')  .then(r => r.json()),
    ])
      .then(([em, bud, seq, red, scen, mon, fac]) => {
        setDashData({
          emissions:    em.data    || [],
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
      })
      .catch(() => setLoading(false));
  }, [selected?.vlcode]);

  const getVal = (rows: BudgetRow[], key: string) =>
    parseFloat(rows.find(r => r.parameter?.toLowerCase().includes(key.toLowerCase()))?.value || '0');

  const netBefore  = dashData ? getVal(dashData.budgetBefore, 'net emission')       : 0;
  const netAfter   = dashData ? getVal(dashData.budgetAfter,  'new net')           : 0;
  const pctRed     = dashData ? getVal(dashData.budgetAfter,  'percentage')        : 0;
  const totalEm    = dashData ? getVal(dashData.budgetBefore, 'total emission')    : 0;
  const totalSeq   = dashData ? getVal(dashData.budgetBefore, 'total sequestration') : 0;
  const forestSeq  = dashData?.seqBefore?.[0]?.annual_co2_sequestered_kg
    ? parseFloat(dashData.seqBefore[0].annual_co2_sequestered_kg)
    : 0;
  const totalRed   = dashData?.reductions?.reduce((a, b) => a + parseFloat(b.annual_co2_reduction_kg || '0'), 0) ?? 0;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">CW</div>
            <div>
              <h1>CarbonWatch</h1>
              <small>SLCR · Varanasi</small>
            </div>
          </div>

          <div className="sidebar-content">
            <VillageDropdown
              villages={villages}
              selected={selected}
              onSelect={(v) => { setSelected(v); setActiveTab('overview'); }}
              loading={villagesLoading}
            />
          </div>
        </aside>
      )}

      {/* Main */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? '◀' : '▶'}
            </button>

            <div>
              <h2>{selected?.village_name || 'Select Village'}</h2>
              <small>
                {TABS.find(t => t.id === activeTab)?.label}
              </small>
            </div>
          </div>

          <div className="topbar-right">
            <div className="status">
              <span className="pulse" /> Live
            </div>
            <Link href="/" className="home-link">← Home</Link>
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="content-area">

          {loading || villagesLoading ? (
            <div className="loading-screen">
              <div className="spinner" />
              <p>Loading village data…</p>
            </div>
          ) : !selected ? (
            <div className="empty-state">
              <div className="emoji">🏘️</div>
              <h3>Select a village to begin</h3>
              <VillageDropdown
                villages={villages}
                selected={null}
                onSelect={setSelected}
                loading={villagesLoading}
              />
            </div>
          ) : (
            <>
              <VillageHeader v={selected} />

              {activeTab === 'overview' && (
                <div className="overview-grid">
                  <KPICard
                    label="Total Emissions"
                    value={totalEm > 0 ? `${(totalEm/1000).toFixed(1)} t` : '—'}
                    sub="CO₂e / year"
                    accent="#ef4444"
                    icon="💨"
                    delay={100}
                  />
                  <KPICard
                    label="Net After Reduction"
                    value={netAfter > 0 ? `${(netAfter/1000).toFixed(1)} t` : '—'}
                    sub="CO₂e / year"
                    accent="#10b981"
                    icon="🌱"
                    delay={200}
                  />
                  <KPICard
                    label="Reduction Achieved"
                    value={pctRed > 0 ? `${pctRed.toFixed(1)}%` : '—'}
                    sub="via interventions"
                    accent="#3b82f6"
                    icon="📉"
                    delay={300}
                  />
                  {/* <KPICard
                    label="Forest Sequestration"
                    value={forestSeq > 0 ? `${(forestSeq/1000).toFixed(1)} t` : '—'}
                    sub="CO₂e / year"
                    accent="#14b8a6"
                    icon="🌲"
                    delay={400}
                  /> */}
                </div>
              )}

              {activeTab === 'emissions'    && <EmissionsChart    rows={dashData?.emissions}    />}
              {activeTab === 'budget'       && <CarbonBudgetCard before={dashData?.budgetBefore} after={dashData?.budgetAfter} />}
              {activeTab === 'scenario'     && <ScenarioProjection rows={dashData?.scenario}     />}
              {activeTab === 'sequestration'&& <SequestrationCard  before={dashData?.seqBefore}  after={dashData?.seqAfter}  />}
              {activeTab === 'interventions'&& <InterventionReductions rows={dashData?.reductions} />}
              {activeTab === 'activity'     && (
                <div className="activity-grid">
                  <MonthlyActivity rows={dashData?.monthly} />
                  <EmissionFactors rows={dashData?.factors} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

