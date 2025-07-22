import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, HelpCircle, CheckCircle, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressStepper from '@/components/ProgressStepper';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumeDataDebugger } from '@/components/ResumeDataDebugger';
import ProPreview from '@/components/ProPreview';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateSelector from '@/components/resume/TemplateSelector';

// Align this page's WorkExperience type with the one in ResumeContext
interface WorkExperience {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  isRemote: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrentJob: boolean;
  responsibilities: string;
  dbJobTitleId?: number;
}

interface JobTitle {
  id: number;
  title: string;
  category: string;
}

// Helper function to generate month options
const generateMonths = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months;
};

// Helper function to generate year options
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 50; i--) {
    years.push(i.toString());
  }
  return years;
};

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

// Animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const WorkExperienceDetailsPage = () => {
  const [location, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors and hydration check
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const updateResumeData = actions?.updateResumeData;
  const updateSkills = useResumeStore(state => state.actions.updateSkills);
  const updateLanguages = useResumeStore(state => state.actions.updateLanguages);
  const updateCertifications = useResumeStore(state => state.actions.updateCertifications);
  const updateCustomSections = useResumeStore(state => state.actions.updateCustomSections);
  const updateEducation = useResumeStore(state => state.actions.updateEducation);
  const setActiveProTemplateId = useResumeStore(state => state.actions.setActiveProTemplateId);
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const proTemplates = useResumeStore(state => state.proTemplates);
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
      if (state.actions && typeof state.actions.updateWorkExperience === 'function') {
        setIsStoreHydrated(true);
        return true;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkHydration, 100);
      } else {
        console.warn('Store hydration timeout after 5 seconds');
      }
      return false;
    };
    
    checkHydration();
  }, []);
  
  // Process pending updates when store is hydrated
  useEffect(() => {
    if (isStoreHydrated && pendingUpdates.length > 0) {
      const state = useResumeStore.getState();
      pendingUpdates.forEach(update => {
        if (update.type === 'workExperience' && state.actions.updateWorkExperience) {
          state.actions.updateWorkExperience(update.data);
        }
      });
      setPendingUpdates([]);
    }
  }, [isStoreHydrated, pendingUpdates]);
  
  // Get updateWorkExperience with hydration check
  const updateWorkExperience = useResumeStore(state => state.actions.updateWorkExperience);

  const isMobile = useIsMobile();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Job title search and suggestions
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<JobTitle[]>([]);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get the active template code from the centralized context
  const activeTemplate = getProTemplateById && typeof getProTemplateById === 'function' 
    ? getProTemplateById(activeProTemplateId) 
    : null;
  const templateCodeToPass = activeTemplate?.code || '';

  // Find the most recent work experience to edit, or create a new one
  const getInitialWorkExperience = (): WorkExperience => {
    const savedExperiences = resumeData.experience || [];

    // Check for URL parameters to load specific work experience
    const searchParams = new URLSearchParams(window.location.search);
    const experienceId = searchParams.get('id');
    const experienceIndex = searchParams.get('index');

    // If we have an ID, try to find the experience by ID
    if (experienceId) {
      const foundExperience = savedExperiences.find(exp => exp.id === experienceId);
      if (foundExperience) {
        // Convert the saved experience back to the form format
        const [startMonth, startYear] = foundExperience.startDate ? foundExperience.startDate.split(' ') : ['', ''];
        const [endMonth, endYear] = foundExperience.endDate && foundExperience.endDate !== 'Present' 
          ? foundExperience.endDate.split(' ') : ['', ''];

        return {
          id: foundExperience.id,
          jobTitle: foundExperience.position || '',
          employer: foundExperience.company || '',
          location: foundExperience.location || '',
          isRemote: false, // Default value, not stored in saved format
          startMonth: startMonth || '',
          startYear: startYear || '',
          endMonth: endMonth || '',
          endYear: endYear || '',
          isCurrentJob: foundExperience.endDate === 'Present',
          responsibilities: foundExperience.description || '',
          dbJobTitleId: (foundExperience as any).dbJobTitleId,
        };
      }
    }

    // If we have an index, try to find the experience by index
    if (experienceIndex) {
      const index = parseInt(experienceIndex, 10);
      if (!isNaN(index) && index >= 0 && index < savedExperiences.length) {
        const foundExperience = savedExperiences[index];
        // Convert the saved experience back to the form format
        const [startMonth, startYear] = foundExperience.startDate ? foundExperience.startDate.split(' ') : ['', ''];
        const [endMonth, endYear] = foundExperience.endDate && foundExperience.endDate !== 'Present' 
          ? foundExperience.endDate.split(' ') : ['', ''];

        return {
          id: foundExperience.id,
          jobTitle: foundExperience.position || '',
          employer: foundExperience.company || '',
          location: foundExperience.location || '',
          isRemote: false, // Default value, not stored in saved format
          startMonth: startMonth || '',
          startYear: startYear || '',
          endMonth: endMonth || '',
          endYear: endYear || '',
          isCurrentJob: foundExperience.endDate === 'Present',
          responsibilities: foundExperience.description || '',
          dbJobTitleId: (foundExperience as any).dbJobTitleId,
        };
      }
    }

    // If no URL parameters (adding new experience), create a completely new one
    return {
      id: `temp-${Date.now()}`, // Ensure new entries always have an ID
    jobTitle: '',
    employer: '',
    location: '',
    isRemote: false,
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrentJob: false,
      responsibilities: '',
    };
  };

  const [workExperience, setWorkExperience] = useState<WorkExperience>(() => {
    const newExperience = getInitialWorkExperience();
    if (!newExperience.id) {
      newExperience.id = `temp-${Date.now()}`;
    }
    return newExperience;
  });

  // Create a preview data object with the current (unsaved) experience
  const previewData = (() => {
    // Start with the list of already saved experiences
    const savedExperiences = resumeData.experience || [];

    // Is the current form entry empty?
    const isFormEmpty = !workExperience.jobTitle && !workExperience.employer;

    // If the form is empty, the preview should ONLY show what's already saved.
    if (isFormEmpty) {
      // DEBUG: Let's see what's in saved experiences
      console.log('Form is empty, showing saved experiences:', savedExperiences);
      return { ...resumeData, experience: savedExperiences };
    }

    // If the form is NOT empty, create the live preview entry.
    // Transform the current form data into the shape the template expects
    const liveEntry = {
      id: workExperience.id,
      position: workExperience.jobTitle,
      company: workExperience.employer,
      location: workExperience.location,
      startDate: `${workExperience.startMonth || ''} ${workExperience.startYear || ''}`.trim(),
      endDate: workExperience.isCurrentJob ? 'Present' : `${workExperience.endMonth || ''} ${workExperience.endYear || ''}`.trim(),
      description: workExperience.responsibilities,
    };

    // To prevent duplicates, filter out any saved entry that has the same ID as our live form entry.
    const experienceForPreview = savedExperiences.filter(exp => exp.id !== workExperience.id);
    experienceForPreview.push(liveEntry);

    // DEBUG: Let's see what we're sending to preview
    console.log('Form has data, preview experiences:', experienceForPreview);
    console.log('Live entry:', liveEntry);
    console.log('Saved experiences after filtering:', savedExperiences.filter(exp => exp.id !== workExperience.id));

    return { ...resumeData, experience: experienceForPreview };
  })();

  const months = generateMonths();
  const years = generateYears();

  // Initialize job title search with existing data
  useEffect(() => {
    if (workExperience.jobTitle) {
      setJobTitleSearch(workExperience.jobTitle);

      // If we have a dbJobTitleId, try to fetch the full job title data
      if (workExperience.dbJobTitleId) {
        const fetchJobTitle = async () => {
          try {
            const response = await fetch(`/api/jobs/titles?search=${encodeURIComponent(workExperience.jobTitle)}`);
            if (response.ok) {
              const data = await response.json();
              const matchingTitle = data.data?.find((title: JobTitle) => title.id === workExperience.dbJobTitleId);
              if (matchingTitle) {
                setSelectedJobTitle(matchingTitle);
              }
            }
          } catch (error) {
            console.error('Error fetching job title data:', error);
          }
        };
        fetchJobTitle();
      }
    }
  }, [workExperience.jobTitle, workExperience.dbJobTitleId]);

  const handleBack = () => {
    // Check if we're editing an existing work experience
    const searchParams = new URLSearchParams(window.location.search);
    const experienceId = searchParams.get('id');
    const experienceIndex = searchParams.get('index');

    // If we're editing an existing experience, go back to work history summary
    if (experienceId || experienceIndex) {
      setLocation('/work-history-summary');
    } else {
      // If we're creating a new experience, go back to why-need-resume
    setLocation('/why-need-resume');
    }
  };

  const handleNext = () => {
    // Save the current experience before navigating
    saveWorkExperience();
    // Navigate to job description page with the current work experience ID
    setLocation(`/job-description?id=${workExperience.id}`);
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const executeWorkExperienceUpdate = (updateData: any) => {
    if (isStoreHydrated && updateWorkExperience) {
      updateWorkExperience(updateData);
    } else {
      // Add to pending updates queue if store is not hydrated
      setPendingUpdates(prev => [...prev, { type: 'workExperience', data: updateData }]);
    }
  };

  const saveWorkExperience = () => {
    // If the form is empty, we might need to delete an entry if it was previously saved.
    if (!workExperience.jobTitle || !workExperience.employer) {
      const savedExperiences = resumeData.experience || [];
      const updatedList = savedExperiences.filter(exp => exp.id !== workExperience.id);

      // If the list changed (meaning an entry was removed), update the context.
      if (updatedList.length < savedExperiences.length) {
        executeWorkExperienceUpdate(updatedList);
      }
      return; // Stop here if the form is empty.
    }

    // If the form is NOT empty, proceed with saving.
    const entryToSave = {
      id: workExperience.id,
      position: workExperience.jobTitle,
      company: workExperience.employer,
      location: workExperience.location,
      startDate: `${workExperience.startMonth || ''} ${workExperience.startYear || ''}`.trim(),
      endDate: workExperience.isCurrentJob ? 'Present' : `${workExperience.endMonth || ''} ${workExperience.endYear || ''}`.trim(),
      description: workExperience.responsibilities,
    };

    const savedExperiences = resumeData.experience || [];
    const existingEntryIndex = savedExperiences.findIndex(exp => exp.id === entryToSave.id);

    let updatedExperienceList;
    if (existingEntryIndex > -1) {
      // We are updating an existing entry.
      updatedExperienceList = [...savedExperiences];
      updatedExperienceList[existingEntryIndex] = entryToSave;
    } else {
      // We are adding a new entry.
      updatedExperienceList = [...savedExperiences, entryToSave];
    }

    executeWorkExperienceUpdate(updatedExperienceList);

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const clearForm = () => {
    // Create a completely fresh new work experience
    const freshExperience: WorkExperience = {
      id: `temp-${Date.now()}`,
      jobTitle: '',
      employer: '',
      location: '',
      isRemote: false,
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isCurrentJob: false,
      responsibilities: '',
    };

    setWorkExperience(freshExperience);
    setJobTitleSearch(''); // Also clear the job title search input
    setSelectedJobTitle(null);
  };

  const handleInputChange = (field: keyof WorkExperience, value: string | boolean) => {
    setWorkExperience(prev => ({ ...prev, [field]: value }));
  };

  // Add a function to completely clear all experience data
  const clearAllExperienceData = () => {
    executeWorkExperienceUpdate([]);
    clearForm();
  };

  useEffect(() => {
    // This effect listens for when the resume data is cleared from the debugger
    // and resets the local form state accordingly.
    if (resumeData.experience.length === 0) {
      const freshExperience: WorkExperience = {
        id: `temp-${Date.now()}`,
        jobTitle: '',
        employer: '',
        location: '',
        isRemote: false,
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        isCurrentJob: false,
        responsibilities: '',
      };

      setWorkExperience(freshExperience);
      setJobTitleSearch('');
      setSelectedJobTitle(null);
      setShowJobTitleSuggestions(false);
    }
  }, [resumeData.experience]);

  const handleCurrentJobChange = (checked: boolean) => {
    setWorkExperience(prev => ({
      ...prev,
      isCurrentJob: checked,
      endMonth: checked ? '' : prev.endMonth,
      endYear: checked ? '' : prev.endYear,
    }));

    // Update the context immediately for checkbox changes
    handleInputChange('isCurrentJob', checked);
  };

  // Job title search functionality
  const fetchJobTitleSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Show popular job titles when no search term
      fetchPopularJobTitles();
      return;
    }

    try {
      const response = await fetch(`/api/jobs/titles?search=${encodeURIComponent(searchTerm)}&limit=10`);
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setJobTitleSuggestions(data.data || []);
          setShowJobTitleSuggestions((data.data || []).length > 0);
        } else {
          console.warn('API returned non-JSON response, likely due to server error');
          setJobTitleSuggestions([]);
          setShowJobTitleSuggestions(false);
        }
      } else {
        setJobTitleSuggestions([]);
        setShowJobTitleSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching job title suggestions:', error);
      setJobTitleSuggestions([]);
      setShowJobTitleSuggestions(false);
    }
  };

  const fetchPopularJobTitles = async () => {
    try {
      const response = await fetch('/api/jobs/titles?limit=8');
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setJobTitleSuggestions(data.data || []);
          setShowJobTitleSuggestions((data.data || []).length > 0);
        } else {
          console.warn('API returned non-JSON response, likely due to server error');
          setJobTitleSuggestions([]);
          setShowJobTitleSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Error fetching popular job titles:', error);
      setJobTitleSuggestions([]);
      setShowJobTitleSuggestions(false);
    }
  };

  const handleJobTitleSearchChange = (value: string) => {
    setJobTitleSearch(value);
    setWorkExperience(prev => ({ ...prev, jobTitle: value }));

    // Clear selected job title if user is typing something different
    if (selectedJobTitle && selectedJobTitle.title !== value) {
      setSelectedJobTitle(null);
      setWorkExperience(prev => ({ ...prev, dbJobTitleId: undefined }));
    }

    // Fetch suggestions with debounce
    fetchJobTitleSuggestions(value);
  };

  const handleJobTitleSelect = (jobTitle: JobTitle) => {
    setSelectedJobTitle(jobTitle);
    setJobTitleSearch(jobTitle.title);
    setWorkExperience(prev => ({ 
      ...prev, 
      jobTitle: jobTitle.title,
      dbJobTitleId: jobTitle.id 
    }));
    setShowJobTitleSuggestions(false);
  };

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        jobTitleInputRef.current && 
        !jobTitleInputRef.current.contains(event.target as Node)
      ) {
        setShowJobTitleSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <span>Work experience saved successfully!</span>
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
                Tell us about your most recent job
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
                    <p className="font-medium text-white mb-2">💼 Work Experience Tips:</p>
                    <ul className="list-disc pl-5 space-y-1 text-white">
                      <li>Start with your most recent position</li>
                      <li>Include company name and your exact job title</li>
                      <li>Add location or mention if it was remote work</li>
                      <li>Be precise with employment dates</li>
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
              We'll start there and work backward.
            </motion.p>

            <motion.div 
              className="text-sm text-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span className="text-red-400">*</span> indicates a required field
            </motion.div>

            {/* Work Experience Form */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title with Autocomplete */}
                <motion.div variants={itemVariants} className="space-y-2 relative">
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-white">
                    JOB TITLE <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                        ref={jobTitleInputRef}
                    id="jobTitle"
                    type="text"
                        placeholder="Search job titles (e.g. Software Engineer)"
                        value={jobTitleSearch}
                        onChange={(e) => handleJobTitleSearchChange(e.target.value)}
                        onFocus={() => {
                          if (jobTitleSuggestions.length > 0) {
                            setShowJobTitleSuggestions(true);
                          } else if (!jobTitleSearch.trim()) {
                            fetchPopularJobTitles();
                          }
                        }}
                        className="w-full py-6 pl-10 pr-10 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                      {selectedJobTitle && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                              Linked
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Job Title Suggestions Dropdown */}
                    <AnimatePresence>
                      {showJobTitleSuggestions && jobTitleSuggestions.length > 0 && (
                        <motion.div
                          ref={suggestionsRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                        >
                          {jobTitleSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleJobTitleSelect(suggestion)}
                              className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white font-medium">{suggestion.title}</p>
                                  <p className="text-gray-400 text-sm">{suggestion.category}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Job Title Hint */}
                  <div className="text-xs text-gray-400 mt-1">
                    {selectedJobTitle ? (
                      <span className="text-green-400">
                        ✓ Connected to Jobs Management system
                      </span>
                    ) : (
                      <span>
                        Start typing to search from {jobTitleSuggestions.length > 0 ? 'available' : 'our database of'} job titles
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Employer */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="employer" className="block text-sm font-medium text-white">
                    EMPLOYER <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="employer"
                    type="text"
                    placeholder="e.g. Google Inc."
                    value={workExperience.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                    className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>
              </div>

              {/* Location */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-white">
                  LOCATION
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={workExperience.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              {/* Remote Checkbox */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <Checkbox 
                  id="remote"
                  checked={workExperience.isRemote}
                  onCheckedChange={(checked) => 
                    handleInputChange('isRemote', Boolean(checked))
                  }
                  className="rounded-sm h-4 w-4 border-white/30 text-purple-400"
                />
                <label htmlFor="remote" className="text-sm text-white">
                  Remote
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <HelpCircle className="h-4 w-4 text-purple-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                      <p>Check this if you worked remotely from home or another location.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    START DATE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="startMonth" className="block text-sm font-medium text-purple-300 mb-1">Start Month</label>
                      <Select onValueChange={(value) => handleInputChange('startMonth', value)} value={workExperience.startMonth}>
                        <SelectTrigger className="bg-white/10 border-white/20">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-purple-500">
                          {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    </div>

                    <div>
                      <label htmlFor="startYear" className="block text-sm font-medium text-purple-300 mb-1">Start Year</label>
                      <Select onValueChange={(value) => handleInputChange('startYear', value)} value={workExperience.startYear}>
                        <SelectTrigger className="bg-white/10 border-white/20">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-purple-500">
                          {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                </motion.div>

                {/* End Date */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    END DATE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={workExperience.endMonth}
                      onValueChange={(value) => handleInputChange('endMonth', value)}
                      disabled={workExperience.isCurrentJob}
                    >
                      <SelectTrigger className="py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {months.map((month) => (
                          <SelectItem key={month} value={month} className="text-white hover:bg-white/10">
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={workExperience.endYear}
                      onValueChange={(value) => handleInputChange('endYear', value)}
                      disabled={workExperience.isCurrentJob}
                    >
                      <SelectTrigger className="py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {years.map((year) => (
                          <SelectItem key={year} value={year} className="text-white hover:bg-white/10">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </div>

              {/* Current Job Checkbox */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <Checkbox 
                  id="currentJob"
                  checked={workExperience.isCurrentJob}
                  onCheckedChange={(checked) => handleCurrentJobChange(Boolean(checked))}
                  className="rounded-sm h-4 w-4 border-white/30 text-purple-400"
                />
                <label htmlFor="currentJob" className="text-sm text-white">
                  I currently work here
                </label>
              </motion.div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div 
              className="flex justify-between items-center mt-8 space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.button
                onClick={clearAllExperienceData}
                className="text-gray-400 hover:text-white border border-gray-400 hover:border-white font-medium rounded-full px-6 py-2.5 text-sm transition-colors duration-300 hover:bg-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Data
              </motion.button>

              <div className="flex space-x-4">
                <motion.button
                  onClick={handlePreview}
                  className="px-6 py-2 rounded-full text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                Preview
              </motion.button>
              <motion.button 
                onClick={handleNext}
                  className="px-8 py-2 rounded-full text-black bg-yellow-500 hover:bg-yellow-600 transition-colors font-semibold"
              >
                  Save & Next
              </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <ResumePreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            resumeData={previewData}
            templateCode={templateCodeToPass}
            onUpdateResumeData={updateResumeData}
            onUpdateSkills={updateSkills}
            onUpdateLanguages={updateLanguages}
            onUpdateCertifications={updateCertifications}
            onUpdateCustomSections={updateCustomSections}
            onUpdateEducation={updateEducation}
            onUpdateWorkExperience={updateWorkExperience}
          />
        )}
      </AnimatePresence>

      {/* Debug Component */}
      <ResumeDataDebugger />
    </div>
  );
};

export default WorkExperienceDetailsPage;