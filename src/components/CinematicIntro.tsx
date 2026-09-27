import React, { useEffect, useState, useRef } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Balanced 3-Second Sequence:
  // Phase 0: Black Hole & Cosmic Universe (0 - 950ms)
  // Phase 1: Letters M, C, H emerge with cosmic sweep (950ms)
  // Phase 2: Letters lock together into "MCH" in center with cyan/teal radiance (1550ms)
  // Phase 3: "HOSPITAL" appears with circular halo pulse & animated underline (2150ms)
  // Phase 4: Soft cinematic flash (2600ms)
  // Phase 5: Smooth medical ice-teal fade (2850ms)
  // onComplete fires at exactly 3000ms (3.0 seconds)
  const [phase, setPhase] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Black Hole & Universe Canvas Animation (Running 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Generate Universe Stars
    const starCount = 180;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      color: string;
    }> = [];

    const starColors = ['#FFFFFF', '#DDF4F4', '#E8F8F8', '#99F6E4', '#BAE6FD'];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 2. Generate Infalling Cosmic Matter Particles for Black Hole
    const particleCount = 75;
    const particles: Array<{
      angle: number;
      distance: number;
      speed: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const particleColors = ['#167C84', '#0F6971', '#22D3EE', '#67E8F9', '#F0FDFA'];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 220 + 70,
        speed: Math.random() * 0.035 + 0.02,
        radius: Math.random() * 2 + 0.8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Universe Background Nebulae
      const grad1 = ctx.createRadialGradient(
        centerX - 80,
        centerY - 60,
        30,
        centerX,
        centerY,
        Math.max(width, height) * 0.6
      );
      grad1.addColorStop(0, 'rgba(15, 105, 113, 0.25)');
      grad1.addColorStop(0.4, 'rgba(12, 39, 48, 0.4)');
      grad1.addColorStop(0.8, 'rgba(5, 8, 13, 0.9)');
      grad1.addColorStop(1, '#020408');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Draw Universe Stars
      for (const star of stars) {
        star.alpha += Math.sin(time * 6 * star.twinkleSpeed) * 0.015;
        const currentAlpha = Math.max(0.15, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw Black Hole Infalling Swirling Particles
      for (const p of particles) {
        p.angle += p.speed;
        p.distance -= 0.65;
        if (p.distance < 45) {
          p.distance = Math.random() * 120 + 170;
          p.angle = Math.random() * Math.PI * 2;
        }

        const px = centerX + Math.cos(p.angle) * p.distance;
        const py = centerY + Math.sin(p.angle) * (p.distance * 0.38);

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Exactly 3-Second Sequence
  useEffect(() => {
    // 0 -> 1: At 950ms, letters emerge
    const t1 = setTimeout(() => setPhase(1), 950);
    // 1 -> 2: At 1550ms, MCH combine in center
    const t2 = setTimeout(() => setPhase(2), 1550);
    // 2 -> 3: At 2150ms, HOSPITAL appears with underline
    const t3 = setTimeout(() => setPhase(3), 2150);
    // 3 -> 4: At 2600ms, Soft cinematic flash
    const t4 = setTimeout(() => setPhase(4), 2600);
    // 4 -> 5: At 2850ms, Fade into main app
    const t5 = setTimeout(() => setPhase(5), 2850);
    // Complete callback at exactly 3000ms (3.0 seconds)
    const t6 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-colors select-none ${
        phase >= 5
          ? 'bg-[#F6FCFC] pointer-events-none opacity-0'
          : phase >= 4
          ? 'bg-[#E8F8F8]'
          : 'bg-[#020408]'
      }`}
      style={{
        transition: 'background-color 550ms ease, opacity 500ms ease',
      }}
    >
      {/* 1. Deep Space Universe & Particle Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-600 ${
          phase >= 5 ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 2. MESMERIZING BLACK HOLE CENTER ANIMATION */}
      <div
        className={`absolute z-10 pointer-events-none flex items-center justify-center transition-all duration-600 ${
          phase >= 4
            ? 'opacity-0 scale-150'
            : phase >= 2
            ? 'opacity-35 scale-110'
            : 'opacity-100 scale-100'
        }`}
      >
        {/* Outer Gravitational Lensing Halo */}
        <div
          className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full animate-lensing-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(22, 124, 132, 0.28) 35%, rgba(15, 105, 113, 0.15) 60%, transparent 75%)',
          }}
        />

        {/* Tilted Swirling Accretion Disk (Upper Gravitational Arc) */}
        <div
          className="absolute w-[360px] h-[140px] sm:w-[500px] sm:h-[190px] rounded-[50%] animate-accretion-spin"
          style={{
            border: '4px solid rgba(22, 124, 132, 0.8)',
            boxShadow:
              '0 0 40px 10px rgba(34, 211, 238, 0.85), inset 0 0 35px 8px rgba(221, 244, 244, 0.65)',
            filter: 'blur(1.5px)',
            transform: 'rotate(-18deg) scaleY(0.42)',
          }}
        />

        {/* Counter-rotating Inner Accretion Layer */}
        <div
          className="absolute w-[310px] h-[115px] sm:w-[430px] sm:h-[155px] rounded-[50%] animate-accretion-spin-reverse"
          style={{
            border: '3px solid rgba(221, 244, 244, 0.9)',
            boxShadow: '0 0 25px 6px rgba(15, 105, 113, 0.95)',
            filter: 'blur(1px)',
            transform: 'rotate(-18deg) scaleY(0.42)',
          }}
        />

        {/* Relativistic Photon Ring (Glowing Rim) */}
        <div
          className="absolute w-[116px] h-[116px] sm:w-[150px] sm:h-[150px] rounded-full animate-photon-ring"
          style={{
            border: '3px solid #E8F8F8',
            boxShadow:
              '0 0 25px 6px #22D3EE, 0 0 45px 12px #167C84, inset 0 0 15px 4px #FFFFFF',
          }}
        />

        {/* Black Hole Pitch-Black Event Horizon (Singularity Core) */}
        <div
          className="relative w-[110px] h-[110px] sm:w-[142px] sm:h-[142px] rounded-full bg-black z-20 shadow-2xl flex items-center justify-center"
          style={{
            boxShadow:
              'inset 0 0 25px 8px rgba(0, 0, 0, 1), 0 0 12px 2px rgba(0, 0, 0, 0.95)',
          }}
        >
          <div className="w-16 h-16 rounded-full bg-black" />
        </div>
      </div>

      {/* Circular light pulse animation for Hospital emergence */}
      {phase >= 3 && (
        <div
          className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-15"
          style={{
            background:
              'radial-gradient(circle, rgba(22, 124, 132, 0.35) 0%, rgba(221, 244, 244, 0.1) 50%, transparent 70%)',
            animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      )}

      {/* Soft Cinematic Flash Effect */}
      {phase === 4 && (
        <div className="absolute inset-0 bg-white/85 animate-soft-flash pointer-events-none z-40" />
      )}

      {/* 3. Center Cinematic Letters Container */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-4">
        {/* Letters container */}
        <div className="flex items-center justify-center font-heading font-extrabold tracking-tight text-6xl sm:text-7xl md:text-8xl select-none">
          {/* Letter M - Sweeps from Left with motion blur */}
          <div
            className={`inline-block transition-all duration-500 ${
              phase === 0
                ? 'opacity-0 -translate-x-36 blur-md'
                : phase === 1
                ? 'opacity-90 -translate-x-3 blur-xs'
                : 'opacity-100 translate-x-0 blur-0'
            }`}
            style={{
              color: phase >= 4 ? '#0F6971' : '#FFFFFF',
              textShadow:
                phase >= 2
                  ? '0 0 30px rgba(34, 211, 238, 0.9), 0 0 60px rgba(22, 124, 132, 0.6)'
                  : 'none',
            }}
          >
            M
          </div>

          {/* Letter C - Surges from Bottom with vertical motion blur */}
          <div
            className={`inline-block transition-all duration-500 ${
              phase === 0
                ? 'opacity-0 translate-y-28 blur-md'
                : phase === 1
                ? 'opacity-90 translate-y-3 blur-xs'
                : 'opacity-100 translate-y-0 blur-0'
            }`}
            style={{
              color: phase >= 4 ? '#167C84' : '#E8F8F8',
              textShadow:
                phase >= 2
                  ? '0 0 30px rgba(34, 211, 238, 0.9), 0 0 60px rgba(22, 124, 132, 0.6)'
                  : 'none',
              margin: '0 3px',
            }}
          >
            C
          </div>

          {/* Letter H - Sweeps from Right with motion blur */}
          <div
            className={`inline-block transition-all duration-500 ${
              phase === 0
                ? 'opacity-0 translate-x-36 blur-md'
                : phase === 1
                ? 'opacity-90 translate-x-3 blur-xs'
                : 'opacity-100 translate-x-0 blur-0'
            }`}
            style={{
              color: phase >= 4 ? '#0F6971' : '#FFFFFF',
              textShadow:
                phase >= 2
                  ? '0 0 30px rgba(34, 211, 238, 0.9), 0 0 60px rgba(22, 124, 132, 0.6)'
                  : 'none',
            }}
          >
            H
          </div>
        </div>

        {/* Animated Underline */}
        <div
          className={`h-1.5 rounded-full transition-all duration-600 mt-2.5 ${
            phase >= 3 ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{
            background:
              phase >= 4
                ? 'linear-gradient(90deg, #167C84, #0F6971)'
                : 'linear-gradient(90deg, transparent, #22D3EE, #167C84, transparent)',
            boxShadow: '0 0 16px rgba(34, 211, 238, 0.8)',
          }}
        />

        {/* Word "HOSPITAL" */}
        <div
          className={`transition-all duration-500 mt-3 tracking-[0.38em] uppercase font-semibold text-xs sm:text-sm md:text-base ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            color: phase >= 4 ? '#0F6971' : '#DDF4F4',
            letterSpacing: '0.45em',
            textShadow: phase >= 3 ? '0 0 20px rgba(34, 211, 238, 0.6)' : 'none',
          }}
        >
          HOSPITAL
        </div>

        {/* Medical care tagline */}
        <div
          className={`transition-all duration-500 mt-2 text-xs tracking-wider font-medium ${
            phase >= 3 ? 'opacity-85' : 'opacity-0'
          }`}
          style={{ color: phase >= 4 ? '#167C84' : '#94A3B8' }}
        >
          PATIENT CARE & REWARD PLATFORM
        </div>
      </div>
    </div>
  );
};
