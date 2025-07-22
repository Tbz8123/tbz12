import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, GraduationCap } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { Button } from '@/components/ui/button';

interface ProPreviewProps {
  onOpenModal: () => void;
}

const ProPreview: React.FC<ProPreviewProps> = ({ onOpenModal }) => {
  const {
    resumeData,
    proTemplates,
    isLoadingProTemplates,
    activeProTemplateId,
    getProTemplateById,
  } = useResume();

  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Real-time preview scale calculation
  useEffect(() => {
    const computeScale = () => {
      if (previewContainerRef.current) {
        const availableWidth = previewContainerRef.current.offsetWidth;
        // Template is designed at 800-px width
        const scale = Math.min(1, availableWidth / 800);
        setPreviewScale(scale);
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  const activeTemplate = getProTemplateById ? getProTemplateById(activeProTemplateId) : null;
  const templateCode = activeTemplate?.code || '';

  // Debug logging
  console.log('[ProPreview] activeProTemplateId:', activeProTemplateId);
  console.log('[ProPreview] activeTemplate:', activeTemplate);
  console.log('[ProPreview] templateCode length:', templateCode.length);
  console.log('[ProPreview] templateCode preview:', templateCode.substring(0, 100) + '...');

  // Scope for Pro templates
  const proTemplateScope = {
    React,
    userData: resumeData,
    resumeData,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    motion,
    render: (ui: React.ReactNode) => ui,
    customColors: resumeData.customization?.colors || {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#60a5fa',
      text: '#111827',
      background: '#ffffff',
      sidebarText: '#ffffff',
      sidebarBackground: '#333333'
    }
  };

  return (
    <div className="sticky top-32">
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-transparent rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          boxShadow: '0 20px 40px -10px rgba(147, 51, 234, 0.15)',
        }}
      >
        {/* Preview Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white/90">Live Preview</span>
              <div className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium">Pro</div>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Preview viewport */}
        <div
          ref={previewContainerRef}
          className="mx-auto relative w-full"
          style={{
            height: `${(1131 * previewScale) - 4}px`,
            overflow: 'hidden',
          }}
        >
          <div
            className="relative"
            style={{
              width: '800px',
              height: '1131px',
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {isLoadingProTemplates ? (
              <div className="text-white flex items-center justify-center h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400 animate-spin" />
                  <p className="text-sm text-white/70">Loading Templates...</p>
                </div>
              </div>
            ) : !activeProTemplateId ? (
              <div className="text-white flex items-center justify-center h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="text-center">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm text-white/70">Select a Pro Template</p>
                </div>
              </div>
            ) : !templateCode ? (
              <div className="text-white flex items-center justify-center h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="text-center">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm text-white/70">No Template Code Available</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white overflow-hidden">
                <LiveProvider code={templateCode} scope={proTemplateScope} noInline={true}>
                  <div className="w-full h-full">
                    <LivePreview className="w-full h-full" />
                  </div>
                  <LiveError className="text-red-600 bg-red-100 p-2 text-xs" />
                </LiveProvider>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex items-center justify-between gap-3 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onOpenModal}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 flex-1"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Full Preview
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default ProPreview;
