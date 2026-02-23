'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [counter4, setCounter4] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const animate = (target: number, setter: (v: number) => void, duration = 2000) => {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setter(target); clearInterval(timer); }
        else setter(Math.floor(start));
      }, 16);
    };
    const t = setTimeout(() => {
      animate(4, setCounter1);
      animate(10, setCounter2);
      animate(2, setCounter3);
      animate(2024, setCounter4, 1500);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Villages', href: '#villages' },
  ];

  const stats = [
    { value: counter1, suffix: '', label: 'Major Projects', icon: '🏗️' },
    { value: counter2, suffix: '+', label: 'Partner Institutes', icon: '🤝' },
    { value: counter3, suffix: '', label: 'Countries', icon: '🌍' },
    { value: counter4, suffix: '', label: 'Established', icon: '📅' },
  ];

  const projects = [
    { title: 'Carbon Neutrality', icon: '🌿', desc: 'Village-level carbon monitoring and net-zero roadmaps for rural Uttar Pradesh communities.', tag: 'Active' },
    { title: 'River Health Index', icon: '💧', desc: 'Real-time Ganga water quality monitoring using IoT sensors across 12 ghats in Varanasi.', tag: 'Active' },
    { title: 'Waste-to-Energy', icon: '♻️', desc: 'Converting municipal solid waste into biogas and compost for clean energy generation.', tag: 'Pilot' },
    { title: 'Agroforestry Scale-up', icon: '🌾', desc: 'Integrating tree plantation with farming to boost sequestration and farmer livelihoods.', tag: 'Planning' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: 'white', overflowX: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        .font-display { font-family: 'Sora', sans-serif !important; }
        .grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .btn-orange {
          background: linear-gradient(135deg, #ea8800, #f5a623);
          box-shadow: 0 4px 20px rgba(234,136,0,0.35);
          transition: all 0.3s;
          color: white; font-weight: 600;
        }
        .btn-orange:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(234,136,0,0.5); }
        .btn-outline-w { border: 2px solid rgba(255,255,255,0.45); transition: all 0.3s; color: white; font-weight: 600; }
        .btn-outline-w:hover { border-color: white; background: rgba(255,255,255,0.08); }
        .stat-card {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px); transition: all 0.3s;
        }
        .stat-card:hover { background: rgba(255,255,255,0.1); border-color: rgba(234,136,0,0.4); transform: translateY(-3px); }
        .nav-scrolled { background: rgba(5,13,26,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .project-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s; }
        .project-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(234,136,0,0.3); transform: translateY(-4px); }
        .village-card { background: linear-gradient(135deg, rgba(10,31,61,0.8), rgba(13,48,96,0.6)); border: 1px solid rgba(255,255,255,0.1); transition: all 0.35s; }
        .village-card:hover { border-color: rgba(234,136,0,0.5); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(234,136,0,0.12); }
        .glow-dot { width:8px; height:8px; background:#22c55e; border-radius:50%; box-shadow:0 0 8px #22c55e; animation: pdot 2s infinite; }
        @keyframes pdot { 0%,100%{opacity:1;box-shadow:0 0 8px #22c55e} 50%{opacity:0.5;box-shadow:0 0 16px #22c55e} }
        .float1 { animation: f1 6s ease-in-out infinite; }
        .float2 { animation: f1 4s ease-in-out infinite reverse; }
        @keyframes f1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .slide-up { animation: su 0.8s ease forwards; }
        @keyframes su { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .orange-text { background: linear-gradient(90deg,#ea8800,#f5a623); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .blue-text { background: linear-gradient(90deg,#38bdf8,#0ea5e9); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .wave { height:3px; background:linear-gradient(90deg,transparent,#ea8800,#f5a623,transparent); }
        .section-label { color:#ea8800; font-size:0.72rem; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; }
        .tag-active { background:rgba(34,197,94,0.12); color:#4ade80; border:1px solid rgba(34,197,94,0.3); }
        .tag-pilot { background:rgba(234,136,0,0.12); color:#fbbf24; border:1px solid rgba(234,136,0,0.3); }
        .tag-planning { background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3); }
        .hero-glow { background: radial-gradient(ellipse at 70% 50%, rgba(14,100,180,0.22) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(234,136,0,0.07) 0%, transparent 50%); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s' }} className={scrolled ? 'nav-scrolled' : ''}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(10,37,72,0.9)', border: '1px solid rgba(234,136,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌊</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>CarbonWatch</div>
              <div style={{ fontSize: 10, color: '#f97316', letterSpacing: '0.15em', marginTop: 2 }}>SLCR · VARANASI</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{ padding: '8px 16px', fontSize: 14, color: '#d1d5db', borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'white'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#d1d5db'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                {l.label}
              </a>
            ))}
            <Link href="/dashboard" style={{ marginLeft: 8, padding: '9px 20px', borderRadius: 10, fontSize: 14, textDecoration: 'none' }} className="btn-orange">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', background: 'linear-gradient(135deg,#050d1a 0%,#0a1f3d 40%,#0d3060 70%,#0a2548 100%)' }}>
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0 }} />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0 }} />
        <div className="float1" style={{ position: 'absolute', top: '20%', right: '25%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12),transparent)', pointerEvents: 'none' }} />
        <div className="float2" style={{ position: 'absolute', bottom: '30%', right: '35%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(234,136,0,0.15),transparent)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 64px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            {/* Left */}
            <div className="slide-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '8px 16px', marginBottom: 24 }}>
                <div className="glow-dot" />
                <span style={{ fontSize: 12, color: '#d1d5db' }}>India–Denmark Joint Initiative · Active 2024</span>
              </div>

              <h1 className="font-display" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
                Smart Laboratory<br />
                on <span className="orange-text">Clean Rivers</span>
              </h1>
              <div className="wave" style={{ width: 80, marginBottom: 20 }} />
              <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.75, marginBottom: 32, maxWidth: 520 }}>
                Smart Laboratory on Clean Rivers in Varanasi (SLCR) is the joint initiative by the Hon'ble Prime Minister of India, H.E. Shri. Narendra Modi and the Prime Minister of Denmark, H.E. Ms Mette Frederiksen. A Memorandum of Understanding (MoU) was signed between the Ministry of Jal Shakti and the Danish Environment Ministry as a broad-based framework in the field of Water Resources Development and Management.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#about" className="btn-orange" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Learn More →</a>
                <a href="#villages" className="btn-outline-w" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>View Villages</a>
                <Link href="/dashboard" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', color: '#fb923c', border: '1px solid rgba(234,136,0,0.4)', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>🌿 Carbon Dashboard</Link>
              </div>
            </div>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" style={{ borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="font-display" style={{ fontSize: 44, fontWeight: 800, color: 'white' }}>{s.value}{s.suffix}</div>
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

      {/* ABOUT */}
      <section id="about" style={{ padding: '96px 0', background: 'linear-gradient(180deg,#050d1a,#071525)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>About the Initiative</div>
            <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700 }}>Monitoring <span className="blue-text">River Health</span> &amp; Carbon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon: '🌊', title: 'River Monitoring', desc: 'Real-time IoT-based water quality tracking across Ganga river ghats using advanced sensor networks.' },
              { icon: '🌿', title: 'Carbon Accounting', desc: 'Village-level greenhouse gas inventories and carbon budget monitoring for rural communities.' },
              { icon: '📊', title: 'Data Dashboard', desc: 'Interactive dashboards displaying emission data, sequestration metrics, and scenario projections.' },
            ].map((item, i) => (
              <div key={i} className="project-card" style={{ borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
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
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20, color: 'white', marginBottom: 10 }}>{p.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VILLAGES */}
      <section id="villages" style={{ padding: '96px 0', background: 'linear-gradient(180deg,#071525,#050d1a)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Carbon Monitoring</div>
            <h2 className="font-display" style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>Select a <span className="orange-text">Village</span></h2>
            <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>Choose a village to view its full carbon budget, emissions data, intervention impact and scenario projections.</p>
          </div>

          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {/* Active village */}
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="village-card" style={{ borderRadius: 20, padding: 28, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div className="glow-dot" />
                      <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Data Available</span>
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20, color: 'white' }}>Hasudi Ausanpur</h3>
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
                <div className="btn-orange" style={{ width: '100%', textAlign: 'center', padding: '11px 0', borderRadius: 12, fontSize: 14 }}>
                  View Dashboard →
                </div>
              </div>
            </Link>

            {/* Coming soon */}
            {[
              { name: 'Rampur Karkhana', dist: 'Gorakhpur, UP', pop: '~2,100' },
              { name: 'Bhaironpur', dist: 'Varanasi, UP', pop: '~980' },
              { name: 'Lakhanpur', dist: 'Lucknow, UP', pop: '~1,750' },
              { name: 'Chandpur Neem', dist: 'Prayagraj, UP', pop: '~1,320' },
            ].map((v, i) => (
              <div key={i} className="village-card" style={{ borderRadius: 20, padding: 28, opacity: 0.55, cursor: 'not-allowed' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4b5563' }} />
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Coming Soon</span>
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20, color: '#d1d5db' }}>{v.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>{v.dist}</p>
                  </div>
                  <span style={{ fontSize: 28, opacity: 0.35 }}>🏘️</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[['Population', v.pop], ['Status', 'Survey Pending']].map(([l, val]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 3 }}>{l}</div>
                      <div style={{ color: '#9ca3af', fontWeight: 600, fontSize: 13 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '100%', textAlign: 'center', padding: '11px 0', borderRadius: 12, fontSize: 14, color: '#6b7280', border: '1px solid #374151' }}>
                  Not Available Yet
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030a14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234,136,0,0.1)', border: '1px solid rgba(234,136,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌊</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>CarbonWatch · SLCR</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Smart Laboratory on Clean Rivers, Varanasi</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#4b5563', textAlign: 'center' }}>
            A joint initiative of India &amp; Denmark · Ministry of Jal Shakti · © 2025
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#d1d5db'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#6b7280'}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
