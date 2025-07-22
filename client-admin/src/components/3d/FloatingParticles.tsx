import React, { useRef, useEffect } from 'react';
import { ANIMATION_CONFIG, PARTICLE_STYLES } from './constants';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingParticles = ({
  count = ANIMATION_CONFIG.particles.home.count,
  className = ''
}: FloatingParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * ANIMATION_CONFIG.particles.home.speed,
      vy: (Math.random() - 0.5) * ANIMATION_CONFIG.particles.home.speed,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.2,
      hue: 200 + Math.random() * 60,
    }));

    let animationFrame: number;

    const animate = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.vy *= -1;
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
        particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = particles
          .map(p => `
            <div 
              class="${PARTICLE_STYLES.base}" 
              style="
                left: ${p.x}px; 
                top: ${p.y}px; 
                width: ${p.size}px; 
                height: ${p.size}px; 
                background: hsla(${p.hue}, 50%, 60%, ${p.opacity});
                box-shadow: 0 0 ${p.size * 2}px hsla(${p.hue}, 50%, 60%, 0.3);
              "
            ></div>
          `)
          .join('');
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [count]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}; 

