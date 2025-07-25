
import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  memory: number;
  hardwareConcurrency: number;
  connection?: {
    effectiveType: string;
    downlink: number;
  };
}

interface PerformanceSettings {
  reducedMotion: boolean;
  simplifiedGraphics: boolean;
  lowMemoryMode: boolean;
  reducedAnimations: boolean;
}

export function usePerformance() {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>({
    reducedMotion: false,
    simplifiedGraphics: false,
    lowMemoryMode: false,
    reducedAnimations: false,
  });
  const [performanceScore, setPerformanceScore] = useState(100);
  const [forceMobileMode, setForceMobileMode] = useState(false);

  useEffect(() => {
    const capabilities: DeviceCapabilities = {
      memory: (navigator as any).deviceMemory || 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
      } : undefined,
    };
    
    setDeviceCapabilities(capabilities);
    
    // Calculate performance score based on capabilities
    let score = 100;
    if (capabilities.memory < 4) score -= 20;
    if (capabilities.hardwareConcurrency < 4) score -= 15;
    if (capabilities.connection?.effectiveType === '3g') score -= 25;
    
    setPerformanceScore(Math.max(score, 0));
    
    // Auto-enable optimizations for low-end devices
    if (score < 60) {
      setPerformanceSettings({
        reducedMotion: true,
        simplifiedGraphics: true,
        lowMemoryMode: true,
        reducedAnimations: true,
      });
    }
  }, []);

  return {
    deviceCapabilities,
    performanceSettings,
    performanceScore,
    forceMobileMode,
    setForceMobileMode,
  };
}

export function usePerformanceCSS() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mobileOptimizationClasses, setMobileOptimizationClasses] = useState('');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width <= 768;
      const tablet = width > 768 && width <= 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      let classes = '';
      if (mobile) classes += 'mobile-optimized ';
      if (tablet) classes += 'tablet-optimized ';
      
      setMobileOptimizationClasses(classes.trim());
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { mobileOptimizationClasses, isMobile, isTablet };
}
