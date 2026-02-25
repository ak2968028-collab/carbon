'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// Place carbonwatch.css in the same folder as this file (or adjust path)
import './carbonwatch.css';

// ─── Organic wave SVG background ─────────────────────────────────────────────
function WavyBackground() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d3060" stopOpacity="0" />
          <stop offset="40%" stopColor="#1a4a7a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0d3060" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea8800" stopOpacity="0" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ea8800" stopOpacity="0" />
        </linearGradient>
        <filter id="blur4"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      {/* Deep glow orbs */}
      <ellipse cx="300" cy="420" rx="340" ry="220" fill="#0a2548" opacity="0.55" filter="url(#blur8)" />
      <ellipse cx="1140" cy="280" rx="280" ry="180" fill="#0d3060" opacity="0.45" filter="url(#blur8)" />
      <ellipse cx="720" cy="700" rx="400" ry="160" fill="#071a35" opacity="0.5" filter="url(#blur8)" />

      {/* Wave band 1 */}
      <path d="M-100 460 Q180 380 420 430 T900 400 T1340 440 T1540 420 L1540 520 Q1300 500 1060 530 T600 510 T100 540 Z"
        fill="url(#wg1)" filter="url(#blur4)" opacity="0.7" />
      {/* Wave band 2 */}
      <path d="M-100 560 Q220 510 500 550 T980 520 T1440 555 L1440 630 Q1100 610 820 640 T280 615 T-100 635 Z"
        fill="url(#wg2)" filter="url(#blur4)" opacity="0.6" />
      {/* Wave band 3 – thin accent */}
      <path d="M0 330 Q360 290 720 320 T1440 300"
        fill="none" stroke="rgba(234,136,0,0.12)" strokeWidth="1.5" />
      <path d="M0 370 Q400 340 800 365 T1440 345"
        fill="none" stroke="rgba(96,165,250,0.08)" strokeWidth="1" />

      {/* Fine grid */}
      {[...Array(18)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 52} x2="1440" y2={i * 52}
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}
      {[...Array(28)].map((_, i) => (
        <line key={`v${i}`} x1={i * 54} y1="0" x2={i * 54} y2="900"
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}
    </svg>
  );
}

// ─── Floating tree / leaf silhouettes ────────────────────────────────────────
function FloatingTrees() {
  const trees = [
    { x: 82, y: 55, scale: 1, delay: '0s', opacity: 0.13 },
    { x: 88, y: 28, scale: 0.6, delay: '1.2s', opacity: 0.09 },
    { x: 76, y: 68, scale: 0.75, delay: '2.4s', opacity: 0.1 },
    { x: 94, y: 50, scale: 0.5, delay: '0.8s', opacity: 0.07 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {trees.map((t, i) => (
        <svg
          key={i}
          viewBox="0 0 60 90"
          style={{
            position: 'absolute',
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.scale * 80}px`,
            height: 'auto',
            opacity: t.opacity,
            animation: `float-leaf 5s ${t.delay} ease-in-out infinite`,
            transform: 'translate(-50%,-50%)',
          }}
        >
          {/* Simple conifer silhouette */}
          <polygon points="30,4 6,40 20,40" fill="#4ade80" />
          <polygon points="30,18 3,62 24,62" fill="#22c55e" />
          <polygon points="30,35 0,88 60,88" fill="#16a34a" />
          <rect x="25" y="80" width="10" height="10" fill="#854d0e" />
        </svg>
      ))}
    </div>
  );
}

// ─── Carbon molecule diagram (C6 ring) ───────────────────────────────────────
function CarbonMolecule({ style }: { style?: React.CSSProperties }) {
  const r = 38, cx = 60, cy = 60, n = 6;
  const pts = Array.from({ length: n }, (_, i) => ({
    x: cx + r * Math.cos((i * Math.PI * 2) / n - Math.PI / 2),
    y: cy + r * Math.sin((i * Math.PI * 2) / n - Math.PI / 2),
  }));
  return (
    <svg viewBox="0 0 120 120" style={{ ...style }}>
      {pts.map((p, i) => {
        const next = pts[(i + 1) % n];
        return (
          <line key={i}
            x1={p.x} y1={p.y} x2={next.x} y2={next.y}
            stroke="rgba(234,136,0,0.6)" strokeWidth="2"
          />
        );
      })}
      {/* double bonds on alternating edges */}
      {[0, 2, 4].map(i => {
        const a = pts[i], b = pts[(i + 1) % n];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx*dx+dy*dy);
        const nx = -dy / len * 3, ny = dx / len * 3;
        return (
          <line key={`d${i}`}
            x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny}
            stroke="rgba(234,136,0,0.35)" strokeWidth="1.5"
          />
        );
      })}
      {pts.map((p, i) => (
        <circle key={`c${i}`} cx={p.x} cy={p.y} r="5" fill="#1e3a5f" stroke="rgba(234,136,0,0.8)" strokeWidth="1.5" />
      ))}
      <circle cx={cx} cy={cy} r="8" fill="#1e3a5f" stroke="rgba(96,165,250,0.6)" strokeWidth="1.5" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="DM Sans">C</text>
    </svg>
  );
}

// ─── Floating carbon molecules scattered in background ────────────────────────
function FloatingMolecules() {
  const mols = [
    { left: '6%',  top: '18%', size: 90,  delay: '0s',   opacity: 0.22 },
    { left: '90%', top: '12%', size: 70,  delay: '1.5s', opacity: 0.15 },
    { left: '78%', top: '72%', size: 110, delay: '3s',   opacity: 0.18 },
    { left: '14%', top: '80%', size: 65,  delay: '0.7s', opacity: 0.13 },
    { left: '50%', top: '8%',  size: 55,  delay: '2s',   opacity: 0.1  },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {mols.map((m, i) => (
        <CarbonMolecule
          key={i}
          style={{
            position: 'absolute',
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animation: `float-mol ${5 + i}s ${m.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated continuous wave strip (bottom of hero) ─────────────────────────
function WaveStrip() {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', width: '200%', animation: 'wave-move 14s linear infinite' }}>
        <svg viewBox="0 0 1440 90" style={{ width: '50%', flexShrink: 0 }} preserveAspectRatio="none">
          <path d="M0 45 Q180 0 360 45 T720 45 T1080 45 T1440 45 L1440 90 L0 90 Z"
            fill="#071525" opacity="0.95" />
        </svg>
        <svg viewBox="0 0 1440 90" style={{ width: '50%', flexShrink: 0 }} preserveAspectRatio="none">
          <path d="M0 45 Q180 0 360 45 T720 45 T1080 45 T1440 45 L1440 90 L0 90 Z"
            fill="#071525" opacity="0.95" />
        </svg>
      </div>
    </div>
  );
}

// ─── CO₂ leaf icon composite ──────────────────────────────────────────────────
function LeafIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path d="M16 2 C16 2 4 8 4 20 C4 26 10 30 16 30 C22 30 28 26 28 20 C28 8 16 2 16 2 Z" fill="rgba(74,222,128,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5" />
      <line x1="16" y1="8" x2="16" y2="28" stroke="rgba(74,222,128,0.5)" strokeWidth="1" />
      <line x1="16" y1="14" x2="10" y2="20" stroke="rgba(74,222,128,0.4)" strokeWidth="0.8" />
      <line x1="16" y1="18" x2="22" y2="22" stroke="rgba(74,222,128,0.4)" strokeWidth="0.8" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
  
  * { box-sizing: border-box; }
  
  .font-display { font-family: 'Syne', sans-serif; }
  .section-label { font-size: 12px; color: #ea8800; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .blue-text { color: #60a5fa; }
  .orange-text { color: #f97316; }
  .shimmer-text { background: linear-gradient(90deg, #60a5fa, #ea8800, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glow-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 12px rgba(74,222,128,0.6); }
  
  .btn-orange { background: linear-gradient(135deg, #ea8800, #f97316); color: white; font-weight: 600; transition: all 0.3s; border: none; cursor: pointer; }
  .btn-orange:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(234,136,0,0.3); }
  .btn-outline-w { border: 1px solid rgba(255,255,255,0.3); color: white; font-weight: 600; transition: all 0.3s; background: transparent; cursor: pointer; }
  .btn-outline-w:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); }
  
  .nav-scrolled { background: rgba(7,21,37,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .stat-card { background: rgba(13,48,96,0.4); border: 1px solid rgba(96,165,250,0.2); transition: all 0.3s; }
  .stat-card:hover { background: rgba(13,48,96,0.6); border-color: rgba(96,165,250,0.4); transform: translateY(-4px); }
  .project-card { background: rgba(13,48,96,0.3); border: 1px solid rgba(96,165,250,0.15); transition: all 0.3s; }
  .project-card:hover { background: rgba(13,48,96,0.5); border-color: rgba(96,165,250,0.3); transform: translateY(-4px); }
  .village-card { background: rgba(13,48,96,0.35); border: 1px solid rgba(13,166,128,0.2); transition: all 0.3s; }
  .village-card:hover { background: rgba(13,48,96,0.55); border-color: rgba(74,222,128,0.4); transform: translateY(-4px); }
  
  .wave { height: 4px; background: linear-gradient(90deg, transparent, #ea8800, transparent); border-radius: 2px; }
  
  .tag-active { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .tag-pilot { background: rgba(234,136,0,0.15); color: #f97316; border: 1px solid rgba(234,136,0,0.3); }
  .tag-planning { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
  
  @keyframes float-leaf { 0%, 100% { transform: translate(-50%, -50%) translateY(0px); } 50% { transform: translate(-50%, -50%) translateY(-20px); } }
  @keyframes float-mol { 0%, 100% { transform: translateX(0px) translateY(0px); } 25% { transform: translateX(12px) translateY(-8px); } 50% { transform: translateX(0px) translateY(-16px); } 75% { transform: translateX(-12px) translateY(-8px); } }
  @keyframes wave-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  
  .slide-up { animation: slide-up 0.7s ease-out 0.1s both; }
  .slide-up2 { animation: slide-up 0.7s ease-out 0.3s both; }
`;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [vw, setVw] = useState(1280);

  // Inject styles client-side only to avoid SSR/client hydration mismatch
  useEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-cw', '1');
    el.textContent = GLOBAL_CSS;
    if (!document.querySelector('[data-cw]')) document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [c4, setC4] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => {
    const anim = (target: number, set: (v: number) => void, ms = 1800) => {
      let val = 0;
      const step = target / (ms / 16);
      const t = setInterval(() => {
        val += step;
        if (val >= target) { set(target); clearInterval(t); } else set(Math.floor(val));
      }, 16);
    };
    const d = setTimeout(() => { anim(4, setC1); anim(10, setC2); anim(2, setC3); anim(2024, setC4, 1400); }, 500);
    return () => clearTimeout(d);
  }, []);

  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1100;
  const sectionPad = isMobile ? '72px 0' : '96px 0';

  const stats = [
    { val: c1, suf: '', label: 'Major Projects', icon: '🏗' },
    { val: c2, suf: '+', label: 'Partner Institutes', icon: '🤝' },
    { val: c3, suf: '', label: 'Countries', icon: '🌍' },
    { val: c4, suf: '', label: 'Established', icon: '📅' },
  ];

  const projects = [
    { title: 'Carbon Neutrality', desc: 'Village-level carbon monitoring and net-zero roadmaps for rural Uttar Pradesh communities.', tag: 'Active' },
    { title: 'River Health Index', desc: 'Real-time Ganga water quality monitoring using IoT sensors across 12 ghats in Varanasi.', tag: 'Active' },
    { title: 'Waste-to-Energy', desc: 'Converting municipal solid waste into biogas and compost for clean energy generation.', tag: 'Pilot' },
    { title: 'Agroforestry Scale-up', desc: 'Integrating tree plantation with farming to boost sequestration and farmer livelihoods.', tag: 'Planning' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: 'white', overflowX: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s' }} className={scrolled ? 'nav-scrolled' : ''}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '12px 14px' : '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(10,37,72,0.9)', border: '1px solid rgba(234,136,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'Syne', fontWeight: 800 }}>CW</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>CarbonWatch</div>
              <div style={{ fontSize: 10, color: '#f97316', letterSpacing: '0.15em', marginTop: 2 }}>SLCR · VARANASI</div>
            </div>
          </div>
          {!isMobile ? (
            <Link href="/dashboard" className="btn-orange" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>Dashboard →</Link>
          ) : (
            <button onClick={() => setMenuOpen(s => !s)}
              style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', fontSize: 18, cursor: 'pointer' }}>
              {menuOpen ? '✕' : '≡'}
            </button>
          )}
        </div>
        {isMobile && menuOpen && (
          <div style={{ padding: '0 14px 12px', display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/dashboard" className="btn-orange" style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13, textDecoration: 'none' }}>Open Dashboard</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', background: 'linear-gradient(135deg,#050d1a 0%,#0a1f3d 40%,#0d3060 70%,#0a2548 100%)', overflow: 'hidden' }}>

        {/* Layered backgrounds */}
        <WavyBackground />
        <FloatingMolecules />
        <FloatingTrees />

        {/* Radial glow center */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(13,48,96,0.55) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Bottom wave transition */}
        <WaveStrip />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '88px 14px 100px' : '96px 24px 120px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>

            <div className="slide-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '8px 16px', marginBottom: 24 }}>
                <div className="glow-dot" />
                <span style={{ fontSize: 12, color: '#d1d5db' }}>India–Denmark Joint Initiative · Active 2024</span>
              </div>

              <h1 className="font-display" style={{ fontSize: isMobile ? 34 : isTablet ? 44 : 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
                Smart Laboratory<br />
                on <span className="shimmer-text">Clean Rivers</span>
              </h1>

              <div className="wave" style={{ width: 80, marginBottom: 20 }} />

              <p style={{ color: '#9ca3af', fontSize: isMobile ? 14 : 15, lineHeight: 1.8, marginBottom: 32, maxWidth: 520 }}>
                Smart Laboratory on Clean Rivers in Varanasi (SLCR) is a joint initiative by India and Denmark. The initiative supports water-resource management and village-level sustainability planning including carbon monitoring.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#about" className="btn-orange" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>Learn More →</a>
                <a href="#villages" className="btn-outline-w" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>View Villages</a>
                <Link href="/dashboard" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', color: '#fb923c', border: '1px solid rgba(234,136,0,0.4)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <LeafIcon size={16} /> Carbon Dashboard
                </Link>
              </div>
            </div>

            <div className="slide-up2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" style={{ borderRadius: 20, padding: isMobile ? '18px 12px' : '28px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div className="font-display" style={{ fontSize: isMobile ? 30 : 44, fontWeight: 800 }}>{s.val}{s.suf}</div>
                  <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: sectionPad, background: 'linear-gradient(180deg,#071525,#071525)', position: 'relative', overflow: 'hidden' }}>
        {/* subtle molecule in corner */}
        <CarbonMolecule style={{ position: 'absolute', right: '-30px', top: '20px', width: 160, opacity: 0.06 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>About the Initiative</div>
            <h2 className="font-display" style={{ fontSize: isMobile ? 30 : 40, fontWeight: 700 }}>Monitoring <span className="blue-text">River Health</span> &amp; Carbon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 20 }}>
            {[
              { title: 'River Monitoring', desc: 'Real-time IoT-based water quality tracking across Ganga ghats using advanced sensors.', icon: '🌊' },
              { title: 'Carbon Accounting', desc: 'Village-level greenhouse gas inventories and carbon budget monitoring.', icon: '🌿' },
              { title: 'Data Dashboard', desc: 'Interactive dashboards for emissions, sequestration and scenario projections.', icon: '📊' },
            ].map((item, i) => (
              <div key={i} className="project-card" style={{ borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: sectionPad, background: '#071525', position: 'relative', overflow: 'hidden' }}>
        {/* tree silhouette bg accent */}
        <svg viewBox="0 0 80 120" style={{ position: 'absolute', left: '-10px', bottom: '0px', width: 120, opacity: 0.06, pointerEvents: 'none' }}>
          <polygon points="40,4 8,50 28,50" fill="#4ade80" />
          <polygon points="40,22 2,80 30,80" fill="#22c55e" />
          <polygon points="40,45 0,118 80,118" fill="#16a34a" />
          <rect x="33" y="108" width="14" height="12" fill="#854d0e" />
        </svg>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 12 }}>Our Work</div>
              <h2 className="font-display" style={{ fontSize: isMobile ? 30 : 40, fontWeight: 700 }}>Major <span className="orange-text">Projects</span></h2>
            </div>
            <Link href="/dashboard" className="btn-orange" style={{ padding: '10px 22px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>View Dashboard →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            {projects.map((p, i) => (
              <div key={i} className="project-card" style={{ borderRadius: 20, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span className={`tag-${p.tag.toLowerCase()}`} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 99, fontWeight: 600 }}>{p.tag}</span>
                </div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VILLAGES ── */}
      <section id="villages" style={{ padding: sectionPad, background: 'linear-gradient(180deg,#071525,#050d1a)', position: 'relative', overflow: 'hidden' }}>
        <CarbonMolecule style={{ position: 'absolute', left: '2%', top: '10%', width: 130, opacity: 0.07, animation: 'float-mol 7s ease-in-out infinite' }} />
        <CarbonMolecule style={{ position: 'absolute', right: '3%', bottom: '8%', width: 100, opacity: 0.06, animation: 'float-mol 9s 1.5s ease-in-out infinite' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Carbon Monitoring</div>
            <h2 className="font-display" style={{ fontSize: isMobile ? 30 : 40, fontWeight: 700, marginBottom: 12 }}>Select a <span className="orange-text">Village</span></h2>
            <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>Choose a village to view full carbon budget, emissions, interventions and scenarios.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 20 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="village-card" style={{ borderRadius: 20, padding: 28, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div className="glow-dot" />
                      <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Data Available</span>
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20 }}>Hasudi Ausanpur</h3>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>Siddharth Nagar, UP</p>
                  </div>
                  <LeafIcon size={32} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[['Population', '1,416'], ['Area', '206 ha'], ['Net Emission', '1,799t CO₂'], ['Reduction', '39.6%']].map(([l, v]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 3 }}>{l}</div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="btn-orange" style={{ textAlign: 'center', padding: '11px 0', borderRadius: 12, fontSize: 14 }}>View Dashboard →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#030a14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '28px 0' : '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'space-between', flexWrap: 'wrap', gap: 20, textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LeafIcon size={20} />
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14 }}>CarbonWatch · SLCR</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Smart Laboratory on Clean Rivers, Varanasi</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#4b5563', textAlign: 'center' }}>A joint initiative of India &amp; Denmark · Ministry of Jal Shakti · © 2025</div>
        </div>
      </footer>
    </div>
  );
}