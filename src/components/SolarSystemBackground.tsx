import React, { useEffect, useRef } from 'react';

export const SolarSystemBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Planetary definitions with real relative aesthetics, sizes, and slow speeds ("dhire dhire")
    // Speed factor is intentionally very slow (0.0003 - 0.0035) so it creates a relaxing, majestic ambient motion
    const planets = [
      {
        name: 'Mercury',
        orbitRadiusX: 75,
        orbitRadiusY: 55,
        size: 3.5,
        color: '#94A3B8',
        glowColor: 'rgba(148, 163, 184, 0.4)',
        speed: 0.0032,
        angle: 0.8,
      },
      {
        name: 'Venus',
        orbitRadiusX: 115,
        orbitRadiusY: 82,
        size: 5,
        color: '#FBBF24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        speed: 0.0022,
        angle: 2.1,
      },
      {
        name: 'Earth',
        orbitRadiusX: 165,
        orbitRadiusY: 118,
        size: 5.5,
        color: '#0EA5E9',
        glowColor: 'rgba(14, 165, 233, 0.45)',
        speed: 0.0016,
        angle: 3.9,
        hasMoon: true,
        moonDistance: 12,
        moonAngle: 0,
        moonSpeed: 0.025,
      },
      {
        name: 'Mars',
        orbitRadiusX: 215,
        orbitRadiusY: 152,
        size: 4.2,
        color: '#F87171',
        glowColor: 'rgba(248, 113, 113, 0.4)',
        speed: 0.0012,
        angle: 5.2,
      },
      {
        name: 'Jupiter',
        orbitRadiusX: 290,
        orbitRadiusY: 205,
        size: 11,
        color: '#D97706',
        glowColor: 'rgba(217, 119, 6, 0.4)',
        speed: 0.0007,
        angle: 1.4,
      },
      {
        name: 'Saturn',
        orbitRadiusX: 375,
        orbitRadiusY: 260,
        size: 9,
        color: '#F59E0B',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        speed: 0.00045,
        angle: 4.1,
        hasRings: true,
      },
      {
        name: 'Uranus',
        orbitRadiusX: 450,
        orbitRadiusY: 310,
        size: 6.5,
        color: '#2DD4BF',
        glowColor: 'rgba(45, 212, 191, 0.35)',
        speed: 0.00032,
        angle: 2.8,
      },
      {
        name: 'Neptune',
        orbitRadiusX: 520,
        orbitRadiusY: 360,
        size: 6.2,
        color: '#6366F1',
        glowColor: 'rgba(99, 102, 241, 0.35)',
        speed: 0.00022,
        angle: 0.3,
      },
    ];

    // Asteroids in belt between Mars and Jupiter
    const asteroidCount = 45;
    const asteroids: Array<{
      distX: number;
      distY: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < asteroidCount; i++) {
      asteroids.push({
        distX: 245 + Math.random() * 20 - 10,
        distY: 172 + Math.random() * 16 - 8,
        angle: Math.random() * Math.PI * 2,
        speed: 0.0009 + (Math.random() - 0.5) * 0.0002,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Center the solar system with a slight tilt or offset for artistic perspective
      const centerX = width > 1024 ? width * 0.5 : width * 0.5;
      const centerY = height > 800 ? height * 0.38 : height * 0.42;

      // Draw Sun Corona Glow (Soft golden-teal aura in harmony with page)
      const sunPulse = Math.sin(time * 0.02) * 2;
      const sunRadius = 18 + sunPulse * 0.5;

      const sunGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        sunRadius * 0.5,
        centerX,
        centerY,
        sunRadius * 4.5
      );
      sunGlow.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      sunGlow.addColorStop(0.35, 'rgba(22, 124, 132, 0.18)');
      sunGlow.addColorStop(0.7, 'rgba(221, 244, 244, 0.08)');
      sunGlow.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun Core Sphere
      const sunCore = ctx.createRadialGradient(
        centerX - 4,
        centerY - 4,
        2,
        centerX,
        centerY,
        sunRadius
      );
      sunCore.addColorStop(0, '#FFFBEB');
      sunCore.addColorStop(0.4, '#FDE047');
      sunCore.addColorStop(0.8, '#F59E0B');
      sunCore.addColorStop(1, '#D97706');

      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunCore;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw faint orbital tracks (concentric ellipses)
      ctx.lineWidth = 1;
      for (const p of planets) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, p.orbitRadiusX, p.orbitRadiusY, -0.05, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(22, 124, 132, 0.12)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw Asteroids between Mars and Jupiter
      for (const a of asteroids) {
        a.angle += a.speed;
        const ax = centerX + Math.cos(a.angle) * a.distX;
        const ay = centerY + Math.sin(a.angle) * a.distY;

        ctx.beginPath();
        ctx.arc(ax, ay, a.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 116, 139, ${a.alpha * 0.6})`;
        ctx.fill();
      }

      // Draw Planets moving slowly in orbits ("dhire dhire")
      for (const p of planets) {
        p.angle += p.speed;

        // Position on tilted ellipse
        const px = centerX + Math.cos(p.angle) * p.orbitRadiusX;
        const py = centerY + Math.sin(p.angle) * p.orbitRadiusY;

        // Subtle glow around planet
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Planet Body
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Special: Earth Moon
        if (p.hasMoon) {
          p.moonAngle = (p.moonAngle || 0) + (p.moonSpeed || 0.02);
          const mx = px + Math.cos(p.moonAngle) * p.moonDistance;
          const my = py + Math.sin(p.moonAngle) * (p.moonDistance * 0.7);

          // Tiny orbit line
          ctx.beginPath();
          ctx.ellipse(px, py, p.moonDistance, p.moonDistance * 0.7, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.stroke();

          // Moon dot
          ctx.beginPath();
          ctx.arc(mx, my, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = '#E2E8F0';
          ctx.fill();
        }

        // Special: Saturn Rings
        if (p.hasRings) {
          ctx.beginPath();
          ctx.ellipse(px, py, p.size * 2.2, p.size * 0.75, -0.4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(px, py, p.size * 2.7, p.size * 0.95, -0.4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      style={{
        opacity: 0.75,
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
