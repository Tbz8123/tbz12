import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FinalPagePreview from '@/components/final-page/FinalPagePreview';
import ExportOptions from '@/components/final-page/ExportOptions';
import TemplateSwitcher from '@/components/final-page/TemplateSwitcher';
import ProgressStepper from '@/components/ProgressStepper';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';
import { useResumeStore } from '@/stores/resumeStore';

const FinalPage: React.FC = () => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Get resume data and template from context
  const resumeData = useResumeStore((state) => state.resumeData);
  const activeProTemplateId = useResumeStore((state) => state.activeProTemplateId);
  const getProTemplateById = useResumeStore((state) => state.getProTemplateById);
  const activeTemplate = activeProTemplateId && getProTemplateById ? getProTemplateById(activeProTemplateId) : null;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && previewWrapperRef.current && !previewWrapperRef.current.contains(event.target as Node)) {
        const sidebar = document.querySelector('[data-sidebar="true"]');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Add CSS to hide EditableSection buttons but allow JavaScript buttons */}
      <style>{`
        /* Hide EditableSection buttons specifically (these have specific class patterns) */
        .group .absolute.top-2.right-2,
        .group .absolute.top-1.right-1,
        .group .absolute.top-0.right-0,
        [data-editable-section] .absolute.top-2.right-2,
        [data-editable-section] .absolute.top-1.right-1 {
          display: none !important;
        }

        /* Ensure JavaScript-injected buttons work properly */
        .action-overlay {
          pointer-events: none;
        }

        .action-overlay .action-bar {
          pointer-events: auto;
        }

        .action-bar button {
          pointer-events: auto !important;
        }

        /* Hide EditableSection hover effects but keep JavaScript hover effects */
        .group:hover .absolute.top-2.right-2,
        .group:hover .absolute.top-1.right-1 {
          display: none !important;
        }
      `}</style>

      <div className="h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] text-white font-sans overflow-hidden pt-20 relative">
        {/* Progress Stepper - Fixed at top */}
        <div className="absolute top-20 left-0 right-0 z-50 px-4 py-3">
          <ProgressStepper currentStep={6} />
        </div>

      <div className="fixed inset-0 opacity-5 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(147,51,234,0.03)_50%,transparent_65%)]"></div>
      </div>

        {/* Fixed Left Sidebar - Template Switcher with Color Customization */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-40 bottom-0 w-72 z-20 p-3"
              data-sidebar="true"
            >
              <TemplateSwitcher />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        <div className={`fixed top-44 z-30 transition-all duration-300 ${isSidebarOpen ? 'left-[18rem]' : 'left-4'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
          >
            {isSidebarOpen ? <PanelLeft /> : <PanelRight />}
          </Button>
        </div>

        {/* Main Content Area */}
        <div 
          className={`h-full relative z-10 transition-all duration-300 pt-20 ${
            isSidebarOpen ? 'ml-72' : 'ml-0'
          }`}
        >
          <div className="flex h-full p-4 md:p-6 overflow-x-hidden">
            {/* Center Column: Resume Preview */}
            <div className="flex-1 h-full flex justify-center items-start min-w-0 overflow-x-hidden">
              <div ref={previewWrapperRef} className="w-full max-w-[900px] h-full flex items-start justify-center overflow-y-auto overflow-x-hidden">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="w-full max-w-[850px]"
                  style={{ 
                    transform: 'scale(0.9)', 
                    transformOrigin: 'top center',
                    marginTop: '0',
                    marginBottom: '-10%'
                  }}
                >
                  <div className="bg-white rounded-xl shadow-lg w-full overflow-x-hidden">
                    <div className="p-3 overflow-x-hidden">
                      <FinalPagePreview />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Export Options */}
            <div className="flex-shrink-0 h-full ml-4">
              <ExportOptions onOpenModal={() => setIsPreviewModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <ResumePreviewModal 
          isOpen={isPreviewModalOpen} 
          onClose={() => setIsPreviewModalOpen(false)} 
          resumeData={resumeData}
          templateCode={activeTemplate?.code || ''}
        />
      )}
    </>
  );
};

export default FinalPage;