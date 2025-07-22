import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';
import { ArrowLeft, HelpCircle, Edit, Trash, ArrowRight, CheckCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressStepper from '@/components/ProgressStepper';
import { useResumeStore } from '@/stores/resumeStore';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';

// Use the same Experience interface as ResumeContext
interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
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

const WorkHistorySummaryPage = () => {
  const [, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors
  const resumeData = useResumeStore(state => state.resumeData);
  const updateWorkExperience = useResumeStore(state => state.actions.updateWorkExperience);
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const actions = useResumeStore(state => state.actions);
  const updateResumeData = actions?.updateResumeData;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Show success notification when page loads with work experiences
  useEffect(() => {
    const validExperiences = resumeData.experience.filter((job: Experience) => 
      job.position && job.company
    );

    if (validExperiences.length > 0) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Format dates for display
  const formatDate = (month: string, year: string) => {
    return `${month} ${year}`;
  };

  const handleBack = () => {
    setLocation('/work-experience-details');
  };

  const handleNext = () => {
    setLocation('/education');
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleEditDescription = (id: string | undefined, index: number) => {
    if (id) {
        setLocation(`/job-description?id=${id}`);
    } else {
      // Fall back to index when ID is missing – pass index in query
      setLocation(`/job-description?index=${index}`);
    }
  };

  const handleEditWorkExperience = (id: string | undefined, index: number) => {
    if (id) {
        setLocation(`/work-experience-details?id=${id}`);
    } else {
      // Fall back to index when ID is missing – pass index in query
      setLocation(`/work-experience-details?index=${index}`);
    }
  };

  const handleDeleteJob = (id: string | undefined, index: number) => {
    let updatedExperience;
    if (id) {
      updatedExperience = resumeData.experience.filter((job: Experience) => job.id !== id);
    } else {
      // Fall back to index when id is missing
      updatedExperience = resumeData.experience.filter((_, idx) => idx !== index);
    }
    updateResumeData({ ...resumeData, experience: updatedExperience });
  };

  const handleAddNewPosition = () => {
    setLocation('/work-experience-details');
  };

  const handleAiAssistance = () => {
    // This would connect to an AI assistance feature
    console.log('AI assistance requested');
  };

  // Add hydration check
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Check if the store has been hydrated by looking for the persist rehydration
    const unsubscribe = useResumeStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    
    // If already hydrated, set immediately
    if (useResumeStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    
    return unsubscribe;
  }, []);

  // Filter out incomplete job entries
  const validWorkExperiences = resumeData.experience.filter((job: Experience) => 
    job.position
  );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } }
  };

  const activeProTemplate = activeProTemplateId && getProTemplateById ? getProTemplateById(activeProTemplateId) : null;

  // Show loading state while store is hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading your work experience...</p>
        </div>
      </div>
    );
  }

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
            <span>Your work experience is looking great!</span>
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
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper currentStep={2} />

          <div className="max-w-6xl mx-auto">

          {/* Page Title and Tips */}
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Work history summary
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
                  <p className="font-medium text-white mb-2">💡 Tips:</p>
                  <p className="text-white">
                    List your most recent jobs first. Include key responsibilities that showcase your skills relevant to the job you're applying for.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          {/* AI Writing Assistant Banner */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 mb-8 flex items-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex-shrink-0 mr-5">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center shadow-inner border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-white text-lg">Unsure what to write or how to phrase it?</h3>
              <p className="text-gray-300">Answer a few quick questions, and we'll help craft interview-landing content as you go.</p>
            </div>
            <motion.button 
              onClick={handleAiAssistance}
              className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Let's go
            </motion.button>
          </motion.div>

          {/* Work Experience List with animations */}
          <motion.div
            className="space-y-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {validWorkExperiences.length > 0 ? (
              validWorkExperiences.map((job: Experience, index: number) => (
                <motion.div 
                  key={job.id || index} 
                  className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-300"
                  variants={item}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    borderColor: "#8B5CF6",
                    borderLeftColor: "#8B5CF6",
                    borderLeftWidth: "4px"
                  }}
                >
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white h-8 w-8 flex items-center justify-center rounded-full font-medium shadow-md">
                    {index + 1}
                  </div>

                  <div className="ml-12">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl text-white">{job.position}</h3>
                        <p className="text-gray-300">
                          {job.company}{job.location ? `, ${job.location}` : ''} | {job.startDate} - {job.endDate}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button 
                          onClick={() => handleEditWorkExperience(job.id, index)}
                          className="text-blue-400 hover:text-blue-300 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                          aria-label="Edit job description"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDeleteJob(job.id, index)}
                          className="text-red-400 hover:text-red-300 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                          aria-label="Delete job"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      {job.description.split('\n').map((item: string, i: number) => (
                        item.trim() && (
                          <motion.li 
                            key={i} 
                            className="text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 * i }}
                          >
                            {item.trim()}
                          </motion.li>
                        )
                      ))}
                    </ul>

                    <motion.button 
                      onClick={() => handleEditDescription(job.id, index)}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-4 flex items-center hover:underline transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit description
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-10 bg-white/5 backdrop-blur-xl rounded-xl shadow-sm border border-white/10"
                variants={item}
              >
                <p className="text-gray-300">No work experience added yet. Add a position to get started.</p>
              </motion.div>
            )}

            {/* Add New Position Button with animation */}
            <motion.div 
              className="border-2 border-dashed border-white/20 rounded-xl p-6 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors duration-300"
              variants={item}
              whileHover={{ 
                scale: 1.02,
                borderColor: "#8B5CF6",
                backgroundColor: "rgba(139, 92, 246, 0.1)"
              }}
            >
              <motion.button 
                onClick={handleAddNewPosition}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add new position
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Navigation Buttons with animations */}
          <motion.div 
            className="flex justify-end space-x-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handlePreview}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-500/20 bg-white/10 px-6 py-2 rounded-md font-medium"
              >
                Preview
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black px-6 py-2 rounded-md shadow-md flex items-center font-medium"
              >
                Next: Education
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          </div>
        </div>
      </main>

      {activeProTemplate && (
        <ResumePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          templateCode={activeProTemplate.code}
          resumeData={resumeData}
        />
      )}
    </div>
  );
};

export default WorkHistorySummaryPage;