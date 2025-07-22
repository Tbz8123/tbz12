import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';
import { CheckCircle, LayoutTemplate, Star, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TemplateSwitcher: React.FC = () => {
  const {
    proTemplates,
    activeProTemplateId,
    isLoadingProTemplates,
    resumeData,
  } = useResumeStore();

  const {
    setActiveProTemplateId,
    updateResumeData
  } = useResumeStore((state) => state.actions);

  const [activeTab, setActiveTab] = useState<'templates' | 'colors'>('templates');
  const [customColors, setCustomColors] = useState({
    primary: '#1e40af', // Blue
    secondary: '#3b82f6', // Light Blue
    accent: '#8b5cf6', // Purple
    text: '#111827', // Dark Gray
    background: '#ffffff' // White
  });

  // Initialize colors from resume data
  React.useEffect(() => {
    if (resumeData.customization?.colors) {
      setCustomColors(resumeData.customization.colors);
    }
  }, [resumeData.customization?.colors]);

  const colorPresets = [
    { name: 'Professional Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#8b5cf6', text: '#111827', background: '#ffffff' },
    { name: 'Modern Purple', primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc', text: '#1f2937', background: '#ffffff' },
    { name: 'Corporate Green', primary: '#059669', secondary: '#10b981', accent: '#34d399', text: '#111827', background: '#ffffff' },
    { name: 'Creative Orange', primary: '#ea580c', secondary: '#fb923c', accent: '#fbbf24', text: '#1f2937', background: '#ffffff' },
    { name: 'Elegant Black', primary: '#1f2937', secondary: '#374151', accent: '#6b7280', text: '#111827', background: '#ffffff' },
    { name: 'Warm Red', primary: '#dc2626', secondary: '#ef4444', accent: '#f87171', text: '#1f2937', background: '#ffffff' }
  ];

  const handleColorChange = (colorType: string, color: string) => {
    const newColors = { ...customColors, [colorType]: color };
    setCustomColors(newColors);

    // Update resume data with new colors
    updateResumeData({
      ...resumeData,
      customization: {
        ...resumeData.customization,
        colors: newColors
      }
    });
  };

  const applyPreset = (preset: any) => {
    const newColors = {
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      text: preset.text,
      background: preset.background
    };
    setCustomColors(newColors);
    updateResumeData({
      ...resumeData,
      customization: {
        ...resumeData.customization,
        colors: newColors
      }
    });
  };

  const resetColors = () => {
    const defaultColors = {
      primary: '#1e40af',
      secondary: '#3b82f6', 
      accent: '#8b5cf6',
      text: '#111827',
      background: '#ffffff'
    };
    setCustomColors(defaultColors);
    updateResumeData({
      ...resumeData,
      customization: {
        ...resumeData.customization,
        colors: defaultColors
      }
    });
  };

  // Function to get the correct thumbnail URL based on displayMode and available fields
  const getThumbnailUrl = (template: any) => {
    if (template.displayMode === 'uploaded_image' && template.uploadedImageUrl) {
      return template.uploadedImageUrl;
    }
    if (template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl) {
      return template.enhanced3DThumbnailUrl;
    }
    return template.thumbnailUrl;
  };

  return (
    <motion.div 
      className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col h-full"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-4 p-1 bg-white/10 rounded-lg">
        <button
          onClick={() => setActiveTab('templates')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'templates' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          )}
        >
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'colors' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          )}
        >
          <Palette className="h-4 w-4" />
          Colors
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-3">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Star className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Pro Templates</h3>
          </div>

          {isLoadingProTemplates && (
            <div className="text-center text-gray-400 py-10">Loading Templates...</div>
          )}
          {!isLoadingProTemplates && proTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              onClick={() => setActiveProTemplateId(template.id)}
              className={cn(
                'relative w-full aspect-[8.5/11] rounded-lg cursor-pointer transition-all duration-300 group overflow-hidden',
                'border-2',
                activeProTemplateId === template.id ? 'border-purple-500' : 'border-transparent hover:border-white/20'
              )}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Elegant Glow for selected item */}
              {activeProTemplateId === template.id && (
                <div className="absolute inset-0 rounded-lg bg-purple-500/20 blur-lg animate-pulse" />
              )}
              <img 
                src={getThumbnailUrl(template) || '/placeholder.png'}
                alt={template.name}
                className="w-full h-full object-cover rounded-md relative z-10"
              />
              {/* Gradient for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-20" />
              <p className="absolute bottom-2 left-3 right-3 text-sm text-white font-bold truncate z-30">{template.name}</p>

              {activeProTemplateId === template.id && (
                <motion.div 
                  className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white border-2 border-slate-800 z-30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Palette className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Color Themes</h3>
          </div>

          {/* Color Presets */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Quick Presets</h4>
            <div className="grid grid-cols-1 gap-2">
              {colorPresets.map((preset, index) => (
                <motion.button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white text-sm font-medium">{preset.name}</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }}></div>
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }}></div>
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }}></div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Custom Colors</h4>
              <Button
                onClick={resetColors}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-1"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {Object.entries(customColors).map(([colorType, color]) => (
                <div key={colorType} className="flex items-center justify-between">
                  <label className="text-sm text-gray-300 capitalize font-medium">
                    {colorType === 'primary' ? 'Primary' : 
                     colorType === 'secondary' ? 'Secondary' :
                     colorType === 'accent' ? 'Accent' :
                     colorType === 'text' ? 'Text' : 'Background'}
                  </label>
                  <div className="flex items-center gap-2 relative">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer relative"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(colorType, e.target.value)}
                        className="w-full h-full rounded-lg border-0 cursor-pointer opacity-0 absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview Indicator */}
          <div className="mt-auto p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium">Live Preview Active</span>
            </div>
            <p className="text-green-200/80 text-xs mt-1">
              Colors update in real-time as you make changes
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TemplateSwitcher;