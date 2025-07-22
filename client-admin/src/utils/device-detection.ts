
interface OptimizationRule {
  key: string;
  priority: number;
  description: string;
}

export function getOptimizationPriority(): OptimizationRule[] {
  return [
    {
      key: 'reducedMotion',
      priority: 1,
      description: 'Reduce animations and transitions',
    },
    {
      key: 'simplifiedGraphics',
      priority: 2,
      description: 'Use simpler visual effects',
    },
    {
      key: 'lowMemoryMode',
      priority: 3,
      description: 'Optimize memory usage',
    },
    {
      key: 'reducedAnimations',
      priority: 4,
      description: 'Minimize animation complexity',
    },
  ];
}

export function detectDevice() {
  const userAgent = navigator.userAgent;
  const width = window.innerWidth;
  
  console.log('[Device Detection] User Agent:', userAgent);
  console.log('[Device Detection] Screen:', `${width}x${window.innerHeight}`);
  
  if (width <= 768) {
    console.log('[Device Detection] Mobile Device Detected');
    return 'mobile';
  } else if (width <= 1024) {
    console.log('[Device Detection] Tablet Device Detected');
    return 'tablet';
  } else {
    console.log('[Device Detection] Desktop Device Detected');
    return 'desktop';
  }
}

export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function shouldUseCompatibilityMode(): boolean {
  return isIOS() || isSafari();
}
