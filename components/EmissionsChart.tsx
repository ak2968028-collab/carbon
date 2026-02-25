'use client';
import { useEffect, useState } from 'react';

export interface EmissionRow {
  vlcode: string;
  village_name: string;
  sector: string;
  activity: string;
  annual_co2_kg: string;
}

const SECTOR_COLORS: Record<string, string> = {
  Residential: '#ff7b4d',
  Energy: '#ffd24d',
  Transport: '#4d9fff',
  Agriculture: '#00e676',
  Waste: '#b084ff',
  Livestock: '#ff6eb4',
};
const LABEL_DARK = '#6b0f1a';

type HoverTip = {
  x: number;
  y: number;
  category: string;
  series: string;
  valueTons: number;
};

export default function EmissionsChart({ rows }: { rows: EmissionRow[] | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<HoverTip | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>No emissions data available</div>
        </div>
      </div>
    );
  }

  const activityTotals = new Map<string, { value: number; sector: string }>();
  const sectorRollup = new Map<string, { sum: number; count: number }>();

  rows.forEach((r) => {
    const v = parseFloat(r.annual_co2_kg || '0') || 0;
    if (v <= 0) return;

    const prevAct = activityTotals.get(r.activity);
    activityTotals.set(r.activity, {
      value: (prevAct?.value || 0) + v,
      sector: r.sector,
    });

    const prevSector = sectorRollup.get(r.sector) || { sum: 0, count: 0 };
    sectorRollup.set(r.sector, { sum: prevSector.sum + v, count: prevSector.count + 1 });
  });

  const activities = Array.from(activityTotals.entries())
    .map(([label, data]) => {
      const sectorStat = sectorRollup.get(data.sector);
      const sectorAvg = sectorStat && sectorStat.count > 0 ? sectorStat.sum / sectorStat.count : 0;
      return {
        key: label,
        label,
        sector: data.sector,
        value: data.value,
        sectorAvg,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const sectorTotals = Array.from(sectorRollup.entries())
    .map(([sector, info]) => ({ sector, value: info.sum }))
    .sort((a, b) => b.value - a.value);

  const total = sectorTotals.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const maxY = Math.max(
    1,
    ...activities.map((a) => a.value),
    ...activities.map((a) => a.sectorAvg),
  );

  const yTicks = [0, 25, 50, 75, 100];
  const shortLabel = (text: string) => (text.length > 9 ? `${text.slice(0, 9)}..` : text);

  const showTooltip = (
    e: React.MouseEvent<HTMLElement>,
    category: string,
    series: string,
    valueTons: number,
  ) => {
    setTooltip({ x: e.clientX, y: e.clientY, category, series, valueTons });
  };

  const moveTooltip = (e: React.MouseEvent<HTMLElement>) => {
    setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  };

  return (
    <div className="card fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Annual Emissions Graph
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0', letterSpacing: '0.03em' }}>
            Grouped bars by activity: emissions vs sector average
          </p>
        </div>
        <div style={{
          background: 'rgba(255,77,77,0.08)',
          border: '1px solid rgba(255,77,77,0.2)',
          borderRadius: 12,
          padding: '10px 14px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: '#ff4d4d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total / year</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ff6b6b', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
            {(total / 1000).toFixed(1)}t
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>CO2e</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#4d9fff', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: LABEL_DARK, fontWeight: 600 }}>Activity Emission</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ff6b6b', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: LABEL_DARK, fontWeight: 600 }}>Sector Average</span>
          </div>
        </div>

        <div style={{ position: 'relative', height: 280, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px 38px 46px' }}>
          {yTicks.map((tick) => {
            const tickValueTons = ((tick / 100) * maxY) / 1000;
            return (
              <div key={tick}>
                <div
                  style={{
                    position: 'absolute',
                    left: 46,
                    right: 12,
                    bottom: `${38 + (tick / 100) * 232}px`,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
                <div
                  onMouseEnter={(e) => showTooltip(e, 'Y Axis', 'Emission Level', tickValueTons)}
                  onMouseMove={moveTooltip}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    position: 'absolute',
                    left: 8,
                    bottom: `${30 + (tick / 100) * 232}px`,
                    fontSize: 11,
                    color: LABEL_DARK,
                    cursor: 'default',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {tickValueTons.toFixed(1)}t
                </div>
              </div>
            );
          })}

          <div style={{ position: 'absolute', left: 46, right: 12, bottom: 38, top: 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8 }}>
            {activities.map((a) => {
              const activityHeight = (a.value / maxY) * 100;
              const avgHeight = (a.sectorAvg / maxY) * 100;
              const sectorColor = SECTOR_COLORS[a.sector] || '#8b9ab0';

              return (
                <div key={a.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: 64 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: '100%', width: '100%', justifyContent: 'center' }}>
                    <div
                      onMouseEnter={(e) => showTooltip(e, a.label, 'Activity Emission', a.value / 1000)}
                      onMouseMove={moveTooltip}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        width: 20,
                        height: mounted ? `${Math.max(activityHeight, 2)}%` : '0%',
                        background: '#4d9fff',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.9s cubic-bezier(0.4,0,0.2,1)',
                        cursor: 'pointer',
                      }}
                    />
                    <div
                      onMouseEnter={(e) => showTooltip(e, a.label, 'Sector Average', a.sectorAvg / 1000)}
                      onMouseMove={moveTooltip}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        width: 20,
                        height: mounted ? `${Math.max(avgHeight, 2)}%` : '0%',
                        background: '#ff6b6b',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.9s cubic-bezier(0.4,0,0.2,1)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                  <div
                    onMouseEnter={(e) => showTooltip(e, shortLabel(a.label), 'X Axis Category', a.value / 1000)}
                    onMouseMove={moveTooltip}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ marginTop: 8, fontSize: 12, color: LABEL_DARK, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, cursor: 'default' }}
                  >
                    {shortLabel(a.label)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 11, color: LABEL_DARK, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Sector Share
        </div>
        <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', background: 'rgba(255,255,255,0.07)' }}>
          {sectorTotals.map((s) => (
            <div
              key={s.sector}
              title={`${s.sector}: ${((s.value / total) * 100).toFixed(1)}%`}
              style={{
                width: `${(s.value / total) * 100}%`,
                background: SECTOR_COLORS[s.sector] || '#8b9ab0',
                transition: 'width 0.8s ease',
              }}
            />
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 42,
            background: 'rgba(13,17,23,0.95)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10,
            padding: '8px 10px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 12, color: '#f0f6ff', fontWeight: 700 }}>{tooltip.category}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{tooltip.series}</div>
          <div style={{ fontSize: 12, color: '#7bd3ff', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
            {tooltip.valueTons.toFixed(2)}t CO2e
          </div>
        </div>
      )}
    </div>
  );
}
