import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resumes table
export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  templateId: text('template_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Templates table
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  code: text('code').notNull(),
  category: text('category').default('standard'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

// Additional types for frontend components
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  contactDetails: Record<string, any>;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  dbJobTitleId?: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface ColorCustomization {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface ResumeData {
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
  sectionOrder?: string[];
}

export interface ResumeTemplateRecord {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  uploadedImageUrl?: string | null;
  previewImageUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  displayMode?: 'thumbnail' | 'uploaded_image' | null;
  enhanced3DMetadata?: any | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}