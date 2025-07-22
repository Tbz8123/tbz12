
import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

// Use global prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
if (global.prisma) {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV === "development") global.prisma = prisma;
}

const professionalSummariesRouter = Router();

// Validation schemas
const professionalSummaryJobTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
});

const professionalSummarySchema = z.object({
  professionalSummaryJobTitleId: z.number().int().positive("Professional summary job title ID must be a positive integer"),
  content: z.string().min(1, "Content is required"),
  isRecommended: z.boolean().optional().default(false),
});

// Get all professional summary job titles with pagination and search
professionalSummariesRouter.get("/jobtitles", async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = (page - 1) * limit;

    const category = req.query.category as string || null;
    const searchQuery = req.query.search as string || null;

    console.log(`Fetching professional summary job titles (page: ${page}, limit: ${limit}, category: ${category || 'all'}, search: ${searchQuery || 'none'})`);

    // Build where clause
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (searchQuery) {
      where.title = {
        contains: searchQuery,
        mode: 'insensitive'
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.professionalSummaryJobTitle.count({ where });

    // Get professional summary job titles with pagination  
    const jobTitles = await prisma.professionalSummaryJobTitle.findMany({
      where,
      orderBy: { title: 'asc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: { professionalSummaries: true }
        }
      }
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.json({
      data: jobTitles,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching professional summary job titles:", error);
    return res.status(500).json({ error: "Failed to fetch professional summary job titles" });
  }
});

// Get professional summaries for a specific job title
professionalSummariesRouter.get("/jobtitles/:id/summaries", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid professional summary job title ID" });
    }

    console.log(`Fetching professional summaries for job title ID: ${id}, search: ${req.query.search || 'none'}`);

    const searchTerm = req.query.search as string || null;

    // Build where clause
    const where: any = { professionalSummaryJobTitleId: id };
    if (searchTerm) {
      where.content = {
        contains: searchTerm,
        mode: 'insensitive'
      };
    }

    const summaries = await prisma.professionalSummary.findMany({
      where,
      orderBy: [
        { isRecommended: 'desc' },
        { id: 'asc' }
      ]
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.json(summaries);
  } catch (error) {
    console.error("Error fetching professional summaries:", error);
    return res.status(500).json({ error: "Failed to fetch professional summaries" });
  }
});

// Get all professional summaries (optionally filtered by professionalSummaryJobTitleId or search term)
professionalSummariesRouter.get("/summaries", async (req: Request, res: Response) => {
  try {
    let professionalSummaryJobTitleId: number | null = null;
    if (req.query.professionalSummaryJobTitleId) {
      const jobTitleIdStr = String(req.query.professionalSummaryJobTitleId).trim();
      const parsedId = parseInt(jobTitleIdStr);
      if (!isNaN(parsedId) && parsedId > 0) {
        professionalSummaryJobTitleId = parsedId;
      }
    }
    const searchTerm = req.query.search as string || null;

    // Build where clause
    const where: any = {};
    if (professionalSummaryJobTitleId) {
      where.professionalSummaryJobTitleId = professionalSummaryJobTitleId;
    }
    if (searchTerm) {
      where.content = {
        contains: searchTerm,
        mode: 'insensitive'
      };
    }

    const summaries = await prisma.professionalSummary.findMany({
      where,
      orderBy: [
        { isRecommended: 'desc' },
        { professionalSummaryJobTitleId: 'asc' },
        { id: 'asc' }
      ],
      take: 200,
      include: {
        professionalSummaryJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.json(summaries);
  } catch (error) {
    console.error("Error fetching professional summaries:", error);
    return res.status(500).json({ error: "Failed to fetch professional summaries" });
  }
});

// Create a new professional summary job title
professionalSummariesRouter.post("/jobtitles", async (req: Request, res: Response) => {
  try {
    const validatedData = professionalSummaryJobTitleSchema.parse(req.body);

    const newJobTitle = await prisma.professionalSummaryJobTitle.create({
      data: {
        title: validatedData.title,
        category: validatedData.category
      },
      include: {
        _count: {
          select: { professionalSummaries: true }
        }
      }
    });

    return res.status(201).json(newJobTitle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle Prisma unique constraint error
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate professional summary job title", 
        message: "A professional summary job title with this name already exists." 
      });
    }

    // Handle raw query constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2010') {
      const meta = error as any;
      if (meta.meta?.code === '23505') {
        return res.status(409).json({ 
          error: "Duplicate professional summary job title", 
          message: "A professional summary job title with this name already exists." 
        });
      }
    }

    console.error("Error creating professional summary job title:", error);
    return res.status(500).json({ error: "Failed to create professional summary job title" });
  }
});

// Update an existing professional summary job title
professionalSummariesRouter.put("/jobtitles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid professional summary job title ID" });
    }

    const validatedData = professionalSummaryJobTitleSchema.parse(req.body);

    const updatedJobTitle = await prisma.professionalSummaryJobTitle.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { professionalSummaries: true }
        }
      }
    });

    return res.json(updatedJobTitle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle Prisma errors
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: "Duplicate professional summary job title", 
          message: "A professional summary job title with this name already exists." 
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: "Professional summary job title not found" });
      }
    }

    console.error("Error updating professional summary job title:", error);
    return res.status(500).json({ error: "Failed to update professional summary job title" });
  }
});

// Delete a professional summary job title (will cascade delete its summaries)
professionalSummariesRouter.delete("/jobtitles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid professional summary job title ID" });
    }

    await prisma.professionalSummaryJobTitle.delete({
      where: { id }
    });

    return res.json({ message: "Professional summary job title deleted successfully" });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return res.status(404).json({ error: "Professional summary job title not found" });
    }

    console.error("Error deleting professional summary job title:", error);
    return res.status(500).json({ error: "Failed to delete professional summary job title" });
  }
});

// Create a new professional summary
professionalSummariesRouter.post("/summaries", async (req: Request, res: Response) => {
  try {
    const validatedData = professionalSummarySchema.parse(req.body);

    const newSummary = await prisma.professionalSummary.create({
      data: {
        content: validatedData.content,
        isRecommended: validatedData.isRecommended,
        professionalSummaryJobTitleId: validatedData.professionalSummaryJobTitleId
      },
      include: {
        professionalSummaryJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    return res.status(201).json(newSummary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle foreign key constraint error
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
      return res.status(400).json({ error: "Invalid professional summary job title ID" });
    }

    console.error("Error creating professional summary:", error);
    return res.status(500).json({ error: "Failed to create professional summary" });
  }
});

// Update an existing professional summary
professionalSummariesRouter.put("/summaries/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid professional summary ID" });
    }

    const { content, isRecommended } = req.body;

    const updatedSummary = await prisma.professionalSummary.update({
      where: { id },
      data: {
        content,
        isRecommended,
        updatedAt: new Date()
      },
      include: {
        professionalSummaryJobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    return res.json(updatedSummary);
  } catch (error) {    
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return res.status(404).json({ error: "Professional summary not found" });
    }

    console.error("Error updating professional summary:", error);
    return res.status(500).json({ error: "Failed to update professional summary" });
  }
});

// Delete a professional summary
professionalSummariesRouter.delete("/summaries/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid professional summary ID" });
    }

    await prisma.professionalSummary.delete({
      where: { id }
    });

    return res.json({ message: "Professional summary deleted successfully" });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return res.status(404).json({ error: "Professional summary not found" });
    }

    console.error("Error deleting professional summary:", error);
    return res.status(500).json({ error: "Failed to delete professional summary" });
  }
});

// Export professional summaries data
professionalSummariesRouter.get("/export", async (req: Request, res: Response) => {
  try {
    const format = req.query.format as string || 'csv';
    console.log('Export requested for format:', format);

    // Get valid job title IDs first
    const validJobTitles = await prisma.professionalSummaryJobTitle.findMany({
      select: { id: true }
    });
    const validJobTitleIds = validJobTitles.map((jt: any) => jt.id);

    const professionalSummaries = await prisma.professionalSummary.findMany({
      where: {
        professionalSummaryJobTitleId: {
          in: validJobTitleIds
        }
      },
      include: {
        professionalSummaryJobTitle: {
          select: { title: true, category: true }
        }
      },
      orderBy: [
        { isRecommended: 'desc' },
        { id: 'asc' }
      ]
    });

    console.log('Found', professionalSummaries.length, 'professional summaries');

    // Transform data for export - simplified format for import compatibility
    const exportData = professionalSummaries.map((summary: any) => ({
      title: summary.professionalSummaryJobTitle.title,
      category: summary.professionalSummaryJobTitle.category,
      content: summary.content,
      isRecommended: summary.isRecommended
    }));

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="professional-summaries.json"');
      return res.json(exportData);
    } else if (format === 'excel') {
      // For now, return CSV with .xlsx extension until Excel library is added
      const csvHeaders = ['title', 'category', 'content', 'isRecommended'];
      const csvRows = exportData.map((row: any) => [
        `"${row.title.replace(/"/g, '""')}"`,
        `"${row.category.replace(/"/g, '""')}"`,
        `"${row.content.replace(/"/g, '""')}"`,
        row.isRecommended
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map((row: any) => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="professional-summaries.xlsx"');
      return res.send(csvContent);
    } else {
      // CSV format (default)
      const csvHeaders = ['title', 'category', 'content', 'isRecommended'];
      const csvRows = exportData.map(row => [
        `"${row.title.replace(/"/g, '""')}"`,
        `"${row.category.replace(/"/g, '""')}"`,
        `"${row.content.replace(/"/g, '""')}"`,
        row.isRecommended
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="professional-summaries.csv"');
      return res.send(csvContent);
    }
  } catch (error) {
    console.error("Error exporting professional summaries:", error);
    return res.status(500).json({ 
      error: "Failed to export professional summaries", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export { professionalSummariesRouter };
