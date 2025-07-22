import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, HelpCircle, Search, Plus, ArrowRight, X, CheckCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressStepper from '@/components/ProgressStepper';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';
import { useResumeStore } from '@/stores/resumeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

// Define interfaces
interface JobTitle {
  id: number;
  title: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SummaryDescription {
  id: number;
  professionalSummaryTitleId: number;
  content: string;
  isRecommended: boolean;
}

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Container and item variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const ProfessionalSummaryPage = () => {
  const [, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors and hydration check
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const isMobile = useIsMobile();
  
  // Check if store is hydrated using Zustand's persist hydration
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Array<{type: string, data: any}>>([]);
  
  useEffect(() => {
    // Use a more reliable hydration check with polling
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkHydration = () => {
      const state = useResumeStore.getState();
      if (state.actions && typeof state.actions.updateResumeData === 'function') {
        setIsStoreHydrated(true);
        return true;
      }
      return false;
    };
    
    const pollForHydration = () => {
      if (checkHydration()) {
        // Process any pending updates
        if (pendingUpdates.length > 0) {
          const state = useResumeStore.getState();
          pendingUpdates.forEach(update => {
            if (update.type === 'updateResumeData' && state.actions?.updateResumeData) {
              state.actions.updateResumeData(update.data);
            }
          });
          setPendingUpdates([]);
        }
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(pollForHydration, 100);
      } else {
        console.warn('Store hydration timeout - some features may not work properly');
      }
    };
    
    pollForHydration();
  }, [pendingUpdates]);
  
  // Helper function to execute resume data updates with hydration check
  const executeResumeDataUpdate = (data: any) => {
    if (isStoreHydrated) {
      const state = useResumeStore.getState();
      if (state.actions?.updateResumeData && typeof state.actions.updateResumeData === 'function') {
        state.actions.updateResumeData(data);
      } else {
        console.error('updateResumeData is not available or not a function');
      }
    } else {
      // Queue the update for when store is hydrated
      setPendingUpdates(prev => [...prev, { type: 'updateResumeData', data }]);
    }
  };
  
  const updateResumeData = actions?.updateResumeData;

  // Professional Summary editing state
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<JobTitle[]>([]);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [currentJobTitle, setCurrentJobTitle] = useState<JobTitle | null>(null);
  const [professionalSummary, setProfessionalSummary] = useState(resumeData.personalInfo?.summary || '');
  const [summaryDescriptions, setSummaryDescriptions] = useState<SummaryDescription[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Hardcoded suggestions for demo
  const hardcodedSuggestions: JobTitle[] = [
    { id: 28, title: 'Manager', category: 'Management' },
    { id: 29, title: 'Marketing Manager', category: 'Marketing' },
    { id: 30, title: 'Marketing Coordinator', category: 'Marketing' },
    { id: 31, title: 'Marketing Specialist', category: 'Marketing' },
    { id: 32, title: 'Machine Learning Engineer', category: 'Technology' },
    { id: 33, title: 'Software Engineer', category: 'Technology' },
    { id: 34, title: 'Product Manager', category: 'Product' },
    { id: 35, title: 'Data Scientist', category: 'Data' },
    { id: 36, title: 'UI/UX Designer', category: 'Design' },
    { id: 37, title: 'Project Manager', category: 'Management' },
    { id: 38, title: 'Business Analyst', category: 'Business' },
    { id: 39, title: 'DevOps Engineer', category: 'Technology' },
    { id: 40, title: 'Content Writer', category: 'Marketing' }
  ];

  // Mock summary examples
  const mockSummaryDescriptions: SummaryDescription[] = [
    {
      id: 1,
      professionalSummaryTitleId: 28,
      content: "Results-driven professional with 5+ years of experience leading cross-functional teams and driving strategic initiatives. Proven track record of improving operational efficiency by 30% and delivering projects on time and within budget.",
      isRecommended: true
    },
    {
      id: 2,
      professionalSummaryTitleId: 28,
      content: "Experienced manager with expertise in team leadership, process optimization, and strategic planning. Successfully managed teams of 15+ employees and implemented cost-saving initiatives that reduced operational expenses by 25%.",
      isRecommended: true
    },
    {
      id: 3,
      professionalSummaryTitleId: 28,
      content: "Dynamic professional with strong analytical and leadership skills. Passionate about fostering collaborative work environments and driving continuous improvement through data-driven decision making.",
      isRecommended: false
    }
  ];

  // Filter job titles based on search term
  const filteredJobTitles = searchTerm.trim() !== ''
    ? hardcodedSuggestions.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : hardcodedSuggestions.slice(0, 10);

  // Get active template for preview
  const activeProTemplate = activeProTemplateId ? getProTemplateById(activeProTemplateId) : null;

  // Prepare preview data
  const previewData = {
    ...resumeData,
    personalInfo: {
      ...resumeData.personalInfo,
      summary: professionalSummary
    }
  };

  // Load summaries when current job title changes
  useEffect(() => {
    if (currentJobTitle) {
      setIsLoadingSummaries(true);
      // Simulate API call
      setTimeout(() => {
        setSummaryDescriptions(mockSummaryDescriptions);
        setIsLoadingSummaries(false);
      }, 500);
    }
  }, [currentJobTitle]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowJobTitleSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-save professional summary changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProfessionalSummary();
    }, 1000);

    return () => clearTimeout(timer);
  }, [professionalSummary]);

  const handleBack = () => {
    setLocation('/skills-summary');
  };

  const handleNext = () => {
    setLocation('/add-section');
  };

  const saveProfessionalSummary = () => {
    executeResumeDataUpdate({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        summary: professionalSummary
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setShowJobTitleSuggestions(false);
      setCurrentJobTitle(null);
    } else {
      setShowJobTitleSuggestions(true);
    }
  };

  const handleSummaryClick = (content: string) => {
    setProfessionalSummary(content);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Success notification */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Professional summary updated!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-32 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-all hover:-translate-x-1 duration-300 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Skills</span>
            </button>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper currentStep={5} />

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Professional Summary
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300">
                        <HelpCircle className="h-5 w-5" />
                        <span className="hidden sm:inline font-medium">Tips</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                      <p className="font-medium text-white mb-2">💡 Summary Tips:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Keep it concise (2-3 sentences)</li>
                        <li>Highlight your key achievements</li>
                        <li>Include relevant skills and experience</li>
                        <li>Tailor it to the job you're applying for</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-300 text-lg">Write a compelling professional summary that highlights your key achievements and skills.</p>
            </motion.div>

            {/* Content Editing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Examples */}
              <div>
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6 transform transition-all hover:scale-[1.01] duration-300"
                >
                  <h2 className="text-xs uppercase font-bold text-purple-300 mb-2">SEARCH BY JOB TITLE FOR PRE-WRITTEN EXAMPLES</h2>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-50 group-hover:opacity-70 blur group-hover:blur-md transition duration-300"></div>
                    <div className="relative bg-white rounded-lg">
                      <Input 
                        type="text"
                        ref={searchInputRef}
                        placeholder="Search by job title"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="rounded-lg border-gray-300 pr-10 py-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                        onFocus={() => {
                          if (filteredJobTitles.length > 0) {
                            setShowJobTitleSuggestions(true);
                          }
                        }}
                      />
                      {searchTerm ? (
                        <button 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                          onClick={() => setSearchTerm('')}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      ) : (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 animate-pulse">
                          <Search className="h-5 w-5" />
                        </div>
                      )}

                      {/* Job title suggestions dropdown */}
                      {showJobTitleSuggestions && (
                        <div 
                          ref={suggestionsRef}
                          className="absolute z-50 mt-1 w-full"
                          style={{ top: '100%', left: 0 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto backdrop-blur-sm bg-white/80">
                            <div className="py-1">
                              {filteredJobTitles.length > 0 ? (
                                filteredJobTitles.map((jobTitle: JobTitle, index) => (
                                  <motion.div
                                    key={jobTitle.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                      setSearchTerm(jobTitle.title);
                                      setCurrentJobTitle(jobTitle);
                                      setShowJobTitleSuggestions(false);
                                    }}
                                  >
                                    <div className="font-medium text-gray-900">{jobTitle.title}</div>
                                    <div className="text-xs text-gray-500">{jobTitle.category}</div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                  No suggestions found
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Popular Job Titles */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold text-white">Popular Job Titles</h2>
                    <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors duration-300 flex items-center gap-1 group">
                      More <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hardcodedSuggestions.slice(0, 6).map((job, index) => (
                      <motion.button
                        key={`popular-job-${job.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="flex items-center border border-white/20 rounded-full px-3 py-2 text-sm bg-white/10 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 text-white"
                        onClick={() => {
                          setSearchTerm(job.title);
                          setCurrentJobTitle(job);
                        }}
                      >
                        <span>{job.title}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Summary Descriptions List */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="text-base font-semibold text-white mb-3">
                    {currentJobTitle ? `${currentJobTitle.title} Examples` : 'Example Professional Summaries'}
                  </h2>

                  {isLoadingSummaries ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {(currentJobTitle ? summaryDescriptions : mockSummaryDescriptions).map((desc, index) => (
                        <motion.div
                          key={desc.id}
                          variants={itemVariants}
                          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                          onClick={() => handleSummaryClick(desc.content)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {desc.isRecommended && (
                                <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full font-medium">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <Plus className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <p className="text-white text-sm leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                            {desc.content}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Editor */}
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Your Professional Summary
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Write or select content from the examples
                  </p>
                </div>

                <p className="text-sm text-purple-300 mb-3">Professional summary:</p>

                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-30 blur"></div>
                  <div className="relative">
                    <textarea 
                      className="w-full h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Click on any example from the left to add it to your professional summary, or write your own."
                      value={professionalSummary}
                      onChange={(e) => setProfessionalSummary(e.target.value)}
                    />
                  </div>
                </div>

                {/* Character count */}
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-400">
                    {professionalSummary.length} characters
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Mobile Action Button */}
            {isMobile && (
              <motion.div 
                className="flex items-center justify-center gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </div>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Buttons */}
      <motion.footer 
        className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-lg border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewModalOpen(true)}
            className="text-white bg-white/10 hover:bg-white/20 border-white/20 hover:text-white"
          >
            Preview
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            Next: Add section
          </Button>
        </div>
      </motion.footer>

      {/* Preview Modal */}
      <ResumePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        resumeData={previewData}
        templateCode={activeProTemplate?.code || ''}
      />
    </div>
  );
};

export default ProfessionalSummaryPage;