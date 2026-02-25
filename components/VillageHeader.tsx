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
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (!v) return null;

  const stats = [
    { label: 'Population',   value: Number(v.total_population || 0),           suffix: '',    icon: '👥', color: '#38032a', unit: 'people'  },
    { label: 'Total Area',   value: parseFloat(v.total_area_ha || '0'),         suffix: ' ha', icon: '🗺️',  color: '#38032a', unit: 'hectares' },
    { label: 'Agri Area',    value: parseFloat(v.agricultural_area_ha || '0'),  suffix: ' ha', icon: '🌾', color: '#38032a', unit: 'cultivated' },
    { label: 'Water Bodies', value: parseFloat(v.water_bodies_area_ha || '0'),  suffix: ' ha', icon: '💧', color: '#38032a', unit: 'water area' },
    { label: 'Households',   value: Number(v.total_households || 0),            suffix: '',    icon: '🏠', color: '#38032a', unit: 'homes'    },
    { label: 'Livestock',    value: Number(v.total_livestock || 0),             suffix: '',    icon: '🐄', color: '#38032a', unit: 'animals'  },
  ];

  return (
    <div style={{ marginBottom: 28, fontFamily: 'var(--font-body, Space Grotesk, sans-serif)' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #75a6e7 0%, #7ae1e1 50%, #da7a05 100%)',
        border: '1px solid rgba(0,230,118,0.15)',
        borderRadius: 20,
        padding: isNarrow ? '16px 14px' : '22px 28px',
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
          background: 'radial-gradient(circle, rgba(236, 168, 111, 0.91) 0%, transparent 70%)',
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
              fontSize: isNarrow ? 20 : 24, fontWeight: 800,
              fontFamily: 'Syne, var(--font-display, sans-serif)',
              color: '#a94008',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>{v.village_name}</div>
            <div style={{ fontSize: isNarrow ? 13 : 15, color: 'rgb(0, 0, 0)', marginTop: 3, letterSpacing: '0.02em' }}>
              {v.district} District · {v.state}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <span style={{
            background: 'rgba(238, 238, 238, 0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(147, 12, 12, 0.5)',
            fontSize: 10, fontWeight: 600,
            padding: '5px 12px', borderRadius: 99,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em',
          }}>VL · {v.vlcode}</span>

        </div>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className={`fade-up fade-up-${Math.min(idx+1,4)}`}
            style={{
              background: 'var(--bg-card, #3080dc)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '16px 12px',
              textAlign: 'center',
              cursor: 'default',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            
            
          >
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontSize: 17, fontWeight: 700,
              color: '#000000',
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {mounted
                ? <><AnimatedNumber target={s.value} />{s.suffix}</>
                : <>{s.value.toLocaleString()}{s.suffix}</>
              }
            </div>
            <div style={{ fontSize: 15, color: 'rgba(192, 5, 5, 0.86)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 9, color: s.color, marginTop: 2, opacity: 0.7 }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
