'use client';
import { useState, useEffect } from 'react';

export interface BudgetRow { vlcode: string; village_name: string; parameter: string; value: string; unit?: string; }

function getVal(rows: BudgetRow[], param: string): number {
  return parseFloat(rows.find(r => r.parameter?.toLowerCase().includes(param.toLowerCase()))?.value || '0');
}

function AnimNum({ n, decimals = 1 }: { n: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame = 0;
    const frames = 45;
    const step = n / frames;
    const id = setInterval(() => {
      frame++;
      if (frame >= frames) { setVal(n); clearInterval(id); }
      else setVal(prev => Math.min(prev + step, n));
    }, 16);
    return () => clearInterval(id);
  }, [n]);
  return <>{val.toFixed(decimals)}</>;
}

function CircularMetric({
  label,
  value,
  unit,
  percent,
  color,
  track = 'rgba(255,255,255,0.08)',
}: {
  label: string;
  value: number;
  unit: string;
  percent: number;
  color: string;
  track?: string;
}) {
  const size = 150;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(percent, 100));
  const dashoffset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: 1.1,
        }}>
          <div style={{ fontSize: 23, fontWeight: 800, color, fontFamily: 'Syne, sans-serif' }}>
            <AnimNum n={value} decimals={1} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{unit}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

function GraphBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = max > 0 ? Math.max(4, (value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
          {value.toFixed(1)}t
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

export default function CarbonBudgetCard({ before, after }: { before: BudgetRow[] | null | undefined; after: BudgetRow[] | null | undefined }) {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const noData = (title: string) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      color: 'var(--text-muted)',
      border: '1px dashed rgba(255,255,255,0.12)',
      borderRadius: 14,
    }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No data available</div>
    </div>
  );

  const totalEm = before?.length ? getVal(before, 'total emission') : 0;
  const totalSeq = before?.length ? getVal(before, 'total sequestration') : 0;
  const netEm = before?.length ? getVal(before, 'net emission') : 0;
  const perCap = before?.length ? getVal(before, 'per capita') : 0;
  const monthly = before?.length ? getVal(before, 'monthly') : 0;
  const coverage = totalEm > 0 ? (totalSeq / totalEm) * 100 : 0;
  const netVsTotal = totalEm > 0 ? (netEm / totalEm) * 100 : 0;

  const prevNet = after?.length ? getVal(after, 'previous net') : netEm;
  const newNet = after?.length ? getVal(after, 'new net') : 0;
  const pct = after?.length ? getVal(after, 'percentage') : 0;
  const emRed = after?.length ? getVal(after, 'emission reduction') : 0;
  const seqInc = after?.length ? getVal(after, 'sequestration increase') : 0;
  const impact = after?.length ? getVal(after, 'total impact') : 0;

  const baselineTon = (before?.length ? netEm : prevNet) / 1000;
  const afterTon = newNet / 1000;
  const graphMax = Math.max(baselineTon, afterTon, 1);
  const impactTotal = emRed + seqInc;
  const emShare = impactTotal > 0 ? (emRed / impactTotal) * 100 : 0;
  const seqShare = impactTotal > 0 ? (seqInc / impactTotal) * 100 : 0;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
          Carbon Budget
        </h3>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
          Baseline and after-action view together
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${isNarrow ? 240 : 280}px, 1fr))`, gap: 14 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff6b6b', marginBottom: 10 }}>
            Baseline Carbon Budget
          </div>

          {!before || before.length === 0 ? noData('Baseline') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: '14px 12px',
                display: 'grid',
                gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
                gap: 10,
                alignItems: 'center',
              }}>
                <CircularMetric
                  label="Total Emissions"
                  value={totalEm / 1000}
                  unit="t CO2e/yr"
                  percent={100}
                  color="#ff6b6b"
                />
                <CircularMetric
                  label="Net Emission"
                  value={netEm / 1000}
                  unit="t CO2e/yr"
                  percent={netVsTotal}
                  color="#ff8f8f"
                />
              </div>

              {[ 
                { label: 'Sequestration', val: `${(totalSeq / 1000).toFixed(1)}t/yr`, color: '#00e676' },
                { label: 'Coverage', val: `${coverage.toFixed(1)}%`, color: coverage < 10 ? '#ff4d4d' : coverage < 30 ? '#ffb84d' : '#00e676' },
                { label: 'Per Capita', val: `${perCap.toFixed(0)} kg/person`, color: 'var(--text-secondary)' },
                { label: 'Monthly Net', val: `${(monthly / 1000).toFixed(1)}t/mo`, color: 'var(--text-secondary)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00e676', marginBottom: 10 }}>
            After Action
          </div>

          {!after || after.length === 0 ? noData('After Action') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,230,118,0.08), rgba(0,184,90,0.04))',
                border: '1px solid rgba(0,230,118,0.15)',
                borderRadius: 14,
                padding: '16px 14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: '#00e676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Reduction Achieved</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#00e676', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
                  <AnimNum n={pct} decimals={1} />%
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Net Emission Graph
                </div>
                <GraphBar label="Baseline" value={baselineTon} max={graphMax} color="#ff6b6b" />
                <GraphBar label="After Action" value={afterTon} max={graphMax} color="#00e676" />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Intervention Impact Split
                </div>
                <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: `${emShare}%`, background: '#00e676', transition: 'width 0.8s ease' }} />
                  <div style={{ width: `${seqShare}%`, background: '#4d9fff', transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
                  <span style={{ color: '#00e676' }}>Emission reduction {(emRed / 1000).toFixed(1)}t</span>
                  <span style={{ color: '#4d9fff' }}>Sequestration increase {(seqInc / 1000).toFixed(1)}t</span>
                </div>
              </div>

              {[ 
                ['Baseline Net', prevNet, '#ff8f8f'],
                ['New Net', newNet, '#00e676'],
                ['Total Impact', impact, '#b084ff'],
              ].map(([l, v, c]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l as string}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c as string, fontFamily: 'JetBrains Mono, monospace' }}>
                    {((v as number) / 1000).toFixed(1)}t
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
