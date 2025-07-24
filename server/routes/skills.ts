import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

// Zod validation schemas
const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
});

const skillCategorySchema = z.object({
  skillsJobTitleId: z.number().int().positive("Skill ID must be a positive integer"),
  content: z.string().min(1, "Content is required"),
  isRecommended: z.boolean().optional().default(false),
});

// Get all skills with pagination and search
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = (page - 1) * limit;

    const category = req.query.category as string || null;
    const searchQuery = req.query.search as string || null;

    const where: { category?: string; title?: { contains: string; mode: 'insensitive' } } = {};
    if (category) {
      where.category = category;
    }
    if (searchQuery) {
      where.title = {
        contains: searchQuery,
        mode: 'insensitive'
      };
    }

    const totalCount = await prisma.skillsJobTitle.count({ where });
    const skills = await prisma.skillsJobTitle.findMany({
      where,
      orderBy: { title: 'asc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.json({
      data: skills,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// Get categories for a specific skill
router.get("/:id/categories", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill ID" });
    }

    const categories = await prisma.skillCategory.findMany({
      where: { skillsJobTitleId: id },
      orderBy: [
        { isRecommended: 'desc' },
        { id: 'asc' }
      ]
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching skill categories:", error);
    res.status(500).json({ error: "Failed to fetch skill categories" });
  }
});

// Get all skill categories (optionally filtered by skillId or search term)
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const skillId = req.query.skillId ? parseInt(req.query.skillId as string) : null;
    const skillsJobTitleId = req.query.skillsJobTitleId ? parseInt(req.query.skillsJobTitleId as string) : null;
    const searchTerm = req.query.search as string || null;

    const where: any = {};
    if (skillId) {
      where.skillsJobTitleId = skillId;
    }
    if (skillsJobTitleId) {
      where.skillsJobTitleId = skillsJobTitleId;
    }
    if (searchTerm) {
      where.content = {
        contains: searchTerm,
        mode: 'insensitive'
      };
    }

    const categories = await prisma.skillCategory.findMany({
      where,
      orderBy: [
        { isRecommended: 'desc' },
        { skillsJobTitleId: 'asc' },
        { id: 'asc' }
      ],
      take: 200,
      include: {
        skillsJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching skill categories:", error);
    res.status(500).json({ error: "Failed to fetch skill categories" });
  }
});

// Create a new skill
router.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = skillSchema.parse(req.body);

    const newSkill = await prisma.skillsJobTitle.create({
      data: validatedData,
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.status(201).json(newSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate skill", 
        message: "A skill with this title already exists." 
      });
    }
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

// Update an existing skill
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill ID" });
    }

    const validatedData = skillSchema.parse(req.body);

    const updatedSkill = await prisma.skillsJobTitle.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.json(updatedSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate skill", 
        message: "A skill with this title already exists." 
      });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill not found" });
    }
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// Delete a skill
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill ID" });
    }

    // Check for associated skill categories
    const associatedCategories = await prisma.skillCategory.count({
      where: { skillsJobTitleId: id }
    });

    if (associatedCategories > 0) {
      return res.status(400).json({ 
        error: "Deletion failed", 
        message: `This skill has ${associatedCategories} associated categories. Please remove them first.` 
      });
    }

    await prisma.skillsJobTitle.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill not found" });
    }
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// Create a new skill category
router.post("/categories", async (req: Request, res: Response) => {
  try {
    const validatedData = skillCategorySchema.parse(req.body);

    const newCategory = await prisma.skillCategory.create({
      data: validatedData,
      include: {
        skillsJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2003') { // Foreign key constraint failed
      return res.status(400).json({ error: "Invalid skill ID provided." });
    }
    console.error("Error creating skill category:", error);
    res.status(500).json({ error: "Failed to create skill category" });
  }
});

// Update a skill category
router.put("/categories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill category ID" });
    }

    const { content, isRecommended } = req.body;

    const updatedCategory = await prisma.skillCategory.update({
      where: { id },
      data: {
        content,
        isRecommended,
        updatedAt: new Date()
      },
      include: {
        skillsJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    res.json(updatedCategory);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill category not found" });
    }
    console.error("Error updating skill category:", error);
    res.status(500).json({ error: "Failed to update skill category" });
  }
});

// Delete a skill category
router.delete("/categories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill category ID" });
    }

    await prisma.skillCategory.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill category not found" });
    }
    console.error("Error deleting skill category:", error);
    res.status(500).json({ error: "Failed to delete skill category" });
  }
});

// Add skillsjobtitles routes for frontend compatibility
router.get("/skillsjobtitles", async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = (page - 1) * limit;

    const category = req.query.category as string || null;
    const searchQuery = req.query.search as string || null;

    const where: { category?: string; title?: { contains: string; mode: 'insensitive' } } = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (searchQuery) {
      where.title = {
        contains: searchQuery,
        mode: 'insensitive'
      };
    }

    const totalCount = await prisma.skillsJobTitle.count({ where });
    const skills = await prisma.skillsJobTitle.findMany({
      where,
      orderBy: { title: 'asc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.json({
      data: skills,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching skills job titles:", error);
    res.status(500).json({ error: "Failed to fetch skills job titles" });
  }
});

router.post("/skillsjobtitles", async (req: Request, res: Response) => {
  try {
    const validatedData = skillSchema.parse(req.body);

    const newSkill = await prisma.skillsJobTitle.create({
      data: validatedData,
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.status(201).json(newSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate skill", 
        message: "A skill with this title already exists." 
      });
    }
    console.error("Error creating skill job title:", error);
    res.status(500).json({ error: "Failed to create skill job title" });
  }
});

router.put("/skillsjobtitles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill job title ID" });
    }

    const validatedData = skillSchema.parse(req.body);

    const updatedSkill = await prisma.skillsJobTitle.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { skillCategories: true }
        }
      }
    });

    res.json(updatedSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate skill", 
        message: "A skill with this title already exists." 
      });
    }
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill job title not found" });
    }
    console.error("Error updating skill job title:", error);
    res.status(500).json({ error: "Failed to update skill job title" });
  }
});

router.delete("/skillsjobtitles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid skill job title ID" });
    }

    // Check for associated skill categories
    const associatedCategories = await prisma.skillCategory.count({
      where: { skillsJobTitleId: id }
    });

    if (associatedCategories > 0) {
      // Delete associated categories first
      await prisma.skillCategory.deleteMany({
        where: { skillsJobTitleId: id }
      });
    }

    await prisma.skillsJobTitle.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: "Skill job title not found" });
    }
    console.error("Error deleting skill job title:", error);
    res.status(500).json({ error: "Failed to delete skill job title" });
  }
});

export { router as skillsRouter };