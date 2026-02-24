'use client';
import { useState } from 'react';

export interface BudgetRow { vlcode: string; village_name: string; parameter: string; value: string; unit?: string; }

function getVal(rows: BudgetRow[], param: string): number {
  return parseFloat(rows.find(r => r.parameter?.toLowerCase().includes(param.toLowerCase()))?.value || '0');
}

export default function CarbonBudgetCard({ before, after }: { before: BudgetRow[] | null | undefined; after: BudgetRow[] | null | undefined }) {
  const [view, setView] = useState<'before' | 'after'>('before');

  const noData = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, color: '#9ca3af' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>💰</div><div style={{ fontSize: 13 }}>No data available</div></div>
    </div>
  );

  const tabBtn = (t: 'before' | 'after', label: string) => (
    <button className="tab-pill" onClick={() => setView(t)}
      style={{ background: view === t ? (t === 'before' ? '#fef2f2' : '#f0fdf4') : 'transparent',
        color: view === t ? (t === 'before' ? '#dc2626' : '#15803d') : '#9ca3af',
        border: view === t ? `1px solid ${t === 'before' ? '#fecaca' : '#bbf7d0'}` : '1px solid transparent' }}>
      {label}
    </button>
  );

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Carbon Budget</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>Emission & sequestration balance</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f9fafb', borderRadius: 10, padding: 3 }}>
          {tabBtn('before', 'Before')}
          {tabBtn('after', 'After')}
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
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total Emissions</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', fontFamily: 'Outfit, sans-serif' }}>{(totalEm/1000).toFixed(0)}t</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>CO₂e/year</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Sequestration</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>{(totalSeq/1000).toFixed(1)}t</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>CO₂e/year</div>
                </div>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Sequestration coverage</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{coverage.toFixed(1)}%</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 99, height: 8 }}>
                  <div style={{ background: 'linear-gradient(90deg,#22c55e,#4ade80)', height: 8, borderRadius: 99, width: `${Math.min(coverage,100)}%` }} className="bar-fill" />
                </div>
              </div>
              {[
                { label: 'Net Emission', val: `${(netEm/1000).toFixed(1)}t`, color: '#dc2626' },
                { label: 'Per Capita',  val: `${perCap.toFixed(0)} kg`,      color: '#374151' },
                { label: 'Monthly Net', val: `${(monthly/1000).toFixed(1)}t/mo`, color: '#374151' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'DM Mono, monospace' }}>{item.val}</span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reduction Achieved</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#15803d', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{pct.toFixed(1)}%</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>via interventions</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Before</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', textDecoration: 'line-through' }}>{(prevNet/1000).toFixed(1)}t</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>After</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d' }}>{(newNet/1000).toFixed(1)}t</div>
                </div>
              </div>
              {[['Emission Reduced', emRed], ['Sequestration Added', seqInc], ['Total Impact', impact]].map(([l, v]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'DM Mono, monospace' }}>{((v as number)/1000).toFixed(1)}t</span>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
