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

export default function CarbonBudgetCard({ before, after }: { before: BudgetRow[] | null | undefined; after: BudgetRow[] | null | undefined }) {
  const [view, setView] = useState<'before' | 'after'>('before');

  const noData = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 10, opacity: 0.3, fontWeight: 700 }}>CB</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No data available</div>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            Carbon Budget
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
            Emission & sequestration balance
          </p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 99, padding: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['before', 'after'] as const).map(t => (
            <button key={t} onClick={() => setView(t)} style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', border: 'none',
              transition: 'all 0.2s',
              background: view === t
                ? (t === 'before' ? 'rgba(255,77,77,0.15)' : 'rgba(0,230,118,0.15)')
                : 'transparent',
              color: view === t
                ? (t === 'before' ? '#ff6b6b' : '#00e676')
                : 'var(--text-muted)',
            }}>
              {t === 'before' ? 'Baseline' : 'After Action'}
            </button>
          ))}
        </div>
      </div>

      {view === 'before' ? (
        !before || before.length === 0 ? noData : (() => {
          const totalEm = getVal(before, 'total emission');
          const totalSeq = getVal(before, 'total sequestration');
          const netEm = getVal(before, 'net emission');
          const perCap = getVal(before, 'per capita');
          const monthly = getVal(before, 'monthly');
          const coverage = totalEm > 0 ? (totalSeq / totalEm) * 100 : 0;
          const netVsTotal = totalEm > 0 ? (netEm / totalEm) * 100 : 0;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: '14px 12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.12)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sequestration</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00e676', fontFamily: 'Syne, sans-serif' }}>
                    <AnimNum n={totalSeq / 1000} decimals={1} />t
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>CO2e per year</div>
                </div>
                <div style={{ background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.12)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Coverage</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: coverage < 10 ? '#ff4d4d' : coverage < 30 ? '#ffb84d' : '#00e676', fontFamily: 'Syne, sans-serif' }}>
                    <AnimNum n={coverage} decimals={1} />%
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>sequestration / emissions</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Sequestration coverage</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: coverage < 10 ? '#ff4d4d' : coverage < 30 ? '#ffb84d' : '#00e676', fontFamily: 'JetBrains Mono, monospace' }}>
                    {coverage.toFixed(1)}%
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #00b85a, #00e676)',
                    height: 8, borderRadius: 99,
                    width: `${Math.min(coverage, 100)}%`,
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: '0 0 10px rgba(0,230,118,0.4)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>0%</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Target: 100%</span>
                </div>
              </div>

              {[
                { label: 'Per Capita', val: `${perCap.toFixed(0)} kg/person`, color: 'var(--text-secondary)' },
                { label: 'Monthly Net', val: `${(monthly / 1000).toFixed(1)}t/mo`, color: 'var(--text-secondary)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.val}</span>
                </div>
              ))}
            </div>
          );
        })()
      ) : (
        !after || after.length === 0 ? noData : (() => {
          const prevNet = getVal(after, 'previous net');
          const newNet = getVal(after, 'new net');
          const pct = getVal(after, 'percentage');
          const emRed = getVal(after, 'emission reduction');
          const seqInc = getVal(after, 'sequestration increase');
          const impact = getVal(after, 'total impact');

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,230,118,0.08), rgba(0,184,90,0.04))',
                border: '1px solid rgba(0,230,118,0.15)',
                borderRadius: 16, padding: '22px 20px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 160, height: 100, borderRadius: '50%', background: 'rgba(0,230,118,0.05)', filter: 'blur(30px)' }} />
                <div style={{ fontSize: 10, color: '#00e676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Reduction Achieved</div>
                <div style={{ fontSize: 52, fontWeight: 800, color: '#00e676', fontFamily: 'Syne, sans-serif', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  <AnimNum n={pct} decimals={1} />%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>via targeted interventions</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.12)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Baseline</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ff6b6b', textDecoration: 'line-through', fontFamily: 'Syne, sans-serif' }}>{(prevNet / 1000).toFixed(1)}t</div>
                </div>
                <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.12)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>After Action</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00e676', fontFamily: 'Syne, sans-serif' }}>{(newNet / 1000).toFixed(1)}t</div>
                </div>
              </div>

              {[
                ['Emissions Reduced', emRed, '#00e676'],
                ['Sequestration Added', seqInc, '#4d9fff'],
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
          );
        })()
      )}
    </div>
  );
}
