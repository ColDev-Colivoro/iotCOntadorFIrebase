
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface FireEffectProps {
  active: boolean;
  particleCount?: number;
}

export function FireEffect({ active, particleCount = 50 }: FireEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const initialParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // as a percentage of width
      y: 100 + Math.random() * 10, // start just below the viewport
      size: Math.random() * 5 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      vx: Math.random() - 0.5,
      vy: -(Math.random() * 1.5 + 0.5),
    }));
    setParticles(initialParticles);

    let animationFrameId: number;

    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newY = p.y + p.vy;
          let newX = p.x + p.vx;
          let newOpacity = p.opacity - 0.01;

          // Reset particle when it goes off-screen or fades
          if (newY < -10 || newOpacity <= 0) {
            return {
              ...p,
              y: 100 + Math.random() * 10,
              x: Math.random() * 100,
              opacity: Math.random() * 0.5 + 0.2,
              vy: -(Math.random() * 1.5 + 0.5),
            };
          }

          return { ...p, y: newY, x: newX, opacity: newOpacity };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [active, particleCount]);

  if (!active) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg width="100%" height="100%" className="absolute bottom-0 left-0">
        <defs>
          <radialGradient id="fireGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {particles.map(p => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="url(#fireGradient)"
            opacity={p.opacity}
            className="transition-transform"
          />
        ))}
      </svg>
    </div>
  );
}
