import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Plus, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

import ProgressStepper from '@/components/ProgressStepper';
import { useResumeStore } from '@/stores/resumeStore';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';

// Using the Education type from ResumeContext
// It includes: id, school, degree, location, startDate, endDate, description
// Note: The form will handle startDate and endDate as separate month/year fields.



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

// List of degrees
const degreeOptions = [
  'Bachelor of Arts (BA)',
  'Bachelor of Science (BS)',
  'Bachelor of Fine Arts (BFA)',
  'Bachelor of Business Administration (BBA)',
  'Master of Arts (MA)',
  'Master of Science (MS)',
  'Master of Business Administration (MBA)',
  'Master of Fine Arts (MFA)',
  'Doctor of Philosophy (PhD)',
  'Doctor of Medicine (MD)',
  'Juris Doctor (JD)',
  'Associate Degree',
  'High School Diploma',
  'GED',
  'Certificate',
  'Diploma',
  'Other'
];

// Months for graduation date
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Type definitions for education categories and examples from the API
interface EducationExample {
  id: number;
  categoryId: number;
  content: string;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EducationCategory {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  examples: EducationExample[];
}

// Mock education categories data
const mockEducationCategories: EducationCategory[] = [
  {
    id: 1,
    name: 'Academic Achievements',
    description: 'Honors, awards, and academic recognition',
    type: 'achievement',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    examples: [
      { id: 1, categoryId: 1, content: 'Dean\'s List', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 2, categoryId: 1, content: 'Magna Cum Laude', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 3, categoryId: 1, content: 'Academic Scholarship Recipient', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]
  },
  {
    id: 2,
    name: 'Relevant Coursework',
    description: 'Important courses related to your field',
    type: 'coursework',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    examples: [
      { id: 4, categoryId: 2, content: 'Advanced Financial Analysis', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 5, categoryId: 2, content: 'Data Structures and Algorithms', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 6, categoryId: 2, content: 'Digital Marketing Strategy', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]
  },
  {
    id: 3,
    name: 'Projects & Research',
    description: 'Academic projects and research work',
    type: 'project',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    examples: [
      { id: 7, categoryId: 3, content: 'Senior Capstone Project', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 8, categoryId: 3, content: 'Independent Research Study', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 9, categoryId: 3, content: 'Published Research Paper', isRecommended: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]
  }
];

const EducationPage = () => {
  const [, setLocation] = useLocation();
  // Connect to ResumeStore with stable selectors and hydration check
  const resumeData = useResumeStore(state => state.resumeData);
  const _actions = useResumeStore(state => state.actions);
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
  

  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [educationCategories, setEducationCategories] = useState<EducationCategory[]>(mockEducationCategories);
  const [showSuccessMessage] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Helper function to get initial education state
  const getInitialEducation = () => {
    const savedEducation = resumeData.education || [];
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const urlId = searchParams.get('id');
    const urlIndex = searchParams.get('index');
    let educationToLoad = null;

    if (urlId) {
      educationToLoad = savedEducation.find(edu => edu.id === urlId);
    } else if (urlIndex) {
      const index = parseInt(urlIndex, 10);
      if (!isNaN(index) && index >= 0 && index < savedEducation.length) {
        educationToLoad = savedEducation[index];
      }
    }

    if (educationToLoad) {
      const [startMonth, startYear] = (educationToLoad.startDate || '').split(' ');
      const [endMonth, endYear] = (educationToLoad.endDate || '').split(' ');
      return {
        formState: {
          id: educationToLoad.id || `temp-${Date.now()}`,
          school: educationToLoad.school || '',
          location: educationToLoad.location || '',
          degree: educationToLoad.degree || '',
          description: educationToLoad.description || '',
        },
        startMonth: startMonth || '',
        startYear: startYear || '',
        endMonth: endMonth || '',
        endYear: endYear || '',
      };
    }

    // If no params, return a fresh empty state
    return {
      formState: {
        id: `temp-${Date.now()}`,
        school: '',
        location: '',
        degree: '',
        description: '',
      },
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
    };
  };

  const [initialState] = useState(getInitialEducation);

  const [currentEducation, setCurrentEducation] = useState(initialState.formState);
  const [startMonth, setStartMonth] = useState(initialState.startMonth);
  const [startYear, setStartYear] = useState(initialState.startYear);
  const [endMonth, setEndMonth] = useState(initialState.endMonth);
  const [endYear, setEndYear] = useState(initialState.endYear);

  // This effect now correctly re-initializes the form when navigating between entries
  useEffect(() => {
    const newState = getInitialEducation();
    setCurrentEducation(newState.formState);
    setStartMonth(newState.startMonth);
    setStartYear(newState.startYear);
    setEndMonth(newState.endMonth);
    setEndYear(newState.endYear);
  }, [window.location.search, resumeData.education]);

  // State for expanded sections
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // State for showing additional coursework section
  const [showAdditionalCoursework, setShowAdditionalCoursework] = useState(false);

  // Create a preview data object with the current (unsaved) education
  const previewData = (() => {
    const savedEducation = resumeData.education || [];
    const isFormEmpty = !currentEducation.school && !currentEducation.degree;

    if (isFormEmpty) {
      return { ...resumeData, education: savedEducation };
    }

    const liveEntry = {
      ...currentEducation,
      startDate: `${startMonth} ${startYear}`.trim(),
      endDate: `${endMonth} ${endYear}`.trim(),
    };

    const existingEntryIndex = savedEducation.findIndex(edu => edu.id === currentEducation.id);

    if (existingEntryIndex !== -1) {
      const educationForPreview = [...savedEducation];
      educationForPreview[existingEntryIndex] = liveEntry;
      return { ...resumeData, education: educationForPreview };
    } else {
      const educationForPreview = [...savedEducation, liveEntry];
      return { ...resumeData, education: educationForPreview };
    }
  })();

  // Fetch education categories and examples from the API
  useEffect(() => {
    const fetchEducationCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/education/categories');
        if (response.ok) {
          const data = await response.json();
          setEducationCategories(data.data || mockEducationCategories);
        } else {
          console.warn('Failed to fetch education categories, using mock data');
          setEducationCategories(mockEducationCategories);
        }
      } catch (error) {
        console.error('Error fetching education categories:', error);
        setEducationCategories(mockEducationCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationCategories();
  }, []);

  // Handle education form changes
  const handleEducationChange = (field: keyof typeof currentEducation, value: string) => {
    setCurrentEducation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Generate years for graduation date dropdown (recent 20 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 5; i >= currentYear - 50; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const years = generateYears();

  // Navigation handlers
  const handleBack = () => {
    // Navigates back, data is saved on Next/Add
    setLocation('/work-history-summary');
  };

  const handleNext = () => {
    saveEducation();
    setLocation('/education-summary');
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  // Save education data to resume context
  const saveEducation = () => {
    if (currentEducation.school.trim() || currentEducation.degree.trim()) {
      const updatedEntry = {
        ...currentEducation,
        startDate: `${startMonth} ${startYear}`.trim(),
        endDate: `${endMonth} ${endYear}`.trim(),
      };

      const existingEntries = resumeData.education || [];
      const existingEntryIndex = existingEntries.findIndex(edu => edu.id === updatedEntry.id);

      let newEducationList;
      if (existingEntryIndex !== -1) {
        // Update existing entry
        newEducationList = [...existingEntries];
        newEducationList[existingEntryIndex] = updatedEntry;
      } else {
        // Add new entry
        newEducationList = [...existingEntries, updatedEntry];
      }

      executeResumeDataUpdate({ ...resumeData, education: newEducationList });
    }
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
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
            <span>Education information saved successfully!</span>
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
              Tell us about your education
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
                    <li>Include your highest level of education first</li>
                    <li>You can list honors, achievements, and relevant coursework</li>
                    <li>If you're currently studying, mention your expected graduation date</li>
                    <li>For recent graduates, include your GPA if it's impressive</li>
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
            Enter your education experience so far, even if you are a current student or did not graduate.
          </motion.p>

          <motion.div 
            className="text-sm text-gray-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="text-red-400">*</span> indicates a required field
          </motion.div>

          {/* Education Form */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* School Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="school" className="block text-sm font-medium text-white">
                SCHOOL NAME <span className="text-red-400">*</span>
              </label>
              <Input
                id="school"
                type="text"
                placeholder="e.g. Delhi University"
                value={currentEducation.school}
                onChange={(e) => handleEducationChange('school', e.target.value)}
                className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </motion.div>

            {/* School Location */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-white">
                SCHOOL LOCATION
              </label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Delhi, India"
                value={currentEducation.location}
                onChange={(e) => handleEducationChange('location', e.target.value)}
                className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </motion.div>

            {/* Degree */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="degree" className="block text-sm font-medium text-white">
                DEGREE
              </label>
              <Select
                value={currentEducation.degree}
                onValueChange={(value) => handleEducationChange('degree', value)}
              >
                <SelectTrigger className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectGroup>
                    {degreeOptions.map((degree) => (
                      <SelectItem key={degree} value={degree} className="text-white hover:bg-white/10">
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Field of Study (now description) */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-white">
                FIELD OF STUDY
              </label>
              <Input
                id="fieldOfStudy"
                type="text"
                placeholder="e.g. Financial Accounting"
                value={currentEducation.description}
                onChange={(e) => handleEducationChange('description', e.target.value)}
                className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </motion.div>

            {/* Graduation Date */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-white">
                GRADUATION DATE (OR EXPECTED GRADUATION DATE)
              </label>
              <div className="grid grid-cols-2 gap-4">
                 <Select
                  value={startMonth}
                  onValueChange={(value) => setStartMonth(value)}
                >
                  <SelectTrigger className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Start Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectGroup>
                      {months.map((month) => (
                        <SelectItem key={`start-${month}`} value={month} className="text-white hover:bg-white/10">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={endYear}
                  onValueChange={(value) => setEndYear(value)}
                >
                  <SelectTrigger className="w-full py-6 bg-white/5 backdrop-blur-xl border-white/10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectGroup>
                      {years.map((year) => (
                        <SelectItem key={`end-${year}`} value={year} className="text-white hover:bg-white/10">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Additional Coursework Section */}
            <motion.div
              variants={itemVariants}
              className="mt-8 border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl"
            >
              <button
                onClick={() => setShowAdditionalCoursework(!showAdditionalCoursework)}
                className="w-full flex items-center justify-between p-4 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    Add any additional coursework you're proud to showcase
                  </span>
                </div>
                {showAdditionalCoursework ? (
                  <ChevronUp className="h-5 w-5 text-gray-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-300" />
                )}
              </button>

              <AnimatePresence>
                {showAdditionalCoursework && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-white/5"
                  >
                    <div className="mb-4 flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-600 text-white p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polygon points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-white">Pro Tip</span>
                      </div>
                      <a href="#" className="text-sm text-blue-400 hover:underline">
                        Look here for sample resume references
                      </a>
                    </div>

                    <div className="text-gray-300 mb-4 text-sm">
                      We recommend including completed coursework, apprenticeship, internship experience or relevant educational achievements. Add them in chronological order, beginning with the most recent one.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Achievement Types */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium mb-2 text-white">Ready-to-use-examples</h3>

                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
                          </div>
                        ) : error ? (
                          <div className="text-red-400 p-4 text-center">
                            {error}
                          </div>
                        ) : (
                          educationCategories.map((category) => (
                            <div key={category.id} className="border border-white/10 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleSection(String(category.id))}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors duration-200"
                              >
                                <span className="font-medium text-white">{category.name}</span>
                                {expandedSection === String(category.id) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-300" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-300" />
                                )}
                              </button>

                              <AnimatePresence>
                                {expandedSection === String(category.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-4 pt-2 pb-4 bg-white/5"
                                  >
                                    <p className="text-sm text-gray-300 mb-3">{category.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {category.examples && category.examples.map(example => (
                                        <button
                                          key={example.id}
                                          className="flex items-center gap-1 border border-purple-400/30 rounded-full px-3 py-2 bg-white/5 hover:bg-purple-500/20 transition-colors duration-200"
                                          onClick={() => {
                                            // Instead of adding as an achievement, directly insert into description field
                                            const currentText = currentEducation.description || '';
                                            const newText = currentText ? `${currentText}\n• ${example.content}` : `• ${example.content}`;
                                            handleEducationChange('description', newText);
                                            // Close the section after inserting
                                            setExpandedSection(null);
                                          }}
                                        >
                                          <Plus className="h-4 w-4 text-purple-400" />
                                          <span className="text-sm text-white">{example.content}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Right Column - Education Description */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium mb-2 text-white">EDUCATION DESCRIPTION</h3>
                        <textarea
                          className="w-full h-[300px] p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="Describe your education, notable achievements, relevant coursework, etc."
                          value={currentEducation.description}
                          onChange={(e) => handleEducationChange('description', e.target.value)}
                        />
                        <div className="flex justify-end space-x-2 py-2">
                          <button className="p-1 rounded hover:bg-white/10 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 9h3.5a2 2 0 0 1 0 4H11v4.5"/>
                              <path d="M8 4h8"/>
                              <rect x="4" y="9" width="4" height="12" rx="1"/>
                            </svg>
                          </button>
                          <button className="p-1 rounded hover:bg-white/10 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          </button>
                          <button className="p-1 rounded hover:bg-white/10 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="8" y1="6" x2="21" y2="6"/>
                              <line x1="8" y1="12" x2="21" y2="12"/>
                              <line x1="8" y1="18" x2="21" y2="18"/>
                              <line x1="3" y1="6" x2="3.01" y2="6"/>
                              <line x1="3" y1="12" x2="3.01" y2="12"/>
                              <line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                          </button>
                          <button className="p-1 rounded hover:bg-white/10 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 7V4h16v3"/>
                              <path d="M9 20h6"/>
                              <path d="M12 4v16"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Navigation buttons */}
            <motion.div variants={itemVariants} className="flex justify-end items-center mt-8 space-x-4">
              <button
                onClick={handlePreview}
                className="text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 font-medium rounded-full px-8 py-2.5 text-base transition-colors duration-300 hover:bg-purple-500/10"
              >
                Preview
              </button>
              <button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-10 py-2.5 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Next: Skills
              </button>
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
            resumeData={previewData}
            templateCode={activeProTemplate.code}
          />
        );
      })()}
    </div>
  );
};

export default EducationPage;