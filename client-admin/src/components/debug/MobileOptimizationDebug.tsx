import React from 'react';
import { usePerformance, usePerformanceCSS } from '@/hooks/use-performance';
import { getOptimizationPriority } from '@/utils/device-detection';

export const MobileOptimizationDebug: React.FC = () => {
  const { deviceCapabilities, performanceSettings, performanceScore, forceMobileMode, setForceMobileMode } = usePerformance();
  const { mobileOptimizationClasses, isMobile, isTablet } = usePerformanceCSS();
  const optimizationPriority = getOptimizationPriority();

  if (!deviceCapabilities) return null;

  const activeOptimizations = optimizationPriority.filter(opt => 
    performanceSettings[opt.key as keyof typeof performanceSettings]
  );

  return (
    <div className="fixed top-20 right-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-sm z-50 font-mono">
      <div className="text-green-400 font-bold mb-2">🔍 Mobile Debug Panel</div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span>Force Mobile Mode:</span>
          <button 
            onClick={() => setForceMobileMode(!forceMobileMode)}
            className={`px-2 py-1 rounded text-xs ${
              forceMobileMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            {forceMobileMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="border-t border-gray-600 pt-1 mt-2">
          <div className="text-yellow-400 text-xs mb-1">Device Info:</div>
          <div>Memory: {deviceCapabilities.memory}GB</div>
          <div>CPU Cores: {deviceCapabilities.hardwareConcurrency}</div>
          <div>Performance: {performanceScore}%</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
          <div>Tablet: {isTablet ? 'Yes' : 'No'}</div>
        </div>

        {activeOptimizations.length > 0 && (
          <div className="border-t border-gray-600 pt-1 mt-2">
            <div className="text-orange-400 text-xs mb-1">Active Optimizations:</div>
            {activeOptimizations.map(opt => (
              <div key={opt.key} className="text-xs">• {opt.description}</div>
            ))}
          </div>
        )}
      </div>
    </div>iv>

        <div>Device: <span className="text-blue-400">{deviceCapabilities.deviceType}{forceMobileMode ? ' (FORCED MOBILE)' : ''}</span></div>
        <div>Score: <span className="text-yellow-400">{performanceScore}</span></div>
        <div>Mobile: <span className={isMobile ? 'text-green-400' : 'text-red-400'}>{isMobile ? 'YES' : 'NO'}</span></div>
        <div>Tablet: <span className={isTablet ? 'text-green-400' : 'text-red-400'}>{isTablet ? 'YES' : 'NO'}</span></div>

        <div className="mt-2 text-orange-400">Active Optimizations ({activeOptimizations.length}/10):</div>
        {activeOptimizations.length > 0 ? (
          <div className="max-h-32 overflow-y-auto">
            {activeOptimizations.map(opt => (
              <div key={opt.key} className="text-green-300">
                #{opt.priority}: {opt.key}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-400">No optimizations active!</div>
        )}

        <div className="mt-2 text-purple-400">CSS Classes:</div>
        <div className="text-xs bg-gray-800 p-1 rounded max-h-20 overflow-y-auto">
          {mobileOptimizationClasses || 'None applied'}
        </div>

        <div className="mt-2 text-cyan-400">Device Info:</div>
        <div className="text-xs">
          {deviceCapabilities.deviceAge} | {deviceCapabilities.memoryLevel}MB | {deviceCapabilities.cpuLevel} CPU
        </div>
      </div>
    </div>
  );
}; 