import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { storage } from './storage.js';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Server, createServer } from 'http';

// Import routers
import { jobsRouter } from './routes/jobs.js';
import { skillsRouter } from './routes/skills.js';
import { professionalSummariesRouter } from './routes/professional-summaries.js';
import { default as analyticsRouter } from './routes/analytics.js';
import { importHistoryRouter } from './routes/import-history.js';

// Import authentication middleware
import { requireUserAuth, optionalUserAuth } from './middleware/userAuth.js';
import { requireAdminAuth } from './middleware/adminAuth.js';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default function setupRoutes(app: express.Express): Server {
  // Create a new order
  app.post("/api/orders", async (req: express.Request, res: express.Response) => {
    try {
      const { cart, billingInfo, paymentMethod, totals } = req.body;

      // Validate required fields
      if (!cart || !billingInfo || !paymentMethod || !totals) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: req.user?.id || 'anonymous', // Handle anonymous users
          subscriptionPackageId: cart[0]?.packageId, // Use first item's package ID
          billingInterval: cart[0]?.billingInterval || 'MONTHLY',
          subtotal: totals.subtotal,
          discountAmount: totals.discount || 0,
          taxAmount: 0, // TODO: Calculate tax
          total: totals.total,
          currency: 'USD',
          status: 'PENDING',
          customerEmail: billingInfo.email,
          customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
          billingAddress: {
            firstName: billingInfo.firstName,
            lastName: billingInfo.lastName,
            email: billingInfo.email,
            phone: billingInfo.phone,
            address: billingInfo.address,
            city: billingInfo.city,
            state: billingInfo.state,
            zipCode: billingInfo.zipCode,
            country: billingInfo.country,
            company: billingInfo.company
          }
        }
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totals.total,
          currency: 'USD',
          status: 'PROCESSING',
          method: 'STRIPE', // Default to Stripe
          // In a real implementation, you would integrate with Stripe or another payment processor
          // paymentIntentId: stripePaymentIntent.id,
          // stripeCustomerId: customer.id,
          // stripeChargeId: charge.id,
        }
      });

      // Simulate payment processing (in real implementation, use Stripe)
      setTimeout(async () => {
        try {
          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              processedAt: new Date(),
              receiptUrl: `https://example.com/receipt/${payment.id}` // Mock receipt URL
            }
          });

          // Update order status
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date()
            }
          });

          // Generate invoice
          const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          await prisma.invoice.create({
            data: {
              orderId: order.id,
              invoiceNumber,
              customerEmail: billingInfo.email,
              customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
              billingAddress: order.billingAddress as any,
              items: cart.map((item: any) => ({
                name: item.packageName,
                tier: item.tier,
                billingInterval: item.billingInterval,
                price: item.price,
                originalPrice: item.originalPrice,
                discountAmount: item.discountAmount,
                discountDescription: item.discountDescription
              })),
              subtotal: totals.subtotal,
              discountAmount: totals.discount || 0,
              taxAmount: 0,
              total: totals.total,
              currency: 'USD',
              issuedAt: new Date(),
              paidAt: new Date()
            }
          });

          // TODO: Send confirmation email
          // TODO: Activate user subscription

        } catch (error: unknown) {
          console.error('Error processing payment:', error);
        }
      }, 2000); // Simulate 2 second processing time

      res.json({ 
        success: true, 
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total
        }
      });

    } catch (error: unknown) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          payment: true,
          invoice: true,
          subscriptionPackage: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error: unknown) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get user's orders
  app.get("/api/user/orders", requireUserAuth, async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          payment: true,
          invoice: true,
          subscriptionPackage: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(orders);
    } catch (error: unknown) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get order receipt/invoice
  app.get("/api/orders/:id/receipt", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          payment: true,
          invoice: true,
          subscriptionPackage: true
        }
      });

      if (!order || !order.invoice) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      // Generate receipt HTML
      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${order.invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            .billing-info { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { text-align: right; }
            .total-row { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Tbz Resume Builder</h1>
            <h2>Receipt</h2>
          </div>

          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${order.invoice.invoiceNumber}</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.invoice.issuedAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <div class="billing-info">
            <h3>Billing Information</h3>
            <p>${order.customerName}</p>
            ${order.billingAddress && (order.billingAddress as any).company ? `<p>${(order.billingAddress as any).company}</p>` : ''}
            <p>${order.billingAddress ? (order.billingAddress as any).address : 'N/A'}</p>
            <p>${order.billingAddress ? `${(order.billingAddress as any).city}, ${(order.billingAddress as any).state} ${(order.billingAddress as any).zipCode}` : 'N/A'}</p>
            <p>${order.billingAddress ? (order.billingAddress as any).country : 'N/A'}</p>
            <p>Email: ${order.customerEmail}</p>
            <p>Phone: ${order.billingAddress ? (order.billingAddress as any).phone : 'N/A'}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Billing Period</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.invoice.items.map((item: any) => `
                <tr>
                  <td>${item.name} (${item.tier})</td>
                  <td>${item.billingInterval.toLowerCase()}</td>
                  <td>$${(item.price / 100).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: $${(order.subtotal / 100).toFixed(2)}</p>
            ${order.discountAmount > 0 ? `<p>Discount: -$${(order.discountAmount / 100).toFixed(2)}</p>` : ''}
            <p class="total-row">Total: $${(order.total / 100).toFixed(2)}</p>
          </div>

          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for your business!</p>
            <p>For support, contact us at support@tbzresumebuilder.com</p>
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(receiptHtml);
    } catch (error: unknown) {
      console.error("Error generating receipt:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // User Management Routes
  
  // Create new user
  app.post("/api/users", async (req: express.Request, res: express.Response) => {
    try {
      const userSchema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6),
      currentTier: z.enum(['FREE', 'PREMIUM', 'ENTERPRISE']).optional().default('FREE')
    });

      const validatedData = userSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          password: validatedData.password, // In production, hash this password
          currentTier: validatedData.currentTier,
          isActive: true
        }
      });

      // Don't return password
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          currentTier: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error: unknown) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        currentTier: z.enum(['FREE', 'PREMIUM', 'ENTERPRISE']).optional(),
        isActive: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // If email is being updated, check for conflicts
      if (validatedData.email && validatedData.email !== existingUser.email) {
        const emailConflict = await prisma.user.findUnique({
          where: { email: validatedData.email }
        });
        if (emailConflict) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: validatedData,
        select: {
          id: true,
          email: true,
          name: true,
          currentTier: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      });

      res.json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await prisma.user.delete({
        where: { id }
      });

      res.json({ message: "User deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get user profile
  app.get("/api/users/:id/profile", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          resumes: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              updatedAt: true
            }
          },
          subscriptions: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true,
              subscriptionPackage: {
                select: {
                  name: true,
                  tier: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return password
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error: unknown) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Update user profile
  app.put("/api/users/:id/profile", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const profileSchema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        bio: z.string().optional()
      });

      const validatedData = profileSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: validatedData,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          company: true,
          jobTitle: true,
          bio: true,
          tier: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Resume Management Routes
  
  // Get all resumes for user
  app.get("/api/resumes", async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const resumes = await prisma.resume.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          templateId: true,
          createdAt: true,
          updatedAt: true,
          isPublic: true,
          template: {
            select: {
              name: true,
              category: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(resumes);
    } catch (error: unknown) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Create new resume
  app.post("/api/resumes", async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const resumeSchema = z.object({
        title: z.string().min(1),
        templateId: z.string(),
        content: z.object({}).optional(),
        isPublic: z.boolean().optional().default(false)
      });

      const validatedData = resumeSchema.parse(req.body);

      // Check if template exists
      const template = await prisma.template.findUnique({
        where: { id: validatedData.templateId }
      });

      if (!template) {
        return res.status(400).json({ error: "Template not found" });
      }

      const resume = await prisma.resume.create({
        data: {
          title: validatedData.title,
          userId,
          templateId: validatedData.templateId,
          content: validatedData.content || {},
          isPublic: validatedData.isPublic
        },
        include: {
          template: {
            select: {
              name: true,
              category: true
            }
          }
        }
      });

      res.status(201).json(resume);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error creating resume:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get resume by ID
  app.get("/api/resumes/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const resume = await prisma.resume.findUnique({
        where: { id },
        include: {
          template: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      // Check if user has access to this resume
      if (resume.userId !== userId && !resume.isPublic) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(resume);
    } catch (error: unknown) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Update resume
  app.put("/api/resumes/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const updateSchema = z.object({
        title: z.string().min(1).optional(),
        content: z.object({}).optional(),
        isPublic: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      // Check if resume exists and user owns it
      const existingResume = await prisma.resume.findUnique({
        where: { id }
      });

      if (!existingResume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (existingResume.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updatedResume = await prisma.resume.update({
        where: { id },
        data: validatedData,
        include: {
          template: {
            select: {
              name: true,
              category: true
            }
          }
        }
      });

      res.json(updatedResume);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating resume:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Delete resume
  app.delete("/api/resumes/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const resume = await prisma.resume.findUnique({
        where: { id }
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await prisma.resume.delete({
        where: { id }
      });

      res.json({ message: "Resume deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Duplicate resume
  app.post("/api/resumes/:id/duplicate", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const originalResume = await prisma.resume.findUnique({
        where: { id }
      });

      if (!originalResume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      // Check if user has access to this resume
      if (originalResume.userId !== userId && !originalResume.isPublic) {
        return res.status(403).json({ error: "Access denied" });
      }

      const duplicatedResume = await prisma.resume.create({
        data: {
          title: `${originalResume.title} (Copy)`,
          userId,
          templateId: originalResume.templateId,
          content: originalResume.content,
          isPublic: false // Always make duplicates private
        },
        include: {
          template: {
            select: {
              name: true,
              category: true
            }
          }
        }
      });

      res.status(201).json(duplicatedResume);
    } catch (error: unknown) {
      console.error("Error duplicating resume:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Template Management Routes
  
  // Snap Template Routes (ResumeTemplate model) - Must come before generic template routes
  
  // Get all snap templates
  app.get("/api/templates/snap", async (req: express.Request, res: express.Response) => {
    try {
      const templates = await prisma.resumeTemplate.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          code: true,
          structure: true,
          thumbnailUrl: true,
          enhanced3DThumbnailUrl: true,
          thumbnailType: true,
          thumbnailFormat: true,
          thumbnailMetadata: true,
          isDefault: true,
          displayMode: true,
          uploadedImageUrl: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(templates);
    } catch (error: unknown) {
      console.error("Error fetching snap templates:", error);
      res.status(500).json({ error: "Failed to fetch snap templates" });
    }
  });

  // Get snap template by ID
  app.get("/api/templates/snap/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const templateId = parseInt(id, 10);

      if (isNaN(templateId)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const template = await prisma.resumeTemplate.findUnique({
        where: { id: templateId }
      });

      if (!template) {
        return res.status(404).json({ error: "Snap template not found" });
      }

      res.json(template);
    } catch (error: unknown) {
      console.error("Error fetching snap template:", error);
      res.status(500).json({ error: "Failed to fetch snap template" });
    }
  });

  // Delete snap template by ID (admin only)
  app.delete("/api/templates/snap/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const templateId = parseInt(id, 10);

      if (isNaN(templateId)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      // Check if template exists
      const existingTemplate = await prisma.resumeTemplate.findUnique({
        where: { id: templateId }
      });

      if (!existingTemplate) {
        return res.status(404).json({ error: "Snap template not found" });
      }

      // Delete the template
      await prisma.resumeTemplate.delete({
        where: { id: templateId }
      });

      res.json({ message: "Snap template deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting snap template:", error);
      res.status(500).json({ error: "Failed to delete snap template" });
    }
   });

  // Get all templates
  app.get("/api/templates", async (req: express.Request, res: express.Response) => {
    try {
      const { isActive } = req.query;
      
      const whereClause: Record<string, any> = {};
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';

      const templates = await prisma.template.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          code: true,
          structure: true,
          thumbnailUrl: true,
          enhanced3DThumbnailUrl: true,
          thumbnailType: true,
          thumbnailFormat: true,
          thumbnailMetadata: true,
          isDefault: true,
          displayMode: true,
          uploadedImageUrl: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(templates);
    } catch (error: unknown) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get template by ID
  app.get("/api/templates/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const template = await prisma.template.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              resumes: true
            }
          }
        }
      });

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error: unknown) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Create template (admin only)
  app.post("/api/templates", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const templateSchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        code: z.string(),
        structure: z.object({}).optional(),
        thumbnailUrl: z.string().url().optional(),
        enhanced3DThumbnailUrl: z.string().url().optional(),
        thumbnailType: z.string().optional(),
        thumbnailFormat: z.string().optional(),
        thumbnailMetadata: z.object({}).optional(),
        isDefault: z.boolean().optional().default(false),
        displayMode: z.string().optional(),
        uploadedImageUrl: z.string().url().optional()
      });

      const validatedData = templateSchema.parse(req.body);

      const template = await prisma.template.create({
        data: validatedData
      });

      res.status(201).json(template);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  // Update template (admin only)
  app.put("/api/templates/:id", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const updateSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        code: z.string().optional(),
        structure: z.object({}).optional(),
        thumbnailUrl: z.string().url().optional(),
        enhanced3DThumbnailUrl: z.string().url().optional(),
        thumbnailType: z.string().optional(),
        thumbnailFormat: z.string().optional(),
        thumbnailMetadata: z.object({}).optional(),
        isDefault: z.boolean().optional(),
        displayMode: z.string().optional(),
        uploadedImageUrl: z.string().url().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      const existingTemplate = await prisma.template.findUnique({
        where: { id }
      });

      if (!existingTemplate) {
        return res.status(404).json({ error: "Template not found" });
      }

      const updatedTemplate = await prisma.template.update({
        where: { id },
        data: validatedData
      });

      res.json(updatedTemplate);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  // Delete template (admin only)
  app.delete("/api/templates/:id", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      // Note: Template deletion check removed as Template model doesn't have resume relations

      await prisma.template.delete({
        where: { id }
      });

      res.json({ message: "Template deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Pro Template Management Routes (using ProTemplate model)
  
  // Get all pro templates
  app.get("/api/pro-templates", async (req: express.Request, res: express.Response) => {
    try {
      const templates = await storage.getAllProTemplates();
      res.json(templates);
    } catch (error: unknown) {
      console.error("Error fetching pro templates:", error);
      res.status(500).json({ error: "Failed to fetch pro templates" });
    }
  });

  // Get pro template by ID
  app.get("/api/pro-templates/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const template = await storage.getProTemplateById(parseInt(id));

      if (!template) {
        return res.status(404).json({ error: "Pro template not found" });
      }

      res.json(template);
    } catch (error: unknown) {
      console.error("Error fetching pro template:", error);
      res.status(500).json({ error: "Failed to fetch pro template" });
    }
  });

  // Create pro template (admin only)
  app.post("/api/pro-templates", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      console.log('POST /api/pro-templates - Request received:', {
        body: req.body,
        headers: req.headers['content-type']
      });
      const templateSchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        code: z.string(),
        structure: z.object({}).optional(),
        thumbnailUrl: z.string().url().optional().or(z.literal('')),
        enhanced3DThumbnailUrl: z.string().url().optional().or(z.literal('')),
        thumbnailType: z.string().optional(),
        thumbnailFormat: z.string().optional(),
        thumbnailMetadata: z.object({}).optional(),
        displayMode: z.string().optional(),
        uploadedImageUrl: z.string().url().optional().or(z.literal(''))
      });

      console.log('POST /api/pro-templates - Validating data...');
      const validatedData = templateSchema.parse(req.body);
      console.log('POST /api/pro-templates - Data validated successfully:', validatedData);

      console.log('POST /api/pro-templates - Creating template...');
      const template = await storage.createProTemplate(validatedData);
      console.log('POST /api/pro-templates - Template created successfully:', template);

      res.status(201).json(template);
    } catch (error: unknown) {
      console.error('POST /api/pro-templates - Error occurred:', error);
      
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        console.error('POST /api/pro-templates - Validation error:', validationError.message);
        return res.status(400).json({ 
          error: 'Validation failed',
          message: validationError.message,
          details: error.errors
        });
      }
      
      // Ensure we always send a proper JSON response
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("POST /api/pro-templates - Server error:", errorMessage);
      res.status(500).json({ 
        error: "Failed to create pro template",
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Update pro template (admin only)
  app.put("/api/pro-templates/:id", async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid pro template id" });
      
      const requestData = req.body;

      // Transform enhanced3DMetadata to thumbnailMetadata for database storage
      const dataForStorage = {
        ...requestData,
        thumbnailMetadata: requestData.enhanced3DMetadata !== undefined 
                            ? {
                                ...requestData.enhanced3DMetadata,
                                // Ensure width and height are numbers, not strings
                                width: typeof requestData.enhanced3DMetadata.width === 'string' 
                                  ? parseInt(requestData.enhanced3DMetadata.width, 10) 
                                  : requestData.enhanced3DMetadata.width,
                                height: typeof requestData.enhanced3DMetadata.height === 'string' 
                                  ? parseInt(requestData.enhanced3DMetadata.height, 10) 
                                  : requestData.enhanced3DMetadata.height
                              }
                            : requestData.thumbnailMetadata,
        thumbnailFormat: requestData.enhanced3DMetadata?.format !== undefined 
                            ? requestData.enhanced3DMetadata.format 
                            : requestData.thumbnailFormat,
      };

      const existingTemplate = await storage.getProTemplateById(id);

      if (!existingTemplate) {
        return res.status(404).json({ error: "Pro template not found" });
      }

      const updatedTemplate = await storage.updateProTemplate(id, dataForStorage);

      res.json(updatedTemplate);
    } catch (error: unknown) {
      console.error("Error updating pro template:", error);
      res.status(500).json({ message: "Failed to update pro template" });
    }
  });

  // Delete pro template (admin only)
  app.delete("/api/pro-templates/:id", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const template = await storage.getProTemplateById(parseInt(id));

      if (!template) {
        return res.status(404).json({ error: "Pro template not found" });
      }

      await storage.deleteProTemplate(parseInt(id));

      res.json({ message: "Pro template deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting pro template:", error);
      res.status(500).json({ error: "Failed to delete pro template" });
    }
  });



  // Analytics & Usage Statistics Routes
  
  // Track user actions
  app.post("/api/analytics/track", async (req: express.Request, res: express.Response) => {
    try {
      const trackingSchema = z.object({
        userId: z.string().optional(),
        action: z.enum(['RESUME_CREATION', 'RESUME_DOWNLOAD', 'TEMPLATE_USAGE', 'AI_SUGGESTION', 'LOGIN', 'SIGNUP']),
        metadata: z.object({}).optional(),
        sessionId: z.string().optional()
      });

      const validatedData = trackingSchema.parse(req.body);

      const usageStats = await prisma.usageStats.create({
        data: {
          userId: validatedData.userId,
          action: validatedData.action,
          metadata: validatedData.metadata || {},
          sessionId: validatedData.sessionId,
          timestamp: new Date()
        }
      });

      res.status(201).json({ success: true, id: usageStats.id });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error tracking analytics:", error);
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });

  // Get dashboard statistics
  app.get("/api/analytics/dashboard", async (req: express.Request, res: express.Response) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      let startDate: Date;
      const now = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get user statistics
      const totalUsers = await prisma.user.count();
      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      });

      // Get resume statistics
      const totalResumes = await prisma.resume.count();
      const newResumes = await prisma.resume.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      });

      // Get template usage (simplified since there's no direct relation)
      const templateUsage = await prisma.template.findMany({
        select: {
          id: true,
          name: true
        },
        take: 10
      });

      // Get template usage counts manually
      const templateUsageCounts = await Promise.all(
        templateUsage.map(async (template: { id: string | number; [key: string]: any }) => {
          const count = await prisma.resume.count({
            where: {
              templateId: template.id.toString()
            }
          });
          return {
            ...template,
            _count: { resumes: count }
          };
        })
      );

      // Sort by usage count
      templateUsageCounts.sort((a, b) => b._count.resumes - a._count.resumes);

      // Get usage statistics
      const usageStats = await prisma.usageStats.groupBy({
        by: ['action'],
        where: {
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          action: true
        }
      });

      const statistics = {
        users: {
          total: totalUsers,
          new: newUsers
        },
        resumes: {
          total: totalResumes,
          new: newResumes
        },
        templateUsage: templateUsageCounts,
        usageStats: usageStats.reduce((acc: any, stat: any) => {
          acc[stat.action] = stat._count.action;
          return acc;
        }, {} as Record<string, number>),
        timeframe
      };

      res.json(statistics);
    } catch (error: unknown) {
      console.error("Error fetching dashboard statistics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // Get user usage statistics
  app.get("/api/analytics/usage/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const { timeframe = '30d' } = req.query;
      
      let startDate: Date;
      const now = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const userStats = await prisma.usageStats.groupBy({
        by: ['action'],
        where: {
          userId,
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          action: true
        }
      });

      const userResumes = await prisma.resume.count({
        where: {
          userId,
          createdAt: {
            gte: startDate
          }
        }
      });

      const statistics = {
        userId,
        timeframe,
        resumesCreated: userResumes,
        actions: userStats.reduce((acc: any, stat: any) => {
          acc[stat.action] = stat._count.action;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json(statistics);
    } catch (error: unknown) {
      console.error("Error fetching user usage statistics:", error);
      res.status(500).json({ error: "Failed to fetch user usage statistics" });
    }
  });

  // Track resume creation
  app.post("/api/analytics/resume-creation", async (req: express.Request, res: express.Response) => {
    try {
      const { userId, resumeId, templateId } = req.body;
      
      await prisma.usageStats.create({
        data: {
          userId,
          action: 'RESUME_CREATION',
          metadata: {
            resumeId,
            templateId
          },
          timestamp: new Date()
        }
      });

      res.json({ success: true });
    } catch (error: unknown) {
      console.error("Error tracking resume creation:", error);
      res.status(500).json({ error: "Failed to track resume creation" });
    }
  });

  // Track resume download
  app.post("/api/analytics/resume-download", async (req: express.Request, res: express.Response) => {
    try {
      const { userId, resumeId, format } = req.body;
      
      await prisma.usageStats.create({
        data: {
          userId,
          action: 'RESUME_DOWNLOAD',
          metadata: {
            resumeId,
            format
          },
          timestamp: new Date()
        }
      });

      res.json({ success: true });
    } catch (error: unknown) {
      console.error("Error tracking resume download:", error);
      res.status(500).json({ error: "Failed to track resume download" });
    }
  });

  // Track template usage
  app.post("/api/analytics/template-usage", async (req: express.Request, res: express.Response) => {
    try {
      const { userId, templateId, action } = req.body;
      
      await prisma.usageStats.create({
        data: {
          userId,
          action: 'TEMPLATE_USAGE',
          metadata: {
            templateId,
            usageAction: action
          },
          timestamp: new Date()
        }
      });

      res.json({ success: true });
    } catch (error: unknown) {
      console.error("Error tracking template usage:", error);
      res.status(500).json({ error: "Failed to track template usage" });
    }
  });

  // Track AI suggestion usage
  app.post("/api/analytics/ai-suggestion", async (req: express.Request, res: express.Response) => {
    try {
      const { userId, suggestionType, accepted } = req.body;
      
      await prisma.usageStats.create({
        data: {
          userId,
          action: 'AI_SUGGESTION',
          metadata: {
            suggestionType,
            accepted
          },
          timestamp: new Date()
        }
      });

      res.json({ success: true });
    } catch (error: unknown) {
      console.error("Error tracking AI suggestion:", error);
      res.status(500).json({ error: "Failed to track AI suggestion" });
    }
  });

  // Admin Management Routes
  
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { page = 1, limit = 20, search, tier, isActive } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const whereClause: Record<string, any> = {};
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } }
        ];
      }
      
      if (tier) whereClause.tier = tier;
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';

      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            email: true,
            name: true,
            tier: true,
            isActive: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                resumes: true
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where: whereClause })
      ]);

      res.json({
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error: unknown) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get detailed user data (admin only)
  app.get("/api/admin/users/:id", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          resumes: {
            select: {
              id: true,
              title: true,
              templateId: true,
              templateType: true,
              createdAt: true,
              updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
          },
          subscription: {
            select: {
              id: true,
              status: true,
              currentPeriodStart: true,
              currentPeriodEnd: true,
              subscriptionPackage: {
                select: {
                  name: true,
                  tier: true,
                  monthlyPrice: true
                }
              }
            }
          },
          supportTickets: {
            select: {
              id: true,
              subject: true,
              status: true,
              priority: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          },
          notifications: {
            select: {
              id: true,
              title: true,
              isRead: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          usageStats: {
            select: {
              resumesCreated: true,
              resumesDownloaded: true,
              templatesUsed: true,
              monthlyResumes: true,
              monthlyDownloads: true,
              lastActiveDate: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return password
      const { password, ...userDetails } = user;
      res.json(userDetails);
    } catch (error: unknown) {
      console.error("Error fetching admin user details:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Update user tier (admin only)
  app.put("/api/admin/users/:id/tier", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { tier } = req.body;

      const tierSchema = z.enum(['FREE', 'PREMIUM', 'ENTERPRISE']);
      const validatedTier = tierSchema.parse(tier);

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { tier: validatedTier },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating user tier:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get admin statistics
  app.get("/api/admin/statistics", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      let startDate: Date;
      const now = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [userStats, resumeStats, templateStats, subscriptionStats, supportStats] = await Promise.all([
        // User statistics
        Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { createdAt: { gte: startDate } } }),
          prisma.user.count({ where: { isActive: true } }),
          prisma.user.groupBy({
            by: ['tier'],
            _count: { tier: true }
          })
        ]),
        
        // Resume statistics
        Promise.all([
          prisma.resume.count(),
          prisma.resume.count({ where: { createdAt: { gte: startDate } } }),
          prisma.resume.count({ where: { isPublic: true } })
        ]),
        
        // Template statistics
        Promise.all([
          prisma.template.count(),
          prisma.template.count(),
          prisma.template.findMany({
            select: {
              id: true,
              name: true,
              category: true,
              _count: {
                select: {
                  resumes: true
                }
              }
            },
            orderBy: {
              resumes: {
                _count: 'desc'
              }
            },
            take: 5
          })
        ]),
        
        // Subscription statistics
        Promise.all([
          prisma.subscription.count(),
          prisma.subscription.count({ where: { status: 'ACTIVE' } }),
          prisma.subscription.groupBy({
            by: ['status'],
            _count: { status: true }
          })
        ]),
        
        // Support ticket statistics
        Promise.all([
          prisma.supportTicket.count(),
          prisma.supportTicket.count({ where: { status: 'OPEN' } }),
          prisma.supportTicket.groupBy({
            by: ['status'],
            _count: { status: true }
          })
        ])
      ]);

      const statistics = {
        users: {
          total: userStats[0],
          new: userStats[1],
          active: userStats[2],
          byTier: userStats[3].reduce((acc: any, stat: any) => {
            acc[stat.tier] = stat._count.tier;
            return acc;
          }, {} as Record<string, number>)
        },
        resumes: {
          total: resumeStats[0],
          new: resumeStats[1],
          public: resumeStats[2]
        },
        templates: {
          total: templateStats[0],
          active: templateStats[1],
          mostUsed: templateStats[2]
        },
        subscriptions: {
          total: subscriptionStats[0],
          active: subscriptionStats[1],
          byStatus: subscriptionStats[2].reduce((acc: any, stat: any) => {
            acc[stat.status] = stat._count.status;
            return acc;
          }, {} as Record<string, number>)
        },
        support: {
          total: supportStats[0],
          open: supportStats[1],
          byStatus: supportStats[2].reduce((acc: any, stat: any) => {
            acc[stat.status] = stat._count.status;
            return acc;
          }, {} as Record<string, number>)
        },
        timeframe
      };

      res.json(statistics);
    } catch (error: unknown) {
      console.error("Error fetching admin statistics:", error);
      res.status(500).json({ error: "Failed to fetch admin statistics" });
    }
  });

  // Update database configuration (admin only)
  app.put("/api/admin/database-config", requireAdminAuth, async (req: express.Request, res: express.Response) => {
    try {
      // TODO: Add proper validation and security measures
      const { databaseUrl, maxConnections } = req.body;

      // This is a sensitive operation that should be handled carefully
      // In a production environment, this would require additional security measures
      
      res.json({ 
        message: "Database configuration update requested",
        note: "This feature requires additional implementation for security"
      });
    } catch (error: unknown) {
      console.error("Error updating database config:", error);
      res.status(500).json({ error: "Failed to update database configuration" });
    }
  });

  // Notification Routes
  
  // Get user notifications
  app.get("/api/notifications/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, isRead } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const whereClause: Record<string, any> = { userId };
      
      if (isRead !== undefined) {
        whereClause.isRead = isRead === 'true';
      }

      const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where: whereClause })
      ]);

      res.json({
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error: unknown) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Create notification
  app.post("/api/notifications", async (req: express.Request, res: express.Response) => {
    try {
      const notificationSchema = z.object({
        userId: z.string(),
        title: z.string().min(1),
        message: z.string().min(1),
        type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR']).optional().default('INFO'),
        actionUrl: z.string().url().optional()
      });

      const validatedData = notificationSchema.parse(req.body);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId }
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const notification = await prisma.notification.create({
        data: validatedData
      });

      res.status(201).json(notification);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  // Mark notification as read
  app.put("/api/notifications/:id/read", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      res.json(updatedNotification);
    } catch (error: unknown) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Delete notification
  app.delete("/api/notifications/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await prisma.notification.delete({
        where: { id }
      });

      res.json({ message: "Notification deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Support Ticket Routes
  
  // Get support tickets
  app.get("/api/support/tickets", async (req: express.Request, res: express.Response) => {
    try {
      const { page = 1, limit = 20, status, priority, userId } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const whereClause: Record<string, any> = {};
      
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (userId) whereClause.userId = userId;

      const [tickets, totalCount] = await Promise.all([
        prisma.supportTicket.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.supportTicket.count({ where: whereClause })
      ]);

      res.json({
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error: unknown) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  // Create support ticket
  app.post("/api/support/tickets", async (req: express.Request, res: express.Response) => {
    try {
      const ticketSchema = z.object({
        userId: z.string(),
        subject: z.string().min(1),
        description: z.string().min(1),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
        category: z.string().optional()
      });

      const validatedData = ticketSchema.parse(req.body);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId }
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const ticket = await prisma.supportTicket.create({
        data: {
          ...validatedData,
          status: 'OPEN'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json(ticket);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating support ticket:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  // Get ticket by ID
  app.get("/api/support/tickets/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const ticket = await prisma.supportTicket.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!ticket) {
        return res.status(404).json({ error: "Support ticket not found" });
      }

      res.json(ticket);
    } catch (error: unknown) {
      console.error("Error fetching support ticket:", error);
      res.status(500).json({ error: "Failed to fetch support ticket" });
    }
  });

  // Update ticket status
  app.put("/api/support/tickets/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        response: z.string().optional(),
        assignedTo: z.string().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      const ticket = await prisma.supportTicket.findUnique({
        where: { id }
      });

      if (!ticket) {
        return res.status(404).json({ error: "Support ticket not found" });
      }

      const updatedTicket = await prisma.supportTicket.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.json(updatedTicket);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating support ticket:", error);
      res.status(500).json({ error: "Failed to update support ticket" });
    }
  });

  // Subscription Management Routes
  
  // Get user subscription
  app.get("/api/subscriptions/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;

      const subscription = await prisma.subscription.findFirst({
        where: { 
          userId,
          status: 'ACTIVE'
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!subscription) {
        return res.status(404).json({ error: "No active subscription found" });
      }

      res.json(subscription);
    } catch (error: unknown) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Create subscription
  app.post("/api/subscriptions", async (req: express.Request, res: express.Response) => {
    try {
      const subscriptionSchema = z.object({
        userId: z.string(),
        planType: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        price: z.number().min(0),
        paymentMethod: z.string().optional(),
        autoRenew: z.boolean().optional().default(false)
      });

      const validatedData = subscriptionSchema.parse(req.body);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId }
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Deactivate existing active subscriptions
      await prisma.subscription.updateMany({
        where: {
          userId: validatedData.userId,
          status: 'ACTIVE'
        },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });

      const subscription = await prisma.subscription.create({
        data: {
          ...validatedData,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          status: 'ACTIVE'
        }
      });

      res.status(201).json(subscription);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Update subscription
  app.put("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        planType: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
        endDate: z.string().datetime().optional(),
        status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED']).optional(),
        autoRenew: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      const subscription = await prisma.subscription.findUnique({
        where: { id }
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      const updateData: any = {
        ...validatedData,
        updatedAt: new Date()
      };

      if (validatedData.endDate) {
        updateData.endDate = new Date(validatedData.endDate);
      }

      const updatedSubscription = await prisma.subscription.update({
        where: { id },
        data: updateData
      });

      res.json(updatedSubscription);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  // Cancel subscription
  app.delete("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const subscription = await prisma.subscription.findUnique({
        where: { id }
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      const cancelledSubscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          autoRenew: false,
          updatedAt: new Date()
        }
      });

      res.json(cancelledSubscription);
    } catch (error: unknown) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Discount Code Management Routes
  
  // Validate discount code
  app.post("/api/discount-codes/validate", async (req: Request, res: Response) => {
    try {
      const validateSchema = z.object({
        code: z.string().min(1),
        userId: z.string().optional()
      });

      const { code, userId } = validateSchema.parse(req.body);

      const discountCode = await prisma.discountCode.findUnique({
        where: { code }
      });

      if (!discountCode) {
        return res.status(404).json({ error: "Invalid discount code" });
      }

      // Check if code is active
      if (!discountCode.isActive) {
        return res.status(400).json({ error: "Discount code is not active" });
      }

      // Check expiration
      if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
        return res.status(400).json({ error: "Discount code has expired" });
      }

      // Check usage limit
      if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
        return res.status(400).json({ error: "Discount code usage limit reached" });
      }

      // Check if user has already used this code (if userId provided)
      if (userId && discountCode.maxUsesPerUser) {
        const userUsageCount = await prisma.discountCodeUsage.count({
          where: {
            discountCodeId: discountCode.id,
            userId
          }
        });

        if (userUsageCount >= discountCode.maxUsesPerUser) {
          return res.status(400).json({ error: "You have already used this discount code" });
        }
      }

      res.json({
        valid: true,
        discountCode: {
          id: discountCode.id,
          code: discountCode.code,
          discountType: discountCode.discountType,
          discountValue: discountCode.discountValue,
          description: discountCode.description
        }
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error validating discount code:", error);
      res.status(500).json({ error: "Failed to validate discount code" });
    }
  });

  // Apply discount code
  app.post("/api/discount-codes/apply", async (req: Request, res: Response) => {
    try {
      const applySchema = z.object({
        code: z.string().min(1),
        userId: z.string(),
        orderId: z.string().optional()
      });

      const { code, userId, orderId } = applySchema.parse(req.body);

      // First validate the code (reuse validation logic)
      const discountCode = await prisma.discountCode.findUnique({
        where: { code }
      });

      if (!discountCode || !discountCode.isActive) {
        return res.status(400).json({ error: "Invalid or inactive discount code" });
      }

      // Record usage
      await prisma.discountCodeUsage.create({
        data: {
          discountCodeId: discountCode.id,
          userId,
          orderId,
          usedAt: new Date()
        }
      });

      // Update usage count
      await prisma.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedCount: {
            increment: 1
          }
        }
      });

      res.json({
        success: true,
        message: "Discount code applied successfully",
        discountCode: {
          id: discountCode.id,
          code: discountCode.code,
          discountType: discountCode.discountType,
          discountValue: discountCode.discountValue
        }
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error applying discount code:", error);
      res.status(500).json({ error: "Failed to apply discount code" });
    }
  });

  // Create discount code (Admin only)
  app.post("/api/discount-codes", async (req: express.Request, res: express.Response) => {
    try {
      const discountSchema = z.object({
        code: z.string().min(1).max(50),
        description: z.string().optional(),
        discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        discountValue: z.number().min(0),
        maxUses: z.number().int().min(1).optional(),
        maxUsesPerUser: z.number().int().min(1).optional(),
        expiresAt: z.string().datetime().optional(),
        isActive: z.boolean().optional().default(true)
      });

      const validatedData = discountSchema.parse(req.body);

      // Check if code already exists
      const existingCode = await prisma.discountCode.findUnique({
        where: { code: validatedData.code }
      });

      if (existingCode) {
        return res.status(400).json({ error: "Discount code already exists" });
      }

      const discountCode = await prisma.discountCode.create({
        data: {
          ...validatedData,
          expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
          usedCount: 0
        }
      });

      res.status(201).json(discountCode);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating discount code:", error);
      res.status(500).json({ error: "Failed to create discount code" });
    }
  });

  // Download Tracking Routes
  
  // Track resume download
  app.post("/api/downloads/track", async (req: express.Request, res: express.Response) => {
    try {
      const downloadSchema = z.object({
        userId: z.string(),
        resumeId: z.string(),
        format: z.enum(['PDF', 'DOCX', 'TXT']),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional()
      });

      const validatedData = downloadSchema.parse(req.body);

      // Verify user and resume exist
      const [user, resume] = await Promise.all([
        prisma.user.findUnique({ where: { id: validatedData.userId } }),
        prisma.resume.findUnique({ where: { id: validatedData.resumeId } })
      ]);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      if (!resume) {
        return res.status(400).json({ error: "Resume not found" });
      }

      // Check if user owns the resume or has permission
      if (resume.userId !== validatedData.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const download = await prisma.download.create({
        data: {
          ...validatedData,
          downloadedAt: new Date()
        }
      });

      // Track analytics
      await prisma.usageStats.create({
        data: {
          userId: validatedData.userId,
          action: 'DOWNLOAD',
          details: `Downloaded resume in ${validatedData.format} format`,
          timestamp: new Date()
        }
      });

      res.status(201).json(download);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error tracking download:", error);
      res.status(500).json({ error: "Failed to track download" });
    }
  });

  // Get download history for user
  app.get("/api/downloads/user/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, format, resumeId } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const whereClause: Record<string, any> = { userId };
      
      if (format) whereClause.format = format;
      if (resumeId) whereClause.resumeId = resumeId;

      const [downloads, totalCount] = await Promise.all([
        prisma.download.findMany({
          where: whereClause,
          include: {
            resume: {
              select: {
                id: true,
                title: true
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { downloadedAt: 'desc' }
        }),
        prisma.download.count({ where: whereClause })
      ]);

      res.json({
        downloads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error: unknown) {
      console.error("Error fetching download history:", error);
      res.status(500).json({ error: "Failed to fetch download history" });
    }
  });

  // Get download statistics
  app.get("/api/downloads/stats", async (req: express.Request, res: express.Response) => {
    try {
      const { timeframe = '30d', userId } = req.query;
      
      let startDate: Date;
      const endDate = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      const whereClause: Record<string, any> = {
        downloadedAt: {
          gte: startDate,
          lte: endDate
        }
      };

      if (userId) whereClause.userId = userId;

      const [totalDownloads, formatStats, dailyStats] = await Promise.all([
        prisma.download.count({ where: whereClause }),
    prisma.download.groupBy({
          by: ['format'],
          where: whereClause,
          _count: { format: true }
        }),
        prisma.download.groupBy({
          by: ['downloadedAt'],
          where: whereClause,
          _count: { downloadedAt: true }
        })
      ]);

      res.json({
        totalDownloads,
        formatBreakdown: formatStats.map((stat: any) => ({
          format: stat.format,
          count: stat._count.format
        })),
        dailyBreakdown: dailyStats.map((stat: any) => ({
          date: stat.downloadedAt,
          count: stat._count.downloadedAt
        }))
      });
    } catch (error: unknown) {
      console.error("Error fetching download statistics:", error);
      res.status(500).json({ error: "Failed to fetch download statistics" });
    }
  });

  // User Permissions Routes
  
  // Get user permissions
  app.get("/api/permissions/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Define permissions based on user tier and subscription
      const activeSubscription = user.subscription[0];
      const userTier = user.tier || 'FREE';
      const planType = activeSubscription?.planType || userTier;

      const permissions = {
        maxResumes: getMaxResumes(planType),
        maxTemplates: getMaxTemplates(planType),
        canExportPDF: canExportPDF(planType),
        canExportDOCX: canExportDOCX(planType),
        canUseAI: canUseAI(planType),
        canAccessPremiumTemplates: canAccessPremiumTemplates(planType),
        canRemoveWatermark: canRemoveWatermark(planType),
        canAccessAnalytics: canAccessAnalytics(planType),
        isAdmin: user.tier === 'ADMIN'
      };

      res.json({
        userId,
        tier: userTier,
        planType,
        permissions,
        subscriptionStatus: activeSubscription?.status || 'NONE'
      });
    } catch (error: unknown) {
      console.error("Error fetching user permissions:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Check specific permission
  app.post("/api/permissions/check", async (req: express.Request, res: express.Response) => {
    try {
      const permissionSchema = z.object({
        userId: z.string(),
        permission: z.enum([
          'CREATE_RESUME',
          'EXPORT_PDF',
          'EXPORT_DOCX',
          'USE_AI',
          'ACCESS_PREMIUM_TEMPLATES',
          'REMOVE_WATERMARK',
          'ACCESS_ANALYTICS',
          'ADMIN_ACCESS'
        ]),
        resourceId: z.string().optional()
      });

      const { userId, permission, resourceId } = permissionSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const activeSubscription = user.subscription[0];
      const planType = activeSubscription?.planType || user.tier || 'FREE';

      let hasPermission = false;

      switch (permission) {
        case 'CREATE_RESUME':
          const resumeCount = await prisma.resume.count({ where: { userId } });
          hasPermission = resumeCount < getMaxResumes(planType);
          break;
        case 'EXPORT_PDF':
          hasPermission = canExportPDF(planType);
          break;
        case 'EXPORT_DOCX':
          hasPermission = canExportDOCX(planType);
          break;
        case 'USE_AI':
          hasPermission = canUseAI(planType);
          break;
        case 'ACCESS_PREMIUM_TEMPLATES':
          hasPermission = canAccessPremiumTemplates(planType);
          break;
        case 'REMOVE_WATERMARK':
          hasPermission = canRemoveWatermark(planType);
          break;
        case 'ACCESS_ANALYTICS':
          hasPermission = canAccessAnalytics(planType);
          break;
        case 'ADMIN_ACCESS':
          hasPermission = user.tier === 'ADMIN';
          break;
      }

      res.json({
        userId,
        permission,
        hasPermission,
        planType,
        resourceId
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error checking permission:", error);
      res.status(500).json({ error: "Failed to check permission" });
    }
  });

  // Helper functions for permissions
  function getMaxResumes(planType: string): number {
    switch (planType) {
      case 'FREE': return 3;
      case 'BASIC': return 10;
      case 'PREMIUM': return 50;
      case 'ENTERPRISE': return -1; // Unlimited
      default: return 3;
    }
  }

  function getMaxTemplates(planType: string): number {
    switch (planType) {
      case 'FREE': return 5;
      case 'BASIC': return 15;
      case 'PREMIUM': return -1; // Unlimited
      case 'ENTERPRISE': return -1; // Unlimited
      default: return 5;
    }
  }

  function canExportPDF(planType: string): boolean {
    return ['BASIC', 'PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  function canExportDOCX(planType: string): boolean {
    return ['PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  function canUseAI(planType: string): boolean {
    return ['PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  function canAccessPremiumTemplates(planType: string): boolean {
    return ['PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  function canRemoveWatermark(planType: string): boolean {
    return ['BASIC', 'PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  function canAccessAnalytics(planType: string): boolean {
    return ['PREMIUM', 'ENTERPRISE'].includes(planType);
  }

  // Authentication Routes
  
  // User registration
  app.post("/api/auth/register", async (req: express.Request, res: express.Response) => {
    try {
      const userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1).optional(),
        username: z.string().min(1).optional()
      });

      const validatedData = userSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Create user (in production, hash the password)
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name || validatedData.username || validatedData.email.split('@')[0],
          password: validatedData.password, // TODO: Hash password in production
          currentTier: 'FREE',
          isActive: true
        }
      });

      // Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // Don't return password
      const { password, ...userResponse } = user;
      
      res.status(201).json({
        success: true,
        user: userResponse,
        token,
        id: user.id,
        userId: user.id,
        uid: user.id
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // User login
  app.post("/api/auth/login", async (req: express.Request, res: express.Response) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1)
      });

      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // TODO: In production, compare hashed password
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // Don't return password
      const { password: _, ...userResponse } = user;
      
      res.json({
        success: true,
        user: userResponse,
        token,
        id: user.id,
        userId: user.id
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error as any).message });
      }
      console.error("Error during login:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // User logout
  app.post("/api/auth/logout", async (req: express.Request, res: express.Response) => {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // For enhanced security, you could maintain a blacklist of tokens
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Register API routers
  app.use('/api/jobs', jobsRouter);
  app.use('/api/skills', skillsRouter);
  app.use('/api/professional-summaries', professionalSummariesRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/import-history', importHistoryRouter);

  console.log('✅ All routes registered successfully');
  
  const server = createServer(app);
  return server;
}