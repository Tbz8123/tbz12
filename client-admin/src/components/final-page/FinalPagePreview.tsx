import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { motion } from 'framer-motion';
import { FileText, Loader2, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { MultiPageRender } from '@/lib/multi-page-template-utils';
import { useLocation } from 'wouter';
import SectionReorderModal from './SectionReorderModal';

interface SectionButton {
  id: string;
  type: string;
  editPath: string;
  canDelete: boolean;
  rect: DOMRect;
}

const FinalPagePreview: React.FC = () => {
  const {
    resumeData,
    activeProTemplateId,
    isLoadingProTemplates,
  } = useResumeStore();

  const {
    getProTemplateById,
    updateResumeData,
    updateSkills,
    updateLanguages,
    updateCertifications,
    updateCustomSections,
    updateEducation,
    updateWorkExperience
  } = useResumeStore((state) => state.actions);

  const [, setLocation] = useLocation();
  const templateRef = useRef<HTMLDivElement>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [sectionButtons, setSectionButtons] = useState<SectionButton[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  // Check if store is hydrated using Zustand's persist hydration
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Array<{type: string, data: any}>>([]);
  
  useEffect(() => {
    // Use a more reliable hydration check with polling
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkHydration = () => {
      attempts++;
      
      // Check if getProTemplateById is available and functional
      if (typeof getProTemplateById === 'function') {
        console.log('✅ FinalPagePreview: Store hydrated successfully');
        setIsStoreHydrated(true);
        
        // Process any pending updates
        if (pendingUpdates.length > 0) {
          console.log('🔄 FinalPagePreview: Processing pending updates:', pendingUpdates.length);
          pendingUpdates.forEach(update => {
            executeResumeDataUpdate(update.type, update.data);
          });
          setPendingUpdates([]);
        }
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkHydration, 100);
      } else {
        console.warn('⚠️ FinalPagePreview: Store hydration timeout after', maxAttempts * 100, 'ms');
        setIsStoreHydrated(true); // Proceed anyway to avoid infinite loading
      }
    };
    
    checkHydration();
  }, [getProTemplateById, pendingUpdates]);
  
  // Helper function to execute resume data updates with hydration check
  const executeResumeDataUpdate = (type: string, data: any) => {
    if (!isStoreHydrated || typeof getProTemplateById !== 'function') {
      console.log('⏳ FinalPagePreview: Queueing update until hydrated:', type);
      setPendingUpdates(prev => [...prev, { type, data }]);
      return;
    }
    
    // Execute the update based on type
    switch (type) {
      case 'resumeData':
        updateResumeData?.(data);
        break;
      case 'skills':
        updateSkills?.(data);
        break;
      case 'languages':
        updateLanguages?.(data);
        break;
      case 'certifications':
        updateCertifications?.(data);
        break;
      case 'customSections':
        updateCustomSections?.(data);
        break;
      case 'education':
        updateEducation?.(data);
        break;
      case 'workExperience':
        updateWorkExperience?.(data);
        break;
      default:
        console.warn('Unknown update type:', type);
    }
  };

  const activeTemplate = isStoreHydrated && typeof getProTemplateById === 'function' 
    ? getProTemplateById(activeProTemplateId) 
    : null;

  const templateCode = useMemo(() => {
    if (!activeTemplate) return null;

    console.log('📋 FinalPagePreview - Template details:', {
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
      hasCode: !!activeTemplate.code,
      codeLength: activeTemplate.code?.length,
      activeProTemplateId,
      activeTemplate: activeTemplate.name
    });

    return activeTemplate.code;
  }, [activeTemplate, activeProTemplateId]);

  // Determine if we should use the backend template or MultiPageRender
  const shouldUseBackendTemplate = useMemo(() => {
    if (!templateCode) return false;

    const hasRealTemplateCode = templateCode.trim().length > 100 && 
                               templateCode.includes('userData') && 
                               !templateCode.includes('// Start your JSX template here');

    console.log('🔍 Template analysis:', {
      hasCode: !!templateCode,
      codeLength: templateCode?.length,
      hasRealTemplateCode,
      shouldUseBackend: hasRealTemplateCode
    });

    return hasRealTemplateCode;
  }, [templateCode]);

  // Scan for sections and create button data
  const scanForSections = () => {
    if (!templateRef.current) return;

    const container = templateRef.current;
    const sectionMappings = [
      { 
        patterns: ['CONTACT'], 
        type: 'contact', 
        editPath: '/personal-information',
        canDelete: false 
      },
      { 
        patterns: ['PROFESSIONAL SUMMARY', 'ABOUT ME', 'SUMMARY'], 
        type: 'summary', 
        editPath: '/professional-summary',
        canDelete: true 
      },
      { 
        patterns: ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT'], 
        type: 'experience', 
        editPath: '/work-history-summary',
        canDelete: true 
      },
      { 
        patterns: ['EDUCATION', 'ACADEMIC'], 
        type: 'education', 
        editPath: '/education-summary',
        canDelete: true 
      },
      { 
        patterns: ['SKILLS', 'TECHNICAL SKILLS'], 
        type: 'skills', 
        editPath: '/skills-summary',
        canDelete: true 
      },
      { 
        patterns: ['LANGUAGES'], 
        type: 'languages', 
        editPath: '/languages-summary',
        canDelete: true 
      },
      { 
        patterns: ['CERTIFICATIONS', 'CERTIFICATES'], 
        type: 'certifications', 
        editPath: '/certifications-summary',
        canDelete: true 
      }
    ];

    const buttons: SectionButton[] = [];
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading) => {
      const headingElement = heading as HTMLElement;
      const text = headingElement.textContent?.toUpperCase() || '';

      sectionMappings.forEach(({ patterns, type, editPath, canDelete }) => {
        const matches = patterns.some(pattern => text.includes(pattern.toUpperCase()));

        if (matches) {
          // Find the section container
          let sectionContainer = headingElement.parentElement;
          let nextHeading = headingElement.nextElementSibling;

          // Find the end of this section
          while (nextHeading && !nextHeading.matches('h1, h2, h3, h4, h5, h6')) {
            nextHeading = nextHeading.nextElementSibling;
          }

          // Calculate section bounds
          const startRect = headingElement.getBoundingClientRect();
          const endRect = nextHeading ? 
            nextHeading.getBoundingClientRect() : 
            sectionContainer?.getBoundingClientRect() || startRect;

          const containerRect = container.getBoundingClientRect();

          // Create a virtual rect for the entire section
          const sectionRect = new DOMRect(
            startRect.left - containerRect.left,
            startRect.top - containerRect.top,
            Math.max(startRect.width, endRect.width),
            Math.abs(endRect.top - startRect.top) + 50
          );

          buttons.push({
            id: `${type}-${Math.random()}`,
            type,
            editPath,
            canDelete,
            rect: sectionRect
          });
        }
      });
    });

    setSectionButtons(buttons);
  };

  // Scan for sections when template changes
  useEffect(() => {
    if (!shouldUseBackendTemplate) return;

    const timer = setTimeout(() => {
      scanForSections();
    }, 1000);

    // Also rescan when section order changes
    const rescanTimer = setTimeout(() => {
      scanForSections();
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(rescanTimer);
    };
  }, [shouldUseBackendTemplate, templateCode, resumeData, resumeData.sectionOrder]);

  // Rescan sections when modal closes
  useEffect(() => {
    if (!isReorderModalOpen && shouldUseBackendTemplate) {
      const timer = setTimeout(() => {
        scanForSections();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReorderModalOpen, shouldUseBackendTemplate]);

  // Handle delete actions
  const handleDelete = (sectionType: string) => {
    switch (sectionType) {
      case 'skills':
        executeResumeDataUpdate('skills', []);
        break;
      case 'languages':
        executeResumeDataUpdate('languages', []);
        break;
      case 'certifications':
        executeResumeDataUpdate('certifications', []);
        break;
      case 'summary':
        executeResumeDataUpdate('resumeData', { 
          ...resumeData,
          personalInfo: { 
            ...resumeData.personalInfo, 
            summary: '' 
          } 
        });
        break;
      case 'experience':
        executeResumeDataUpdate('workExperience', []);
        break;
      case 'education':
        executeResumeDataUpdate('education', []);
        break;
    }
  };

  // React-based Section Button Component
  const SectionButton: React.FC<{
    button: SectionButton;
    isVisible: boolean;
  }> = ({ button, isVisible }) => {
    return (
      <div
        className={`absolute flex gap-2 transition-all duration-200 z-[9999] ${
          isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          left: Math.max(button.rect.right - 80, 10),
          top: Math.max(button.rect.top + 8, 10),
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        {/* Edit Button */}
        <button
          onClick={() => setLocation(button.editPath)}
          className="w-8 h-8 bg-white shadow-lg rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105 border border-gray-200"
          style={{ zIndex: 10000 }}
          title="Edit Section"
        >
          <Edit size={16} />
        </button>

        {/* Delete Button */}
        {button.canDelete && (
          <button
            onClick={() => handleDelete(button.type)}
            className="w-8 h-8 bg-white shadow-lg rounded-md flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-105 border border-gray-200"
            style={{ zIndex: 10000 }}
            title="Delete Section"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  };

  // Add a refresh button for debugging
  const RefreshButton: React.FC = () => (
    <button
      onClick={() => {
        console.log('🔄 Refreshing sections...');
        scanForSections();
      }}
      className="fixed bottom-20 right-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 z-[9998]"
      title="Refresh Section Detection"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    </button>
  );

  // Mouse tracking for hover detection
  useEffect(() => {
    if (!shouldUseBackendTemplate) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!templateRef.current) return;

      const containerRect = templateRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;

      // Check which section is being hovered
      let foundSection: string | null = null;

      for (const button of sectionButtons) {
        if (
          relativeX >= button.rect.left &&
          relativeX <= button.rect.right &&
          relativeY >= button.rect.top &&
          relativeY <= button.rect.bottom
        ) {
          foundSection = button.type;
          break;
        }
      }

      setHoveredSection(foundSection);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [sectionButtons, shouldUseBackendTemplate]);

  if (isLoadingProTemplates) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No template selected</p>
        </div>
      </div>
    );
  }

  // Use MultiPageRender (default professional template) if no backend template code
  if (!shouldUseBackendTemplate) {
    console.log('✅ Using MultiPageRender (default professional template with multi-page support)');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-full relative"
      >
        {/* Section Reorder Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsReorderModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative"
            title="Drag & Drop to Reorder Sections"
          >
            <ArrowUpDown className="w-6 h-6" />

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Reorder Sections
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </button>
        </div>

        {/* Section Reorder Modal */}
        <SectionReorderModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
        />

        <MultiPageRender 
          resumeData={resumeData}
          onUpdateResumeData={(data) => executeResumeDataUpdate('resumeData', data)}
          onUpdateSkills={(data) => executeResumeDataUpdate('skills', data)}
          onUpdateLanguages={(data) => executeResumeDataUpdate('languages', data)}
          onUpdateCertifications={(data) => executeResumeDataUpdate('certifications', data)}
          onUpdateCustomSections={(data) => executeResumeDataUpdate('customSections', data)}
          onUpdateEducation={(data) => executeResumeDataUpdate('education', data)}
          onUpdateWorkExperience={(data) => executeResumeDataUpdate('workExperience', data)}
        />
      </motion.div>
    );
  }

  console.log('✅ Using backend template code with React-based overlay buttons');

  // Use backend template code with React-based overlay system
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-full relative"
    >
      {/* Section Reorder Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsReorderModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative"
          title="Drag & Drop to Reorder Sections"
        >
          <ArrowUpDown className="w-6 h-6" />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Reorder Sections
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Section Reorder Modal */}
      <SectionReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
      />

      {/* Template Container */}
      <div 
        ref={templateRef}
        className="relative"
      >
        <LiveProvider 
          code={templateCode || ''}
          scope={{ 
            React,
            resumeData,
            userData: resumeData,
            useState: React.useState,
            useEffect: React.useEffect,
            useMemo: React.useMemo,
            useRef: React.useRef,
            motion,
            useInView: (options?: any) => {
              const ref = React.useRef<HTMLDivElement>(null);
              return { ref, inView: true };
            },
            render: (ui: React.ReactNode) => ui,
            customColors: resumeData.customization?.colors || {
              primary: '#2563eb',
              secondary: '#1e40af',
              accent: '#60a5fa',
              text: '#111827',
              background: '#ffffff',
              sidebarText: '#ffffff',
              sidebarBackground: '#333333'
            },
            PageBreak: () => React.createElement('div', { 
              style: { 
                pageBreakAfter: 'always',
                height: '1px',
                backgroundColor: 'transparent'
              }
            }),
            PageHeader: ({ children, pageNumber }: { children: React.ReactNode, pageNumber?: number }) => 
              React.createElement('div', { 
                style: { 
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '20px',
                  marginBottom: '30px'
                }
              }, children),
            PageFooter: ({ children, pageNumber }: { children: React.ReactNode, pageNumber?: number }) => 
              React.createElement('div', { 
                style: { 
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '20px',
                  marginTop: '30px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '14px'
                }
              }, children)
          }}
          noInline={true}
        >
          <LiveError className="absolute top-4 left-4 right-4 max-h-[200px] overflow-y-auto bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm whitespace-pre-wrap font-mono z-50" />
          <LivePreview />
        </LiveProvider>
      </div>

      {/* React-based Overlay Buttons */}
      {sectionButtons.map((button) => (
        <SectionButton
          key={button.id}
          button={button}
          isVisible={hoveredSection === button.type}
        />
      ))}

      {/* Refresh Button for debugging */}
      <RefreshButton />
    </motion.div>
  );
};

export default FinalPagePreview;