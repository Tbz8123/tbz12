// 3D Theme Constants
// Revolutionary 3D Animation System Configuration

export const THEME_COLORS = {
  // Primary Gradients
  primary: {
    purple: '#9333ea',
    blue: '#3b82f6',
    pink: '#ec4899',
    yellow: '#f59e0b',
    orange: '#f97316',
  },

  // Gradient Combinations
  gradients: {
    purpleBlue: 'linear-gradient(to right, #9333ea, #3b82f6)',
    purplePinkBlue: 'linear-gradient(to right, #9333ea, #ec4899, #3b82f6)',
    yellowOrange: 'linear-gradient(to right, #f59e0b, #f97316)',
    holographic: 'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
    morphing: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  },

  // Background Colors
  backgrounds: {
    dark: 'from-slate-900 via-purple-900 to-slate-900',
    glass: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(147, 51, 234, 0.1)',
  },

  // Shadow Colors
  shadows: {
    purple: 'rgba(147, 51, 234, 0.3)',
    blue: 'rgba(59, 130, 246, 0.3)',
    glow: 'rgba(147, 51, 234, 0.5)',
  }
} as const;

export const ANIMATION_CONFIG = {
  // Duration Settings
  durations: {
    fast: 0.3,
    medium: 0.8,
    slow: 1.2,
    particle: 2,
    holographic: 4,
    morphing: 3,
  },

  // Spring Settings
  spring: {
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  // Easing Functions
  easing: {
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    linear: 'linear',
    spring: 'spring',
  },

  // 3D Transform Settings
  transforms: {
    perspective: '1000px',
    rotateRange: [-30, 30],
    scaleHover: 1.05,
    scalePress: 0.95,
  },

  // Particle Settings
  particles: {
    home: { count: 50, speed: 0.5 },
    header: { count: 15, speed: 0.3 },
    footer: { count: 25, speed: 0.4 },
    burst: { count: 20, duration: 1 },
  },

  // Scroll Effects
  scroll: {
    parallaxStrength: 0.5,
    fadeStart: 0.3,
    fadeEnd: 0.7,
  }
} as const;

export const GLASSMORPHISM = {
  backdrop: 'backdrop-blur-xl',
  background: 'bg-white/10',
  border: 'border border-purple-500/30',
  shadow: 'shadow-2xl',
} as const;

export const PARTICLE_STYLES = {
  base: 'absolute rounded-full pointer-events-none',
  gradient: 'bg-gradient-to-r from-purple-400 to-blue-400',
  animation: 'animate-pulse',
  glow: (size: number) => `box-shadow: 0 0 ${size * 2}px rgba(147, 51, 234, 0.3)`,
} as const; 

