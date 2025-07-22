import { PrismaClient } from '@prisma/client';
// Re-evaluating types

// Initialize Prisma client
const prisma = new PrismaClient();

export const storage = {
  // Template operations (Snap Templates)
  async getAllTemplates() {
    return prisma.resumeTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        thumbnailUrl: true,
        enhanced3DThumbnailUrl: true,
        uploadedImageUrl: true,
        thumbnailType: true,
        displayMode: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },

  async getTemplateById(id: number) {
    return prisma.resumeTemplate.findUnique({
      where: { id }
    });
  },

  async createTemplate(data: { 
    name: string; 
    code: string; 
    description?: string; 
    structure?: any; 
    thumbnailUrl?: string | null;
    enhanced3DThumbnailUrl?: string | null;
    uploadedImageUrl?: string | null;
    thumbnailType?: string;
    displayMode?: string;
    thumbnailFormat?: string;
    thumbnailMetadata?: any;
  }) {
    return await prisma.resumeTemplate.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        structure: data.structure || {},
        thumbnailUrl: data.thumbnailUrl,
        enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
        uploadedImageUrl: data.uploadedImageUrl,
        thumbnailType: data.thumbnailType || 'standard',
        displayMode: data.displayMode || 'thumbnail',
        thumbnailFormat: data.thumbnailFormat,
        thumbnailMetadata: data.thumbnailMetadata,
      },
    });
  },

  async updateTemplate(id: number, data: { 
    name?: string;
    code?: string; 
    description?: string | null;
    structure?: any; 
    thumbnailUrl?: string | null;
    enhanced3DThumbnailUrl?: string | null;
    uploadedImageUrl?: string | null;
    thumbnailType?: string;
    displayMode?: string;
    thumbnailFormat?: string | null;
    thumbnailMetadata?: any | null;
  }) {
    return await prisma.resumeTemplate.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        structure: data.structure || {},
        thumbnailUrl: data.thumbnailUrl,
        enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
        uploadedImageUrl: data.uploadedImageUrl,
        thumbnailType: data.thumbnailType,
        displayMode: data.displayMode,
        thumbnailFormat: data.thumbnailFormat,
        thumbnailMetadata: data.thumbnailMetadata,
      },
    });
  },

  async deleteTemplate(id: number) {
    await prisma.resumeTemplate.delete({
      where: { id }
    });
    return true;
  },

  // Pro Template operations (using Template model as fallback until ProTemplate is available)
  async getAllProTemplates() {
    return prisma.proTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        structure: true,
        thumbnailUrl: true,
        enhanced3DThumbnailUrl: true,
        uploadedImageUrl: true,
        thumbnailType: true,
        displayMode: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
        }
      });
  },

  async getProTemplateById(id: number) {
    try {
      return await (prisma as any).proTemplate.findUnique({
        where: { id }
      });
    } catch (error) {
      console.log('ProTemplate model not available, using Template model');
      return await prisma.template.findUnique({
        where: { 
          id,
          structure: {
            path: ['isPro'],
            equals: true
          }
        }
      });
    }
  },

  async createProTemplate(data: { 
    name: string; 
    code: string; 
    description?: string; 
    structure?: any; 
    thumbnailUrl?: string | null;
    enhanced3DThumbnailUrl?: string | null;
    uploadedImageUrl?: string | null;
    thumbnailType?: string;
    displayMode?: string;
    thumbnailFormat?: string;
    thumbnailMetadata?: any;
  }) {
    try {
      return await (prisma as any).proTemplate.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          structure: data.structure || {},
          thumbnailUrl: data.thumbnailUrl,
          enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
          uploadedImageUrl: data.uploadedImageUrl,
          thumbnailType: data.thumbnailType || 'standard',
          displayMode: data.displayMode || 'thumbnail',
          thumbnailFormat: data.thumbnailFormat,
          thumbnailMetadata: data.thumbnailMetadata,
        },
      });
    } catch (error) {
      console.log('ProTemplate model not available, using Template model with pro flag');
      // Fallback to Template model with isPro flag
      return await prisma.template.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          structure: { ...data.structure, isPro: true },
          thumbnailUrl: data.thumbnailUrl,
          enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
          uploadedImageUrl: data.uploadedImageUrl,
          thumbnailType: data.thumbnailType || 'standard',
          displayMode: data.displayMode || 'thumbnail',
          thumbnailFormat: data.thumbnailFormat,
          thumbnailMetadata: data.thumbnailMetadata,
        },
      });
    }
  },

  async updateProTemplate(id: number, data: { 
    name?: string;
    code?: string; 
    description?: string | null;
    structure?: any; 
    thumbnailUrl?: string | null;
    enhanced3DThumbnailUrl?: string | null;
    uploadedImageUrl?: string | null;
    thumbnailType?: string;
    displayMode?: string;
    thumbnailFormat?: string | null;
    thumbnailMetadata?: any | null;
  }) {
    try {
      return await (prisma as any).proTemplate.update({
        where: { id },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          structure: data.structure || {},
          thumbnailUrl: data.thumbnailUrl,
          enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
          uploadedImageUrl: data.uploadedImageUrl,
          thumbnailType: data.thumbnailType,
          displayMode: data.displayMode,
          thumbnailFormat: data.thumbnailFormat,
          thumbnailMetadata: data.thumbnailMetadata,
        },
      });
    } catch (error) {
      console.log('ProTemplate model not available, using Template model');
      return await prisma.template.update({
        where: { id },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          structure: { ...data.structure, isPro: true },
          thumbnailUrl: data.thumbnailUrl,
          enhanced3DThumbnailUrl: data.enhanced3DThumbnailUrl,
          uploadedImageUrl: data.uploadedImageUrl,
          thumbnailType: data.thumbnailType,
          displayMode: data.displayMode,
          thumbnailFormat: data.thumbnailFormat,
          thumbnailMetadata: data.thumbnailMetadata,
        },
      });
    }
  },

  async deleteProTemplate(id: number) {
    try {
      await (prisma as any).proTemplate.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.log('ProTemplate model not available, using Template model');
      await prisma.template.delete({
        where: { id }
      });
      return true;
    }
  },

  // Resume operations
  async getResumesByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId }
    });
  },

  async getResumeById(id: number) {
    return prisma.resume.findUnique({
      where: { id: String(id) }
    });
  },

  async createResume(data: { userId: string; data: any }) {
    return prisma.resume.create({
      data: {
        userId: data.userId,
        content: data.data,
        title: data.data.title || "Untitled Resume"
      }
    });
  },

  async updateResume(id: number, data: any) {
    return prisma.resume.update({
      where: { id: String(id) },
      data: {
        content: data,
        updatedAt: new Date()
      }
    });
  },

  async deleteResume(id: number) {
    await prisma.resume.delete({
      where: { id: String(id) }
    });
    return true;
  }
};
