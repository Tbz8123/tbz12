
import React from 'react';
import { usePerformance, usePerformanceCSS } from '@/hooks/use-performance';
import { Smartphone, Zap, Battery } from 'lucide-react';

export const MobileOptimizationIndicator: React.FC = () => {
  const { 
    performanceSettings, 
    isVeryLowPowerDevice, 
    isThermalThrottling,
    batteryOptimizationActive 
  } = usePerformance();

  const {
    isMobile,
    isTablet,
    isLowPower,
    performanceScore,
  } = usePerformanceCSS();

  // Only show indicator if optimizations are active
  const hasActiveOptimizations = performanceSettings.lowGraphicsMode || 
                                 performanceSettings.veryLowGraphicsMode ||
                                 batteryOptimizationActive ||
                                 isThermalThrottling;

  if (!hasActiveOptimizations) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-40 flex items-center gap-2">
      {isMobile && <Smartphone className="w-3 h-3 text-blue-400" />}
      {batteryOptimizationActive && <Battery className="w-3 h-3 text-green-400" />}
      {(isLowPower || isThermalThrottling) && <Zap className="w-3 h-3 text-yellow-400" />}
      <span className="text-xs">
        Optimized ({performanceScore})
      </span>
    </div>
  );
};
