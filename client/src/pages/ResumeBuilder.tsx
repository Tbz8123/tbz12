// Import mobile compatibility CSS only for ResumeBuilder page
// import '../styles/mobile-compatibility.css'; // Temporarily commented out for testing

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionEditor from '@/components/resume/SectionEditor';
import ResumePreview from '@/components/resume/ResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import { ResumeData } from '@shared/schema';
// import { Link } from 'wouter'; // No longer needed if Cancel button is removed
import { apiRequest } from '@/lib/queryClient';
import ContextualTipBar from '@/components/ui/ContextualTipBar';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';
import DownloadOptionsModal from '@/components/modal/DownloadOptionsModal';
import DownloadTestButton from '@/components/debug/DownloadTestButton';
import { motion, useMotionValue, useTransform, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Download, Eye, Sparkles, User, Briefcase, GraduationCap, Settings, Award, Languages, Plus, TrendingUp, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the type for a resume template based on Prisma schema (mirroring TemplateSelector)
interface PrismaResumeTemplate {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  uploadedImageUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  displayMode?: 'thumbnail' | 'uploaded_image' | null;
  enhanced3DMetadata?: any | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  templateType?: 'snap' | 'pro'; // Added to differentiate between template types
  // Add other fields if they are used by ResumePreview or other logic consuming templates here
}

// Lightweight Floating Particles Component with reduced GPU usage
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced particle count for better performance
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3, // Reduced velocity
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1, // Reduced opacity
      hue: 200 + Math.random() * 60,
    }));

    let animationFrame: number;

    const animateParticles = () => {
      if (!particlesRef.current) return;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      });

      // Update DOM less frequently (every other frame)
      particlesRef.current.innerHTML = particles
        .map(p => 
          `<div class="absolute rounded-full" 
                style="left: ${p.x}px; top: ${p.y}px; width: ${p.size}px; height: ${p.size}px; 
                background: hsla(${p.hue}, 50%, 60%, ${p.opacity});
                box-shadow: 0 0 ${p.size * 2}px hsla(${p.hue}, 50%, 60%, 0.2);"></div>`
        )
        .join('');

      animationFrame = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Enhanced Progress Tracker Component with Full End-to-End Functionality
const ProgressTracker = ({ resumeData, editorMode, isMobile, activeSection, onSectionChange, sections, getCompletionStatus }: { 
  resumeData: ResumeData, 
  editorMode: 'fresher' | 'experienced', 
  isMobile: boolean,
  activeSection?: string,
  onSectionChange?: (section: string) => void,
  sections: any[],
  getCompletionStatus: (key: string) => boolean
}) => {
  // Get detailed completion info for tooltips
  const getCompletionDetails = (key: string) => {
    switch (key) {
      case 'personal':
        const personalInfo = resumeData.personalInfo;
        const missing = [];
        if (!personalInfo?.firstName) missing.push('First Name');
        if (!personalInfo?.lastName) missing.push('Last Name'); 
        if (!personalInfo?.email) missing.push('Email');
        if (!personalInfo?.phone) missing.push('Phone');
        if (!personalInfo?.title) missing.push('Job Title');
        if (!personalInfo?.summary || personalInfo.summary.length < 50) missing.push('Summary (50+ chars)');
        return missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'Complete';

      case 'experience':
        const experiences = resumeData.experience || [];
        if (experiences.length === 0) return 'Add at least one work experience';
        const incompleteExp = experiences.filter(exp => 
          !exp.company || !exp.position || !exp.startDate || !exp.description ||
          exp.description.length < 30
        );
        return incompleteExp.length > 0 ? `${incompleteExp.length} incomplete entries` : 'Complete';

      case 'education':
        const education = resumeData.education || [];
        if (education.length === 0) return 'Add at least one education entry';
        const incompleteEdu = education.filter(edu => !edu.school || !edu.degree || !edu.startDate);
        return incompleteEdu.length > 0 ? `${incompleteEdu.length} incomplete entries` : 'Complete';

      case 'skills':
        const skills = resumeData.skills || [];
        if (skills.length === 0) return 'Add at least 1 skill';
        return 'Complete';

      case 'languages':
        const languages = resumeData.languages || [];
        if (languages.length === 0) return 'Optional: Add languages';
        return 'Complete';

      case 'custom':
        const customSections = resumeData.customSections || [];
        if (customSections.length === 0) return 'Optional: Add custom sections';
        return 'Complete';

      default:
        return '';
    }
  };

  // Always include all sections except certifications, handle experience visibility in UI
  const applicableSections = sections.filter(s => s.key !== 'certifications');

  // For progress calculation, exclude custom sections always and experience in fresher mode
  const sectionsForProgress = applicableSections.filter(s => {
    // Always exclude custom sections and certifications from progress calculation
    if (s.key === 'custom' || s.key === 'certifications') {
      return false;
    }
    // Exclude experience in fresher mode
    if (editorMode === 'fresher' && s.key === 'experience') {
      return false;
    }
    return true;
  });

  const completedSections = sectionsForProgress.filter(s => getCompletionStatus(s.key));
  const requiredSections = sectionsForProgress.filter(s => s.required);
  const completedRequiredSections = requiredSections.filter(s => getCompletionStatus(s.key));

  // Calculate progress with emphasis on required sections
  const requiredProgress = (completedRequiredSections.length / requiredSections.length) * 80; // 80% for required
  const optionalProgress = ((completedSections.length - completedRequiredSections.length) / (sectionsForProgress.length - requiredSections.length)) * 20; // 20% for optional
  const progress = requiredProgress + (isNaN(optionalProgress) ? 0 : optionalProgress);

  const handleSectionClick = (sectionKey: string) => {
    if (onSectionChange) {
      // Add haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Smooth section transition with visual feedback
      const clickedElement = document.querySelector(`[data-section="${sectionKey}"]`);
      if (clickedElement) {
        clickedElement.classList.add('animate-pulse');
        setTimeout(() => clickedElement.classList.remove('animate-pulse'), 200);
      }

      onSectionChange(sectionKey);
    }
  };

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return; // Don't interfere with form inputs
      }

      const currentIndex = sectionsForProgress.findIndex(s => s.key === activeSection);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sectionsForProgress.length;
        if (onSectionChange) {
          onSectionChange(sectionsForProgress[nextIndex].key);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? sectionsForProgress.length - 1 : currentIndex - 1;
        if (onSectionChange) {
          onSectionChange(sectionsForProgress[prevIndex].key);
        }
      }
    };

    // Only add keyboard navigation on desktop
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyNavigation);
      return () => window.removeEventListener('keydown', handleKeyNavigation);
    }
  }, [activeSection, editorMode, onSectionChange, isMobile, sections, sectionsForProgress]);

  return (
    <motion.div 
      className={`${isMobile ? 'mb-4 p-3' : 'mb-6 p-4'} bg-gradient-to-br from-purple-900/40 via-purple-950/35 to-blue-900/40 border-2 border-purple-400/50 rounded-xl shadow-lg`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(147, 51, 234, 0.15)" }}
    >
      {/* Header with enhanced styling */}
      <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
          </motion.div>
          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent`}>
            Resume Completion
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">
            {completedRequiredSections.length}/{requiredSections.length} required
          </span>
          <motion.span 
            className={`text-sm font-bold font-mono px-2 py-1 rounded-full ${
              progress >= 80 ? 'bg-green-500/20 text-green-300' : 
              progress >= 50 ? 'bg-yellow-500/20 text-yellow-300' : 
              'bg-red-500/20 text-red-300'
            }`}
            animate={{ scale: progress >= 80 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: progress >= 80 ? Infinity : 0, repeatDelay: 2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        <Progress 
          value={progress} 
          className={`h-3 ${isMobile ? 'mb-3' : 'mb-4'} bg-white/10 overflow-hidden`}
        />
        {/* Progress milestones */}
        <div className="absolute top-0 left-0 w-full h-3 flex items-center justify-between px-1">
          {[25, 50, 75].map(milestone => (
            <motion.div
              key={milestone}
              className={`w-0.5 h-2 rounded-full ${
                progress >= milestone ? 'bg-white/60' : 'bg-white/20'
              }`}
              style={{ marginLeft: `${milestone}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: progress >= milestone ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Section Pills */}
      <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
        {applicableSections.map((section, index) => {
          const isCompleted = getCompletionStatus(section.key);
          const isActive = activeSection === section.key;
          const Icon = section.icon;
          const completionDetails = getCompletionDetails(section.key);

          // Always render but hide experience for fresher mode
          const isHidden = editorMode === 'fresher' && section.key === 'experience';

          return (
            <motion.div
              key={section.key}
              data-section={section.key}
              style={{ display: isHidden ? 'none' : 'flex' }}
              className={`group relative cursor-pointer items-center ${
                isMobile ? 'gap-1 px-2 py-1' : 'gap-1.5 px-3 py-1.5'
              } rounded-full ${isMobile ? 'text-[10px]' : 'text-xs'} transition-all duration-200 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 border border-green-400/50 shadow-md' 
                  : section.required
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 border border-purple-400/30'
                    : 'bg-white/10 text-white/60 border border-transparent'
              } ${
                isActive ? 'ring-2 ring-purple-400/50 bg-purple-500/20 scale-105' : ''
              }`}
              whileHover={{ 
                scale: isMobile ? 1.02 : 1.05, 
                y: -2,
                boxShadow: "0 4px 20px rgba(147, 51, 234, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionClick(section.key)}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Completion Icon */}
              <motion.div
                animate={isCompleted ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 text-green-300" />
                ) : (
                  <Circle className={`w-3 h-3 ${isActive ? 'text-purple-300' : 'text-white/60'}`} />
                )}
              </motion.div>

              {/* Section Icon */}
              <Icon className="w-3 h-3" />

              {/* Section Label */}
              <span className="font-medium">{section.label}</span>

              {/* Active Indicator - Now handled by circle color */}

              {/* Required Badge */}
              {section.required && !isCompleted && (
                <motion.div
                  className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isActive ? '✓ Currently Active' : `Click to edit ${completionDetails}`}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Status Message */}
      <AnimatePresence>
        {progress >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-200 text-xs">
              <CheckCircle className="w-4 h-4" />
              <div>
                <p className="font-medium">🎉 Resume is ready for download!</p>
                <p className="text-green-300/80 mt-1">Your resume meets all quality standards. You can now download it as a PDF.</p>
              </div>
            </div>
          </motion.div>
        )}
        {progress >= 50 && progress < 80 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-blue-200 text-xs">
              <TrendingUp className="w-4 h-4" />
              <div>
                <p className="font-medium">Almost there! Complete a few more sections</p>
                <p className="text-blue-300/80 mt-1">Add more details to improve your resume quality and increase your chances.</p>
              </div>
            </div>
          </motion.div>
        )}
        {progress < 50 && completedRequiredSections.length < requiredSections.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg"
          >
            <div className="flex items-start gap-2 text-purple-200 text-xs">
              <TrendingUp className="w-4 h-4 mt-0.5" />
              <div>
                <p className="font-medium">Complete required sections to get started</p>
                <div className="mt-2 space-y-1">
                  {requiredSections.filter(s => !getCompletionStatus(s.key)).slice(0, 2).map(section => (
                    <p key={section.key} className="text-purple-300/80 flex items-center gap-1">
                      <Circle className="w-2 h-2" />
                      {getCompletionDetails(section.key)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Save Status Indicator
const SaveStatusIndicator = ({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) => {
  return (
    <AnimatePresence>
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-lg border border-transparent group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-3 text-sm">
            <motion.div 
              className="w-3 h-3 bg-purple-300 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <div>
              <p className="font-medium">Unsaved changes</p>
              <p className="text-xs text-purple-100/80">Changes will be lost if you navigate away</p>
            </div>
          </div>
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-30"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Completion Notification Component
const CompletionNotification = ({ notifications, onDismiss }: { 
  notifications: string[], 
  onDismiss: (index: number) => void 
}) => {
  return (
    <AnimatePresence>
      {notifications.map((notification, index) => (
        <motion.div
          key={`${notification}-${index}`}
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-lg border border-transparent group cursor-pointer max-w-xs"
          onClick={() => onDismiss(index)}
          whileHover={{ scale: 1.05 }}
          layout
        >
          <div className="flex items-center gap-3 text-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <CheckCircle className="w-5 h-5 text-green-200" />
            </motion.div>
            <div>
              <p className="font-medium">Section Completed!</p>
              <p className="text-xs text-green-100/80">{notification}</p>
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-30"
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default function ResumeBuilder() {
  const isMobile = useIsMobile();

  const [mode, setMode] = useState<"light" | "pro">("light");
  const [editorMode, setEditorMode] = useState<'fresher' | 'experienced'>('experienced');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState('personal');

  // Initialize the form with empty fields
  const [resumeData, setResumeData] = useState<ResumeData>({
    id: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      title: '',
      summary: '',
      contactDetails: {},
    },
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    languages: [],
    customSections: [],
    templateId: '', // This will be updated to a number ID once a template is selected
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Determine template type based on URL params or localStorage
  const getTemplateType = (): 'snap' | 'pro' => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateType = urlParams.get('type');

    console.log('URL params:', window.location.search);
    console.log('Template type from URL:', templateType);

    if (templateType === 'snap' || templateType === 'pro') {
      return templateType;
    }

    // Check localStorage for package selection
    const selectedPackage = localStorage.getItem('selectedPackage');
    const selectedTemplateId = localStorage.getItem('selectedTemplateId');
    const activeProTemplateId = localStorage.getItem('activeProTemplateId');

    console.log('Selected package from localStorage:', selectedPackage);
    console.log('Selected template ID from localStorage:', selectedTemplateId);
    console.log('Active pro template ID from localStorage:', activeProTemplateId);

    // If user has selected a pro template, use pro templates
    if (activeProTemplateId) {
      return 'pro';
    }

    // If user selected snap package, use snap templates
    if (selectedPackage === 'snap') {
      return 'snap';
    }

    // If user selected pro package, use pro templates
    if (selectedPackage === 'pro' || selectedPackage === 'basic' || selectedPackage === 'premium') {
      return 'pro';
    }

    // Default to snap for testing/fallback
    return 'snap';
  };

  const templateType = getTemplateType();
  console.log('Final template type:', templateType);

  // Fetch both Snap and Pro templates based on template type
  const { data: snapTemplates = [], isLoading: isLoadingSnapTemplates } = useQuery<PrismaResumeTemplate[]>({
    queryKey: ['/api/templates'],
    enabled: templateType === 'snap',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch snap templates');
      }
      return response.json();
    },
  });

  const { data: proTemplates = [], isLoading: isLoadingProTemplates } = useQuery<PrismaResumeTemplate[]>({
    queryKey: ['/api/pro-templates'],
    enabled: templateType === 'pro',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const response = await fetch('/api/pro-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch pro templates');
      }
      return response.json();
    },
  });

  // Use appropriate templates based on type
  const templates = templateType === 'snap' 
    ? snapTemplates.map(template => ({ ...template, templateType: 'snap' as const }))
    : proTemplates.map(template => ({ ...template, templateType: 'pro' as const }));

  console.log('🔄 Template loading state:', {
    templateType,
    isLoadingSnap: isLoadingSnapTemplates,
    isLoadingPro: isLoadingProTemplates,
    snapTemplatesCount: snapTemplates.length,
    proTemplatesCount: proTemplates.length,
    finalTemplatesCount: templates.length
  });

  console.log('📋 Templates loaded:', templates.length, 'templates');
  console.log('📋 Template details:', templates.map(t => ({ id: t.id, name: t.name, type: t.templateType })));

  const isLoadingTemplates = templateType === 'snap' ? isLoadingSnapTemplates : isLoadingProTemplates;

  // Define sections array for consistent use across components (after resumeData is available)
  const sections = [
    { key: 'personal', label: 'Personal', icon: User, required: true },
    { key: 'experience', label: 'Experience', icon: Briefcase, required: editorMode === 'experienced' },
    { key: 'education', label: 'Education', icon: GraduationCap, required: true },
    { key: 'skills', label: 'Skills', icon: Settings, required: true },
    { key: 'certifications', label: 'Certifications', icon: Award, required: false },
    { key: 'languages', label: 'Languages', icon: Languages, required: false },
    { key: 'custom', label: 'Custom', icon: Plus, required: false }
  ];

  // Enhanced completion status detection with more comprehensive validation (after resumeData is available)
  const getCompletionStatus = (key: string) => {
    switch (key) {
      case 'personal':
        const personalInfo = resumeData.personalInfo;
        const hasBasicInfo = !!(personalInfo?.firstName && personalInfo?.lastName && personalInfo?.email && personalInfo?.phone);
        const hasTitle = !!(personalInfo?.title && personalInfo.title.trim().length > 0);
        const hasSummary = !!(personalInfo?.summary && personalInfo.summary.trim().length > 50); // At least 50 chars
        return hasBasicInfo && hasTitle && hasSummary;

      case 'experience':
        const experiences = resumeData.experience || [];
        if (experiences.length === 0) return false;
        // Check if at least one experience has all required fields
        return experiences.some(exp => 
          exp.company && exp.position && exp.startDate && exp.description && 
          exp.company.trim().length > 0 && exp.position.trim().length > 0 && 
          exp.description.trim().length > 30
        );

      case 'education':
        const education = resumeData.education || [];
        if (education.length === 0) return false;
        // Check if at least one education entry has required fields
        return education.some(edu => 
          edu.school && edu.degree && edu.startDate
        );

      case 'skills':
        const skills = resumeData.skills || [];
        // At least 1 skill for basic completion
        return skills.length >= 1 && skills.every(skill => skill.name && skill.name.trim().length > 0);

      case 'languages':
        const languages = resumeData.languages || [];
        return languages.length > 0 && languages.every(lang => 
          lang.name && lang.proficiency && 
          lang.name.trim().length > 0 && lang.proficiency.trim().length > 0
        );

      case 'custom':
        const customSections = resumeData.customSections || [];
        return customSections.length > 0 && customSections.every(section => 
          section.title && section.content && 
          section.title.trim().length > 0 && section.content.trim().length > 10
        );

      default:
        return false;
    }
  };

  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('template'); // Start with template selection
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Removed heavy spring scroll animations
  const [completionNotifications, setCompletionNotifications] = useState<string[]>([]);

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('resumeBuilderProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.editorMode) setEditorMode(progress.editorMode);
        if (progress.activeSection) setActiveSection(progress.activeSection);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress when state changes
  useEffect(() => {
    const progress = {
      editorMode,
      activeSection,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('resumeBuilderProgress', JSON.stringify(progress));
  }, [editorMode, activeSection]);

  useEffect(() => {
    const savedMode = localStorage.getItem("resumeBuilderMode");
    if (savedMode) {
      setMode(savedMode as "light" | "pro");
    }
  }, []);

  const handleModeChange = (newMode: "light" | "pro") => {
    setMode(newMode);
  };

  // Preload demo data for preview only
  // Remove the entire demoData definition block (lines 664-726)

  useEffect(() => {
    // Remove automatic template selection - let users choose manually
    // This was causing auto-navigation without user interaction
    // if (!activeTemplateId && templates.length > 0) {
    //   if (templates[0] && typeof templates[0].id === 'number') {
    //     console.log('[ResumeBuilder] Setting default template to:', templates[0].name, 'ID:', templates[0].id);
    //     setActiveTemplateId(templates[0].id); // Default to the first template's ID
    //   }
    // }
  }, [templates, activeTemplateId]);

  useEffect(() => {
    setResumeData(prev => ({
      ...prev,
      templateId: activeTemplateId ? String(activeTemplateId) : '' // Only set if template is actually selected
    }));
  }, [activeTemplateId]);

  const handleDataChange = (newData: Partial<ResumeData>) => {
    console.log('[ResumeBuilder] handleDataChange called with:', newData);
    const previousData = resumeData;
    const updatedData = {
      ...resumeData,
      ...newData,
      updatedAt: new Date().toISOString()
    };

    setResumeData(updatedData);
    setHasUnsavedChanges(true);

    // Check for newly completed sections
    const checkSectionCompletion = (sectionKey: string) => {
      switch (sectionKey) {
        case 'personal':
          const personalInfo = updatedData.personalInfo;
          const prevPersonalInfo = previousData.personalInfo;
          const isCompleteNow = !!(personalInfo?.firstName && personalInfo?.lastName && personalInfo?.email && personalInfo?.phone && personalInfo?.title && personalInfo?.summary?.length >= 50);
          const wasComplete = !!(prevPersonalInfo?.firstName && prevPersonalInfo?.lastName && prevPersonalInfo?.email && prevPersonalInfo?.phone && prevPersonalInfo?.title && prevPersonalInfo?.summary?.length >= 50);
          return isCompleteNow && !wasComplete;

        case 'experience':
          if (editorMode === 'fresher') return false;
          const experienceComplete = updatedData.experience?.some(exp => 
            exp.company && exp.position && exp.startDate && exp.description?.length >= 30
          );
          const prevExperienceComplete = previousData.experience?.some(exp => 
            exp.company && exp.position && exp.startDate && exp.description?.length >= 30
          );
          return experienceComplete && !prevExperienceComplete;

        case 'education':
          const educationComplete = updatedData.education?.some(edu => 
            edu.school && edu.degree && edu.startDate
          );
          const prevEducationComplete = previousData.education?.some(edu => 
            edu.school && edu.degree && edu.startDate
          );
          return educationComplete && !prevEducationComplete;

        case 'skills':
          const skillsComplete = updatedData.skills?.length >= 1;
          const prevSkillsComplete = previousData.skills?.length >= 1;
          return skillsComplete && !prevSkillsComplete;

        case 'languages':
          const languagesComplete = updatedData.languages?.length > 0;
          const prevLanguagesComplete = previousData.languages?.length > 0;
          return languagesComplete && !prevLanguagesComplete;

        case 'custom':
          const customComplete = updatedData.customSections?.length > 0;
          const prevCustomComplete = previousData.customSections?.length > 0;
          return customComplete && !prevCustomComplete;

        default:
          return false;
      }
    };

    // Check all applicable sections for completion (excluding custom sections)
    const sections = ['personal', 'experience', 'education', 'skills', 'languages'];
    const applicableSections = sections.filter(s => {
      if (editorMode === 'fresher') return s !== 'experience';
      return true;
    });

    applicableSections.forEach(section => {
      if (checkSectionCompletion(section)) {
        const sectionLabels = {
          personal: 'Personal Information',
          experience: 'Work Experience', 
          education: 'Education',
          skills: 'Skills',
          languages: 'Languages',
          custom: 'Custom Sections'
        };

        setCompletionNotifications(prev => [...prev, sectionLabels[section as keyof typeof sectionLabels]]);

        // Auto-dismiss notification after 4 seconds
        setTimeout(() => {
          setCompletionNotifications(prev => prev.slice(1));
        }, 4000);
      }
    });

    // Auto-save with debouncing
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(updatedData);
    }, 2000); // Auto-save after 2 seconds of inactivity
  };

  // Auto-save reference for debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save function
  const handleAutoSave = async (dataToSave: ResumeData) => {
    try {
      await apiRequest('POST', '/api/resumes', dataToSave);
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());

      // Show brief auto-save indicator
      const indicator = document.createElement('div');
      indicator.className = 'fixed bottom-4 right-4 z-50 bg-green-500/90 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 transition-opacity';
      indicator.textContent = '✓ Auto-saved';
      document.body.appendChild(indicator);

      // Fade in and out
      setTimeout(() => indicator.style.opacity = '1', 10);
      setTimeout(() => indicator.style.opacity = '0', 1500);
      setTimeout(() => document.body.removeChild(indicator), 2000);

    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Preview data is simply the current resume plus editor mode flag
  const previewData: any = {
    ...resumeData, 
    editorMode,
  };

  // Find the active template object based on activeTemplateId
  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  console.log('[ResumeBuilder] Active Template for Preview:', activeTemplate);
  console.log('[ResumeBuilder] Active Template ID:', activeTemplateId);
  console.log('[ResumeBuilder] All available templates:', templates.map(t => ({ id: t.id, name: t.name })));
  console.log('[ResumeBuilder] Templates loading state:', isLoadingTemplates);
  console.log('[ResumeBuilder] Skills data being passed to preview:', previewData.skills);
  console.log('[ResumeBuilder] Full merged preview data:', previewData);
  console.log('[ResumeBuilder] Templates array length:', templates.length);
  if (activeTemplate) {
    console.log('[ResumeBuilder] Active Template Code (first 100 chars):', activeTemplate.code ? activeTemplate.code.substring(0, 100) + '...' : 'CODE IS EMPTY');
    console.log('[ResumeBuilder] Active Template Name:', activeTemplate.name);
    console.log('[ResumeBuilder] Active Template Code Length:', activeTemplate.code ? activeTemplate.code.length : 0);
  } else {
    console.log('[ResumeBuilder] No Active Template found for Preview.');
  }

  // Add safety check for template code
  const templateCodeToPass = activeTemplate?.code || '';
  console.log('[ResumeBuilder] Template code being passed to ResumePreview:', templateCodeToPass ? 'HAS CODE' : 'EMPTY');
  console.log('[ResumeBuilder] Template code length being passed:', templateCodeToPass.length);
  console.log('[ResumeBuilder] Editor Mode being passed to template:', editorMode);
  console.log('[ResumeBuilder] previewData.editorMode:', previewData.editorMode);
  console.log('[ResumeBuilder] previewData.experience length:', previewData.experience?.length || 0);

  // If we have a template selected but no code, use a fallback
  const finalTemplateCode = templateCodeToPass || (activeTemplate ? `
    // Fallback template for ${activeTemplate.name}
    const FallbackTemplate = ({ userData }) => {
      return React.createElement('div', {
        style: {
          display: 'flex',
          fontFamily: 'Arial, sans-serif',
          background: '#fff',
          width: '800px',
          height: '1131px',
          margin: '0 auto'
        }
      }, [
        // Left Sidebar
        React.createElement('div', {
          key: 'sidebar',
          style: {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: '#fff',
            width: '280px',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          // Contact Section
          React.createElement('div', {
            key: 'contact',
            style: { marginBottom: '40px' }
          }, [
            React.createElement('h3', {
              key: 'contact-title',
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '20px',
                letterSpacing: '1px',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: '8px'
              }
            }, 'CONTACT'),
            React.createElement('div', {
              key: 'contact-details',
              style: { fontSize: '13px', lineHeight: '1.6' }
            }, [
              // Phone
              userData.personalInfo?.phone && React.createElement('div', {
                key: 'phone',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'center' }
              }, [
                React.createElement('span', { key: 'phone-icon', style: { marginRight: '8px' } }, '📞'),
                React.createElement('span', { key: 'phone-text' }, userData.personalInfo.phone)
              ]),
              // Email
              userData.personalInfo?.email && React.createElement('div', {
                key: 'email',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'center' }
              }, [
                React.createElement('span', { key: 'email-icon', style: { marginRight: '8px' } }, '✉️'),
                React.createElement('span', { key: 'email-text', style: { wordBreak: 'break-all' } }, userData.personalInfo.email)
              ]),
              // Address
              userData.personalInfo?.address && React.createElement('div', {
                key: 'address',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }
              }, [
                React.createElement('span', { key: 'address-icon', style: { marginRight: '8px', marginTop: '2px' } }, '📍'),
                React.createElement('span', { key: 'address-text' }, userData.personalInfo.address)
              ]),
              // LinkedIn
              userData.personalInfo?.contactDetails?.linkedin && React.createElement('div', {
                key: 'linkedin',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'center' }
              }, [
                React.createElement('span', { key: 'linkedin-icon', style: { marginRight: '8px' } }, '🔗'),
                React.createElement('span', { key: 'linkedin-text', style: { wordBreak: 'break-all' } }, userData.personalInfo.contactDetails.linkedin)
              ]),
              // Website
              userData.personalInfo?.contactDetails?.website && React.createElement('div', {
                key: 'website',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'center' }
              }, [
                React.createElement('span', { key: 'website-icon', style: { marginRight: '8px' } }, '🌐'),
                React.createElement('span', { key: 'website-text', style: { wordBreak: 'break-all' } }, userData.personalInfo.contactDetails.website)
              ]),
              // Driving License
              userData.personalInfo?.contactDetails?.drivingLicense && React.createElement('div', {
                key: 'license',
                style: { marginBottom: '12px', display: 'flex', alignItems: 'center' }
              }, [
                React.createElement('span', { key: 'license-icon', style: { marginRight: '8px' } }, '🚗'),
                React.createElement('span', { key: 'license-text' }, userData.personalInfo.contactDetails.drivingLicense)
              ])
            ].filter(Boolean))
          ])
        ]),
        // Right Content Area
        React.createElement('div', {
          key: 'content',
          style: {
            flex: 1,
            padding: '50px 40px',
            background: '#fff'
          }
        }, [
          React.createElement('h1', { key: 'name', style: { fontSize: '36px', fontWeight: 'bold', color: '#1e40af' } }, 
            (userData?.personalInfo?.firstName || 'Jane') + ' ' + (userData?.personalInfo?.lastName || 'Doe')),
          React.createElement('p', { key: 'title' }, userData?.personalInfo?.title || 'Product Designer'),
          // Dynamic About Section
          React.createElement('div', { key: 'about', style: { marginTop: '30px' } }, [
            React.createElement('h2', { 
              key: 'about-title',
              style: { fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }
            }, userData.editorMode === 'fresher' ? 'ABOUT ME' : 'PROFESSIONAL SUMMARY'),
            React.createElement('p', { 
              key: 'about-content',
              style: { fontSize: '14px', lineHeight: '1.6', color: '#374151' }
            }, userData.personalInfo?.summary || 'Add your professional summary here.')
          ]),
          // Experience Section - Only show if not fresher mode
          userData.editorMode !== 'fresher' && userData.experience?.length > 0 && React.createElement('div', { 
            key: 'experience', 
            style: { marginTop: '30px' } 
          }, [
            React.createElement('h2', { 
              key: 'exp-title',
              style: { fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }
            }, 'EXPERIENCE'),
            userData.experience.map((exp, index) => 
              React.createElement('div', { key: index, style: { marginBottom: '20px' } }, [
                React.createElement('h3', { 
                  key: 'exp-position',
                  style: { fontSize: '16px', fontWeight: 'bold', color: '#111827' }
                }, exp.position || exp.jobTitle),
                React.createElement('p', { 
                  key: 'exp-company',
                  style: { fontSize: '14px', color: '#1e40af', fontWeight: '600' }
                }, (exp.company || exp.companyName) + ' | ' + exp.startDate + ' - ' + (exp.endDate || 'Present')),
                React.createElement('p', { 
                  key: 'exp-desc',
                  style: { fontSize: '13px', lineHeight: '1.5', color: '#4b5563' }
                }, exp.description)
              ])
            )
          ]),
          // Education Section - Always show
          userData.education?.length > 0 && React.createElement('div', { 
            key: 'education', 
            style: { marginTop: '30px' } 
          }, [
            React.createElement('h2', { 
              key: 'edu-title',
              style: { fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }
            }, 'EDUCATION'),
            userData.education.map((edu, index) => 
              React.createElement('div', { key: index, style: { marginBottom: '15px' } }, [
                React.createElement('h3', { 
                  key: 'edu-school',
                  style: { fontSize: '16px', fontWeight: 'bold', color: '#111827' }
                }, edu.school || edu.institution),
                React.createElement('p', { 
                  key: 'edu-degree',
                  style: { fontSize: '14px', color: '#1e40af', fontWeight: '600' }
                }, edu.degree + ' | ' + edu.startDate + ' - ' + (edu.endDate || 'Present'))
              ])
            )
          ])
        ])
      ]);
    };
    render(React.createElement(FallbackTemplate, { userData: userData }));
  ` : `
render(
  <div style={{
    display: 'flex',
    fontFamily: 'Arial, sans-serif',
    background: '#fff',
    width: '800px',
    height: '1131px',
    margin: '0 auto'
  }}>
    {/* Left Sidebar */}
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      color: '#fff',
      width: '280px',
      padding: '40px 30px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Contact Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          letterSpacing: '1px',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px'
        }}>CONTACT</h3>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          {userData.personalInfo?.phone && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>📞</span>
              <span>{userData.personalInfo.phone}</span>
            </div>
          )}
          {userData.personalInfo?.email && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>✉️</span>
              <span style={{ wordBreak: 'break-all' }}>{userData.personalInfo.email}</span>
            </div>
          )}
          {userData.personalInfo?.address && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '8px', marginTop: '2px' }}>📍</span>
              <span>{userData.personalInfo.address}</span>
            </div>
          )}
          {userData.personalInfo?.contactDetails?.linkedin && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🔗</span>
              <span style={{ wordBreak: 'break-all' }}>{userData.personalInfo.contactDetails.linkedin}</span>
            </div>
          )}
          {userData.personalInfo?.contactDetails?.website && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🌐</span>
              <span style={{ wordBreak: 'break-all' }}>{userData.personalInfo.contactDetails.website}</span>
            </div>
          )}
          {userData.personalInfo?.contactDetails?.drivingLicense && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🚗</span>
              <span>{userData.personalInfo.contactDetails.drivingLicense}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          letterSpacing: '1px',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px'
        }}>SKILLS</h3>
        <div>
          {userData.skills?.slice(0, 6).map((skill, index) => {
            const percentage = skill.level || skill.proficiency || (skill.stars ? skill.stars * 20 : 80);
  return (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{skill.name}</span>
                  <span style={{ fontSize: '12px', opacity: '0.9' }}>{typeof percentage === 'number' ? percentage : 80}%</span>
          </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: \`\${typeof percentage === 'number' ? percentage : 80}%\`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
                    borderRadius: '3px',
                    transition: 'width 1s ease-in-out'
                  }}></div>
        </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Languages Section */}
      {userData.languages && userData.languages.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '1px',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
            paddingBottom: '8px'
          }}>LANGUAGES</h3>
          <div>
            {userData.languages.map((lang, index) => (
              <div key={index} style={{
                fontSize: '13px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: '500' }}>{lang.name}</span>
                <span style={{ opacity: '0.9' }}>({lang.proficiency})</span>
          </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests Section */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          letterSpacing: '1px',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px'
        }}>INTERESTS</h3>
        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
          {userData.customSections?.find(section => section.title?.toLowerCase().includes('interest'))?.content || 
           'Technology, Design, Innovation'}
        </div>
      </div>
    </div>

    {/* Right Content Area */}
    <div style={{
      flex: 1,
      padding: '50px 40px',
      background: '#fff'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1e40af',
          marginBottom: '8px',
          letterSpacing: '2px'
        }}>
          {userData.personalInfo?.firstName?.toUpperCase()} {userData.personalInfo?.lastName?.toUpperCase()}
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#1e40af',
          fontWeight: '600',
          marginBottom: '0'
        }}>
          {userData.personalInfo?.jobTitle || userData.personalInfo?.title}
        </p>
        <div style={{
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
          marginTop: '15px'
        }}></div>
      </div>

      {/* About Section */}
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1e40af',
          marginBottom: '15px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>{userData.editorMode === 'fresher' ? 'ABOUT ME' : 'PROFESSIONAL SUMMARY'}</h2>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#374151',
          margin: '0'
        }}>
          {userData.professionalSummary || userData.personalInfo?.summary || 
           'Creative and detail-oriented product designer with 5+ years of experience in UI/UX and digital product design.'}
        </p>
      </div>

      {/* Experience Section */}
      {userData.editorMode !== 'fresher' && userData.experience && userData.experience.length > 0 && (
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '20px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>EXPERIENCE</h2>
          {userData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {exp.jobTitle || exp.position}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1e40af',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {exp.companyName || exp.company} | {exp.startDate} - {exp.endDate}
              </p>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#4b5563',
                margin: '0'
              }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {userData.education && userData.education.length > 0 && (
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '20px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>EDUCATION</h2>
          {userData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {edu.institution || edu.school}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1e40af',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {edu.degree} | {edu.graduationDate || \`\${edu.startDate} - \${edu.endDate}\`}
              </p>
              {edu.description && (
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {userData.certifications && userData.certifications.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '20px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>CERTIFICATIONS</h2>
          {userData.certifications.map((cert, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '2px'
              }}>
                {cert.name}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#1e40af',
                fontWeight: '600',
                margin: '0'
              }}>
                {cert.issuer} | {cert.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
`);

  // Dynamically compute preview scale based on the preview column width so the resume fits nicely
  const [previewScale, setPreviewScale] = useState(0.4);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Resize observer to keep the preview scaled to available width
  useLayoutEffect(() => {
    const computeScale = () => {
      if (previewContainerRef.current) {
        const availableWidth = previewContainerRef.current.offsetWidth;
        // Template is designed at 800-px width – scale to fit while keeping aspect ratio
        const scale = Math.min(1, availableWidth / 800);
        setPreviewScale(scale);
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  // Initialize state and track template selection
  const [hasSelectedTemplate, setHasSelectedTemplate] = useState(false);
  const [isFirstTemplateSelection, setIsFirstTemplateSelection] = useState(true);

  // Check for URL params on load to detect if a template was selected from Home page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateFromUrl = urlParams.get('template');

    if (templateFromUrl) {
      const templateId = parseInt(templateFromUrl);
      if (!isNaN(templateId)) {
        setActiveTemplateId(templateId);
        setHasSelectedTemplate(true);
        setActiveTab('content'); // Go directly to content if template was pre-selected
      }
    }
  }, []);

  // Auto-navigate to content when template is selected
  useEffect(() => {
    if (activeTemplateId && !hasSelectedTemplate) {
      setHasSelectedTemplate(true);
      // Navigate immediately without delay
      setActiveTab('content');
    }
  }, [activeTemplateId, hasSelectedTemplate]);

  // Wrapper to handle both template clicks and Content Editing button clicks
  const handleTemplateInteraction = (templateId: number, forceNavigation: boolean = false) => {
    setActiveTemplateId(templateId);

    if (forceNavigation || isFirstTemplateSelection) {
      // Force navigation (Content Editing button) OR first time: immediately navigate to content
      setHasSelectedTemplate(true);
      setIsFirstTemplateSelection(false);
      setActiveTab('content');
    } else {
      // Subsequent times: check if this template is already selected
      if (activeTemplateId === templateId) {
        // If clicking on already selected template, navigate to content
        setActiveTab('content');
      } else {
        // If clicking on different template, just select it, don't navigate
        setHasSelectedTemplate(true);
      }
    }
  };

  return (
    <div className="resume-builder dark min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Enhanced Floating Particles Background */}
      {!isMobile && <FloatingParticles />}

      {/* Enhanced Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      <SaveStatusIndicator hasUnsavedChanges={hasUnsavedChanges} />

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column: Editor (2/3 width) */}
            <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/10 backdrop-blur-xl border border-transparent rounded-2xl shadow-lg overflow-hidden mobile-card-fallback ios-fix-blur"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}

          >
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 border-b border-transparent">
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Resume Builder
              </motion.h1>
              <p className="text-white/70 text-sm tracking-wide">Create your professional resume with ease</p>
          </div>

            <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid grid-cols-2 w-full ${isMobile ? 'mb-4' : 'mb-8'} rounded-full bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm p-1 h-12`}>
                  <TabsTrigger 
                    value="template" 
                    className="rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-300 h-10 flex items-center justify-center"
                  >
                    <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <GraduationCap className="w-4 h-4" />
                      Template
                    </motion.div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className="rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-300 h-10 flex items-center justify-center"
                  >
                    <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <User className="w-4 h-4" />
                      Content
                    </motion.div>
                  </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="w-full m-0 p-0">
                  <div className={`${isMobile ? 'mb-4' : 'mb-6'} flex justify-center`}>
                    <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as 'fresher' | 'experienced')} className={`w-full ${isMobile ? 'max-w-full' : 'max-w-xs'}`}>
                      <TabsList className="grid grid-cols-2 w-full rounded-full bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm p-1 h-10">
                        <TabsTrigger 
                          value="fresher" 
                          className="rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-300 h-8 flex items-center justify-center"
                        >
                          <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Fresher</motion.span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="experienced" 
                          className="rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-300 h-8 flex items-center justify-center"
                        >
                          <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Experienced</motion.span>
                        </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                  <ProgressTracker resumeData={resumeData} editorMode={editorMode} isMobile={isMobile} activeSection={activeSection} onSectionChange={setActiveSection} sections={sections} getCompletionStatus={getCompletionStatus} />

                <SectionEditor 
                  resumeData={resumeData} 
                  onChange={handleDataChange} 
                  editorMode={editorMode}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
              </TabsContent>
              <TabsContent value="template" className="w-full m-0 p-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Choose a Template
                    </h2>
                <TemplateSelector 
                  templates={templates} 
                  selectedTemplate={activeTemplateId}
                  onSelectTemplate={handleTemplateInteraction}
                />
                  </motion.div>
              </TabsContent>
            </Tabs>

            {/* Mobile Action Buttons - Only visible on mobile */}
            {isMobile && (
              <motion.div 
                className="flex items-center justify-between gap-3 mt-6 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
          </div>
                </Button>
                <Button 
                  size="lg"
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </div>
                </Button>
              </motion.div>
            )}
          </div>
          </motion.div>
        </div>

            {/* Right Column: Preview (1/3 width) - Hidden on Mobile */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <div className="sticky top-32">
            <ContextualTipBar />

              <motion.div 
                className="bg-white/10 backdrop-blur-xl border border-transparent rounded-2xl shadow-lg overflow-hidden mobile-card-fallback ios-fix-blur"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  boxShadow: "0 20px 40px -10px rgba(147, 51, 234, 0.15)"
                }}
              >
                {/* Clean Preview Header */}
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-white/90">Live Preview</span>
                      <div className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium">Real-time</div>
                      <div className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium">Following</div>
                </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>

                {/* Lightweight viewport container */}
                <div 
                  ref={previewContainerRef}
                  className="mx-auto relative w-full"
                  style={{ 
                    // Height must follow aspect ratio (A4 800 × 1131)
                    height: `${(1131 * previewScale) - 4}px`,
                    overflow: 'hidden',
                  }}
                >
                  {/* The entire conditional block for the dot is removed from here */}

                  {/* CPU-optimized scaled content wrapper */}
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
                    {isLoadingTemplates ? (
                      <div className="text-white flex items-center justify-center h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                          <p className="text-sm text-white/70">Loading templates...</p>
          </div>
        </div>
                    ) : !activeTemplateId ? (
                      <div className="text-white flex items-center justify-center h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                        <div className="text-center">
                          <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                          <p className="text-sm text-white/70">Select a template to see preview</p>
                        </div>
                      </div>
                    ) : (
                      <ResumePreview
                        resumeData={previewData}
                        templateCode={finalTemplateCode}
                      />
                    )}
          </div>
        </div>
              </motion.div>

              {/* Optimized Action Buttons */}
              <motion.div 
                className="flex items-center justify-between gap-3 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </div>
                </Button>
                <Button 
                  size="lg"
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </div>
                </Button>
              </motion.div>

              {/* Simple Last Save Indicator */}
              {lastSaveTime && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-xs text-white/50 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-transparent mt-3 mobile-safe-text-white mobile-card-fallback ios-fix-blur"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Last saved: {lastSaveTime.toLocaleTimeString()}
                  </div>
                </motion.div>
              )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResumePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        resumeData={previewData}
        templateCode={finalTemplateCode}
        editorMode={editorMode}
      />

      <DownloadOptionsModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        resumeData={previewData}
        templateCode={finalTemplateCode}
        templateId={activeTemplate?.id}
        templateName={activeTemplate?.name}
        templateType={templateType}
      />

      <CompletionNotification notifications={completionNotifications} onDismiss={(index) => {
        const newNotifications = completionNotifications.filter((_, i) => i !== index);
        setCompletionNotifications(newNotifications);
      }} />
    </div>
  );
}
