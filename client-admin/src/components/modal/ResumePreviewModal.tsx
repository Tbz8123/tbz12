import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, Download, Loader2, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDownloadResume } from '@/hooks/use-download-resume';
import { Button } from '@/components/ui/button';
import { MultiPageRender } from '@/lib/multi-page-template-utils';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/stores/resumeStore';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: any; // Using any type since ResumeData is defined locally in ResumeContext
  templateCode: string;
  editorMode?: 'fresher' | 'experienced';
  // Add ResumeContext methods as optional props
  onUpdateResumeData?: (data: any) => void;
  onUpdateSkills?: (skills: any[]) => void;
  onUpdateLanguages?: (languages: any[]) => void;
  onUpdateCertifications?: (certifications: any[]) => void;
  onUpdateCustomSections?: (sections: any[]) => void;
  onUpdateEducation?: (education: any[]) => void;
  onUpdateWorkExperience?: (experience: any[]) => void;
}

const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  resumeData, 
  templateCode,
  onUpdateResumeData,
  onUpdateSkills,
  onUpdateLanguages,
  onUpdateCertifications,
  onUpdateCustomSections,
  onUpdateEducation,
  onUpdateWorkExperience
}) => {
  const isMobile = useIsMobile();
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { downloadPDF } = useDownloadResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const activeProTemplateId = useResumeStore((state) => state.activeProTemplateId);
  const { getProTemplateById } = useResumeStore((state) => state.actions);
  const isLoadingProTemplates = useResumeStore((state) => state.isLoadingProTemplates);

  const activeTemplate = getProTemplateById && typeof getProTemplateById === 'function' 
    ? getProTemplateById(activeProTemplateId) 
    : null;

  // Use the same template selection logic as FinalPagePreview
  const finalTemplateCode = useMemo(() => {
    if (!activeTemplate) return templateCode;

    // Enhanced logging for debugging
    console.log('📋 ResumePreviewModal - Template details:', {
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
      hasCode: !!activeTemplate.code,
      codeLength: activeTemplate.code?.length,
      codePreview: activeTemplate.code?.substring(0, 100) + '...',
      activeProTemplateId,
      activeTemplate: activeTemplate.name
    });

    return activeTemplate.code || templateCode;
  }, [activeTemplate, activeProTemplateId, templateCode]);

  // Determine if we should use the backend template or MultiPageRender
  const shouldUseBackendTemplate = useMemo(() => {
    // Use backend template if:
    // 1. We have template code
    // 2. The template code is not empty/default
    // 3. The template code contains actual template logic (not just placeholder)
    if (!finalTemplateCode) return false;

    const hasRealTemplateCode = finalTemplateCode.trim().length > 100 && 
                               finalTemplateCode.includes('userData') && 
                               !finalTemplateCode.includes('// Start your JSX template here');

    console.log('🔍 ResumePreviewModal Template analysis:', {
      hasCode: !!finalTemplateCode,
      codeLength: finalTemplateCode?.length,
      hasRealTemplateCode,
      shouldUseBackend: hasRealTemplateCode
    });

    return hasRealTemplateCode;
  }, [finalTemplateCode]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Add professional interactive features after template renders (for backend templates)
  useEffect(() => {
    if (!templateRef.current || !shouldUseBackendTemplate) return;

    const addInteractiveFeatures = () => {
      const container = templateRef.current;
      if (!container) return;

      // Add hover effects to sections by finding elements with specific text content
      const addHoverEffectByText = (textPatterns: string[], sectionType: string, editPath: string) => {
        const allElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, div, section');

        allElements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          const text = htmlElement.textContent?.toUpperCase() || '';

          // Check if this element contains any of the text patterns
          const matches = textPatterns.some(pattern => text.includes(pattern.toUpperCase()));

          if (matches && !htmlElement.classList.contains('interactive-enhanced')) {
            // Find the parent section (usually a div containing the heading and content)
            let targetElement = htmlElement;
            if (htmlElement.tagName.match(/^H[1-6]$/)) {
              // If it's a heading, try to find the parent section
              const parent = htmlElement.parentElement;
              if (parent && parent.tagName !== 'BODY') {
                targetElement = parent;
              }
            }

            targetElement.classList.add('interactive-enhanced');
            targetElement.style.position = 'relative';
            targetElement.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            targetElement.style.borderRadius = '8px';

            // Create professional action overlay
            const actionOverlay = document.createElement('div');
            actionOverlay.className = 'action-overlay';
            actionOverlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
              border: 2px solid transparent;
              border-radius: 8px;
              opacity: 0;
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: none;
              z-index: 1;
            `;

            // Create professional action buttons
            const actionBar = document.createElement('div');
            actionBar.className = 'action-bar';
            actionBar.style.cssText = `
              position: absolute;
              top: 12px;
              right: 12px;
              display: flex;
              gap: 8px;
              opacity: 0;
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 1000;
              pointer-events: none;
            `;

            // Edit button with professional styling
            const editBtn = document.createElement('button');
            editBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            `;
            editBtn.style.cssText = `
              width: 32px;
              height: 32px;
              border: none;
              border-radius: 6px;
              background: rgba(255, 255, 255, 0.95);
              color: #3b82f6;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: auto;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              backdrop-filter: blur(10px);
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              border: 1px solid rgba(255, 255, 255, 0.2);
            `;

            editBtn.addEventListener('mouseenter', () => {
              editBtn.style.transform = 'scale(1.05)';
              editBtn.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
              editBtn.style.background = '#3b82f6';
              editBtn.style.color = 'white';
            });

            editBtn.addEventListener('mouseleave', () => {
              editBtn.style.transform = 'scale(1)';
              editBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              editBtn.style.background = 'rgba(255, 255, 255, 0.95)';
              editBtn.style.color = '#3b82f6';
            });

            editBtn.onclick = () => {
              onClose(); // Close modal first
              setLocation(editPath);
            };

            // Delete button with professional styling (only for deletable sections)
            if (sectionType !== 'contact' && sectionType !== 'header') {
              const deleteBtn = document.createElement('button');
              deleteBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              `;
              deleteBtn.style.cssText = `
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.95);
                color: #ef4444;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: auto;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.2);
              `;

              deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.transform = 'scale(1.05)';
                deleteBtn.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.3)';
                deleteBtn.style.background = '#ef4444';
                deleteBtn.style.color = 'white';
              });

              deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.transform = 'scale(1)';
                deleteBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                deleteBtn.style.background = 'rgba(255, 255, 255, 0.95)';
                deleteBtn.style.color = '#ef4444';
              });

              deleteBtn.onclick = () => handleDelete(sectionType);
              actionBar.appendChild(deleteBtn);
            }

            actionBar.appendChild(editBtn);
            targetElement.appendChild(actionOverlay);
            targetElement.appendChild(actionBar);

            // Professional hover effects
            targetElement.addEventListener('mouseenter', () => {
              targetElement.style.transform = 'translateY(-2px)';
              targetElement.style.zIndex = '10';
              actionOverlay.style.opacity = '1';
              actionOverlay.style.border = '2px solid rgba(139, 92, 246, 0.2)';
              actionOverlay.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.12)';
              actionBar.style.opacity = '1';
              actionBar.style.transform = 'translateY(0)';
            });

            targetElement.addEventListener('mouseleave', () => {
              targetElement.style.transform = 'translateY(0)';
              targetElement.style.zIndex = 'auto';
              actionOverlay.style.opacity = '0';
              actionOverlay.style.border = '2px solid transparent';
              actionOverlay.style.boxShadow = 'none';
              actionBar.style.opacity = '0';
              actionBar.style.transform = 'translateY(-4px)';
            });
          }
        });
      };

      // Add interactive features to different sections using text patterns
      addHoverEffectByText(['SKILLS', 'SKILL'], 'skills', '/skills');
      addHoverEffectByText(['EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE'], 'experience', '/work-experience-details');
      addHoverEffectByText(['EDUCATION', 'ACADEMIC'], 'education', '/education');
      addHoverEffectByText(['LANGUAGES', 'LANGUAGE'], 'languages', '/section/languages');
      addHoverEffectByText(['CERTIFICATION', 'CERTIFICATES'], 'certifications', '/section/certifications');
      addHoverEffectByText(['PROFESSIONAL SUMMARY', 'ABOUT ME', 'SUMMARY', 'ABOUT'], 'summary', '/professional-summary');
      addHoverEffectByText(['CONTACT', 'CONTACT INFO'], 'contact', '/personal-information');
    };

    const timer = setTimeout(addInteractiveFeatures, 1000);
    return () => clearTimeout(timer);
  }, [finalTemplateCode, resumeData, setLocation, shouldUseBackendTemplate, onClose]);

  // Handle delete actions
  const handleDelete = (sectionType: string) => {
    switch (sectionType) {
      case 'skills':
        onUpdateSkills?.([]);
        break;
      case 'languages':
        onUpdateLanguages?.([]);
        break;
      case 'certifications':
        onUpdateCertifications?.([]);
        break;
      case 'summary':
        onUpdateResumeData?.({ 
          ...resumeData,
          personalInfo: { 
            ...resumeData.personalInfo, 
            summary: '' 
          } 
        });
        break;
      case 'experience':
        onUpdateWorkExperience?.([]);
        break;
      case 'education':
        onUpdateEducation?.([]);
        break;
    }
  };

  if (!isOpen) {
    return null;
  }

  // Simple mobile scale calculation - fit to screen width
  const getMobileScale = () => {
    if (!isMobile || viewport.width === 0) return 1;

    const padding = 32; // Total padding for mobile
    const availableWidth = viewport.width - padding;

    // Calculate scale based on width only, let height scroll
    const scale = availableWidth / 800;
    return Math.max(scale, 0.3); // Minimum scale of 0.3
  };

  const mobileScale = getMobileScale();
  const scaledWidth = 800 * mobileScale;
  const scaledHeight = 1131 * mobileScale;

  // Loading state - only show loading when actually fetching templates
  const hasTemplateCode = finalTemplateCode && finalTemplateCode.trim() !== '';
  const isLoading = isLoadingProTemplates;

  const getModalClassName = () => {
    return `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-out bg-black/70 backdrop-blur-sm mobile-modal-fallback ios-fix-blur ${
      isMobile ? 'p-1' : 'p-4 sm:p-6 lg:p-8'
    }`;
  };

  const getModalContentClassName = () => {
    return `bg-white flex flex-col overflow-hidden relative transition-transform duration-300 ease-out shadow-2xl mobile-card-fallback ${
      isMobile 
        ? 'w-full h-full rounded-t-xl'
        : 'w-full max-w-5xl h-full max-h-[90vh] rounded-xl'
    }`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={getModalClassName()} onClick={onClose}>
        <div className={getModalContentClassName()} onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className={`flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10 ${
            isMobile ? 'p-4' : 'p-4 sm:p-5'
          }`}>
            <div className="flex items-center gap-3">
              <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Resume Preview
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className={`text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 ${
                isMobile ? 'p-2' : 'p-1'
              }`}
              aria-label="Close preview"
            >
              <X size={isMobile ? 24 : 20} />
            </button>
          </div>

          {/* Loading Content */}
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading template...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Note: Removed the "No template selected" state since we always want to show content
  // Either the backend template or MultiPageRender as fallback

  const renderContent = () => {
    // Use MultiPageRender (default professional template) if no backend template code
    if (!shouldUseBackendTemplate) {
      console.log('✅ ResumePreviewModal Using MultiPageRender (default professional template with multi-page support)');

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full min-h-full relative"
        >
          <MultiPageRender 
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            onUpdateSkills={onUpdateSkills}
            onUpdateLanguages={onUpdateLanguages}
            onUpdateCertifications={onUpdateCertifications}
            onUpdateCustomSections={onUpdateCustomSections}
            onUpdateEducation={onUpdateEducation}
            onUpdateWorkExperience={onUpdateWorkExperience}
          />
        </motion.div>
      );
    }

    console.log('✅ ResumePreviewModal Using backend template code with interactive features');

    // Use backend template code with interactive features
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-full relative"
        style={{
          // Ensure proper overflow handling for magnifier effects
          overflow: 'visible',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div 
          ref={templateRef}
          style={{
            // Container for magnifier effects
            position: 'relative',
            isolation: 'isolate',
            overflow: 'visible'
          }}
        >
          <LiveProvider 
            code={finalTemplateCode || ''}
            scope={{ 
              React,
              resumeData,
              userData: resumeData, // Many templates expect userData
              useState: React.useState,
              useEffect: React.useEffect,
              useMemo: React.useMemo,
              useRef: React.useRef,
              motion,
              useInView: (options?: any) => {
                const ref = React.useRef<HTMLDivElement>(null);
                return { ref, inView: true };
              }, // Mock useInView with proper signature
              render: (ui: React.ReactNode) => ui,
              // Custom colors that templates might expect
              customColors: resumeData.customization?.colors || {
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#60a5fa',
                text: '#111827',
                background: '#ffffff',
                sidebarText: '#ffffff',
                sidebarBackground: '#333333'
              },
              // Page break components that multi-page templates might need
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
      </motion.div>
    );
  };

  return (
    <div 
      className={getModalClassName()}
      onClick={onClose}
    >
      <div 
        className={getModalContentClassName()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10 ${
          isMobile ? 'p-4' : 'p-4 sm:p-5'
        }`}>
          <div className="flex items-center gap-3">
            <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Resume Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              onClick={() => {
                if (resumeRef.current) {
                  downloadPDF(resumeRef.current, 'resume.pdf');
                }
              }}
              className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          <button 
            onClick={onClose} 
            className={`text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 ${
              isMobile ? 'p-2' : 'p-1'
            }`}
            aria-label="Close preview"
          >
            <X size={isMobile ? 24 : 20} />
          </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className={`flex-1 bg-gray-50 relative ${
          isMobile ? 'overflow-y-auto overflow-x-hidden p-4' : 'overflow-auto p-6'
        }`}>
          <div ref={resumeRef}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;