import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, HelpCircle, Edit, Trash, PlusCircle, Star, CheckCircle, BrainCircuit } from 'lucide-react';
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

// Define Skill interface - assuming it's available in resumeData.skills
// No need to define it here if it's part of the resume context's types.

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

const SkillsSummaryPage = () => {
  const [, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const updateResumeData = actions?.updateResumeData;
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Assuming resumeData.skills is an array of skill objects
  type SkillFromContext = (typeof resumeData.skills)[0];
  type Skill = SkillFromContext & { id?: string };

  const validSkills = (resumeData.skills || []).filter((skill: Skill) => 
    skill.name && skill.level
  );

  useEffect(() => {
    if (validSkills.length > 0) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [resumeData.skills]);

  // Handle navigation
  const handleBack = () => {
    setLocation('/education-summary');
  };

  const handleNext = () => {
    setLocation('/professional-summary');
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleAddNewSkill = () => {
    setLocation('/skills');
  };

  const handleEditSkill = (id: string | undefined, index: number) => {
    if (id) {
      setLocation(`/skills?id=${id}`);
    } else {
      setLocation(`/skills?index=${index}`);
    }
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...(resumeData.skills || [])];
    updatedSkills.splice(index, 1);
    updateResumeData({ ...resumeData, skills: updatedSkills });
  };

  const handleAiAssistance = () => {
    console.log('AI assistance for skills requested');
  };

  const renderStarRating = (level: string | number) => {
    const numericLevel = typeof level === 'string' ? parseInt(level, 10) : level;
    if (isNaN(numericLevel)) {
      return null;
    }
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= numericLevel ? 'text-yellow-400 fill-current' : 'text-gray-500'
            }`}
          />
        ))}
      </div>
    );
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

  const activeProTemplate = activeProTemplateId ? getProTemplateById(activeProTemplateId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Your skills section is looking sharp!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-32 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
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

          <ProgressStepper currentStep={4} />

          <div className="max-w-6xl mx-auto">

            <motion.div 
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Skills Summary
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
                    <p className="font-medium text-white mb-2">💡 Skills Tips:</p>
                    <ul className="list-disc pl-5 space-y-1 text-white">
                      <li>Include a mix of hard and soft skills.</li>
                      <li>Tailor your skills to the job you're applying for.</li>
                      <li>Be honest about your proficiency level.</li>
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
              Here's a summary of the skills you've added. You can add, edit, or remove skills.
            </motion.p>

            <motion.div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex-shrink-0 mr-5">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center border border-purple-400/30">
                  <BrainCircuit className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-white text-lg">Need help identifying your top skills?</h3>
                <p className="text-gray-300">Our AI can help you find relevant skills based on your experience.</p>
              </div>
              <motion.button 
                onClick={handleAiAssistance}
                className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Suggestions
              </motion.button>
            </motion.div>

            <motion.div
              className="space-y-5"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {validSkills.length > 0 ? (
                validSkills.map((skill: Skill, index: number) => (
                  <motion.div 
                    key={skill.id || index} 
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative hover:bg-white/10 transition-all duration-300"
                    variants={item}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{skill.name}</h3>
                        <div className="flex items-center mt-1">
                          {renderStarRating(skill.level)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-purple-400 hover:text-purple-300 hover:bg-white/10"
                                onClick={() => handleEditSkill(skill.id, index)}
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Skill</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-400 hover:bg-white/10"
                                onClick={() => handleDeleteSkill(index)}
                              >
                                <Trash className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Skill</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col items-center"
                  variants={item}
                >
                  <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-400/30">
                    <PlusCircle className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">No skills to show yet</h3>
                  <p className="text-gray-400 mb-6 max-w-sm">
                    Click the button below to add your first skill and showcase what you're great at.
                  </p>
                  <motion.button 
                    onClick={handleAddNewSkill}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add a Skill
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {validSkills.length > 0 && (
            <motion.div 
                className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
            >
                <button
                  onClick={handleAddNewSkill}
                  className="w-full border-2 border-dashed border-purple-400/30 text-purple-400 hover:text-purple-300 hover:border-purple-300 bg-white/5 hover:bg-purple-500/10 rounded-2xl py-6 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Add Another Skill</span>
                </button>
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
          <Button onClick={handlePreview} variant="outline" className="text-white bg-white/10 hover:bg-white/20 border-white/20 hover:text-white">
            Preview
          </Button>
          <Button onClick={handleNext} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            Next: Professional Summary
          </Button>
        </div>
      </motion.footer>

      {isPreviewModalOpen && (
        <ResumePreviewModal 
          isOpen={isPreviewModalOpen} 
          onClose={() => setIsPreviewModalOpen(false)}
          resumeData={resumeData}
          templateCode={activeProTemplate?.code || ''}
        />
      )}
    </div>
  );
};

export default SkillsSummaryPage;