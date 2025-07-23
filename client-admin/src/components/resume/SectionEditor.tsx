import React, { useState, useMemo, useEffect } from 'react';
// import { ResumeData, Certification, Language } from '@shared/schema'; // TEMP: Removed Certification, Language
import { ResumeData } from '@shared/schema'; // TEMP: Using only ResumeData
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Briefcase, GraduationCap, Lightbulb, FolderKanban, Award, Languages as LanguagesIcon, User, Settings2, Linkedin, Globe, Car, Sparkles, TrendingUp, Users, ChevronRight, FileText, Check, Edit2, Sidebar, FileText as MainIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface SectionEditorProps {
  resumeData: ResumeData;
  onChange: (newData: Partial<ResumeData>) => void;
  editorMode: 'fresher' | 'experienced';
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

// Enhanced Character Counter Component
const CharacterCounter = ({ value, maxLength, label }: { value: string, maxLength: number, label: string }) => {
  const length = value?.length || 0;
  const percentage = (length / maxLength) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <motion.div 
      className="flex items-center justify-between text-xs mt-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: length > 0 ? 1 : 0.5 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-white/50">{label}</span>
      <span className={`font-mono transition-colors ${
        isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-white/60'
      }`}>
        {length}/{maxLength}
      </span>
    </motion.div>
  );
};

// Enhanced Floating Label Input Component
const FloatingLabelInput = ({ label, value, onChange, placeholder, type = "text", required = false, maxLength }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={shouldFloat ? placeholder : ""}
          className="peer pt-6 pb-2 transition-all duration-200"
          maxLength={maxLength}
        />
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat 
              ? 'top-1.5 text-xs text-white/70' 
              : 'top-3 text-sm text-white/50'
          } ${required && !hasValue ? 'text-orange-400' : ''}`}
          animate={{
            y: shouldFloat ? 0 : 0,
            scale: shouldFloat ? 0.85 : 1,
            color: isFocused ? '#a855f7' : shouldFloat ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)'
          }}
          transition={{ duration: 0.2 }}
        >
          {label} {required && <span className="text-orange-400">*</span>}
        </motion.label>
      </div>
      {maxLength && <CharacterCounter value={value} maxLength={maxLength} label={`Recommended length for ${label.toLowerCase()}`} />}
    </div>
  );
};

// Enhanced Floating Label Textarea Component
const FloatingLabelTextarea = ({ label, value, onChange, placeholder, required = false, maxLength, rows = 4 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={shouldFloat ? placeholder : ""}
          className="peer pt-6 pb-2 resize-none transition-all duration-200"
          rows={rows}
          maxLength={maxLength}
        />
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat 
              ? 'top-1.5 text-xs text-white/70' 
              : 'top-3 text-sm text-white/50'
          } ${required && !hasValue ? 'text-orange-400' : ''}`}
          animate={{
            y: shouldFloat ? 0 : 0,
            scale: shouldFloat ? 0.85 : 1,
            color: isFocused ? '#a855f7' : shouldFloat ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)'
          }}
          transition={{ duration: 0.2 }}
        >
          {label} {required && <span className="text-orange-400">*</span>}
        </motion.label>
      </div>
      {maxLength && <CharacterCounter value={value} maxLength={maxLength} label={`${label} length`} />}
    </div>
  );
};

// Smart suggestions data
const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'Git', 'Docker',
  'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Express.js', 'GraphQL',
  'Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Project Management', 'Agile'
];

const JOB_TITLE_SUGGESTIONS = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist',
  'Product Manager', 'UX Designer', 'DevOps Engineer', 'Marketing Manager', 'Business Analyst',
  'Project Manager', 'Data Analyst', 'Mobile Developer', 'QA Engineer', 'Solutions Architect'
];

// Smart Suggestion Component
const SmartSuggestions = ({ suggestions, onSelect, currentValue }: {
  suggestions: string[];
  onSelect: (value: string) => void;
  currentValue: string;
}) => {
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(currentValue.toLowerCase()) && 
    s.toLowerCase() !== currentValue.toLowerCase()
  ).slice(0, 5);

  if (filteredSuggestions.length === 0 || !currentValue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden"
    >
      {filteredSuggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
};

// Date Selector Component
const DateSelector = ({ value, onChange, placeholder, allowPresent = true }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowPresent?: boolean;
}) => {
  // Parse existing value if it exists (format: MM/YYYY or 'Present')
  const parseValue = (val: string) => {
    if (val === 'Present') return { month: '', year: '', isPresent: true };
    if (!val) return { month: '', year: '', isPresent: false };
    const parts = val.split('/');
    if (parts.length === 2) {
      return { month: parts[0], year: parts[1], isPresent: false };
    }
    return { month: '', year: '', isPresent: false };
  };

  const { month: currentMonth, year: currentYear, isPresent } = parseValue(value);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate years from 1980 to current year + 10
  const currentYearNum = new Date().getFullYear();
  const years = [];
  for (let year = 1980; year <= currentYearNum + 10; year++) {
    years.push(year.toString());
  }

  const handleMonthChange = (newMonth: string) => {
    if (isPresent) return; // Don't change month if Present is checked

    if (newMonth && currentYear) {
      onChange(`${newMonth}/${currentYear}`);
    } else if (newMonth) {
      // If only month is selected, store it temporarily
      onChange(`${newMonth}/`);
    } else {
      onChange('');
    }
  };

  const handleYearChange = (newYear: string) => {
    if (isPresent) return; // Don't change year if Present is checked

    if (newYear && currentMonth) {
      onChange(`${currentMonth}/${newYear}`);
    } else if (newYear && value.includes('/')) {
      // If we have a partial month selection, complete it
      const month = value.split('/')[0];
      onChange(`${month}/${newYear}`);
    } else if (newYear) {
      // If only year is selected, don't update yet
      onChange(`/${newYear}`);
    } else {
      onChange('');
    }
  };

  const handlePresentChange = (checked: boolean) => {
    if (checked) {
      onChange('Present');
    } else {
      // When unchecking Present, set to empty or restore previous date if exists
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={isPresent ? '' : currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          disabled={isPresent}
          className={`flex-1 px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">Month</option>
          {months.map((month) => (
            <option key={month.value} value={month.value} className="bg-white text-black">
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={isPresent ? '' : currentYear}
          onChange={(e) => handleYearChange(e.target.value)}
          disabled={isPresent}
          className={`flex-1 px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">Year</option>
          {years.reverse().map((year) => (
            <option key={year} value={year} className="bg-white text-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      {allowPresent && (
        <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={(e) => handlePresentChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
              isPresent 
                ? 'bg-green-500 border-green-500 shadow-lg' 
                : 'border-gray-300 bg-white hover:border-green-400'
            }`}>
              {isPresent && (
                <svg 
                  className="w-3 h-3 text-white" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </div>
          <span className={`transition-colors ${isPresent ? 'text-green-300 font-medium' : ''}`}>
            Currently ongoing (Present)
          </span>
        </label>
      )}
    </div>
  );
};

// Define base sections and their properties
const allSectionsConfig = {
  personal: { label: 'Personal', icon: User, content: (props: any) => <PersonalInfoSection {...props} /> },
  experience: { label: 'Experience', icon: Briefcase, content: (props: any) => <ExperienceSection {...props} /> },
  education: { label: 'Education', icon: GraduationCap, content: (props: any) => <EducationSection {...props} /> },
  skills: { label: 'Skills', icon: Settings2, content: (props: any) => <SkillsSection {...props} /> },
  certifications: { label: 'Certifications', icon: Award, content: (props: any) => <CertificationsSection {...props} /> },
  languages: { label: 'Languages', icon: LanguagesIcon, content: (props: any) => <LanguagesSection {...props} /> },
  custom: { label: 'Custom', icon: Plus, content: (props: any) => <CustomSections {...props} /> }
};

// Define which sections are available for each mode
const modeSections: Record<'fresher' | 'experienced', (keyof typeof allSectionsConfig)[]> = {
  fresher: ['personal', 'education', 'skills', 'languages', 'custom'],
  experienced: ['personal', 'experience', 'education', 'skills', 'languages', 'custom']
};

export default function SectionEditor({ resumeData, onChange, editorMode, activeSection: parentActiveSection, onSectionChange }: SectionEditorProps) {
  const availableSectionKeys = useMemo(() => modeSections[editorMode], [editorMode]);
  const [activeSection, setActiveSection] = useState<(keyof typeof allSectionsConfig)>((parentActiveSection as keyof typeof allSectionsConfig) || (availableSectionKeys.includes('personal') ? 'personal' : availableSectionKeys[0]) || 'personal');

  // Sync with parent activeSection prop
  useEffect(() => {
    if (parentActiveSection && availableSectionKeys.includes(parentActiveSection as keyof typeof allSectionsConfig)) {
      setActiveSection(parentActiveSection as keyof typeof allSectionsConfig);
    }
  }, [parentActiveSection, availableSectionKeys]);

  useEffect(() => {
    if (!availableSectionKeys.includes(activeSection)) {
      setActiveSection(availableSectionKeys[0] || 'personal');
    }
  }, [availableSectionKeys, activeSection]);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({ personalInfo: { ...resumeData.personalInfo, [field]: value }});
  };

  const updateContactDetail = (key: string, value: string) => {
    onChange({
      personalInfo: {
        ...resumeData.personalInfo,
        contactDetails: {
          ...(resumeData.personalInfo?.contactDetails || {}),
          [key]: value,
        },
      },
    });
  };

  const removeContactDetail = (key: string) => {
    const { [key]: _, ...remainingDetails } = resumeData.personalInfo?.contactDetails || {};
    onChange({
      personalInfo: {
        ...resumeData.personalInfo,
        contactDetails: remainingDetails,
      },
    });
  };

  const addEducation = () => {
    onChange({ education: [...(resumeData.education || []), { id: crypto.randomUUID(), school: '', degree: '', location: '', startDate: '', endDate: '', description: '' }] });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ education: updated });
  };

  // New function to update entire education at once
  const updateEntireEducation = (index: number, educationData: any) => {
    const updated = [...(resumeData.education || [])];
    updated[index] = { ...updated[index], ...educationData };
    console.log('[SectionEditor] Updating entire education at index:', index);
    console.log('[SectionEditor] Education data being saved:', educationData);
    console.log('[SectionEditor] Updated education array:', updated);
    onChange({ education: updated });
  };

  const removeEducation = (index: number) => {
    const updated = [...(resumeData.education || [])];
    updated.splice(index, 1);
    onChange({ education: updated });
  };

  const addExperience = () => {
    onChange({ experience: [...(resumeData.experience || []), { id: crypto.randomUUID(), company: '', position: '', location: '', startDate: '', endDate: '', description: '' }] });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.experience || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ experience: updated });
  };

  // New function to update entire experience at once
  const updateEntireExperience = (index: number, experienceData: any) => {
    const updated = [...(resumeData.experience || [])];
    updated[index] = { ...updated[index], ...experienceData };
    console.log('[SectionEditor] Updating entire experience at index:', index);
    console.log('[SectionEditor] Experience data being saved:', experienceData);
    console.log('[SectionEditor] Updated experience array:', updated);
    onChange({ experience: updated });
  };

  const removeExperience = (index: number) => {
    const updated = [...(resumeData.experience || [])];
    updated.splice(index, 1);
    onChange({ experience: updated });
  };

  const addSkill = (skill?: {name: string, level: string}) => {
    const newSkill = skill || { name: '', level: '' };
    onChange({ skills: [...(resumeData.skills || []), newSkill] });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.skills || [])];
    updated[index] = { ...updated[index], [field]: value };
    console.log('[SectionEditor] Updating skills:', updated);
    onChange({ skills: updated });
  };

  // New function to update entire skill at once
  const updateEntireSkill = (index: number, skillData: any) => {
    const updated = [...(resumeData.skills || [])];
    updated[index] = { ...updated[index], ...skillData };
    console.log('[SectionEditor] Updating entire skill:', updated);
    onChange({ skills: updated });
  };

  const removeSkill = (index: number) => {
    const updated = [...(resumeData.skills || [])];
    if (index === -1) {
        onChange({ skills: [] });
        return;
    }
    updated.splice(index, 1);
    onChange({ skills: updated });
  };

  const addCertification = () => {
    const newCertification: any = { id: crypto.randomUUID(), name: '', issuingOrganization: '', date: '', credentialId: '' };
    onChange({ certifications: [...(resumeData.certifications as any[] || []), newCertification] });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.certifications as any[] || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ certifications: updated as any[] });
  };

  const removeCertification = (index: number) => {
    const updated = [...(resumeData.certifications as any[] || [])];
    updated.splice(index, 1);
    onChange({ certifications: updated as any[] });
  };

  const addLanguage = (language?: { name: string; proficiency: string }) => {
    const newLanguage = language || { name: '', proficiency: '' };
    const updatedLanguages = [...(resumeData.languages as any[] || []), newLanguage];
    console.log('[SectionEditor] Adding new language:', newLanguage, 'Updated languages array:', updatedLanguages);
    onChange({ languages: updatedLanguages });
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.languages as any[] || [])];
    updated[index] = { ...updated[index], [field]: value };
    console.log('[SectionEditor] Updating languages:', updated, 'at index:', index, 'field:', field, 'value:', value);
    onChange({ languages: updated as any[] });
  };

  // New function to update entire language at once
  const updateEntireLanguage = (index: number, languageData: any) => {
    const updated = [...(resumeData.languages as any[] || [])];
    updated[index] = { ...updated[index], ...languageData };
    console.log('[SectionEditor] Updating entire language:', updated);
    onChange({ languages: updated as any[] });
  };

  const removeLanguage = (index: number) => {
    const updated = [...(resumeData.languages as any[] || [])];
    updated.splice(index, 1);
    onChange({ languages: updated as any[] });
  };

  const addCustomSection = () => {
    onChange({ customSections: [...(resumeData.customSections || []), { title: 'New Section', content: '' }] });
  };

  const updateCustomSection = (index: number, field: string, value: string) => {
    const updated = [...(resumeData.customSections || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ customSections: updated });
  };

  const updateEntireCustomSection = (index: number, sectionData: any) => {
    const updated = [...(resumeData.customSections || [])];
    updated[index] = sectionData;
    onChange({ customSections: updated });
  };

  const removeCustomSection = (index: number) => {
    const updated = [...(resumeData.customSections || [])];
    updated.splice(index, 1);
    onChange({ customSections: updated });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section as keyof typeof allSectionsConfig);
    onSectionChange?.(section);
  };

  return (
    <div className="p-0">
      {/* Direct rendering without tabs - navigation is handled by ProgressTracker */}
      <div className="p-6 m-0 mt-0 bg-gradient-to-br from-purple-900/40 via-purple-950/35 to-blue-900/40 border-2 border-purple-400/50 rounded-2xl text-white shadow-lg min-h-[700px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {activeSection === 'personal' && <PersonalInfoSection resumeData={resumeData} updatePersonalInfo={updatePersonalInfo} updateContactDetail={updateContactDetail} removeContactDetail={removeContactDetail} editorMode={editorMode} />}
          {activeSection === 'experience' && <ExperienceSection resumeData={resumeData} experience={resumeData.experience || []} addExperience={addExperience} updateExperience={updateExperience} updateEntireExperience={updateEntireExperience} removeExperience={removeExperience} />}
          {activeSection === 'education' && <EducationSection resumeData={resumeData} education={resumeData.education || []} addEducation={addEducation} updateEducation={updateEducation} updateEntireEducation={updateEntireEducation} removeEducation={removeEducation} />}
          {activeSection === 'skills' && <SkillsSection resumeData={resumeData} skills={resumeData.skills || []} addSkill={addSkill} updateSkill={updateSkill} updateEntireSkill={updateEntireSkill} removeSkill={removeSkill} />}
          {activeSection === 'certifications' && <CertificationsSection resumeData={resumeData} certifications={resumeData.certifications as any[] || []} addCertification={addCertification} updateCertification={updateCertification} removeCertification={removeCertification} />}
          {activeSection === 'languages' && <LanguagesSection resumeData={resumeData} languages={resumeData.languages as any[] || []} addLanguage={addLanguage} updateLanguage={updateLanguage} updateEntireLanguage={updateEntireLanguage} removeLanguage={removeLanguage} />}
          {activeSection === 'custom' && <CustomSections resumeData={resumeData} customSections={resumeData.customSections || []} addCustomSection={addCustomSection} updateCustomSection={updateCustomSection} updateEntireCustomSection={updateEntireCustomSection} removeCustomSection={removeCustomSection} />}
        </motion.div>
      </div>
    </div>
  );
}

const optionalFieldsConfig = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'LinkedIn Profile URL', icon: Linkedin },
  { key: 'website', label: 'Website', placeholder: 'Portfolio/Website URL', icon: Globe },
  { key: 'drivingLicense', label: 'Driving License', placeholder: 'License Class/Number', icon: Car },
  // Add more fields here, e.g., GitHub, Nationality
];

const PersonalInfoSection = ({ resumeData, updatePersonalInfo, updateContactDetail, removeContactDetail, editorMode }: any) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="min-h-[850px]">
      <div>
        <h3 className="text-lg font-medium text-white mb-6">Personal Information</h3>

        <Card className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
          <div className="p-4">
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  First Name
                </label>
                <Input
                  value={resumeData.personalInfo?.firstName || ''}
                  onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Last Name
                </label>
                <Input
                  value={resumeData.personalInfo?.lastName || ''}
                  onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Email
                </label>
                <Input
                  type="email"
                  value={resumeData.personalInfo?.email || ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={resumeData.personalInfo?.phone || ''}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="Your phone number"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>

              {/* Job Title */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Job Title / Desired Role
                </label>
                <Input
                  value={resumeData.personalInfo?.title || ''}
                  onChange={(e) => {
                    updatePersonalInfo('title', e.target.value);
                    setShowSuggestions(e.target.value.length > 1);
                  }}
                  placeholder="e.g., Software Engineer"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
                <AnimatePresence>
                  {showSuggestions && (
                    <SmartSuggestions
                      suggestions={JOB_TITLE_SUGGESTIONS}
                      currentValue={resumeData.personalInfo?.title || ''}
                      onSelect={(value) => {
                        updatePersonalInfo('title', value);
                        setShowSuggestions(false);
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Address / Location
                </label>
                <Input
                  value={resumeData.personalInfo?.address || ''}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  placeholder="City, Country"
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>

              {/* Professional Summary / About Me */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  {editorMode === 'fresher' ? 'About Me' : 'Professional Summary'}
                </label>
                <Textarea 
                  value={resumeData.personalInfo?.summary || ''} 
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)} 
                  placeholder={editorMode === 'fresher' ? 'Write a brief introduction about yourself, your interests, and career aspirations...' : 'Write a brief summary of your career, skills, and goals...'}
                  rows={4}
                  maxLength={500}
                  className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
                <CharacterCounter 
                  value={resumeData.personalInfo?.summary || ''} 
                  maxLength={500} 
                  label={editorMode === 'fresher' ? 'About Me length' : 'Professional Summary length'} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Optional Contact Details */}
        {resumeData.personalInfo?.contactDetails && Object.keys(resumeData.personalInfo.contactDetails).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.keys(resumeData.personalInfo.contactDetails).map((key) => {
            const fieldConfig = optionalFieldsConfig.find(f => f.key === key);
            if (!fieldConfig) return null;
            return (
                <div key={key} className="flex items-center gap-3 p-3 border border-white/20 bg-white/5 rounded-lg">
                  <fieldConfig.icon size={16} className="text-white/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium mb-1 text-white/60">
                      {fieldConfig.label}
                    </label>
                  <Input 
                    value={resumeData.personalInfo.contactDetails[key] || ''} 
                    onChange={(e) => updateContactDetail(key, e.target.value)}
                      placeholder={fieldConfig.placeholder}
                    className="text-sm h-8 bg-white text-black border-gray-300 placeholder:text-gray-500"
                  />
                </div>
                  <Button 
                    size="sm" 
                    onClick={() => removeContactDetail(key)} 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 h-8 px-2"
                  >
                    <Trash2 size={12} />
                </Button>
              </div>
            );
          })}
        </div>
        )}

        {/* Add Optional Fields */}
        {optionalFieldsConfig.some(field => !(resumeData.personalInfo?.contactDetails && resumeData.personalInfo.contactDetails.hasOwnProperty(field.key))) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white/80 mb-3">
              Additional Information 
              <Badge variant="secondary" className="ml-2 bg-white/10 text-white/70 text-xs">Optional</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {optionalFieldsConfig
                .filter(field => !(resumeData.personalInfo?.contactDetails && resumeData.personalInfo.contactDetails.hasOwnProperty(field.key)))
                .map((field) => (
                  <Button 
                    key={field.key}
                    size="sm" 
                    onClick={() => updateContactDetail(field.key, '')}
                    className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
                  >
                    <field.icon size={14} className="mr-2" />
                    {field.label}
                    <Plus size={14} className="ml-1" />
                  </Button>
                ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExperienceSection = ({ resumeData, experience, addExperience, updateExperience, updateEntireExperience, removeExperience }: any) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [currentExperience, setCurrentExperience] = React.useState({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Auto-save current experience and add new one
  const handleAddExperience = () => {
    // If we're currently editing and have data, save it first
    if (editingIndex !== null && hasExperienceData(currentExperience)) {
      handleSaveExperience();
    }

    // Add new experience and start editing it
    const newIndex = experience.length;
    addExperience();
    setEditingIndex(newIndex);
    setCurrentExperience({
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  // Check if experience has meaningful data
  const hasExperienceData = (exp: any) => {
    return exp.position || exp.company || exp.description;
  };

  // Save current experience
  const handleSaveExperience = () => {
    if (editingIndex !== null && hasExperienceData(currentExperience)) {
      console.log('[ExperienceSection] Saving experience:', currentExperience, 'at index:', editingIndex);
      console.log('[ExperienceSection] Current experience state before save:', currentExperience);

      const experienceToSave = {
        position: currentExperience.position,
        company: currentExperience.company,
        location: currentExperience.location,
        startDate: currentExperience.startDate,
        endDate: currentExperience.endDate,
        description: currentExperience.description
      };

      console.log('[ExperienceSection] Experience object being saved:', experienceToSave);

      // Use the new updateEntireExperience function to avoid race conditions
      updateEntireExperience(editingIndex, experienceToSave);

      // Clear the current experience state and exit edit mode
      setCurrentExperience({
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setEditingIndex(null);
    } else {
      console.log('[ExperienceSection] Save failed - editingIndex:', editingIndex, 'hasData:', hasExperienceData(currentExperience));
    }
  };

  // Start editing an experience
  const handleEditExperience = (index: number) => {
    // Auto-save current editing experience if different
    if (editingIndex !== null && editingIndex !== index && hasExperienceData(currentExperience)) {
      handleSaveExperience();
    }

    const exp = experience[index] || {};
    setCurrentExperience({
      position: exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || ''
    });
    setEditingIndex(index);
  };

  // Update current experience state AND resume data for real-time preview
  const handleUpdateCurrentExperience = (field: string, value: string) => {
    const updatedExp = { ...currentExperience, [field]: value };
    setCurrentExperience(updatedExp);

    // Also update the resume data immediately for real-time preview
    if (editingIndex !== null) {
      updateEntireExperience(editingIndex, updatedExp);
    }
  };

  // Format description with bullet points
  const formatDescription = (description: string) => {
    if (!description) return [];
    const lines = description.split('\n').filter(line => line.trim());
    return lines.map(line => line.startsWith('•') ? line : `• ${line}`);
  };

  return (
    <div className="min-h-[850px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Work Experience</h3>
            <Button 
              size="sm" 
            onClick={handleAddExperience}
              className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
            >
              <Plus size={16} className="mr-1"/> Add Experience
            </Button>
        </div>

        <div className="space-y-4">
          {experience.map((exp: any, index: number) => {
            const isEditing = editingIndex === index;
            const currentExp = isEditing ? currentExperience : exp;

            return (
              <Card key={index} className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
                <div className="p-4">
                  {isEditing ? (
                    // Edit Mode
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/90">
                          {currentExp.position || `Experience #${index + 1}`}
                          {currentExp.company && <span className="text-white/60 ml-2">at {currentExp.company}</span>}
                        </h4>
                  </div>

                      <div className="space-y-4">
                        {/* Position */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            Position *
                          </label>
                          <Input
                            value={currentExp.position}
                            onChange={(e) => handleUpdateCurrentExperience('position', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                        </div>

                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            Company *
                          </label>
                          <Input
                            value={currentExp.company}
                            onChange={(e) => handleUpdateCurrentExperience('company', e.target.value)}
                        placeholder="e.g., Google Inc."
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            Location
                          </label>
                          <Input
                            value={currentExp.location}
                            onChange={(e) => handleUpdateCurrentExperience('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                        </div>

                                                {/* Start Date and End Date */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              Start Date
                            </label>
                            <DateSelector
                              value={currentExp.startDate}
                              onChange={(value) => handleUpdateCurrentExperience('startDate', value)}
                              placeholder="Select start date"
                              allowPresent={false}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              End Date
                            </label>
                            <DateSelector
                              value={currentExp.endDate}
                              onChange={(value) => handleUpdateCurrentExperience('endDate', value)}
                              placeholder="Select end date"
                              allowPresent={true}
                            />
                </div>
                  </div>

                        {/* Job Description */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-white/80">
                              Job Description
                            </label>
                            <CharacterCounter 
                              value={currentExp.description || ''} 
                              maxLength={800} 
                      label="Job Description"
                            />
                          </div>
                          <div className="text-xs text-white/60 mb-2">
                            💡 Include 3-5 key responsibilities and achievements for best results (minimum 50 words recommended)
                          </div>
                          <Textarea 
                            value={currentExp.description}
                            onChange={(e) => handleUpdateCurrentExperience('description', e.target.value)}
                      placeholder="• Led cross-functional team of 8 developers on enterprise projects&#10;• Increased system performance by 40% through code optimization&#10;• Implemented CI/CD pipelines reducing deployment time by 60%"
                      rows={5}
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                            maxLength={800}
                    />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/20">
                          <Button 
                            size="sm" 
                            onClick={handleSaveExperience}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                          >
                            <Check size={14} className="mr-1" /> Save
                          </Button>
                    <Button 
                      size="sm" 
                      onClick={() => removeExperience(index)} 
                            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                    >
                            <Trash2 size={14} className="mr-1" /> Remove Entry
                </Button>
                  </div>
                      </div>
                    </>
                  ) : (
                    // View Mode - Saved Experience Card
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-300 text-sm font-semibold">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {exp.position || 'Position'}
                              {exp.company && <span className="text-white/70">, {exp.company}</span>}
                            </h3>
                          </div>

                          <div className="text-sm text-white/60 mb-3">
                            {exp.company && exp.location && `${exp.company} | `}
                            {!exp.company && exp.location && `${exp.location} | `}
                            {exp.startDate} - {exp.endDate || 'Present'}
          </div>

                          {exp.description && (
                            <div className="space-y-1">
                              {formatDescription(exp.description).map((line: string, i: number) => (
                                <div key={i} className="text-sm text-white/80 flex items-start">
                                  <span className="text-white/60 mr-2">•</span>
                                  <span>{line.replace(/^•\s*/, '')}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {exp.description && (
            <Button 
                              variant="link"
              size="sm" 
                              onClick={() => handleEditExperience(index)}
                              className="text-blue-400 hover:text-blue-300 p-0 h-auto mt-2 text-sm"
            >
                              <Edit2 size={12} className="mr-1" />
                              Edit description
            </Button>
                          )}
        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExperience(index)}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                          >
                            <Edit2 size={16} />
                          </Button>
                <Button 
                            variant="ghost"
                  size="sm" 
                            onClick={() => removeExperience(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                >
                            <Trash2 size={16} />
                </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
          </Card>
            );
          })}

          {/* Add More Experience Button - Only show if not currently editing */}
          {experience.length > 0 && editingIndex === null && (
            <Card className="border-2 border-dashed border-white/30 bg-white/5 shadow-sm rounded-lg">
              <div className="p-6 text-center">
                <Button 
                  onClick={handleAddExperience}
                  className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-purple-800 transition-all"
                >
                  <Plus size={16} className="mr-2" />
                  Add More Experience
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const EducationSection = ({ resumeData, education, addEducation, updateEducation, updateEntireEducation, removeEducation }: any) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [currentEducation, setCurrentEducation] = React.useState({
    school: '',
    degree: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Debug education state
  console.log('[EducationSection] Render - editingIndex:', editingIndex);
  console.log('[EducationSection] Render - currentEducation:', currentEducation);
  console.log('[EducationSection] Render - education array:', education);

  // Auto-save current education and add new one
  const handleAddEducation = () => {
    console.log('[EducationSection] handleAddEducation called');
    if (editingIndex !== null && hasEducationData(currentEducation)) {
      handleSaveEducation();
    }

    const newIndex = education.length;
    console.log('[EducationSection] Adding new education at index:', newIndex);
    addEducation();
    setEditingIndex(newIndex);
    const emptyEducation = {
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    console.log('[EducationSection] Setting currentEducation to empty state:', emptyEducation);
    setCurrentEducation(emptyEducation);
  };

  // Check if education has meaningful data
  const hasEducationData = (edu: any) => {
    return edu.school || edu.degree;
  };

  // Save current education
  const handleSaveEducation = () => {
    if (editingIndex !== null && hasEducationData(currentEducation)) {
      console.log('[EducationSection] Saving education:', currentEducation, 'at index:', editingIndex);
      console.log('[EducationSection] Current education state before save:', currentEducation);

      const educationToSave = {
        school: currentEducation.school,
        degree: currentEducation.degree,
        location: currentEducation.location,
        startDate: currentEducation.startDate,
        endDate: currentEducation.endDate
      };

      console.log('[EducationSection] Education object being saved:', educationToSave);

      // Use the new updateEntireEducation function to avoid race conditions
      updateEntireEducation(editingIndex, educationToSave);

      // Clear the current education state and exit edit mode
      setCurrentEducation({
        school: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setEditingIndex(null);
    } else {
      console.log('[EducationSection] Save failed - editingIndex:', editingIndex, 'hasData:', hasEducationData(currentEducation));
    }
  };

  // Start editing an education
  const handleEditEducation = (index: number) => {
    console.log('[EducationSection] handleEditEducation called for index:', index);
    if (editingIndex !== null && editingIndex !== index && hasEducationData(currentEducation)) {
      handleSaveEducation();
    }

    const edu = education[index] || {};
    console.log('[EducationSection] Loading education data for editing:', edu);
    const loadedEducation = {
      school: edu.school || '',
      degree: edu.degree || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || ''
    };
    console.log('[EducationSection] Setting currentEducation for editing:', loadedEducation);
    setCurrentEducation(loadedEducation);
    setEditingIndex(index);
  };

  // Update current education state AND resume data for real-time preview
  const handleUpdateCurrentEducation = (field: string, value: string) => {
    console.log('[EducationSection] handleUpdateCurrentEducation called:', field, '=', value);
    const updatedEdu = { ...currentEducation, [field]: value };
    setCurrentEducation(updatedEdu);
    console.log('[EducationSection] Updated currentEducation state:', updatedEdu);

    // Also update the resume data immediately for real-time preview
    if (editingIndex !== null) {
      updateEntireEducation(editingIndex, updatedEdu);
    }
  };

  return (
    <div className="min-h-[850px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Education</h3>
          <Button 
            size="sm" 
            onClick={handleAddEducation}
            className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
          >
            <Plus size={16} className="mr-1"/> Add Education
          </Button>
                  </div>

        <div className="space-y-4">
          {(education || []).map((eduItem: any, index: number) => {
            const isEditing = editingIndex === index;
            const currentEdu = isEditing ? currentEducation : eduItem;

            return (
              <Card key={index} className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
                <div className="p-4">
                  {isEditing ? (
                    // Edit Mode
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/90">
                          {currentEdu.degree || `Education #${index + 1}`}
                          {currentEdu.school && <span className="text-white/60 ml-2">at {currentEdu.school}</span>}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {/* School/University */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            School/University *
                          </label>
                          <Input
                            value={currentEdu.school}
                            onChange={(e) => handleUpdateCurrentEducation('school', e.target.value)}
                            placeholder="e.g., Harvard University"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                          />
                        </div>

                        {/* Degree */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            Degree *
                          </label>
                          <Input
                            value={currentEdu.degree}
                            onChange={(e) => handleUpdateCurrentEducation('degree', e.target.value)}
                            placeholder="e.g., B.S. in Computer Science"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white/80">
                            Location
                          </label>
                          <Input
                            value={currentEdu.location}
                            onChange={(e) => handleUpdateCurrentEducation('location', e.target.value)}
                            placeholder="e.g., Cambridge, MA"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                          />
                        </div>

                                                {/* Start Date and End Date */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              Start Date
                            </label>
                            <DateSelector
                              value={currentEdu.startDate}
                              onChange={(value) => handleUpdateCurrentEducation('startDate', value)}
                              placeholder="Select start date"
                              allowPresent={false}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              End Date
                            </label>
                            <DateSelector
                              value={currentEdu.endDate}
                              onChange={(value) => handleUpdateCurrentEducation('endDate', value)}
                              placeholder="Select end date"
                              allowPresent={true}
                            />
                        </div>
                    </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/20">
                          <Button 
                            size="sm" 
                            onClick={handleSaveEducation}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                          >
                            <Check size={14} className="mr-1" /> Save
                          </Button>
                        <Button 
                          size="sm" 
                          onClick={() => removeEducation(index)} 
                            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                        >
                        <Trash2 size={14} className="mr-1" /> Remove Entry
                      </Button>
                    </div>
                      </div>
                    </>
                  ) : (
                    // View Mode - Saved Education Card
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center text-green-300 text-sm font-semibold">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {eduItem.degree || 'Degree'}
                            </h3>
                          </div>

                          <div className="text-base text-white/80 mb-2">
                            {eduItem.school || 'School'}
                          </div>

                          <div className="text-sm text-white/60">
                            {eduItem.location && `${eduItem.location} | `}
                            {eduItem.startDate} - {eduItem.endDate || 'Present'}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEducation(index)}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
        )}
                </div>
              </Card>
            );
          })}

          {/* Add More Education Button */}
          {education.length > 0 && editingIndex === null && (
            <Card className="border-2 border-dashed border-white/30 bg-white/5 shadow-sm rounded-lg">
              <div className="p-6 text-center">
                <Button 
                  onClick={handleAddEducation}
                  className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-purple-800 transition-all"
                >
                  <Plus size={16} className="mr-2" />
                  Add More Education
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const SkillsSection = ({ resumeData, skills, addSkill, updateSkill, updateEntireSkill, removeSkill }: any) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [currentSkill, setCurrentSkill] = React.useState({
    name: '',
    level: ''
  });

  // Auto-save current skill and add new one
  const handleAddSkillCard = () => {
    if (editingIndex !== null && hasSkillData(currentSkill)) {
      handleSaveSkill();
    }

    const newIndex = skills.length;
    addSkill({ name: '', level: '' });
    setEditingIndex(newIndex);
    setCurrentSkill({
      name: '',
      level: ''
    });
  };

  // Check if skill has meaningful data
  const hasSkillData = (skill: any) => {
    return skill.name && skill.name.trim();
  };

  // Save current skill
  const handleSaveSkill = () => {
    if (editingIndex !== null && hasSkillData(currentSkill)) {
      console.log('[SkillsSection] Saving skill:', currentSkill, 'at index:', editingIndex);

      // Use the new updateEntireSkill function to avoid race conditions
      updateEntireSkill(editingIndex, {
        name: currentSkill.name,
        level: currentSkill.level
      });

      // Clear state immediately - the UI will update when parent state changes
      setCurrentSkill({ name: '', level: '' });
      setEditingIndex(null);
    }
  };

  // Start editing a skill
  const handleEditSkill = (index: number) => {
    if (editingIndex !== null && editingIndex !== index && hasSkillData(currentSkill)) {
      handleSaveSkill();
    }

    const skill = skills[index] || {};
    setCurrentSkill({
      name: skill.name || '',
      level: skill.level || ''
    });
    setEditingIndex(index);
  };

  // Update current skill state AND resume data for real-time preview
  const handleUpdateCurrentSkill = (field: string, value: string) => {
    const updatedSkill = { ...currentSkill, [field]: value };
    setCurrentSkill(updatedSkill);

    // Also update the resume data immediately for real-time preview
    if (editingIndex !== null) {
      updateEntireSkill(editingIndex, updatedSkill);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[850px]"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Skills</h3>
        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        <Button 
          size="sm" 
          onClick={handleAddSkillCard}
          className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
        >
          <Plus size={16} className="mr-1"/> Add Skill
        </Button>
      </div>

      <div className="space-y-4">
        {(skills || []).map((skill: any, index: number) => {
          const isEditing = editingIndex === index;
          const currentSkillData = isEditing ? currentSkill : skill;

          return (
            <Card key={index} className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
              <div className="p-4">
                {isEditing ? (
                  // Edit Mode
                  <>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/90">
                        {currentSkillData.name || `Skill #${index + 1}`}
                        {currentSkillData.level && <span className="text-white/60 ml-2">({currentSkillData.level})</span>}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {/* Skill Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">
                          Skill Name *
                        </label>
                        <Input
                          value={currentSkillData.name}
                          onChange={(e) => handleUpdateCurrentSkill('name', e.target.value)}
            placeholder="e.g., JavaScript, Leadership"
                          className="bg-white text-black border-gray-300 placeholder:text-gray-500"
          />
                      </div>

                      {/* Skill Level */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">
                          Proficiency Level (Optional)
                        </label>
                        <select
                          value={currentSkillData.level}
                          onChange={(e) => handleUpdateCurrentSkill('level', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" className="bg-white text-black">Select proficiency level</option>
                          <option value="Beginner" className="bg-white text-black">Beginner</option>
                          <option value="Intermediate" className="bg-white text-black">Intermediate</option>
                          <option value="Advanced" className="bg-white text-black">Advanced</option>
                          <option value="Expert" className="bg-white text-black">Expert</option>
                          <option value="Professional" className="bg-white text-black">Professional</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-white/20">
                        <Button 
                          size="sm" 
                          onClick={handleSaveSkill}
                          className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                        >
                          <Check size={14} className="mr-1" /> Save
                        </Button>
          <Button 
            size="sm" 
                          onClick={() => removeSkill(index)} 
                          className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
          >
                          <Trash2 size={14} className="mr-1" /> Remove Entry
        </Button>
      </div>
                    </div>
                  </>
                ) : (
                  // View Mode - Saved Skill Card
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center text-purple-300 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {skill.name || 'Skill'}
                          </h3>
                {skill.level && (
                            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                              {skill.level}
                            </span>
                )}
              </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSkill(index)}
                          className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                  onClick={() => removeSkill(index)} 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                >
                <Trash2 size={16} />
              </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}

        {/* Add More Skills Button */}
        {skills.length > 0 && editingIndex === null && (
          <Card className="border-2 border-dashed border-white/30 bg-white/5 shadow-sm rounded-lg">
            <div className="p-6 text-center">
              <Button 
                onClick={handleAddSkillCard}
                className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-purple-800 transition-all"
              >
                <Plus size={16} className="mr-2" />
                Add More Skills
              </Button>
        </div>
          </Card>
      )}


              </div>
    </motion.div>
  );
};

const CertificationsSection = ({ resumeData, certifications, addCertification, updateCertification, removeCertification }: any) => {
  return (
    <div className="min-h-[850px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Certifications</h3>
          <Button onClick={addCertification} size="sm" className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all">
            <Plus size={16} className="mr-1.5" /> Add Certification
          </Button>
        </div>

        {(certifications || []).length === 0 ? (
          <Card className="border-dashed border-white border-2 bg-purple-800 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <Award size={40} className="text-white/60 mb-4" />
              <p className="text-white/70 mb-3 text-sm">No certifications listed yet.</p>
              <Button onClick={addCertification} size="sm" className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all">
                <Plus size={16} className="mr-1.5" /> Add First Certification
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {(certifications || []).map((cert: any, index: number) => (
              <AccordionItem key={index} value={`cert-${index}`} className="border border-white/20 bg-white/10 rounded-lg shadow-sm overflow-hidden text-white backdrop-blur-md">
                <AccordionTrigger className="px-4 py-3 hover:bg-white/10 hover:no-underline w-full text-left text-white">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-sm">
                      {cert.name || `Certification #${index + 1}`}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 border-t border-white/10 bg-white/5 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-white/70">Certification Name</label>
                      <Input 
                        placeholder="e.g., Certified Scrum Master" 
                        value={cert.name || ''} 
                        onChange={(e) => updateCertification(index, 'name', e.target.value)} 
                        className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-white/70">Issuing Organization</label>
                      <Input 
                        placeholder="e.g., Scrum Alliance" 
                        value={cert.issuer || cert.issuingOrganization || ''} // Accommodate both issuer/issuingOrganization for now
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)} // Standardize on 'issuer' for update
                        className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-white/70">Date Issued</label>
                      <DateSelector
                        value={cert.date || ''} 
                        onChange={(value) => updateCertification(index, 'date', value)} 
                        placeholder="Select date issued"
                        allowPresent={false}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-white/70">Credential ID/URL (Optional)</label>
                      <Input 
                        placeholder="e.g., ABC-123 or https://verify.example.com" 
                        value={cert.credentialId || ''} 
                        onChange={(e) => updateCertification(index, 'credentialId', e.target.value)} 
                        className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={() => removeCertification(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
                      <Trash2 size={14} className="mr-1" /> Remove Certification
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

const LanguagesSection = ({ resumeData, languages, addLanguage, updateLanguage, updateEntireLanguage, removeLanguage }: any) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = React.useState({
    name: '',
    proficiency: ''
  });

  // Auto-save current language and add new one
  const handleAddLanguageCard = () => {
    if (editingIndex !== null && hasLanguageData(currentLanguage)) {
      handleSaveLanguage();
    }

    const newIndex = languages.length;
    addLanguage({ name: '', proficiency: '' });
    setEditingIndex(newIndex);
    setCurrentLanguage({
      name: '',
      proficiency: ''
    });
  };

  // Check if language has meaningful data
  const hasLanguageData = (lang: any) => {
    return lang.name && lang.name.trim();
  };

  // Save current language
  const handleSaveLanguage = () => {
    if (editingIndex !== null && hasLanguageData(currentLanguage)) {
      console.log('[LanguagesSection] Saving language:', currentLanguage, 'at index:', editingIndex);

      // Use the new updateEntireLanguage function to avoid race conditions
      updateEntireLanguage(editingIndex, {
        name: currentLanguage.name,
        proficiency: currentLanguage.proficiency
      });

      // Clear state immediately - the UI will update when parent state changes
      setCurrentLanguage({ name: '', proficiency: '' });
      setEditingIndex(null);
    }
  };

  // Start editing a language
  const handleEditLanguage = (index: number) => {
    if (editingIndex !== null && editingIndex !== index && hasLanguageData(currentLanguage)) {
      handleSaveLanguage();
    }

    const lang = languages[index] || {};
    setCurrentLanguage({
      name: lang.name || '',
      proficiency: lang.proficiency || ''
    });
    setEditingIndex(index);
  };

  // Update current language state AND resume data for real-time preview
  const handleUpdateCurrentLanguage = (field: string, value: string) => {
    const updatedLang = { ...currentLanguage, [field]: value };
    setCurrentLanguage(updatedLang);

    // Also update the resume data immediately for real-time preview
    if (editingIndex !== null) {
      updateEntireLanguage(editingIndex, updatedLang);
    }
  };

  return (
    <div className="min-h-[850px]">
      <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Languages</h3>
            <Button 
              size="sm" 
              onClick={handleAddLanguageCard}
              className="whitespace-nowrap bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
            >
              <Plus size={16} className="mr-1"/> Add Language
            </Button>
          </div>

          <div className="space-y-4">
            {(languages || []).map((lang: any, index: number) => {
              const isEditing = editingIndex === index;
              const currentLangData = isEditing ? currentLanguage : lang;

              return (
                <Card key={index} className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
                  <div className="p-4">
                    {isEditing ? (
                      // Edit Mode
                      <>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-white/90">
                            {currentLangData.name || `Language #${index + 1}`}
                            {currentLangData.proficiency && <span className="text-white/60 ml-2">({currentLangData.proficiency})</span>}
                          </h4>
                        </div>

                        <div className="space-y-4">
                          {/* Language Name */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              Language *
                            </label>
            <Input 
                              value={currentLangData.name}
                              onChange={(e) => handleUpdateCurrentLanguage('name', e.target.value)}
              placeholder="e.g., English, Spanish, French" 
                              className="bg-white text-black border-gray-300 placeholder:text-gray-500"
            />
          </div>

                          {/* Proficiency */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                              Proficiency Level
                            </label>
                            <select
                              value={currentLangData.proficiency}
                              onChange={(e) => handleUpdateCurrentLanguage('proficiency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="" className="bg-white text-black">Select proficiency level</option>
                              <option value="Native" className="bg-white text-black">Native</option>
                              <option value="Fluent" className="bg-white text-black">Fluent</option>
                              <option value="Advanced" className="bg-white text-black">Advanced</option>
                              <option value="Intermediate" className="bg-white text-black">Intermediate</option>
                              <option value="Conversational" className="bg-white text-black">Conversational</option>
                              <option value="Basic" className="bg-white text-black">Basic</option>
                            </select>
          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-white/20">
                            <Button 
                              size="sm" 
                              onClick={handleSaveLanguage}
                              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                            >
                              <Check size={14} className="mr-1" /> Save
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => removeLanguage(index)} 
                              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                            >
                              <Trash2 size={14} className="mr-1" /> Remove Entry
          </Button>
        </div>
                        </div>
                      </>
                    ) : (
                      // View Mode - Saved Language Card
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-300 text-sm font-semibold">
                                {index + 1}
                </div>
                              <h3 className="text-lg font-semibold text-white">
                                {lang.name || 'Language'}
                              </h3>
                              {lang.proficiency && (
                                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                                  {lang.proficiency}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLanguage(index)}
                              className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLanguage(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                            >
                  <Trash2 size={16} />
                </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
              </Card>
              );
            })}

            {/* Add More Languages Button */}
            {languages.length > 0 && editingIndex === null && (
              <Card className="border-2 border-dashed border-white/30 bg-white/5 shadow-sm rounded-lg">
                <div className="p-6 text-center">
                  <Button 
                    onClick={handleAddLanguageCard}
                    className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-purple-800 transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    Add More Languages
                  </Button>
          </div>
              </Card>
        )}


          </div>
      </div>
    </div>
  );
};

const CustomSections = ({ resumeData, customSections, addCustomSection, updateCustomSection, updateEntireCustomSection, removeCustomSection }: any) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [currentSection, setCurrentSection] = React.useState({
    title: '',
    content: '',
    placement: 'sidebar' as 'sidebar' | 'main'
  });

  // Auto-save current section and add new one
  const handleAddCustomSectionCard = () => {
    if (editingIndex !== null && hasCustomSectionData(currentSection)) {
      handleSaveCustomSection();
    }

    const newIndex = customSections.length;
    addCustomSection();
    setEditingIndex(newIndex);
    setCurrentSection({
      title: '',
      content: '',
      placement: 'sidebar' as 'sidebar' | 'main'
    });
  };

  // Check if custom section has meaningful data
  const hasCustomSectionData = (section: any) => {
    return section.title && section.title.trim();
  };

  // Save current custom section
  const handleSaveCustomSection = () => {
    if (editingIndex !== null && hasCustomSectionData(currentSection)) {
      console.log('[CustomSections] Saving custom section:', currentSection, 'at index:', editingIndex);

      const sectionToSave = {
        title: currentSection.title,
        content: currentSection.content,
        placement: currentSection.placement
      };

      console.log('[CustomSections] Custom section object being saved:', sectionToSave);

      // Use the new updateEntireCustomSection function to avoid race conditions
      updateEntireCustomSection(editingIndex, sectionToSave);

      // Clear the current section state and exit edit mode
      setCurrentSection({ title: '', content: '', placement: 'sidebar' as 'sidebar' | 'main' });
      setEditingIndex(null);
    } else {
      console.log('[CustomSections] Save failed - editingIndex:', editingIndex, 'hasData:', hasCustomSectionData(currentSection));
    }
  };

  // Start editing a custom section
  const handleEditCustomSection = (index: number) => {
    console.log('[CustomSections] handleEditCustomSection called for index:', index);
    if (editingIndex !== null && editingIndex !== index && hasCustomSectionData(currentSection)) {
      handleSaveCustomSection();
    }

    const section = customSections[index] || {};
    console.log('[CustomSections] Loading custom section data for editing:', section);
    const loadedSection = {
      title: section.title || '',
      content: section.content || '',
      placement: section.placement || 'sidebar' as 'sidebar' | 'main'
    };
    console.log('[CustomSections] Setting currentSection for editing:', loadedSection);
    setCurrentSection(loadedSection);
    setEditingIndex(index);
  };

  // Update current custom section state AND resume data for real-time preview
  const handleUpdateCurrentSection = (field: string, value: string) => {
    console.log('[CustomSections] handleUpdateCurrentSection called:', field, '=', value);
    const updatedSection = { ...currentSection, [field]: value };
    setCurrentSection(updatedSection);
    console.log('[CustomSections] Updated currentSection state:', updatedSection);

    // Also update the resume data immediately for real-time preview
    if (editingIndex !== null) {
      updateEntireCustomSection(editingIndex, updatedSection);
    }
  };

  return (
    <div className="min-h-[850px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Custom Sections</h3>
          <Button 
            size="sm" 
            onClick={handleAddCustomSectionCard}
            className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
          >
            <Plus size={16} className="mr-1"/> Add Section
          </Button>
        </div>

          <div className="space-y-4">
          {(customSections || []).map((section: any, index: number) => {
            const isEditing = editingIndex === index;
            const currentSectionData = isEditing ? currentSection : section;

            return (
              <Card key={index} className="border border-white/20 bg-white/10 shadow-sm rounded-lg text-white backdrop-blur-md">
                <div className="p-4">
                  {isEditing ? (
                    // Edit Mode
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/90">
                          {currentSectionData.title || `Custom Section #${index + 1}`}
                        </h4>
                      </div>

                  <div className="space-y-4">
                    {/* Section Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                            Section Title *
                      </label>
                    <Input 
                            value={currentSectionData.title}
                            onChange={(e) => handleUpdateCurrentSection('title', e.target.value)}
                        placeholder="e.g., Volunteering, Awards, Publications"
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                    </div>

                    {/* Section Placement */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Section Placement
                      </label>
                      <Select value={currentSectionData.placement || 'sidebar'} onValueChange={(value) => handleUpdateCurrentSection('placement', value)}>
                        <SelectTrigger className="bg-white text-black border-gray-300">
                          <SelectValue placeholder="Choose where to display this section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sidebar">
                            <div className="flex items-center gap-2">
                              <Sidebar size={16} />
                              <span>Left Sidebar</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="main">
                            <div className="flex items-center gap-2">
                              <MainIcon size={16} />
                              <span>Main Content Area</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/50 mt-1">
                        Choose whether this section appears in the left sidebar or main content area
                      </p>
                    </div>

                    {/* Section Content */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Content
                      </label>
                    <Textarea 
                            value={currentSectionData.content}
                            onChange={(e) => handleUpdateCurrentSection('content', e.target.value)}
                        placeholder="Describe your achievements, experiences, or qualifications in this area..."
                        rows={4}
                            className="bg-white text-black border-gray-300 placeholder:text-gray-500"
                    />
                  </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/20">
                          <Button 
                            size="sm" 
                            onClick={handleSaveCustomSection}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                          >
                            <Check size={14} className="mr-1" /> Save
                          </Button>
                      <Button 
                        size="sm" 
                        onClick={() => removeCustomSection(index)} 
                            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                      >
                            <Trash2 size={14} className="mr-1" /> Remove Entry
                    </Button>
                  </div>
                  </div>
                    </>
                  ) : (
                    // View Mode - Saved Custom Section Card
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center text-orange-300 text-sm font-semibold">
                              {index + 1}
                </div>
                            <h3 className="text-lg font-semibold text-white">
                              {section.title || 'Custom Section'}
                            </h3>
                            {/* Placement indicator */}
                            <div className="flex items-center gap-1 text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                              {section.placement === 'main' ? <MainIcon size={12} /> : <Sidebar size={12} />}
                              <span>{section.placement === 'main' ? 'Main' : 'Sidebar'}</span>
                            </div>
                          </div>

                          {section.content && (
                            <div className="text-sm text-white/80 mt-2 leading-relaxed">
                              {section.content.split('\n').map((line: string, lineIndex: number) => (
                                <p key={lineIndex} className="mb-1">
                                  {line}
                                </p>
            ))}
          </div>
        )}
      </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomSection(index)}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomSection(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Add More Custom Sections Button */}
          {customSections.length > 0 && editingIndex === null && (
            <Card className="border-2 border-dashed border-white/30 bg-white/5 shadow-sm rounded-lg">
              <div className="p-6 text-center">
                <Button 
                  onClick={handleAddCustomSectionCard}
                  className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-purple-800 transition-all"
                >
                  <Plus size={16} className="mr-2" />
                  Add More Sections
                </Button>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {customSections.length === 0 && (
            <Card className="border-dashed border-white border-2 bg-purple-800 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <Plus size={40} className="text-white/60 mb-4" />
                <p className="text-white/70 mb-3 text-sm">No custom sections yet.</p>
                <p className="text-xs text-white/50 mb-3">Add things like Volunteering, Awards, Hobbies, etc.</p>
                <Button 
                  onClick={handleAddCustomSectionCard} 
                  size="sm" 
                  className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-800 transition-all"
                >
                  <Plus size={16} className="mr-2" /> 
                  Add Custom Section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// IMPORTANT: The actual JSX for Education, Skills, Experience, Custom has been truncated above
// for brevity but needs to be fully implemented within these new components, 
// adapting to use the passed props (resumeData, onChange handlers).
