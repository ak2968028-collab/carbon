'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export interface ReductionRow {
  vlcode: string;
  village_name: string;
  sector: string;
  intervention: string;
  activity_reduction: string;
  emission_factor: string;
  annual_co2_reduction_kg: string;
}

const SERIES_COLORS = {
  annual: '#4d9fff',
  activity: '#0b758d',
  factor: '#4f1a05',
};
const LABEL_DARK_RED = '#6b0f1a';

function toNum(v: string): number {
  const n = parseFloat(v || '0');
  return Number.isFinite(n) ? n : 0;
}

function labelFor(row: ReductionRow, index: number): string {
  const sector = row.sector?.trim() || 'Sector';
  const intervention = row.intervention?.trim() || `Item ${index + 1}`;
  const short = intervention.length > 22 ? `${intervention.slice(0, 22)}...` : intervention;
  return `${sector} | ${short}`;
}

export default function InterventionReductions({ rows }: { rows: ReductionRow[] | null | undefined }) {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No intervention data available</div>
        </div>
      </div>
    );
  }

  const items = rows.filter((r) => r.sector || r.intervention);
  if (items.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No intervention data available</div>
        </div>
      </div>
    );
  }

  const x = items.map((r, i) => labelFor(r, i));
  const annualTons = items.map((r) => toNum(r.annual_co2_reduction_kg) / 1000);
  const activityReduction = items.map((r) => toNum(r.activity_reduction));
  const emissionFactor = items.map((r) => toNum(r.emission_factor));

  const totalTons = annualTons.reduce((sum, v) => sum + v, 0);

  const data = [
    {
      x,
      y: annualTons,
      type: 'bar',
      name: 'Annual CO2 Reduction (t/yr)',
      marker: {
        color: 'rgba(77,159,255,0.75)',
        line: { color: SERIES_COLORS.annual, width: 1.2 },
      },
      hovertemplate: '%{x}<br>CO2 reduction: %{y:.2f} t/yr<extra></extra>',
      yaxis: 'y',
    },
    {
      x,
      y: activityReduction,
      type: 'bar',
      name: 'Activity Reduction',
      marker: {
        color: 'rgba(11,117,141,0.75)',
        line: { color: SERIES_COLORS.activity, width: 1.1 },
      },
      hovertemplate: '%{x}<br>Activity reduction: %{y:.2f}<extra></extra>',
      yaxis: 'y2',
    },
    {
      x,
      y: emissionFactor,
      type: 'bar',
      name: 'Emission Factor',
      marker: {
        color: 'rgba(79,26,5,0.89)',
        line: { color: SERIES_COLORS.factor, width: 1 },
      },
      hovertemplate: '%{x}<br>Emission factor: %{y:.2f}<extra></extra>',
      yaxis: 'y2',
    },
  ];

  const layout = {
    barmode: 'group',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(255,255,255,0.02)',
    margin: { l: isNarrow ? 48 : 72, r: isNarrow ? 46 : 78, t: 26, b: isNarrow ? 96 : 110 },
    bargap: 0.28,
    bargroupgap: 0.08,
    hovermode: 'x unified',
    legend: {
      orientation: 'h',
      x: 0,
      y: isNarrow ? 1.23 : 1.18,
      font: { color: LABEL_DARK_RED, size: isNarrow ? 10 : 12 },
    },
    xaxis: {
      title: { text: 'Intervention', font: { color: LABEL_DARK_RED, size: isNarrow ? 11 : 13 } },
      tickangle: -22,
      automargin: true,
      tickfont: { color: LABEL_DARK_RED, size: isNarrow ? 9 : 11 },
      gridcolor: 'rgba(255,255,255,0.04)',
      linecolor: 'rgba(255,255,255,0.2)',
    },
    yaxis: {
      title: { text: 'CO2 Reduction (t/yr)', font: { color: LABEL_DARK_RED, size: isNarrow ? 10 : 12 } },
      tickfont: { color: LABEL_DARK_RED, size: isNarrow ? 9 : 11 },
      gridcolor: 'rgba(255,255,255,0.08)',
      zeroline: false,
      linecolor: 'rgba(255,255,255,0.2)',
    },
    yaxis2: {
      title: { text: 'Activity / Emission Factor', font: { color: LABEL_DARK_RED, size: isNarrow ? 10 : 12 } },
      tickfont: { color: LABEL_DARK_RED, size: isNarrow ? 9 : 11 },
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      zeroline: false,
      linecolor: 'rgba(255,255,255,0.2)',
    },
    font: { color: '#dce6f2', family: 'Space Grotesk, sans-serif' },
    autosize: true,
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
  };

  return (
    <div className="card fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Intervention Reductions Graph
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.03em' }}>
            Full intervention dataset in grouped bar format
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid rgba(0,230,118,0.2)',
            borderRadius: 12,
            padding: '10px 14px',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 10, color: '#00e676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Saved
          </div>
          <div style={{ fontSize: 23, fontWeight: 800, color: '#00e676', fontFamily: 'Syne, sans-serif', lineHeight: 1.05 }}>
            {totalTons.toFixed(1)}t
          </div>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          minHeight: isNarrow ? 340 : 430,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 6,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
        }}
      >
        <Plot
          data={data as never[]}
          layout={layout as never}
          config={config as never}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
}
