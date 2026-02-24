'use client';
import { useState } from 'react';

export interface SeqBeforeRow { vlcode: string; village_name: string; source: string; area_ha: string; annual_co2_sequestered_kg: string; }
export interface SeqAfterRow  { vlcode: string; village_name: string; type: string; intervention: string; area_added_ha: string; sequestration_factor: string; annual_co2_sequestration_kg: string; }

const TYPE_COLORS: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  Forestry:     { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '🌲' },
  Agroforestry: { bg: '#fefce8', border: '#fde68a', color: '#92400e', icon: '🌳' },
  'Soil Carbon':{ bg: '#fef3c7', border: '#fcd34d', color: '#78350f', icon: '🌱' },
  'Green Belt': { bg: '#ecfdf5', border: '#6ee7b7', color: '#065f46', icon: '🌿' },
};

export default function SequestrationCard({ before, after }: { before: SeqBeforeRow[] | null | undefined; after: SeqAfterRow[] | null | undefined }) {
  const [tab, setTab] = useState<'before' | 'after'>('before');
  const afterRows = (after || []).filter(r => r.type);
  const total = afterRows.reduce((s, r) => s + parseFloat(r.annual_co2_sequestration_kg || '0'), 0);

  const noData = <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0' }}><div style={{ fontSize: 28, marginBottom: 6 }}>🌲</div><div style={{ fontSize: 13 }}>No data</div></div>;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Sequestration</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>Carbon sink sources</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f9fafb', borderRadius: 10, padding: 3 }}>
          {(['before', 'after'] as const).map(t => (
            <button key={t} className="tab-pill" onClick={() => setTab(t)}
              style={{ background: tab === t ? (t === 'before' ? '#fef9c3' : '#f0fdf4') : 'transparent',
                color: tab === t ? (t === 'before' ? '#92400e' : '#15803d') : '#9ca3af',
                border: tab === t ? `1px solid ${t === 'before' ? '#fde68a' : '#bbf7d0'}` : '1px solid transparent' }}>
              {t === 'before' ? 'Before' : 'After'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'before' ? (
        !before || before.length === 0 ? noData :
        before.map((r, i) => (
          <div key={i} style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '1px solid #fcd34d' }}>🌲</div>
              <div>
                <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.source}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', fontFamily: 'Outfit, sans-serif', marginTop: 2 }}>{r.area_ha} ha</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{(parseFloat(r.annual_co2_sequestered_kg || '0')/1000).toFixed(1)}t CO₂ absorbed / year</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        afterRows.length === 0 ? noData :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Total Added</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#15803d', fontFamily: 'Outfit, sans-serif' }}>{(total/1000).toFixed(1)}t/yr</span>
          </div>
          {afterRows.map((r, i) => {
            const val = parseFloat(r.annual_co2_sequestration_kg || '0');
            const style = TYPE_COLORS[r.type] || { bg: '#f9fafb', border: '#e5e7eb', color: '#374151', icon: '🌿' };
            return (
              <div key={i} style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{style.icon} {r.intervention}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: style.color, fontFamily: 'DM Mono, monospace' }}>{(val/1000).toFixed(2)}t</span>
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>{r.area_added_ha} ha · {r.sequestration_factor} kg/ha</div>
                <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 99, height: 4 }}>
                  <div style={{ background: style.color, height: 4, borderRadius: 99, width: total > 0 ? `${(val/total)*100}%` : '0%' }} className="bar-fill" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
