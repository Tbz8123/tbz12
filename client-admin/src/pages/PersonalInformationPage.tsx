import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Info, Upload, Linkedin, Link as LinkIcon, Car, Eye, ArrowUp, User, Sparkles, Check, FileText, Briefcase, GraduationCap, Award, Settings, CheckCircle, LayoutTemplate, Star, Zap, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import ProgressStepper from '@/components/ProgressStepper';
import PersonalInfoPreview from '@/components/PersonalInfoPreview';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumeDataDebugger } from '@/components/ResumeDataDebugger';
import { cn } from '@/lib/utils';
import { generateSampleData, getDefaultSampleConfig, getMinimalSampleConfig, getMaximalSampleConfig, SampleDataConfig } from '@/lib/sampleDataGenerator';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
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

const PersonalInformationPage = () => {
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  // Connect to ResumeStore with stable selectors and hydration check
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const proTemplates = useResumeStore(state => state.proTemplates);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const isLoadingProTemplates = useResumeStore(state => state.isLoadingProTemplates);
  
  // Fetch Pro templates and update store
  const { data: fetchedProTemplates = [], isLoading: isFetchingTemplates } = useQuery({
    queryKey: ['/api/pro-templates'],
    queryFn: async () => {
      const response = await fetch('/api/pro-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch pro templates');
      }
      return response.json();
    },
  });
  
  // Update store when templates are fetched
  useEffect(() => {
    if (fetchedProTemplates.length > 0 && actions?.setProTemplates && actions?.setLoadingProTemplates) {
      actions.setProTemplates(fetchedProTemplates);
      actions.setLoadingProTemplates(false);
    }
  }, [fetchedProTemplates, actions]);
  
  // Check if store is hydrated using Zustand's persist hydration
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Array<{type: string, data: any}>>([]);
  
  useEffect(() => {
    // Use a more reliable hydration check with polling
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkHydration = () => {
      const state = useResumeStore.getState();
      if (state.actions && typeof state.actions.updatePersonalInfo === 'function') {
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
  }, []); // Remove pendingUpdates dependency to prevent infinite loop
  
  // Separate effect to process pending updates when store becomes hydrated
  useEffect(() => {
    if (isStoreHydrated && pendingUpdates.length > 0) {
      const state = useResumeStore.getState();
      pendingUpdates.forEach(update => {
        if (update.type === 'personalInfo' && state.actions.updatePersonalInfo) {
          state.actions.updatePersonalInfo(update.data);
        } else if (update.type === 'resumeData' && state.actions.updateResumeData) {
          state.actions.updateResumeData(update.data);
        }
      });
      setPendingUpdates([]);
    }
  }, [isStoreHydrated, pendingUpdates]);
  
  // Extract actions with fallbacks
  const updatePersonalInfo = actions?.updatePersonalInfo;
  const updateResumeData = actions?.updateResumeData;
  const updateWorkExperience = actions?.updateWorkExperience;
  const updateEducation = actions?.updateEducation;
  const updateSkills = actions?.updateSkills;
  const updateCertifications = actions?.updateCertifications;
  const updateLanguages = actions?.updateLanguages;
  const updateCustomSections = actions?.updateCustomSections;
  const setActiveProTemplateId = actions?.setActiveProTemplateId;

  const [formState, setFormState] = useState({
    firstName: resumeData.personalInfo.firstName || '',
    surname: resumeData.personalInfo.lastName || '',
    profession: resumeData.personalInfo.title || '',
    city: '',
    country: '',
    pinCode: '',
    phone: resumeData.personalInfo.phone || '',
    email: resumeData.personalInfo.email || '',
    photo: null as string | null,
  });

  const [additionalFields, setAdditionalFields] = useState({
    linkedin: { enabled: false, value: resumeData.personalInfo.contactDetails?.linkedin || '' },
    website: { enabled: false, value: resumeData.personalInfo.contactDetails?.website || '' },
    drivingLicence: { enabled: false, value: resumeData.personalInfo.contactDetails?.drivingLicence || '' }
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Sample Data Testing State
  const [sampleConfig, setSampleConfig] = useState<SampleDataConfig>(getDefaultSampleConfig());
  const [showSampleControls, setShowSampleControls] = useState(false);

  // Sample Data Functions
  const loadSampleData = (config: SampleDataConfig) => {
    const sampleData = generateSampleData(config);
    const updateData = {
      ...resumeData,
      ...sampleData
    };

    // Update all resume data with pending updates mechanism
    if (isStoreHydrated && updateResumeData) {
      updateResumeData(updateData);
    } else {
      // Add to pending updates queue if store is not hydrated
      setPendingUpdates(prev => [...prev, { type: 'resumeData', data: updateData }]);
      return;
    }

    // Update form state to reflect the new personal info
    setFormState({
      firstName: sampleData.personalInfo.firstName,
      surname: sampleData.personalInfo.lastName,
      profession: sampleData.personalInfo.title,
      city: '',
      country: '',
      pinCode: '',
      phone: sampleData.personalInfo.phone,
      email: sampleData.personalInfo.email,
      photo: null,
    });

    // Update additional fields
    setAdditionalFields({
      linkedin: { enabled: true, value: sampleData.personalInfo.contactDetails?.linkedin || '' },
      website: { enabled: true, value: sampleData.personalInfo.contactDetails?.website || '' },
      drivingLicence: { enabled: false, value: '' }
    });
  };

  const clearAllData = () => {
    const clearData = {
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
    };

    // Clear all resume data with pending updates mechanism
    if (isStoreHydrated && updateResumeData) {
      updateResumeData(clearData);
    } else {
      // Add to pending updates queue if store is not hydrated
      setPendingUpdates(prev => [...prev, { type: 'resumeData', data: clearData }]);
      return;
    }

    // Reset form state
    setFormState({
      firstName: '',
      surname: '',
      profession: '',
      city: '',
      country: '',
      pinCode: '',
      phone: '',
      email: '',
      photo: null,
    });

    // Reset additional fields
    setAdditionalFields({
      linkedin: { enabled: false, value: '' },
      website: { enabled: false, value: '' },
      drivingLicence: { enabled: false, value: '' }
    });
  };

  const adjustSampleCount = (type: 'experience' | 'education' | 'skills', delta: number) => {
    setSampleConfig(prev => {
      const newConfig = { ...prev };
      const currentValue = newConfig[`${type}Count`];
      const newValue = Math.max(0, Math.min(currentValue + delta, 
        type === 'experience' ? 5 : 
        type === 'education' ? 4 : 
        15 // skills
      ));
      newConfig[`${type}Count`] = newValue;
      return newConfig;
    });
  };

  // Function to get the correct thumbnail URL based on displayMode and available fields
  const getThumbnailUrl = (template: any) => {
    if (template.displayMode === 'uploaded_image' && template.uploadedImageUrl) {
      return template.uploadedImageUrl;
    }
    if (template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl) {
      return template.enhanced3DThumbnailUrl;
    }
    return template.thumbnailUrl;
  };

  // Sync form state with context when resumeData changes
  useEffect(() => {
    setFormState({
      firstName: resumeData.personalInfo.firstName || '',
      surname: resumeData.personalInfo.lastName || '',
      profession: resumeData.personalInfo.title || '',
      city: '',
      country: '',
      pinCode: '',
      phone: resumeData.personalInfo.phone || '',
      email: resumeData.personalInfo.email || '',
      photo: null,
    });
  }, [resumeData.personalInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Create the potential new state
    const newFormState = {
      ...formState,
      [name]: value
    };
    setFormState(newFormState);

    // Define which fields are keys
    const keyFields = ['firstName', 'surname'];
    const isKeyField = keyFields.includes(name);

    // Check if all key fields are now empty
    const areKeyFieldsEmpty = newFormState.firstName.trim() === '' && newFormState.surname.trim() === '';

    // Define field mappings
    const fieldMappings: Record<string, string> = {
      firstName: 'firstName',
      surname: 'lastName',
      profession: 'title',
      phone: 'phone',
      email: 'email'
    };

    // Safety check: ensure updatePersonalInfo exists with fallback
    const executeUpdate = (updateData: any) => {
      if (isStoreHydrated && updatePersonalInfo) {
        updatePersonalInfo(updateData);
      } else {
        // Add to pending updates queue if store is not hydrated
        setPendingUpdates(prev => [...prev, { type: 'personalInfo', data: updateData }]);
      }
    };

    if (isKeyField && areKeyFieldsEmpty) {
      // If a key field was changed and now all are empty, clear all personal data.
      executeUpdate({
        firstName: '',
        lastName: '',
        title: '',
        email: '',
        phone: ''
      });
    } else {
      // Otherwise, just update the single field that was changed.
      if (fieldMappings[name]) {
        executeUpdate({ [fieldMappings[name]]: value });
      }
    }
  };

  const handleAdditionalFieldToggle = (field: 'linkedin' | 'website' | 'drivingLicence') => {
    setAdditionalFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        enabled: !prev[field].enabled
      }
    }));
  };

  const handleAdditionalFieldChange = (field: 'linkedin' | 'website' | 'drivingLicence', value: string) => {
    setAdditionalFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value
      }
    }));

    // Update context with the new contact details using fallback mechanism
    const updateData = {
      contactDetails: {
        ...resumeData.personalInfo.contactDetails,
        [field]: value
      }
    };
    
    if (isStoreHydrated && updatePersonalInfo) {
      updatePersonalInfo(updateData);
    } else {
      // Add to pending updates queue if store is not hydrated
      setPendingUpdates(prev => [...prev, { type: 'personalInfo', data: updateData }]);
    }
  };

  // Template selection handler with proper error handling and state management
  const handleTemplateSelection = (templateId: number) => {
    try {
      // Get the current store state
      const store = useResumeStore.getState();
      
      // Verify the template exists
      const selectedTemplate = store.proTemplates.find(t => t.id === templateId);
      if (!selectedTemplate) {
        console.error('Template not found:', templateId);
        return;
      }

      // Update the active template ID using the store action
      if (store.actions && store.actions.setActiveProTemplateId) {
        store.actions.setActiveProTemplateId(templateId);
        
        // Close the modal
        setIsTemplateModalOpen(false);
        
        // Optional: Show success feedback
        console.log('Template selected successfully:', selectedTemplate.name);
      } else {
        console.error('Store actions not available for template selection');
      }
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    in: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Particles Background - Desktop only */}
      {!isMobile && <FloatingParticles />}

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="initial"
          animate="in"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button 
              onClick={() => setLocation('/')} 
              className="flex items-center text-purple-400 font-semibold hover:text-purple-300 transition-colors group"
              whileHover={{ x: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ArrowLeft size={16} className="mr-2 group-hover:animate-bounce" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper currentStep={1} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Form */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              {/* Header Section */}
              <motion.div 
                className="text-center lg:text-left mb-8"
                variants={itemVariants}
              >
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold mb-3 text-white leading-tight"
                  style={{
                    background: 'linear-gradient(-45deg, #ffffff, #a855f7, #3b82f6, #ffffff)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  What's the best way for employers to contact you?
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-3">
                  We suggest including an email and phone number.
                </motion.p>
                <motion.p variants={itemVariants} className="text-sm text-gray-400">
                  <span className="text-red-400">*</span> indicates a required field
                </motion.p>
              </motion.div>

              {/* Sample Data Controls for Template Testing */}
              <motion.div 
                variants={itemVariants} 
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 mb-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Template Testing Tools
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSampleControls(!showSampleControls)}
                    className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                  >
                    {showSampleControls ? 'Hide' : 'Show'} Controls
                  </Button>
                </div>

                {showSampleControls && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Quick Load Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        onClick={() => loadSampleData(getMinimalSampleConfig())}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30"
                        size="sm"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Minimal Data
                      </Button>
                      <Button
                        onClick={() => loadSampleData(getDefaultSampleConfig())}
                        className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30"
                        size="sm"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Standard Data
                      </Button>
                      <Button
                        onClick={() => loadSampleData(getMaximalSampleConfig())}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30"
                        size="sm"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Maximum Data
                      </Button>
                    </div>

                    {/* Custom Configuration */}
                    <div className="bg-black/20 rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Custom Configuration</h4>

                      {/* Experience Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Experience ({sampleConfig.experienceCount})</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('experience', -1)}
                            disabled={sampleConfig.experienceCount <= 0}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-amber-300 font-mono w-8 text-center">{sampleConfig.experienceCount}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('experience', 1)}
                            disabled={sampleConfig.experienceCount >= 5}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Education Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Education ({sampleConfig.educationCount})</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('education', -1)}
                            disabled={sampleConfig.educationCount <= 0}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-amber-300 font-mono w-8 text-center">{sampleConfig.educationCount}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('education', 1)}
                            disabled={sampleConfig.educationCount >= 4}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Skills Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Skills ({sampleConfig.skillsCount})</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('skills', -1)}
                            disabled={sampleConfig.skillsCount <= 0}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-amber-300 font-mono w-8 text-center">{sampleConfig.skillsCount}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => adjustSampleCount('skills', 1)}
                            disabled={sampleConfig.skillsCount >= 15}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Load Custom and Clear Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => loadSampleData(sampleConfig)}
                          className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30"
                          size="sm"
                        >
                          Load Custom Data
                        </Button>
                        <Button
                          onClick={clearAllData}
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Photo Upload and Basic Info */}
              <motion.div 
                variants={itemVariants} 
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  Personal Information
                </h3>

                <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">
                  {/* Photo Upload */}
                  <motion.div 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-full mb-2 flex items-center justify-center group cursor-pointer"
                      whileHover={{ 
                        boxShadow: '0 0 30px rgba(147, 51, 234, 0.5)',
                        scale: 1.1
                      }}
                    >
                      <User className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </motion.div>
                    <motion.button 
                      className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Upload Photo
                    </motion.button>
                  </motion.div>

                  {/* Basic Info Fields */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        First Name
                      </label>
                      <Input 
                        name="firstName" 
                        value={formState.firstName} 
                        onChange={handleInputChange} 
                        placeholder="Saanvi"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        Surname
                      </label>
                      <Input 
                        name="surname" 
                        value={formState.surname} 
                        onChange={handleInputChange} 
                        placeholder="Patel"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                    <motion.div variants={itemVariants} className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        Profession
                      </label>
                      <Input 
                        name="profession" 
                        value={formState.profession} 
                        onChange={handleInputChange} 
                        placeholder="Retail Sales Associate"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                  </div>
                </div>

              {/* Location Info */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-purple-300 mb-3 uppercase tracking-wider">Location Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                      City
                    </label>
                    <Input 
                      name="city" 
                      value={formState.city} 
                      onChange={handleInputChange} 
                      placeholder="New Delhi"
                      className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                      Country
                    </label>
                    <Input 
                      name="country" 
                      value={formState.country} 
                      onChange={handleInputChange} 
                      placeholder="India"
                      className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                      Pin Code
                    </label>
                    <Input 
                      name="pinCode" 
                      value={formState.pinCode} 
                      onChange={handleInputChange} 
                      placeholder="110034"
                      className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                    />
                  </motion.div>
                </div>
                </div>

              {/* Contact Info */}
                <div>
                  <h4 className="text-md font-semibold text-purple-300 mb-3 uppercase tracking-wider">Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                      Phone
                    </label>
                    <Input 
                      name="phone" 
                      value={formState.phone} 
                      onChange={handleInputChange} 
                      placeholder="+91 22 1234 5677"
                      className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                      Email *
                    </label>
                    <Input 
                      name="email" 
                      value={formState.email} 
                      onChange={handleInputChange} 
                      placeholder="saanvipatel@sample.in"
                      className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                    />
                  </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Additional Information */}
              <motion.div 
                variants={itemVariants} 
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl"
              >
                <label className="flex items-center text-lg font-semibold text-white mb-4">
                  Add additional information to your resume (optional) 
                  <Info size={16} className="ml-2 text-purple-400"/>
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { icon: Linkedin, label: 'LinkedIn', field: 'linkedin' as const },
                    { icon: LinkIcon, label: 'Website', field: 'website' as const },
                    { icon: Car, label: 'Driving licence', field: 'drivingLicence' as const }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => handleAdditionalFieldToggle(item.field)}
                          className={`${
                            additionalFields[item.field].enabled 
                              ? 'bg-purple-600/30 border-purple-400 text-purple-200' 
                              : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-purple-400'
                          } transition-all duration-300 rounded-full text-sm py-2 px-4`}
                        >
                          <item.icon size={14} className="mr-2"/>
                          {item.label} {additionalFields[item.field].enabled ? '-' : '+'}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Dynamic Input Fields */}
                <div className="space-y-3">
                  {additionalFields.linkedin.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        LinkedIn Profile
                      </label>
                      <Input 
                        value={additionalFields.linkedin.value}
                        onChange={(e) => handleAdditionalFieldChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                  )}

                  {additionalFields.website.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        Website / Portfolio
                      </label>
                      <Input 
                        value={additionalFields.website.value}
                        onChange={(e) => handleAdditionalFieldChange('website', e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                  )}

                  {additionalFields.drivingLicence.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-purple-300 mb-1 uppercase tracking-wider">
                        Driving Licence
                      </label>
                      <Input 
                        value={additionalFields.drivingLicence.value}
                        onChange={(e) => handleAdditionalFieldChange('drivingLicence', e.target.value)}
                        placeholder="Full UK Driving Licence"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10" 
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <motion.div 
                variants={itemVariants} 
                className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 rounded-full px-8 py-3 font-semibold shadow-xl"
                  >
                    Optional: Personal details
                  </Button>
                </motion.div>

                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-3 font-semibold"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => setLocation('/why-need-resume')}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-yellow-900 font-bold rounded-full px-8 py-3 shadow-xl"
                    >
                      Next: Work history
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Preview */}
            <motion.div className="hidden lg:block" variants={itemVariants}>
              <div className="sticky top-20">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Your Resume Preview
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    See how your information looks in real-time. Changes you make will instantly appear here.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-purple-300">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Auto-updating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI-optimized layout</span>
                    </div>
                  </div>
                </div>
                <PersonalInfoPreview resumeData={resumeData} />

                {/* Change Template Option */}
                <div className="mt-3 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm underline decoration-blue-400/50 hover:decoration-blue-300/50 transition-all duration-300"
                  >
                    Change template
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Debug Component */}
      <ResumeDataDebugger />

      {/* Template Selection Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-purple-400" />
              Select a Template
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose from available resume templates to customize your resume appearance
            </DialogDescription>
          </DialogHeader>
          {(isLoadingProTemplates || isFetchingTemplates) ? (
            <div className="text-center py-8">
              <p className="text-gray-300">Loading templates...</p>
            </div>
          ) : proTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-300">No templates available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {proTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTemplateSelection(template.id)}
                  className={cn(
                    "relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 group",
                    activeProTemplateId === template.id
                      ? "border-purple-400 ring-2 ring-purple-400/50 bg-purple-500/20"
                      : "hover:border-purple-400 hover:ring-2 hover:ring-purple-400/50 hover:bg-white/20"
                  )}
                >
                  {/* Selected indicator */}
                  {activeProTemplateId === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="aspect-[8.5/11] mb-3 rounded-lg overflow-hidden bg-white">
                    <img
                      src={getThumbnailUrl(template) || '/placeholder.png'}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1 truncate">{template.name}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{template.description || 'Professional resume template'}</p>
                </motion.div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PersonalInformationPage;