import React, { createContext, useContext, ReactNode } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumeData, ResumeTemplateRecord } from '@shared/schema';

interface ResumeContextType {
  resumeData: ResumeData;
  proTemplates: ResumeTemplateRecord[];
  isLoadingProTemplates: boolean;
  activeProTemplateId: string | null;
  getProTemplateById?: (id: string | null) => ResumeTemplateRecord | undefined;
  updateResumeData: (data: Partial<ResumeData>) => void;
  updateSkills: (skills: any[]) => void;
  updateLanguages: (languages: any[]) => void;
  updateCertifications: (certifications: any[]) => void;
  updateCustomSections: (sections: any[]) => void;
  updateEducation: (education: any[]) => void;
  updateWorkExperience: (experience: any[]) => void;
  setActiveProTemplateId: (id: string | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const resumeData = useResumeStore((state) => state.resumeData);
  const proTemplates = useResumeStore((state) => state.proTemplates);
  const isLoadingProTemplates = useResumeStore((state) => state.isLoadingProTemplates);
  const activeProTemplateId = useResumeStore((state) => state.activeProTemplateId);
  const getProTemplateById = useResumeStore((state) => state.getProTemplateById);
  const actions = useResumeStore((state) => state.actions);

  const contextValue: ResumeContextType = {
    resumeData,
    proTemplates,
    isLoadingProTemplates,
    activeProTemplateId,
    getProTemplateById,
    updateResumeData: actions.updateResumeData,
    updateSkills: actions.updateSkills,
    updateLanguages: actions.updateLanguages,
    updateCertifications: actions.updateCertifications,
    updateCustomSections: actions.updateCustomSections,
    updateEducation: actions.updateEducation,
    updateWorkExperience: actions.updateWorkExperience,
    setActiveProTemplateId: actions.setActiveProTemplateId,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};