// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './dashboard.css';

export default function LandingPage() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [c4, setC4] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const anim = (target: number, set: (v: number) => void, ms = 1800) => {
      let val = 0;
      const step = target / (ms / 16);
      const t = setInterval(() => {
        val += step;
        if (val >= target) { set(target); clearInterval(t); }
        else set(Math.floor(val));
      }, 16);
    };
    const delay = setTimeout(() => {
      anim(4,    setC1);
      anim(10,   setC2);
      anim(2,    setC3);
      anim(2024, setC4, 1400);
    }, 500);
    return () => clearTimeout(delay);
  }, []);



  const stats = [
    { val: c1, suf: '',  label: 'Major Projects',    icon: '🏗️' },
    { val: c2, suf: '+', label: 'Partner Institutes', icon: '🤝' },
    { val: c3, suf: '',  label: 'Countries',          icon: '🌍' },
    { val: c4, suf: '',  label: 'Established',        icon: '📅' },
  ];

  const projects = [
    { title: 'Carbon Neutrality',   icon: '🌿', desc: 'Village-level carbon monitoring and net-zero roadmaps for rural Uttar Pradesh communities.', tag: 'Active' },
    { title: 'River Health Index',  icon: '💧', desc: 'Real-time Ganga water quality monitoring using IoT sensors across 12 ghats in Varanasi.',   tag: 'Active' },
    { title: 'Waste-to-Energy',     icon: '♻️', desc: 'Converting municipal solid waste into biogas and compost for clean energy generation.',        tag: 'Pilot' },
    { title: 'Agroforestry Scale-up', icon: '🌾', desc: 'Integrating tree plantation with farming to boost sequestration and farmer livelihoods.',   tag: 'Planning' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: 'white', overflowX: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s' }}
        className={scrolled ? 'nav-scrolled' : ''}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(10,37,72,0.9)', border: '1px solid rgba(234,136,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌊</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>CarbonWatch</div>
              <div style={{ fontSize: 10, color: '#f97316', letterSpacing: '0.15em', marginTop: 2 }}>SLCR · VARANASI</div>
            </div>
          </div>

          {/* Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            
            <Link href="/dashboard" className="btn-orange" style={{ marginLeft: 8, padding: '9px 20px', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', background: 'linear-gradient(135deg,#050d1a 0%,#0a1f3d 40%,#0d3060 70%,#0a2548 100%)' }}>
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0 }} />
        <div className="hero-glow"    style={{ position: 'absolute', inset: 0 }} />
        <div className="float1" style={{ position: 'absolute', top: '20%', right: '25%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12),transparent)', pointerEvents: 'none' }} />
        <div className="float2" style={{ position: 'absolute', bottom: '30%', right: '35%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(234,136,0,0.15),transparent)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 64px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div className="slide-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '8px 16px', marginBottom: 24 }}>
                <div className="glow-dot" />
                <span style={{ fontSize: 12, color: '#d1d5db' }}>India–Denmark Joint Initiative · Active 2024</span>
              </div>
              <h1 className="font-display" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
                Smart Laboratory<br />on <span className="orange-text">Clean Rivers</span>
              </h1>
              <div className="wave" style={{ width: 80, marginBottom: 20 }} />
              <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.8, marginBottom: 32, maxWidth: 520 }}>
                Smart Laboratory on Clean Rivers in Varanasi (SLCR) is the joint initiative by the Hon'ble Prime Minister of India, H.E. Shri. Narendra Modi and the Prime Minister of Denmark, H.E. Ms Mette Frederiksen. A Memorandum of Understanding (MoU) was signed between the Ministry of Jal Shakti and the Danish Environment Ministry as a broad-based framework in the field of Water Resources Development and Management.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#about"    className="btn-orange"    style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Learn More →</a>
                <a href="#villages" className="btn-outline-w" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>View Villages</a>
                <Link href="/dashboard" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', color: '#fb923c', border: '1px solid rgba(234,136,0,0.4)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>🌿 Carbon Dashboard</Link>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" style={{ borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="font-display" style={{ fontSize: 44, fontWeight: 800 }}>{s.val}{s.suf}</div>
                  <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
          <span style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.2em' }}>SCROLL</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom,#9ca3af,transparent)' }} />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '96px 0', background: 'linear-gradient(180deg,#050d1a,#071525)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>About the Initiative</div>
            <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700 }}>Monitoring <span className="blue-text">River Health</span> &amp; Carbon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon: '🌊', title: 'River Monitoring',  desc: 'Real-time IoT-based water quality tracking across Ganga river ghats using advanced sensor networks.' },
              { icon: '🌿', title: 'Carbon Accounting', desc: 'Village-level greenhouse gas inventories and carbon budget monitoring for rural communities.' },
              { icon: '📊', title: 'Data Dashboard',    desc: 'Interactive dashboards displaying emission data, sequestration metrics, and scenario projections.' },
            ].map((item, i) => (
              <div key={i} className="project-card" style={{ borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: '96px 0', background: '#071525' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 12 }}>Our Work</div>
              <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700 }}>Major <span className="orange-text">Projects</span></h2>
            </div>
            <Link href="/dashboard" className="btn-orange" style={{ padding: '10px 22px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>View Dashboard →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {projects.map((p, i) => (
              <div key={i} className="project-card" style={{ borderRadius: 20, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{p.icon}</span>
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
      <section id="villages" style={{ padding: '96px 0', background: 'linear-gradient(180deg,#071525,#050d1a)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Carbon Monitoring</div>
            <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>Select a <span className="orange-text">Village</span></h2>
            <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>Choose a village to view its full carbon budget, emissions data, intervention impact and scenario projections.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {/* Active */}
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
                  <span style={{ fontSize: 28 }}>🌾</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[['Population','1,416'],['Area','206 ha'],['Net Emission','1,799t CO₂'],['Reduction','39.6%']].map(([l,v]) => (
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
      <footer style={{ background: '#030a14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234,136,0,0.1)', border: '1px solid rgba(234,136,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌊</div>
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
