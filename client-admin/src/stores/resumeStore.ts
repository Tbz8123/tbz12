import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define ResumeData type locally (matching ResumeBuilder.tsx structure)
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  contactDetails: Record<string, any>;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  dbJobTitleId?: number;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  level: string;
}

interface Language {
  name: string;
  proficiency: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface CustomSection {
  title: string;
  content: string;
}

interface ColorCustomization {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  templateId: string;
  createdAt: string;
  updatedAt: string;
  customization?: {
    colors?: ColorCustomization;
  };
  sectionOrder?: string[]; // New field for section ordering
}

// Define the type for a resume template
interface PrismaResumeTemplate {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  uploadedImageUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  displayMode?: 'thumbnail' | 'uploaded_image' | null;
  enhanced3DMetadata?: any | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ResumeState {
  resumeData: ResumeData;
  proTemplates: PrismaResumeTemplate[];
  isLoadingProTemplates: boolean;
  activeProTemplateId: number | null;
  getProTemplateById: (id: number | null) => PrismaResumeTemplate | undefined;
  actions: {
    updateResumeData: (data: Partial<ResumeData>) => void;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    updateWorkExperience: (experience: Experience[]) => void;
    updateEducation: (education: Education[]) => void;
    updateSkills: (skills: Skill[]) => void;
    updateCertifications: (certifications: Certification[]) => void;
    updateLanguages: (languages: Language[]) => void;
    updateCustomSections: (sections: CustomSection[]) => void;
    updateSectionOrder: (sectionOrder: string[]) => void; // New function for section ordering
    setActiveProTemplateId: (id: number | null) => void;
    getProTemplateById: (id: number | null) => PrismaResumeTemplate | undefined;
    setProTemplates: (templates: PrismaResumeTemplate[]) => void;
    setLoadingProTemplates: (loading: boolean) => void;
    clearResumeData: () => void;
  };
}

const getDefaultResumeData = (): ResumeData => ({
  id: '',
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
  templateId: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sectionOrder: ['contact', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications'], // Default section order
});

export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set, get) => ({
        resumeData: getDefaultResumeData(),
        proTemplates: [],
        isLoadingProTemplates: true,
        activeProTemplateId: null,
        getProTemplateById: (id) => {
          return get().proTemplates.find((t) => t.id === id);
        },
        actions: {
          updateResumeData: (data) =>
            set((state) => ({ resumeData: { ...state.resumeData, ...data, updatedAt: new Date().toISOString() } })),
          updatePersonalInfo: (info) =>
            set((state) => ({
              resumeData: { ...state.resumeData, personalInfo: { ...state.resumeData.personalInfo, ...info }, updatedAt: new Date().toISOString() },
            })),
          updateWorkExperience: (experience) =>
            set((state) => ({ resumeData: { ...state.resumeData, experience, updatedAt: new Date().toISOString() } })),
          updateEducation: (education) =>
            set((state) => ({ resumeData: { ...state.resumeData, education, updatedAt: new Date().toISOString() } })),
          updateSkills: (skills) =>
            set((state) => ({ resumeData: { ...state.resumeData, skills, updatedAt: new Date().toISOString() } })),
          updateCertifications: (certifications) =>
            set((state) => ({ resumeData: { ...state.resumeData, certifications, updatedAt: new Date().toISOString() } })),
          updateLanguages: (languages) =>
            set((state) => ({ resumeData: { ...state.resumeData, languages, updatedAt: new Date().toISOString() } })),
          updateCustomSections: (customSections) =>
            set((state) => ({ resumeData: { ...state.resumeData, customSections, updatedAt: new Date().toISOString() } })),
          updateSectionOrder: (sectionOrder) =>
            set((state) => ({ resumeData: { ...state.resumeData, sectionOrder, updatedAt: new Date().toISOString() } })),
          setActiveProTemplateId: (id) => set({ activeProTemplateId: id }),
          getProTemplateById: (id) => {
            return get().proTemplates.find((t) => t.id === id);
          },
          setProTemplates: (templates) => set({ proTemplates: templates }),
          setLoadingProTemplates: (loading) => set({ isLoadingProTemplates: loading }),
          clearResumeData: () => set({ resumeData: getDefaultResumeData(), activeProTemplateId: null }),
        },
      }),
      {
        name: 'tbz-resume-data',
      }
    )
  )
);