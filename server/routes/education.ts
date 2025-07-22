import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Mock education categories data
const mockEducationCategories = [
  {
    id: 1,
    name: "High School Diploma",
    description: "Secondary education completion",
    type: "secondary",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 1,
        categoryId: 1,
        content: "High School Diploma - General Studies",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 2,
    name: "Bachelor's Degree",
    description: "Undergraduate degree programs",
    type: "undergraduate",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 2,
        categoryId: 2,
        content: "Bachelor of Science in Computer Science",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        categoryId: 2,
        content: "Bachelor of Arts in Business Administration",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 3,
    name: "Master's Degree",
    description: "Graduate degree programs",
    type: "graduate",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 4,
        categoryId: 3,
        content: "Master of Business Administration (MBA)",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        categoryId: 3,
        content: "Master of Science in Engineering",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 4,
    name: "Professional Certification",
    description: "Industry certifications and professional credentials",
    type: "certification",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 6,
        categoryId: 4,
        content: "Project Management Professional (PMP)",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        categoryId: 4,
        content: "Certified Public Accountant (CPA)",
        isRecommended: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
];

// GET /api/education/categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    // For now, return mock data
    // In the future, this could fetch from database
    res.json({
      success: true,
      data: mockEducationCategories
    });
  } catch (error) {
    console.error('Error fetching education categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch education categories'
    });
  }
});

export { router as educationRouter };