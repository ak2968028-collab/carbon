'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  emissions: EmissionRow[];
  budgetBefore: BudgetRow[];
  budgetAfter: BudgetRow[];
  seqBefore: SeqBeforeRow[];
  seqAfter: SeqAfterRow[];
  reductions: ReductionRow[];
  scenario: ScenarioRow[];
  monthly: MonthlyRow[];
  factors: FactorRow[];
}

type Tab = 'overview' | 'emissions' | 'budget' | 'scenario' | 'sequestration' | 'interventions' | 'activity';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'budget', label: 'Carbon Budget' },
  { id: 'emissions', label: 'Emissions' },
  { id: 'sequestration', label: 'Sequestration' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'scenario', label: 'Scenarios' },
  
  { id: 'activity', label: 'Activity' },
];

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
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const visibleVillages = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return villages;
    return villages.filter((v) => v.village_name.toLowerCase().includes(query));
  }, [q, villages]);

  return (
    <div ref={ref} className="village-dropdown">
      <div className="village-block-label">Village</div>

      <button className={`village-dropdown-trigger ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} disabled={loading}>
        <div className="village-trigger-content">
          <div className="village-trigger-title">
            {loading ? 'Loading villages...' : selected?.village_name || 'Select village'}
          </div>
        </div>
        <span className={`village-trigger-arrow ${open ? 'open' : ''}`}>v</span>
      </button>

      {open && villages.length > 0 && (
        <div className="village-dropdown-menu">
          <div className="village-search-wrap">
            <input
              className="village-search"
              placeholder="Search village..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {visibleVillages.map((v) => (
            <div
              key={v.vlcode}
              className={`village-item ${selected?.vlcode === v.vlcode ? 'selected' : ''}`}
              onClick={() => {
                onSelect(v);
                setOpen(false);
              }}
            >
              <div className="village-item-content">
                <div className={`village-item-title ${selected?.vlcode === v.vlcode ? 'selected' : ''}`}>{v.village_name}</div>
              </div>
            </div>
          ))}
          {visibleVillages.length === 0 && <div className="village-empty">No village found</div>}
        </div>
      )}
    </div>
  );
}

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
      <div className="kpi-icon" style={{ color: accent }}>
        {icon}
      </div>
      <div className="kpi-content">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value" style={{ color: accent }}>
          {value}
        </div>
        <div className="kpi-sub">{sub}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [villages, setVillages] = useState<VillageRow[]>([]);
  const [selected, setSelected] = useState<VillageRow | null>(null);
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    fetch('/api/village')
      .then((r) => r.json())
      .then((res) => {
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
      fetch(`/api/emissions${q}`).then((r) => r.json()),
      fetch(`/api/carbon-budget${q}`).then((r) => r.json()),
      fetch(`/api/sequestration${q}`).then((r) => r.json()),
      fetch(`/api/reductions${q}`).then((r) => r.json()),
      fetch(`/api/scenario${q}`).then((r) => r.json()),
      fetch(`/api/monthly${q}`).then((r) => r.json()),
      fetch('/api/emission-factors').then((r) => r.json()),
    ])
      .then(([em, bud, seq, red, scen, mon, fac]) => {
        setDashData({
          emissions: em.data || [],
          budgetBefore: bud.before || [],
          budgetAfter: bud.after || [],
          seqBefore: seq.before || [],
          seqAfter: seq.after || [],
          reductions: red.data || [],
          scenario: scen.data || [],
          monthly: mon.data || [],
          factors: fac.data || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selected?.vlcode]);

  const getVal = (rows: BudgetRow[], key: string) =>
    parseFloat(rows.find((r) => r.parameter?.toLowerCase().includes(key.toLowerCase()))?.value || '0');

  const netAfter = dashData ? getVal(dashData.budgetAfter, 'new net') : 0;
  const pctRed = dashData ? getVal(dashData.budgetAfter, 'percentage') : 0;
  const totalEm = dashData ? getVal(dashData.budgetBefore, 'total emission') : 0;

  return (
    <div className={`dashboard-container ${isMobile ? 'is-mobile' : ''}`}>
      {isMobile && sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {sidebarOpen && (
        <aside className={`sidebar ${isMobile ? 'mobile open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">CW</div>
            <div>
              <h1>CarbonWatch</h1>
              <small>SLCR - Varanasi</small>
            </div>
          </div>

          <div className="sidebar-content">
            <VillageDropdown
              villages={villages}
              selected={selected}
              onSelect={(v) => {
                setSelected(v);
                setActiveTab('overview');
              }}
              loading={villagesLoading}
            />
          </div>
        </aside>
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
              {sidebarOpen ? '<' : '>'}
            </button>

            <div>
              <h2>{selected?.village_name || 'Select Village'}</h2>
              <small>{TABS.find((t) => t.id === activeTab)?.label}</small>
            </div>
          </div>

          <div className="topbar-right">
            <Link href="/" className="home-link">
              {'<'} Home
            </Link>
          </div>
        </header>

        <nav className="tabs-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="content-area">
          {loading || villagesLoading ? (
            <div className="loading-screen">
              <div className="spinner" />
              <p>Loading village data...</p>
            </div>
          ) : !selected ? (
            <div className="empty-state">
              <h3>Select a village to begin</h3>
              <VillageDropdown villages={villages} selected={null} onSelect={setSelected} loading={villagesLoading} />
            </div>
          ) : (
            <>
              <VillageHeader v={selected} />

              {activeTab === 'overview' && (
                <div className="overview-grid">
                  <KPICard
                    label="Total Emissions"
                    value={totalEm > 0 ? `${(totalEm / 1000).toFixed(1)} t` : '--'}
                    sub="CO2e / year"
                    accent="#ef4444"
                    icon="E"
                    delay={100}
                  />
                  <KPICard
                    label="Net After Reduction"
                    value={netAfter > 0 ? `${(netAfter / 1000).toFixed(1)} t` : '--'}
                    sub="CO2e / year"
                    accent="#10b981"
                    icon="N"
                    delay={200}
                  />
                  <KPICard
                    label="Reduction Achieved"
                    value={pctRed > 0 ? `${pctRed.toFixed(1)}%` : '--'}
                    sub="via interventions"
                    accent="#3b82f6"
                    icon="R"
                    delay={300}
                  />
                </div>
              )}

              {activeTab === 'emissions' && <EmissionsChart rows={dashData?.emissions} />}
              {activeTab === 'budget' && <CarbonBudgetCard before={dashData?.budgetBefore} after={dashData?.budgetAfter} />}
              {activeTab === 'scenario' && <ScenarioProjection rows={dashData?.scenario} />}
              {activeTab === 'sequestration' && <SequestrationCard before={dashData?.seqBefore} after={dashData?.seqAfter} />}
              {activeTab === 'interventions' && <InterventionReductions rows={dashData?.reductions} />}
              {activeTab === 'activity' && (
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
