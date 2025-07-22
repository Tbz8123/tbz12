import React, { useState } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

interface DesignPanelProps {
  onClose: () => void;
}

const DesignPanel: React.FC<DesignPanelProps> = ({ onClose }) => {
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const [fontSize, setFontSize] = useState('normal');

  const recommendedColors = [
    '#8B5CF6', // Purple (selected)
    '#1E40AF', // Blue
    '#DB2777', // Pink
    '#DC2626', // Red
    '#EA580C', // Orange
    '#CA8A04', // Yellow
    '#16A34A', // Green
    '#6B7280', // Gray
    '#000000', // Black
    '#7C3AED', // Violet
  ];

  const fontSizes = [
    { id: 'small', label: 'A Small', size: 'text-xs' },
    { id: 'normal', label: 'A Normal', size: 'text-sm' },
    { id: 'large', label: 'A Large', size: 'text-base' },
  ];

  const CustomSlider = ({ value = 50, label }: { value?: number; label: string }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="h-1 bg-gray-600 rounded-full">
          <div className="h-1 bg-purple-500 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <div 
          className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-pointer hover:border-purple-400 transition-colors" 
          style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#2A2D3E] text-white w-96 h-full flex flex-col border-r border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-white">Design & formatting</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Colors Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Colors</h3>
          <div className="space-y-3">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Recommended colors</div>
            <div className="flex items-center gap-2 flex-wrap">
              {recommendedColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-white shadow-lg' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              See all <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Font Style Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Font style</h3>
          <div className="bg-[#1E2139] p-1 rounded-lg grid grid-cols-3 gap-1">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id)}
                className={`py-3 px-3 rounded-md text-center transition-all duration-200 ${
                  fontSize === size.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className={`${size.size} font-medium`}>A</div>
                <div className="text-xs mt-1">{size.id}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Font</h3>
          <div className="relative">
            <select className="w-full p-3 bg-[#1E2139] border border-gray-600/50 rounded-lg text-white appearance-none cursor-pointer hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors">
              <option value="century-gothic">Century Gothic</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="arial">Arial</option>
              <option value="helvetica">Helvetica</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Spacing Controls */}
        <div className="space-y-6">
          <CustomSlider value={60} label="Section spacing" />
          <CustomSlider value={45} label="Paragraph spacing" />
          <CustomSlider value={55} label="Line spacing" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-gray-700/50 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RotateCcw size={14} />
          Reset to default
        </button>
        <button className="bg-[#1E2139] hover:bg-purple-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Advanced
        </button>
      </div>
    </div>
  );
};

export default DesignPanel; 