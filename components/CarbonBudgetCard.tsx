'use client';
import { useState, useEffect } from 'react';

export interface BudgetRow { vlcode: string; village_name: string; parameter: string; value: string; unit?: string; }

const FONT = "'Times New Roman', Times, Georgia, serif";
const MONO = "'JetBrains Mono', 'Courier New', monospace";

function getVal(rows: BudgetRow[], param: string): number {
  return parseFloat(rows.find(r => r.parameter?.toLowerCase().includes(param.toLowerCase()))?.value || '0') || 0;
}

interface Slice { label: string; value: number; color: string; dark: string; }

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutPath(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number) {
  const os = polarXY(cx, cy, outerR, startDeg);
  const oe = polarXY(cx, cy, outerR, endDeg);
  const is_ = polarXY(cx, cy, innerR, endDeg);
  const ie = polarXY(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [`M ${os.x} ${os.y}`, `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
          `L ${is_.x} ${is_.y}`, `A ${innerR} ${innerR} 0 ${large} 0 ${ie.x} ${ie.y}`, 'Z'].join(' ');
}

function DonutChart({ slices, size = 248 }: { slices: Slice[]; size?: number }) {
  const [hov, setHov] = useState<number | null>(null);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      let s: number | null = null;
      const tick = (ts: number) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 1000, 1);
        setAnim(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total <= 0) return null;

  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 12;
  const innerR = outerR - Math.round(outerR * 0.38);
  const GAP = slices.length > 1 ? 2 : 0;

  let angle = 0;
  const built = slices.map((sl, i) => {
    const span = (sl.value / total) * 360 * anim;
    const start = angle + GAP / 2, end = angle + span - GAP / 2;
    angle += span;
    const mid = (start + end) / 2;
    const push = polarXY(cx, cy, hov === i ? 9 : 0, mid);
    return { sl, i, start, end, mid, push };
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
        {slices.map((sl, i) => (
          <radialGradient key={i} id={`g${i}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={sl.color} stopOpacity="0.7" />
            <stop offset="50%"  stopColor={sl.color} stopOpacity="1" />
            <stop offset="100%" stopColor={sl.dark}  stopOpacity="1" />
          </radialGradient>
        ))}
        <radialGradient id="hole" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#9db3dd" />
          <stop offset="100%" stopColor="#bec9e2" />
        </radialGradient>
        <filter id="sf"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.55)" /></filter>
        <filter id="gf" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        </defs>

        {/* Track ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth={outerR - innerR} />

        {/* Slices */}
        {built.map(({ sl, i, start, end, push }) => {
          if (end <= start) return null;
          const isH = hov === i;
          return (
            <g key={i}
              style={{ transform: `translate(${push.x - cx}px,${push.y - cy}px)`, transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              filter="url(#sf)"
            >
              <path
                d={donutPath(cx, cy, outerR, innerR, start, end)}
                fill={`url(#g${i})`}
                opacity={!hov || isH ? 1 : 0.35}
                stroke="rgba(0,0,0,0.3)" strokeWidth="0.7"
                style={{ transition: 'opacity 0.18s' }}
              />
              {isH && (
                <path
                  d={`M ${polarXY(cx,cy,outerR,start+GAP).x} ${polarXY(cx,cy,outerR,start+GAP).y} A ${outerR} ${outerR} 0 ${end-start>180?1:0} 1 ${polarXY(cx,cy,outerR,end-GAP).x} ${polarXY(cx,cy,outerR,end-GAP).y}`}
                  fill="none" stroke={sl.color} strokeWidth="2.5" strokeLinecap="round" opacity="0.75" filter="url(#gf)"
                />
              )}
            </g>
          );
        })}

        {/* Hole */}
        <circle cx={cx} cy={cy} r={innerR} fill="url(#hole)" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Center text - Darker and bolder */}
        {hov !== null && slices[hov] ? (
          <>
            <text x={cx} y={cy - 12} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily={FONT}>{slices[hov].label}</text>
            <text x={cx} y={cy + 9}  textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily={FONT}>{((slices[hov].value / total) * 100).toFixed(1)}%</text>
            <text x={cx} y={cy + 26} textAnchor="middle" fill="#334155" fontSize="12" fontFamily={MONO} fontWeight="700">{(slices[hov].value / 1000).toFixed(2)}t</text>
          </>
        ) : (
          <>
            <text x={cx} y={cy - 5}  textAnchor="middle" fill="#475569" fontSize="11" fontFamily={FONT} fontWeight="600" fontStyle="italic">Total</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#0f172a" fontSize="21" fontWeight="900" fontFamily={FONT} letterSpacing="-0.03em">{(total / 1000).toFixed(1)}t</text>
          </>
        )}
      </svg>
    </div>
  );
}

function CoverageArc({ pct }: { pct: number }) {
  const r = 22, sw = 5, sz = (r + sw) * 2 + 4;
  const circ = 2 * Math.PI * r, dash = (Math.min(pct, 100) / 100) * circ;
  const col = pct < 15 ? '#ff4d4d' : pct < 35 ? '#ffd24d' : '#00c853';
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${sz/2} ${sz/2})`} style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={sz/2} y={sz/2+4} textAnchor="middle" fill={col} fontSize="10" fontWeight="800" fontFamily={MONO}>{pct.toFixed(0)}%</text>
    </svg>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(15,23,42,0.2)' }}>
      <span style={{ fontSize: 13, color: '#334155', fontFamily: FONT, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: color || '#1e293b', fontFamily: MONO }}>{value}</span>
    </div>
  );
}

export default function CarbonBudgetCard({ before, after }: { before: BudgetRow[] | null | undefined; after: BudgetRow[] | null | undefined }) {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => { const fn = () => setIsNarrow(window.innerWidth < 680); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);

  const totalEm  = getVal(before || [], 'total emission');
  const totalSeq = getVal(before || [], 'total sequestration');
  const netEm    = getVal(before || [], 'net emission');
  const perCap   = getVal(before || [], 'per capita');
  const monthly  = getVal(before || [], 'monthly');
  const coverage = totalEm > 0 ? (totalSeq / totalEm) * 100 : 0;
  const prevNet  = getVal(after || [], 'previous net') || netEm;
  const newNet   = getVal(after || [], 'new net');
  const pct      = getVal(after || [], 'percentage');
  const emRed    = getVal(after || [], 'emission reduction');
  const seqInc   = getVal(after || [], 'sequestration increase');
  const impact   = getVal(after || [], 'total impact');
  const hasB = !!(before && before.length > 0);
  const hasA = !!(after  && after.length > 0);

  const slices: Slice[] = [];
  if (hasB && totalEm > 0) {
    const seqP = Math.max(totalSeq, 0), netP = Math.max(netEm, 0), remP = Math.max(totalEm - netP - seqP, 0);
    if (seqP > 0) slices.push({ label: 'Sequestered',    value: seqP, color: '#00c853', dark: '#006e24' });
    if (netP > 0) slices.push({ label: 'Net Emission',   value: netP, color: '#c62828', dark: '#7f0000' });
    if (remP > 0) slices.push({ label: 'Gross Remaining',value: remP, color: '#e65100', dark: '#7f2500' });
  }
  if (hasA) {
    if (emRed  > 0) slices.push({ label: 'Em. Reduced',   value: emRed,  color: '#1565c0', dark: '#082767' });
    if (seqInc > 0) slices.push({ label: 'Seq. Increase', value: seqInc, color: '#00838f', dark: '#00424a' });
    if (newNet > 0) slices.push({ label: 'New Net',        value: newNet, color: '#6a1b9a', dark: '#2e0050' });
  }
  if (slices.length === 0) slices.push({ label: 'No Data', value: 1, color: '#37474f', dark: '#1c2a30' });

  const total = slices.reduce((s, sl) => s + sl.value, 0);

  return (
    <div className="card" style={{ height: '100%', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: FONT, letterSpacing: '-0.01em' }}>Carbon Budget</h3>
        <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0', fontFamily: FONT, fontWeight: 500, fontStyle: 'italic' }}>Baseline & after-action breakdown</p>
      </div>

      <div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', gap: 20, alignItems: isNarrow ? 'center' : 'flex-start', marginBottom: 20, padding: '16px 14px', background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16 }}>
        <DonutChart slices={slices} size={isNarrow ? 210 : 244} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 4 }}>
        {slices.map((sl, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 9px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.4)', transition: 'background 0.15s', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${sl.color}20`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)'}
          >
            <div style={{ width: 11, height: 11, borderRadius: 3, background: `linear-gradient(135deg,${sl.color},${sl.dark})`, boxShadow: `0 0 6px ${sl.color}55`, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#334155', flex: 1, fontFamily: FONT, fontWeight: 600 }}>{sl.label}</span>
            <span style={{ fontSize: 12, color: sl.color, fontFamily: MONO, fontWeight: 800 }}>{((sl.value / total) * 100).toFixed(1)}%</span>
            <span style={{ fontSize: 11, color: '#475569', fontFamily: MONO, fontWeight: 700, minWidth: 46, textAlign: 'right' }}>{(sl.value / 1000).toFixed(1)}t</span>
          </div>
        ))}
        {hasB && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <CoverageArc pct={coverage} />
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: FONT, fontWeight: 600, fontStyle: 'italic' }}>Sequestration Coverage</div>
              <div style={{ fontSize: 12, color: coverage < 15 ? '#ff4d4d' : coverage < 35 ? '#ffd24d' : '#00c853', fontFamily: MONO, fontWeight: 800 }}>{coverage.toFixed(1)}% of gross offset</div>
            </div>
          </div>
        )}
        {hasA && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
            {[{ label: 'Reduction', value: `${pct.toFixed(1)}%`, color: '#00c853' }, { label: 'New Net', value: `${(newNet/1000).toFixed(1)}t`, color: '#6a1b9a' }, { label: 'Em. Saved', value: `${(impact/1000).toFixed(1)}t`, color: '#1565c0' }, { label: 'Seq. +', value: `${(seqInc/1000).toFixed(1)}t`, color: '#00838f' }].map(({ label, value, color }) => (
              <div key={label} style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 9, padding: '7px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FONT }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color, fontFamily: MONO }}>{value}</div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: 12 }}>
        {hasB && (
        <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(198,40,40,0.2)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontFamily: FONT }}>Baseline</div>
          <StatRow label="Total Emission" value={`${(totalEm/1000).toFixed(1)}t`}  color="#dc2626" />
          <StatRow label="Total Seq."     value={`${(totalSeq/1000).toFixed(1)}t`} color="#00c853" />
          <StatRow label="Net Emission"   value={`${(netEm/1000).toFixed(1)}t`}    color="#ef4444" />
          <StatRow label="Coverage"       value={`${coverage.toFixed(1)}%`}        color={coverage < 15 ? '#dc2626' : coverage < 35 ? '#eab308' : '#22c55e'} />
          <StatRow label="Per Capita"     value={`${perCap.toFixed(0)} kg`}        color="#475569" />
          <StatRow label="Monthly Net"    value={`${(monthly/1000).toFixed(2)}t`}  color="#475569" />
        </div>
        )}
        {hasA && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontFamily: FONT }}>After Action</div>
          <StatRow label="Baseline Net"   value={`${(prevNet/1000).toFixed(1)}t`}  color="#ef4444" />
          <StatRow label="New Net"        value={`${(newNet/1000).toFixed(1)}t`}   color="#16a34a" />
          <StatRow label="Reduction"      value={`${pct.toFixed(1)}%`}             color="#16a34a" />
          <StatRow label="Em. Reduction"  value={`${(emRed/1000).toFixed(1)}t`}    color="#3b82f6" />
          <StatRow label="Seq. Increase"  value={`${(seqInc/1000).toFixed(1)}t`}  color="#0ea5e9" />
          <StatRow label="Total Impact"   value={`${(impact/1000).toFixed(1)}t`}   color="#9333ea" />
        </div>
        )}
      </div>
    </div>
  );
}
