'use client';
import { useEffect, useState, useRef } from 'react';

export interface VillageRow {
  vlcode: string; village_name: string; district: string; state: string;
  total_population: string; total_area_ha: string; builtup_area_ha: string;
  agricultural_area_ha: string; water_bodies_area_ha: string;
  total_households: string; total_livestock: string; total_vehicles: string;
}

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  unit: string;
  gradientClass: string;
  particleColor: string;
  baseShadowClass: string;
  hoverShadowClass: string;
  model: 'population' | 'area' | 'house' | 'animal';
}

function ParticleSystem({ color, count = 50 }: { color: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const withAlpha = (input: string, alpha: number) => {
      const a = Math.max(0, Math.min(1, alpha));
      const rgbaMatch = input.match(
        /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/i
      );
      if (rgbaMatch) {
        return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${a})`;
      }

      const rgbMatch = input.match(
        /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i
      );
      if (rgbMatch) {
        return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${a})`;
      }

      const hex = input.replace('#', '').trim();
      if (/^[0-9a-f]{3}$/i.test(hex)) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return `rgba(${r},${g},${b},${a})`;
      }
      if (/^[0-9a-f]{6}$/i.test(hex) || /^[0-9a-f]{8}$/i.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${a})`;
      }

      return `rgba(117,166,231,${a})`;
    };

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random(),
        maxLife: 0.8 + Math.random() * 0.2
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
          p.life = p.maxLife;
        }

        const alpha = p.life;
        const size = 2 + Math.sin(frame * 0.1 + i) * 1;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, withAlpha(color, alpha));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      frame++;
      requestAnimationFrame(animate);
    }
    animate();

    return () => {};
  }, [color, count]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1]" />;
}

function Floating3DModel({ model, scale = 1 }: { model: string; scale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let time = 0;

    const renderModel = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rotationX = 0.3 + Math.sin(time * 0.001) * 0.1;
      const rotationY = time * 0.0008;

      let points: [number, number, number][] = [];
      let faces: number[][] = [];

      if (model === 'population') {
        for (let i = 0; i < 8; i++) {
          points.push([
            (Math.sin(time * 0.002 + i) - 0.5) * 30 * scale,
            Math.cos(time * 0.0015 + i) * 15 * scale,
            (i * 8 - 28) * scale
          ]);
        }
      } else if (model === 'house') {
        points = [
          [-20 * scale, 20 * scale, -20 * scale], [20 * scale, 20 * scale, -20 * scale],
          [20 * scale, 20 * scale, 20 * scale], [-20 * scale, 20 * scale, 20 * scale],
          [-15 * scale, 0, -15 * scale], [15 * scale, 0, -15 * scale],
          [15 * scale, 0, 15 * scale], [-15 * scale, 0, 15 * scale],
        ];
        faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
      } else if (model === 'animal') {
        points = [
          [-25 * scale, 10 * scale, -10 * scale], [25 * scale, 10 * scale, -10 * scale],
          [25 * scale, 10 * scale, 20 * scale], [-25 * scale, 10 * scale, 20 * scale],
          [0, -5 * scale, 0], [-12 * scale, -15 * scale, 5 * scale], [12 * scale, -15 * scale, 5 * scale],
        ];
      }

      ctx.save();
      ctx.translate(cx, cy);

      points.forEach((point, i) => {
        let [x, y, z] = point;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const x2 = x * cosY + z2 * sinY;
        const z3 = -x * sinY + z2 * cosY;

        const scaleFactor = 300 / (300 + z3);
        const px = x2 * scaleFactor;
        const py = y2 * scaleFactor;

        (points as unknown as [number, number][])[i] = [px, py];
      });

      faces.forEach(face => {
        ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.sin(time * 0.005) * 0.05})`;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        face.forEach((i, j) => {
          const [px, py] = points[i] as unknown as [number, number];
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      ctx.restore();
      time++;
      requestAnimationFrame(renderModel);
    };

    renderModel();
  }, [model, scale]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute left-[10%] top-[10%] z-[3] h-[80%] w-[80%]" />;
}

function HolographicCounter({ target, suffix }: { target: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = target * easeOut;
      setDisplayValue(Math.floor(current));

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="relative text-[clamp(24px,5vw,32px)] font-black tracking-[-0.03em] [font-family:'TT_Hoves',-apple-system,sans-serif] [text-shadow:0_0_20px_rgba(255,255,255,0.8)] [transform:translateZ(50px)]">
      <div className="absolute inset-0 z-[1] rounded-xl [background:linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.3)_50%,transparent_70%)] [background-size:100%_100%] [animation:scan_2s_infinite_linear] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />
      <span>{displayValue.toLocaleString()}</span>{suffix}
      <style jsx>{`
        @keyframes scan {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </div>
  );
}

export default function UltraRealisticVillageHeader({ v }: { v: VillageRow | null | undefined }) {
  const [mounted, setMounted] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!v) return null;

  const stats: StatCard[] = [
    { label: 'Population', value: Number(v.total_population || 0), suffix: '', icon: '👥', unit: 'people', gradientClass: '[background:linear-gradient(135deg,_#ff6b6b,_#ff8e8e)]', particleColor: 'rgba(255,107,107,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(255,107,107,0.6)]', model: 'population' },
    { label: 'Total Area', value: parseFloat(v.total_area_ha || '0'), suffix: ' ha', icon: '🗺️', unit: 'hectares', gradientClass: '[background:linear-gradient(135deg,_#4ecdc4,_#6cd5c9)]', particleColor: 'rgba(78,205,196,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(78,205,196,0.6)]', model: 'area' },
    { label: 'Agri Area', value: parseFloat(v.agricultural_area_ha || '0'), suffix: ' ha', icon: '🌾', unit: 'cultivated', gradientClass: '[background:linear-gradient(135deg,_#45b7d1,_#5fc2d8)]', particleColor: 'rgba(69,183,209,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(69,183,209,0.6)]', model: 'area' },
    { label: 'Water Bodies', value: parseFloat(v.water_bodies_area_ha || '0'), suffix: ' ha', icon: '💧', unit: 'water area', gradientClass: '[background:linear-gradient(135deg,_#96ceb4,_#a8d5bd)]', particleColor: 'rgba(150,206,180,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(150,206,180,0.6)]', model: 'area' },
    { label: 'Households', value: Number(v.total_households || 0), suffix: '', icon: '🏠', unit: 'homes', gradientClass: '[background:linear-gradient(135deg,_#feca57,_#fed77e)]', particleColor: 'rgba(254,202,87,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(254,202,87,0.6)]', model: 'house' },
    { label: 'Livestock', value: Number(v.total_livestock || 0), suffix: '', icon: '🐄', unit: 'animals', gradientClass: '[background:linear-gradient(135deg,_#ff9ff3,_#ffb3f6)]', particleColor: 'rgba(255,159,243,0.6)', baseShadowClass: '[box-shadow:0_15px_35px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]', hoverShadowClass: '[box-shadow:0_30px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(255,159,243,0.6)]', model: 'animal' },
  ];

  return (
    <div className="relative mb-9 [perspective:1000px] [font-family:'TT_Hoves',-apple-system,BlinkMacSystemFont,sans-serif]">
      <ParticleSystem color="rgba(117,166,231,0.3)" count={80} />

      <div className={`relative mb-5 rounded-[28px] border border-white/25 [background:radial-gradient(ellipse_at_top_left,rgba(117,166,231,0.95)_0%,rgba(122,225,225,0.9)_40%,rgba(218,122,5,0.85)_100%)] [backdrop-filter:blur(20px)_saturate(1.2)] [box-shadow:0_25px_50px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-500 ${isNarrow ? 'px-5 py-6' : 'px-10 py-8'}`}>
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full [background:radial-gradient(circle_at_30%_30%,rgba(236,168,111,0.95)_0%,rgba(236,168,111,0.4)_40%,transparent_70%)] blur-[20px] [animation:float_6s_ease-in-out_infinite] [box-shadow:0_0_60px_rgba(236,168,111,0.6)]" />

        <div className="absolute -bottom-[60px] left-1/4 h-40 w-40 rounded-full [background:radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] blur-[30px] [animation:float_8s_ease-in-out_infinite_reverse] [box-shadow:0_0_40px_rgba(0,212,255,0.4)]" />

        <div className="relative z-[5] flex items-center gap-6 [transform-style:preserve-3d]">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/40 text-[32px] [background:radial-gradient(circle,rgba(0,230,118,0.95)_0%,rgba(0,230,118,0.4)_70%)] [box-shadow:0_0_40px_rgba(0,230,118,0.6),inset_0_1px_0_rgba(255,255,255,0.6)] [transform:translateZ(30px)_rotateX(10deg)] transition-all duration-300">
            🌿
          </div>

          <div className="min-w-0">
            <div className={`${isNarrow ? 'text-[28px]' : 'text-[36px]'} bg-gradient-to-br from-[#a94008] to-[#d97706] bg-clip-text font-black leading-[1.1] tracking-[-0.03em] text-transparent [text-shadow:0_2px_10px_rgba(0,0,0,0.3)] [transform:translateZ(20px)]`}>
              {v.village_name}
            </div>
            <div className={`mt-1.5 ${isNarrow ? 'text-[15px]' : 'text-[17px]'} font-medium tracking-[0.03em] text-white/95 [backdrop-filter:blur(10px)]`}>
              {v.district} District · {v.state}
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-white/95 [backdrop-filter:blur(20px)] [box-shadow:0_8px_32px_rgba(0,0,0,0.2)] [transform:translateZ(40px)_rotateX(-15deg)] [animation:glow_3s_ease-in-out_infinite_alternate]">
          VL · {v.vlcode}
        </div>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] [perspective:1200px]">
        {stats.map((stat) => {
          const isHovered = hoveredStat === stat.label;

          return (
            <div
              key={stat.label}
              onMouseEnter={() => setHoveredStat(stat.label)}
              onMouseLeave={() => setHoveredStat(null)}
              className={`relative h-[140px] cursor-pointer overflow-hidden rounded-[20px] border border-white/20 px-4 py-6 text-center [transform-style:preserve-3d] transition-all duration-500 ${stat.gradientClass} ${isHovered ? '[transform:translateZ(60px)_rotateX(5deg)_rotateY(10deg)_scale(1.05)]' : '[transform:translateZ(0px)_rotateX(0deg)_rotateY(0deg)_scale(1)]'} ${isHovered ? stat.hoverShadowClass : stat.baseShadowClass}`}
            >
              <ParticleSystem color={stat.particleColor} count={25} />

              {mounted && <Floating3DModel model={stat.model} scale={stat.value > 10000 ? 0.8 : 1.2} />}

              <div className="relative z-10 flex h-full flex-col justify-center">
                <div className="mb-2 text-[28px] [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
                  {stat.icon}
                </div>

                {mounted ? (
                  <HolographicCounter target={stat.value} suffix={stat.suffix} />
                ) : (
                  <div className="text-[clamp(24px,5vw,32px)] font-black tracking-[-0.03em] text-black">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                )}

                <div className="mt-1.5 text-sm font-bold uppercase tracking-[0.05em] text-white/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-[11px] font-medium tracking-[0.03em] text-white/80">
                  {stat.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes glow {
          0% { box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.3); }
          100% { box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 0 30px rgba(255,255,255,0.6); }
        }
      `}</style>
    </div>
  );
}

