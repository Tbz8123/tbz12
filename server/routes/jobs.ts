import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

// Use global prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
if (typeof window === "undefined") {
  if (global.prisma) {
    prisma = global.prisma;
  } else {
    prisma = new PrismaClient();
    if (process.env.NODE_ENV === "development") global.prisma = prisma;
  }
}

export const jobsRouter = Router();

// Validation schemas
const jobTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
});

const jobDescriptionSchema = z.object({
  jobTitleId: z.number().int().positive("Job title ID must be a positive integer"),
  content: z.string().min(1, "Content is required"),
  isRecommended: z.boolean().optional().default(false),
});

// Import History API Endpoints


// Get all job titles with pagination and search
jobsRouter.get("/titles", async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = (page - 1) * limit;

    const category = req.query.category as string || null;
    const searchQuery = req.query.search as string || null;

    console.log(`Fetching job titles (page: ${page}, limit: ${limit}, category: ${category || 'all'}, search: ${searchQuery || 'none'})`);

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
    const totalCount = await prisma.jobTitle.count({ where });

    // Get job titles with pagination
    const jobTitles = await prisma.jobTitle.findMany({
      where,
      orderBy: { title: 'asc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: { descriptions: true }
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
  } catch (error: unknown) {
    console.error("Error fetching job titles:", error);
    return res.status(500).json({ error: "Failed to fetch job titles" });
  }
});

// Get descriptions for a specific job title
jobsRouter.get("/titles/:id/descriptions", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid job title ID" });
    }

    const descriptions = await prisma.jobDescription.findMany({
      where: { jobTitleId: id },
      orderBy: [
        { isRecommended: 'desc' },
        { id: 'asc' }
      ]
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.json(descriptions);
  } catch (error: unknown) {
    console.error("Error fetching job descriptions:", error);
    return res.status(500).json({ error: "Failed to fetch job descriptions" });
  }
});

// Get all job descriptions (optionally filtered by jobTitleId or search term)
jobsRouter.get("/descriptions", async (req: Request, res: Response) => {
  try {
    let jobTitleId: number | null = null;
    if (req.query.jobTitleId) {
      const jobTitleIdStr = String(req.query.jobTitleId).trim();
      const parsedId = parseInt(jobTitleIdStr);
      if (!isNaN(parsedId) && parsedId > 0) {
        jobTitleId = parsedId;
      }
    }
    const searchTerm = req.query.search as string || null;

    // Build where clause
    const where: any = {};
    if (jobTitleId) {
      where.jobTitleId = jobTitleId;
    }
    if (searchTerm) {
      where.content = {
        contains: searchTerm,
        mode: 'insensitive'
      };
    }

    const descriptions = await prisma.jobDescription.findMany({
      where,
      orderBy: [
        { isRecommended: 'desc' },
        { jobTitleId: 'asc' },
        { id: 'asc' }
      ],
      take: 200,
      include: {
        jobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.json(descriptions);
  } catch (error: unknown) {
    console.error("Error generating job descriptions:", error);
    return res.status(500).json({ error: "Failed to generate job descriptions" });
  }
});

// Create a new job title
jobsRouter.post("/titles", async (req: Request, res: Response) => {
  try {
    const validatedData = jobTitleSchema.parse(req.body);

    const newJobTitle = await prisma.jobTitle.create({
      data: validatedData,
      include: {
        _count: {
          select: { descriptions: true }
        }
      }
    });

    return res.status(201).json(newJobTitle);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle Prisma unique constraint error
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Duplicate job title", 
        message: `A job title with this name already exists.` 
      });
    }

    console.error("Error creating job title:", error);
    return res.status(500).json({ error: "Failed to create job title" });
  }
});

// Update an existing job title
jobsRouter.put("/titles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid job title ID" });
    }

    const validatedData = jobTitleSchema.parse(req.body);

    const updatedJobTitle = await prisma.jobTitle.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { descriptions: true }
        }
      }
    });

    return res.json(updatedJobTitle);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle Prisma errors
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: "Duplicate job title", 
          message: "A job title with this name already exists." 
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: "Job title not found" });
      }
    }

    console.error("Error updating job title:", error);
    return res.status(500).json({ error: "Failed to update job title" });
  }
});

// Delete a job title (will cascade delete its descriptions)
jobsRouter.delete("/titles/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid job title ID" });
    }

    await prisma.jobTitle.delete({
      where: { id }
    });

    return res.json({ message: "Job title deleted successfully" });
  } catch (error: any) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: "Job title not found" });
    }

    console.error("Error deleting job title:", error);
    return res.status(500).json({ error: "Failed to delete job title" });
  }
});

// Create a new job description
jobsRouter.post("/descriptions", async (req: Request, res: Response) => {
  try {
    const validatedData = jobDescriptionSchema.parse(req.body);

    const newDescription = await prisma.jobDescription.create({
      data: validatedData,
      include: {
        jobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    return res.status(201).json(newDescription);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle foreign key constraint error
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return res.status(400).json({ error: "Invalid job title ID" });
    }

    console.error("Error creating job description:", error);
    return res.status(500).json({ error: "Failed to create job description" });
  }
});

// Update an existing job description
jobsRouter.put("/descriptions/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid job description ID" });
    }

    const { content, isRecommended } = req.body;

    const updatedDescription = await prisma.jobDescription.update({
      where: { id },
      data: {
        content,
        isRecommended,
        updatedAt: new Date()
      },
      include: {
        jobTitle: {
          select: { title: true, category: true }
        }
      }
    });

    return res.json(updatedDescription);
  } catch (error: unknown) {    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: "Job description not found" });
    }

    console.error("Error updating job description:", error);
    return res.status(500).json({ error: "Failed to update job description" });
  }
});

// Delete a job description
jobsRouter.delete("/descriptions/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid job description ID" });
    }

    await prisma.jobDescription.delete({
      where: { id }
    });

    return res.json({ message: "Job description deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: "Job description not found" });
    }

    console.error("Error deleting job description:", error);
    return res.status(500).json({ error: "Failed to delete job description" });
  }
});

// Initialize sample data
async function initializeJobData() {
  try {
    const count = await prisma.jobTitle.count();
    if (count > 0) {
      console.log("Job titles already exist, skipping initialization");
      return;
    }

    console.log("Initializing sample job titles and descriptions...");

    // Sample job titles and descriptions
    const sampleData = [
      {
        title: "Software Engineer",
        category: "Software Development",
        descriptions: [
          {
            content: "Develop and maintain web applications using modern technologies including React, Node.js, and PostgreSQL. Collaborate with cross-functional teams to deliver high-quality software solutions.",
            isRecommended: true
          },
          {
            content: "Design and implement scalable software solutions, write clean and maintainable code, and participate in code reviews. Work with agile methodologies and contribute to technical documentation.",
            isRecommended: false
          }
        ]
      },
      {
        title: "Frontend Developer",
        category: "Software Development",
        descriptions: [
          {
            content: "Create responsive and user-friendly web interfaces using HTML, CSS, JavaScript, and modern frameworks like React or Vue.js. Ensure cross-browser compatibility and optimal performance.",
            isRecommended: true
          },
          {
            content: "Collaborate with UX/UI designers to implement pixel-perfect designs, optimize applications for maximum speed and scalability, and maintain code quality through testing and debugging.",
            isRecommended: false
          }
        ]
      },
      {
        title: "Data Scientist",
        category: "Data Science",
        descriptions: [
          {
            content: "Analyze large datasets to extract valuable insights, develop machine learning models, and create data visualizations. Use Python, R, and SQL to solve complex business problems.",
            isRecommended: true
          },
          {
            content: "Design and implement statistical models, perform A/B testing, and communicate findings to stakeholders. Work with big data technologies and cloud platforms for data processing.",
            isRecommended: false
          }
        ]
      },
      {
        title: "Marketing Manager",
        category: "Marketing",
        descriptions: [
          {
            content: "Develop and execute comprehensive marketing strategies to increase brand awareness and drive customer acquisition. Manage marketing campaigns across multiple channels including digital and traditional media.",
            isRecommended: true
          },
          {
            content: "Lead market research initiatives, analyze customer behavior and market trends, and coordinate with sales teams to align marketing efforts with business objectives.",
            isRecommended: false
          }
        ]
      },
      {
        title: "UX/UI Designer",
        category: "Design",
        descriptions: [
          {
            content: "Design intuitive and visually appealing user interfaces for web and mobile applications. Conduct user research, create wireframes and prototypes, and collaborate with development teams.",
            isRecommended: true
          },
          {
            content: "Develop design systems and style guides, perform usability testing, and iterate on designs based on user feedback. Stay current with design trends and best practices.",
            isRecommended: false
          }
        ]
      }
    ];

    for (const jobData of sampleData) {
      const jobTitle = await prisma.jobTitle.create({
        data: {
          title: jobData.title,
          category: jobData.category
        }
      });

      for (const descData of jobData.descriptions) {
        await prisma.jobDescription.create({
          data: {
            jobTitleId: jobTitle.id,
            content: descData.content,
            isRecommended: descData.isRecommended
          }
        });
      }
    }

    console.log("Sample job data initialized successfully");
  } catch (error: unknown) {
    console.error("Error initializing job data:", error);
  }
}

// Initialize data when the router is loaded
initializeJobData();



