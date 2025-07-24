import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';
import { ArrowLeft, HelpCircle, Edit, Trash, ArrowRight, CheckCircle, PlusCircle, School, BookOpen } from 'lucide-react';
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

const EducationSummaryPage = () => {
  const [, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const updateResumeData = actions?.updateResumeData;
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Use the Education type from the context for clarity
  type Education = typeof resumeData.education[0];

  // Relax the filtering logic to only require school and degree
  const validEducations = (resumeData.education || []).filter((edu: Education) => 
    edu.school && edu.degree
  );

  // Show success notification when page loads with education entries
  useEffect(() => {
    if (validEducations.length > 0) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [resumeData.education]); // Depend on the actual data

  const handleBack = () => {
    setLocation('/education');
  };

  const handleNext = () => {
    setLocation('/skills');
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleEditEducation = (id: string | undefined, index: number) => {
    // Navigate to education page with the specified id or index as a fallback
    if (id) {
      setLocation(`/education?id=${id}`);
    } else {
      setLocation(`/education?index=${index}`);
    }
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducation = [...(resumeData.education || [])];
    updatedEducation.splice(index, 1);
    updateResumeData({ ...resumeData, education: updatedEducation });
  };

  const handleAddNewEducation = () => {
    // Navigate to the education page without any params to add a new entry
    setLocation('/education');
  };

  const handleAiAssistance = () => {
    // This would connect to an AI assistance feature
    console.log('AI assistance requested');
  };

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
            <span>Your education information is looking great!</span>
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
          <ProgressStepper currentStep={3} />

          <div className="max-w-6xl mx-auto">

          {/* Page Title and Tips */}
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Education summary
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
                  <p className="font-medium text-white mb-2">💡 Education Tips:</p>
                  <ul className="list-disc pl-5 space-y-1 text-white">
                    <li>Include every school, even if you're still there or didn't graduate</li>
                    <li>List your highest level of education first</li>
                    <li>You can add honors, achievements, and relevant coursework</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          <motion.p 
            className="text-gray-300 text-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Review and manage your education information. You can edit, delete, or add new entries.
          </motion.p>

          {/* AI Writing Assistant Banner */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex-shrink-0 mr-5">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center border border-purple-400/30">
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-white text-lg">Not sure how to describe your education?</h3>
              <p className="text-gray-300">Get help crafting descriptions that highlight your academic achievements.</p>
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

          {/* Education List with animations */}
          <motion.div
            className="space-y-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {validEducations.length > 0 ? (
              validEducations.map((edu: Education, index: number) => (
                <motion.div 
                  key={edu.id || index} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative hover:bg-white/10 transition-all duration-300"
                  variants={item}
                  whileHover={{ 
                    y: -5, 
                    borderColor: "rgba(139, 92, 246, 0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white h-8 w-8 flex items-center justify-center rounded-full font-medium shadow-md">
                    {index + 1}
                  </div>

                  <div className="ml-12">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl text-white">{edu.degree}</h3>
                        <p className="font-medium text-purple-300">{edu.school}</p>
                        <p className="text-gray-300">
                          {edu.location ? `${edu.location} | ` : ''}
                          {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : (edu.endDate || edu.startDate)}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button 
                          onClick={() => handleEditEducation(edu.id, index)}
                          className="text-blue-400 hover:text-blue-300 bg-blue-500/20 p-2 rounded-full hover:bg-blue-500/30 transition-colors duration-200"
                          aria-label="Edit education"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDeleteEducation(index)}
                          className="text-red-400 hover:text-red-300 bg-red-500/20 p-2 rounded-full hover:bg-red-500/30 transition-colors duration-200"
                          aria-label="Delete education"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {edu.description && (
                      <div className="mt-4">
                        <p className="text-gray-300 whitespace-pre-wrap">{edu.description}</p>
                      </div>
                    )}

                    <motion.button 
                      onClick={() => handleEditEducation(edu.id, index)}
                      className="text-purple-400 hover:text-purple-300 text-sm mt-4 flex items-center hover:underline transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit details
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                variants={item}
              >
                <p className="text-gray-300">No education information added yet. Add your education to get started.</p>
              </motion.div>
            )}

            {/* Add New Education Button with animation */}
            <motion.div 
              className="border-2 border-dashed border-purple-400/30 rounded-2xl p-6 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors duration-300"
              variants={item}
              whileHover={{ 
                scale: 1.02,
                borderColor: "rgba(139, 92, 246, 0.6)",
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <motion.button 
                onClick={handleAddNewEducation}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add another degree
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
                className="border-purple-400 text-purple-400 hover:bg-purple-500/20 bg-white/10 backdrop-blur-xl px-6 py-2 rounded-md font-medium"
              >
                Preview
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black px-6 py-2 rounded-md shadow-md flex items-center font-medium"
              >
                Next: Skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {(() => {
        const activeProTemplate = activeProTemplateId ? getProTemplateById(activeProTemplateId) : null;
        return activeProTemplate && (
          <ResumePreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            resumeData={resumeData}
            templateCode={activeProTemplate.code}
          />
        );
      })()}
    </div>
  );
};

export default EducationSummaryPage;