'use client';
import { useEffect, useState } from 'react';

export interface VillageRow {
  vlcode: string; village_name: string; district: string; state: string;
  total_population: string; total_area_ha: string; builtup_area_ha: string;
  agricultural_area_ha: string; water_bodies_area_ha: string;
  total_households: string; total_livestock: string; total_vehicles: string;
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) return;
    const step = end / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

export default function VillageHeader({ v }: { v: VillageRow | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!v) return null;

  const stats = [
    { label: 'Population',   value: Number(v.total_population || 0),           suffix: '',    icon: '👥', color: '#4d9fff', unit: 'people'  },
    { label: 'Total Area',   value: parseFloat(v.total_area_ha || '0'),         suffix: ' ha', icon: '🗺️',  color: '#b084ff', unit: 'hectares' },
    { label: 'Agri Area',    value: parseFloat(v.agricultural_area_ha || '0'),  suffix: ' ha', icon: '🌾', color: '#ffb84d', unit: 'cultivated' },
    { label: 'Water Bodies', value: parseFloat(v.water_bodies_area_ha || '0'),  suffix: ' ha', icon: '💧', color: '#00d4ff', unit: 'water area' },
    { label: 'Households',   value: Number(v.total_households || 0),            suffix: '',    icon: '🏠', color: '#ff7eb6', unit: 'homes'    },
    { label: 'Livestock',    value: Number(v.total_livestock || 0),             suffix: '',    icon: '🐄', color: '#00e676', unit: 'animals'  },
  ];

  return (
    <div style={{ marginBottom: 28, fontFamily: 'var(--font-body, Space Grotesk, sans-serif)' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1a12 0%, #0a1a1a 50%, #0d1117 100%)',
        border: '1px solid rgba(0,230,118,0.15)',
        borderRadius: 20,
        padding: '22px 28px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: '30%',
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(0,230,118,0.15), rgba(0,230,118,0.05))',
            border: '1px solid rgba(0,230,118,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 0 20px rgba(0,230,118,0.1)',
          }}>🌿</div>
          <div>
            <div style={{
              fontSize: 24, fontWeight: 800,
              fontFamily: 'Syne, var(--font-display, sans-serif)',
              color: '#f0f6ff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>{v.village_name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3, letterSpacing: '0.02em' }}>
              {v.district} District · {v.state}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <span style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10, fontWeight: 600,
            padding: '5px 12px', borderRadius: 99,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em',
          }}>VL · {v.vlcode}</span>
          <span style={{
            background: 'rgba(0,230,118,0.1)',
            border: '1px solid rgba(0,230,118,0.2)',
            color: '#00e676',
            fontSize: 10, fontWeight: 600,
            padding: '5px 14px', borderRadius: 99,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6,
              background: '#00e676',
              borderRadius: '50%',
              display: 'inline-block',
              boxShadow: '0 0 6px #00e676',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            Active Monitoring
          </span>
        </div>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className={`fade-up fade-up-${Math.min(idx+1,4)}`}
            style={{
              background: 'var(--bg-card, #111820)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '16px 12px',
              textAlign: 'center',
              cursor: 'default',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = `${s.color}40`;
              el.style.background = '#161e28';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${s.color}20`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.06)';
              el.style.background = 'var(--bg-card, #111820)';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontSize: 17, fontWeight: 700,
              color: '#f0f6ff',
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {mounted
                ? <><AnimatedNumber target={s.value} />{s.suffix}</>
                : <>{s.value.toLocaleString()}{s.suffix}</>
              }
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 9, color: s.color, marginTop: 2, opacity: 0.7 }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}