import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Mail, Eye, CheckCircle, FileType, FileText, FileUp, Zap, RotateCcw, Plus, Minus, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { generateSampleData, getDefaultSampleConfig, getMinimalSampleConfig, getMaximalSampleConfig, SampleDataConfig } from '@/lib/sampleDataGenerator';
import { useLocation } from 'wouter';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { auth } from '@/lib/firebase';

interface ExportOptionsProps {
  onOpenModal: () => void;
}

type ExportFormat = 'pdf' | 'docx';

const ExportOptions: React.FC<ExportOptionsProps> = ({ onOpenModal }) => {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [isSaving, setIsSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    resumeData,
    activeProTemplateId,
  } = useResumeStore();

  const {
    updateResumeData,
    updatePersonalInfo,
    updateWorkExperience,
    updateEducation,
    updateSkills,
    updateCertifications,
    updateLanguages,
    updateCustomSections,
    getProTemplateById
  } = useResumeStore((state) => state.actions);

  const [sampleConfig, setSampleConfig] = useState<SampleDataConfig>(getDefaultSampleConfig());
  const [showSampleControls, setShowSampleControls] = useState(false);

  // Sample Data Functions
  const loadSampleData = (config: SampleDataConfig) => {
    const sampleData = generateSampleData(config);
    updateResumeData(sampleData);
  };

  const clearAllData = () => {
    updateResumeData({
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

  const ActionButton = ({ icon: Icon, text, onClick }: { icon: React.ElementType, text: string, onClick?: () => void }) => (
    <Button 
      onClick={onClick}
      variant="outline" 
      className="w-full justify-start p-3 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all duration-200 hover:border-purple-400/50 text-sm"
    >
      <Icon className="w-4 h-4 mr-3 text-purple-400"/>
      <span className="font-medium">{text}</span>
    </Button>
  );

  const handleFinishAndSave = async () => {
    setIsSaving(true);

    try {
      // Get the current user from Firebase auth context
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your resume.",
          variant: "destructive",
        });
        setLocation('/login');
        return;
      }

      // Get the active template
      const activeTemplate = getProTemplateById ? getProTemplateById(activeProTemplateId) : null;

      // Prepare the resume data for saving
      const resumeDataToSave = {
        ...resumeData,
        userId: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        templateId: activeProTemplateId?.toString() || '',
        templateName: activeTemplate?.name || 'Unknown Template',
        title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim() || 'Untitled Resume',
        updatedAt: new Date().toISOString()
      };

      console.log('Saving resume data:', resumeDataToSave);

      // Save the resume to the database
      const response = await apiRequest('POST', '/api/resumes', resumeDataToSave);

      if (response.ok) {
        toast({
          title: "Resume Saved Successfully!",
          description: "Your resume has been saved to your dashboard.",
        });

        // Clear the local storage data since it's now saved
        localStorage.removeItem('tbz-resume-data');
        localStorage.removeItem('tbz-selected-pro-template');
        localStorage.removeItem('resumeBuilderProgress');

        // Navigate to dashboard
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error Saving Resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
      className="w-64 flex-shrink-0"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Finalize & Export</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">Download, share, or save your resume.</p>
        </div>

        {/* Download Card */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/10 mb-3">
          <h3 className="font-semibold text-white mb-2 px-1 text-sm">Download</h3>
          <div className="flex bg-black/20 rounded-full p-1 mb-3">
            <div
              onClick={() => setFormat('pdf')}
              className="flex-1 text-xs font-semibold rounded-full py-1 flex items-center justify-center gap-1 transition-colors relative cursor-pointer"
            >
              {format === 'pdf' && (
                <motion.span
                  layoutId="formatBubble"
                  className="absolute inset-0 bg-purple-600 text-white shadow-md rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">PDF</span>
            </div>
            <div
              onClick={() => setFormat('docx')}
              className="flex-1 text-xs font-semibold rounded-full py-1 flex items-center justify-center gap-1 transition-colors relative cursor-pointer"
            >
              {format === 'docx' && (
                <motion.span
                  layoutId="formatBubble"
                  className="absolute inset-0 bg-purple-600 text-white shadow-md rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">DOCX</span>
            </div>
          </div>
          <Button size="sm" className="w-full bg-white text-purple-700 hover:bg-gray-200 font-bold text-xs">
            <Download className="w-3 h-3 mr-2" />
            Download as {format.toUpperCase()}
          </Button>
        </div>

        {/* Other Actions Card */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/10 mb-3 space-y-2">
           <ActionButton icon={Printer} text="Print your resume" />
           <ActionButton icon={Mail} text="Send via email" />
        </div>

        {/* Sample Data Testing Card */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-amber-300 flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3" />
              Template Testing
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSampleControls(!showSampleControls)}
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 text-xs px-1 py-0.5 h-auto"
            >
              {showSampleControls ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showSampleControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {/* Quick Load Buttons */}
              <div className="grid grid-cols-1 gap-1">
                <Button
                  onClick={() => loadSampleData(getMinimalSampleConfig())}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs py-1 px-2 h-auto"
                  size="sm"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Minimal
                </Button>
                <Button
                  onClick={() => loadSampleData(getDefaultSampleConfig())}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 text-xs py-1 px-2 h-auto"
                  size="sm"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  Standard
                </Button>
                <Button
                  onClick={() => loadSampleData(getMaximalSampleConfig())}
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs py-1 px-2 h-auto"
                  size="sm"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Maximum
                </Button>
              </div>

              {/* Custom Controls */}
              <div className="bg-black/20 rounded-lg p-2 space-y-1">
                {/* Experience */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Exp</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('experience', -1)}
                      disabled={sampleConfig.experienceCount <= 0}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Minus className="w-2 h-2" />
                    </Button>
                    <span className="text-amber-300 font-mono text-xs w-4 text-center">{sampleConfig.experienceCount}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('experience', 1)}
                      disabled={sampleConfig.experienceCount >= 5}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Plus className="w-2 h-2" />
                    </Button>
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Edu</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('education', -1)}
                      disabled={sampleConfig.educationCount <= 0}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Minus className="w-2 h-2" />
                    </Button>
                    <span className="text-amber-300 font-mono text-xs w-4 text-center">{sampleConfig.educationCount}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('education', 1)}
                      disabled={sampleConfig.educationCount >= 4}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Plus className="w-2 h-2" />
                    </Button>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Skills</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('skills', -1)}
                      disabled={sampleConfig.skillsCount <= 0}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Minus className="w-2 h-2" />
                    </Button>
                    <span className="text-amber-300 font-mono text-xs w-4 text-center">{sampleConfig.skillsCount}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => adjustSampleCount('skills', 1)}
                      disabled={sampleConfig.skillsCount >= 15}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Plus className="w-2 h-2" />
                    </Button>
                  </div>
                </div>

                {/* Load Custom and Clear */}
                <div className="flex gap-1 pt-1">
                  <Button
                    onClick={() => loadSampleData(sampleConfig)}
                    className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs py-1 h-auto"
                    size="sm"
                  >
                    Load
                  </Button>
                  <Button
                    onClick={clearAllData}
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs py-1 px-1.5 h-auto"
                    size="sm"
                  >
                    <RotateCcw className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex-grow" />

        {/* Finalization Card */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/10 space-y-2">
          <ActionButton icon={Eye} text="Full Preview" onClick={onOpenModal} />
          <Button size="sm" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-yellow-500/30 group" onClick={handleFinishAndSave} disabled={isSaving}>
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Finish & Save
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportOptions;