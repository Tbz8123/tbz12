import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';
import { 
  ArrowLeft, 
  HelpCircle, 
  Plus, 
  Search, 
  Star, 
  ArrowRight,
  Loader,
  X
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
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

// Fallback skills to show
const fallbackSkills = [
  'Team Leadership',
  'Strategic Planning', 
  'Project Management',
  'Communication',
  'Problem Solving',
  'JavaScript',
  'React',
  'TypeScript',
  'Python',
  'SQL',
  'Data Analysis',
  'UI/UX Design',
  'Git',
  'Microsoft Office',
  'Presentation Skills'
];

const SkillsPage = () => {
  const [, setLocation] = useLocation();
  
  // Connect to ResumeStore with stable selectors and hydration check
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    (resumeData.skills || []).map(skill => ({
      id: skill.name, // Use name as id for local state
      name: skill.name,
      level: parseInt(skill.level) || 3
    }))
  );
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('text-editor');
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [skillText, setSkillText] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>(fallbackSkills);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter skills based on search term
  const filteredSkills = searchTerm.trim() !== ''
    ? skillSuggestions.filter(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : skillSuggestions.slice(0, 15);

  // Navigation handlers
  const handleBack = () => {
    saveSkills();
    setLocation('/education-summary');
  };

  const handleNext = () => {
    saveSkills();
    setLocation('/skills-summary');
  };

  const handlePreview = () => {
    saveSkills();
    setIsPreviewModalOpen(true);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
    }
  };

  // Handle skill selection
  const handleSkillClick = (skillName: string) => {
    // Add to textarea
    if (skillText) {
      setSkillText((prev) => prev + '\n• ' + skillName);
    } else {
      setSkillText('• ' + skillName);
    }

    // Check if already in selected skills
    const existingSkill = selectedSkills.find(s => s.name === skillName);
    if (!existingSkill) {
      const newSkill: Skill = {
        id: uuidv4(),
        name: skillName,
        level: 3 // Default rating
      };
      setSelectedSkills([...selectedSkills, newSkill]);
      setCurrentSkill(newSkill);
    }
  };

  // Set skill rating
  const handleSkillRating = (skill: Skill, rating: number) => {
    const updatedSkills = selectedSkills.map(s => 
      s.id === skill.id ? { ...s, level: rating } : s
    );
    setSelectedSkills(updatedSkills);
  };

  // Save skills to resume context
  const saveSkills = () => {
    if (skillText && selectedSkills.length === 0) {
      const lines = skillText.split('\n');
      const extractedSkills = lines.map(line => {
        const skillName = line.replace(/^[•\-*]\s*/, '').trim();
        return {
          name: skillName,
          level: '3' // Default level as string for context
        };
      }).filter(s => s.name.length > 0);

      if (extractedSkills.length > 0) {
        executeResumeDataUpdate({ skills: extractedSkills });
      }
    } else if (selectedSkills.length > 0) {
      // Convert local skills to context format
      const contextSkills = selectedSkills.map(skill => ({
        name: skill.name,
        level: skill.level.toString()
      }));
      executeResumeDataUpdate({ skills: contextSkills });
    }
  };

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSkillSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveSkills();
    };
  }, [selectedSkills]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

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
              <span>Back to Education</span>
            </button>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper currentStep={4} />

          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                What skills would you like to highlight?
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
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Include skills relevant to the job you're applying for</li>
                      <li>Rate your skills honestly</li>
                      <li>Balance technical skills with soft skills</li>
                      <li>Prioritize skills mentioned in the job description</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-gray-300 text-lg">To get started, you can choose from our expert recommended skills below.</p>
          </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Examples */}
              <div>
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6 transform transition-all hover:scale-[1.01] duration-300"
                >
                  <h2 className="text-xs uppercase font-bold text-purple-300 mb-2">SEARCH BY JOB TITLE OR SKILL</h2>
                  <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-50 group-hover:opacity-70 blur group-hover:blur-md transition duration-300"></div>
                    <div className="relative bg-white rounded-lg">
                    <Input 
                      type="text"
                      ref={searchInputRef}
                      placeholder="Search by job title or skill..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                        className="rounded-lg border-gray-300 pr-10 py-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                      onFocus={() => {
                        if (filteredSkills.length > 0) {
                          setShowSkillSuggestions(true);
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

                    {/* Search suggestions dropdown */}
                    {showSkillSuggestions && (
                      <div 
                        ref={suggestionsRef}
                          className="absolute z-50 mt-1 w-full"
                        style={{ top: '100%', left: 0 }}
                      >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto backdrop-blur-sm bg-white/80">
                        <div className="py-1">
                          {filteredSkills.map((skill, index) => (
                                <motion.div
                              key={`skill-${index}`}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setSearchTerm(skill);
                                handleSkillClick(skill);
                                setShowSkillSuggestions(false);
                              }}
                            >
                                  <div className="font-medium text-gray-900">{skill}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                        </div>
                      </div>
                </motion.div>

                {/* Related Skills */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold text-white">Popular Skills</h2>
                    <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors duration-300 flex items-center gap-1 group">
                      More <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions.slice(0, 6).map((skill, index) => (
                      <motion.button
                        key={`popular-skill-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="flex items-center border border-white/20 rounded-full px-3 py-2 text-sm bg-white/10 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 text-white"
                        onClick={() => handleSkillClick(skill)}
                      >
                        <span>{skill}</span>
                      </motion.button>
                    ))}
                </div>
                </motion.div>

                {/* Skills List */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-white">{skillSuggestions.length} skills available</h2>
                  </div>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 py-2 bg-transparent">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                  {skillSuggestions.map((skill, index) => (
                        <motion.div
                      key={`skill-card-${index}`}
                          variants={itemVariants}
                          className={`p-3 border ${index < 3 ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'} rounded-lg cursor-pointer transition-all duration-300 hover:border-purple-300 hover:shadow-sm`}
                      onClick={() => handleSkillClick(skill)}
                    >
                          <div className="flex mb-1">
                      {index < 3 && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mr-1">
                          Expert Recommended
                              </span>
                      )}
                    </div>
                          <p className="text-gray-800 text-sm">{skill}</p>
                        </motion.div>
                  ))}
                    </motion.div>
                </div>
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
                    Your Professional Skills
                  </h2>
                  <p className="text-gray-300 text-sm">
                    List your key skills below
                  </p>
                </div>

                <p className="text-sm text-purple-300 mb-3">Skills list:</p>

                <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-30 blur"></div>
                      <div className="relative">
                        <textarea
                      className="w-full h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Click on any skill from the left to add it to your skills list, or write your own."
                          value={skillText}
                          onChange={(e) => setSkillText(e.target.value)}
                        />
                      </div>
                    </div>

                {/* Character count and tips */}
                    <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-400">
                    {skillText.length} characters
                      </span>
                  <span className="text-purple-400">
                    Use • to create bullet points
                      </span>
                    </div>

                {/* Navigation buttons */}
                <div className="flex justify-end items-center mt-8 space-x-4">
                  <button
                    onClick={handlePreview}
                    className="text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 font-medium rounded-full px-8 py-2.5 text-base transition-colors duration-300 hover:bg-purple-500/10"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={handleNext}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-full px-10 py-2.5 text-base transition-colors duration-300 shadow-sm hover:shadow"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            </div>
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

export default SkillsPage;