import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  speed: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  pulseVal: number;
}

interface WaterSurface3DProps {
  active?: boolean;
  interactive?: boolean;
}

export const WaterSurface3D: React.FC<WaterSurface3DProps> = ({ active = true, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
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

    // Collection of active 3D ripples
    const ripples: Ripple[] = [];
    const maxRipples = 18;

    // Floating 3D liquid droplets
    const particleCount = 35;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.35 + Math.random() * 0.65, // 3D depth layer
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.6,
        radius: 2 + Math.random() * 3.5,
        alpha: 0.25 + Math.random() * 0.45,
        pulseSpeed: 0.02 + Math.random() * 0.035,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    let lastMouseX = -1;
    let lastMouseY = -1;
    let lastTime = 0;

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!interactive) return;
      const now = performance.now();
      if (now - lastTime < 75) return; // Responsive throttle
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dist = Math.hypot(x - lastMouseX, y - lastMouseY);
      if (dist > 28 && ripples.length < maxRipples) {
        ripples.push({
          x,
          y,
          radius: 3,
          maxRadius: 130 + Math.random() * 50,
          amplitude: 1.5,
          speed: 2.2,
          alpha: 0.7,
        });
        lastMouseX = x;
        lastMouseY = y;
      }
    };

    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Click burst: spawn 2 concentric rings for strong 3D water impact
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 180,
        amplitude: 2.5,
        speed: 2.6,
        alpha: 0.9,
      });
      ripples.push({
        x,
        y,
        radius: 1,
        maxRadius: 110,
        amplitude: 1.8,
        speed: 1.7,
        alpha: 0.75,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let t = 0;
    const render = () => {
      t += 0.018;
      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: Subtle Organic 3D Water Wave Gradient (Tripura Rudrasagar Lake Caustics) ---
      const waveGrad = ctx.createLinearGradient(0, 0, width, height);
      if (isDark) {
        waveGrad.addColorStop(0, 'rgba(8, 47, 73, 0.08)');
        waveGrad.addColorStop(0.5, 'rgba(12, 74, 110, 0.04)');
        waveGrad.addColorStop(1, 'rgba(2, 6, 23, 0.1)');
      } else {
        waveGrad.addColorStop(0, 'rgba(224, 242, 254, 0.15)');
        waveGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.08)');
        waveGrad.addColorStop(1, 'rgba(240, 249, 255, 0.18)');
      }
      ctx.fillStyle = waveGrad;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 2: 3D Sinusoidal Caustic Bands ---
      ctx.save();
      const causticBands = 3;
      for (let b = 0; b < causticBands; b++) {
        ctx.beginPath();
        const baseOffset = (b + 1) * (height / (causticBands + 1));
        const freq = 0.0028 + b * 0.0012;
        const speed = t * (0.9 + b * 0.35);

        ctx.moveTo(0, baseOffset);
        for (let x = 0; x <= width; x += 25) {
          const wave1 = Math.sin(x * freq + speed) * (18 + b * 8);
          const wave2 = Math.cos(x * 0.0045 - speed * 0.8) * (10 + b * 4);
          ctx.lineTo(x, baseOffset + wave1 + wave2);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const bandColor = isDark
          ? `rgba(56, 189, 248, ${0.025 + b * 0.015})`
          : `rgba(14, 165, 233, ${0.035 + b * 0.02})`;
        ctx.fillStyle = bandColor;
        ctx.fill();
      }
      ctx.restore();

      // --- LAYER 3: Interactive 3D Water Ripples (Clearly Colored & Crisp in Both Modes) ---
      if (ripples.length > 0) {
        ctx.save();
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed;
          r.alpha *= 0.965;

          if (r.radius >= r.maxRadius || r.alpha < 0.01) {
            ripples.splice(i, 1);
            continue;
          }

          const progress = r.radius / r.maxRadius;
          const currentAlpha = Math.min(1, r.alpha * (1 - progress * 0.5));

          // 1. Outer refraction ring (Bright & Crisp in Light & Dark Mode)
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(1.2, 3.2 * (1 - progress));
          ctx.strokeStyle = isDark
            ? `rgba(125, 211, 252, ${currentAlpha * 0.95})`
            : `rgba(2, 132, 199, ${currentAlpha * 0.85})`;
          ctx.stroke();

          // 2. Sunlight specular glint on the wave crest
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 1.5, Math.PI * 1.1, Math.PI * 1.6);
          ctx.lineWidth = Math.max(1, 2.5 * (1 - progress));
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha * 0.9})`
            : `rgba(255, 255, 255, ${currentAlpha * 0.95})`;
          ctx.stroke();

          // 3. Inner caustic refraction ring
          if (r.radius > 16) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, Math.max(2, r.radius - 14), 0, Math.PI * 2);
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${currentAlpha * 0.5})`
              : `rgba(14, 165, 233, ${currentAlpha * 0.45})`;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // --- LAYER 4: Floating 3D Hydro Droplets & Light Caustics ---
      ctx.save();
      for (let p of particles) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const dynamicAlpha = p.alpha * (0.75 + 0.25 * Math.sin(p.pulseVal));
        const dynamicRadius = p.radius * p.z;

        const grad = ctx.createRadialGradient(
          p.x - dynamicRadius * 0.3,
          p.y - dynamicRadius * 0.3,
          dynamicRadius * 0.1,
          p.x,
          p.y,
          dynamicRadius
        );

        if (isDark) {
          grad.addColorStop(0, `rgba(224, 242, 254, ${dynamicAlpha * 1.6})`);
          grad.addColorStop(0.4, `rgba(56, 189, 248, ${dynamicAlpha * 0.9})`);
          grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${dynamicAlpha * 1.8})`);
          grad.addColorStop(0.35, `rgba(186, 230, 253, ${dynamicAlpha * 1.1})`);
          grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isDark, isReducedMotion, active, interactive]);

  if (isReducedMotion || !active) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-1 transition-opacity duration-700"
      style={{ opacity: isDark ? 0.95 : 1 }}
    />
  );
};
