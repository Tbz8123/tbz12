import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    currentTier: string;
    usageStats?: any;
  };
}

// Define usage limits by tier
const USAGE_LIMITS = {
  FREE: {
    monthlyResumes: 3,
    monthlyDownloads: 5,
    monthlyTemplateAccess: 2,
    aiSuggestions: 0,
    proTemplates: false,
    exportFormats: ['pdf'],
    customBranding: false
  },
  BASIC: {
    monthlyResumes: 10,
    monthlyDownloads: 20,
    monthlyTemplateAccess: 5,
    aiSuggestions: 10,
    proTemplates: true,
    exportFormats: ['pdf', 'docx'],
    customBranding: false
  },
  PREMIUM: {
    monthlyResumes: -1, // unlimited
    monthlyDownloads: -1,
    monthlyTemplateAccess: -1,
    aiSuggestions: -1,
    proTemplates: true,
    exportFormats: ['pdf', 'docx', 'txt', 'html'],
    customBranding: true
  },
  ENTERPRISE: {
    monthlyResumes: -1,
    monthlyDownloads: -1,
    monthlyTemplateAccess: -1,
    aiSuggestions: -1,
    proTemplates: true,
    exportFormats: ['pdf', 'docx', 'txt', 'html', 'json'],
    customBranding: true
  }
};

// Middleware to check if user has reached their usage limits
export const checkUsageLimit = (limitType: keyof typeof USAGE_LIMITS.FREE) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const firebaseUid = req.params.uid || req.body.userId || req.user?.firebaseUid;

      if (!firebaseUid) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Get user with usage stats
      const user = await prisma.user.findUnique({
        where: { firebaseUid },
        include: { usageStats: true }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userTier = user.currentTier as keyof typeof USAGE_LIMITS;
      const limits = USAGE_LIMITS[userTier];
      const stats = user.usageStats;

      if (!limits) {
        return res.status(400).json({ message: 'Invalid user tier' });
      }

      // Check if limit is unlimited (-1)
      if (limits[limitType] === -1) {
        req.user = { ...user, usageStats: stats };
        return next();
      }

      // Check specific limits
      let currentUsage = 0;
      let limitValue = limits[limitType];

      switch (limitType) {
        case 'monthlyResumes':
          currentUsage = stats?.monthlyResumes || 0;
          break;
        case 'monthlyDownloads':
          currentUsage = stats?.monthlyDownloads || 0;
          break;
        case 'monthlyTemplateAccess':
          currentUsage = stats?.monthlyTemplateAccess || 0;
          break;
        case 'aiSuggestions':
          currentUsage = stats?.aiSuggestionsUsed || 0;
          break;
        default:
          return res.status(400).json({ message: 'Invalid limit type' });
      }

      // Check if user has exceeded their limit
      if (typeof limitValue === 'number' && currentUsage >= limitValue) {
        return res.status(429).json({
          message: `Usage limit exceeded for ${limitType}`,
          currentUsage,
          limit: limitValue,
          tier: userTier,
          upgradeRequired: true
        });
      }

      // Add user info to request for further processing
      req.user = { ...user, usageStats: stats };
      next();
    } catch (error) {
      console.error('Usage limit check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check feature access
export const checkFeatureAccess = (feature: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const firebaseUid = req.params.uid || req.body.userId || req.user?.firebaseUid;

      if (!firebaseUid) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await prisma.user.findUnique({
        where: { firebaseUid },
        include: { permissions: true }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userTier = user.currentTier as keyof typeof USAGE_LIMITS;
      const limits = USAGE_LIMITS[userTier];

      // Check tier-based access
      let hasAccess = false;

      switch (feature) {
        case 'pro_templates':
          hasAccess = limits.proTemplates;
          break;
        case 'custom_branding':
          hasAccess = limits.customBranding;
          break;
        case 'export_docx':
          hasAccess = limits.exportFormats.includes('docx');
          break;
        case 'export_multiple_formats':
          hasAccess = limits.exportFormats.length > 1;
          break;
        case 'ai_suggestions':
          hasAccess = limits.aiSuggestions > 0 || limits.aiSuggestions === -1;
          break;
        default:
          // Check explicit permissions
          hasAccess = user.permissions.some(p => p.permission === feature);
      }

      if (!hasAccess) {
        return res.status(403).json({
          message: `Access denied for feature: ${feature}`,
          tier: userTier,
          upgradeRequired: true
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Feature access check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to automatically track usage
export const trackUsageMiddleware = (action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Execute the main request first
      const originalSend = res.send;

      res.send = function(body) {
        // Only track if request was successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          trackUsageAsync(req.user?.firebaseUid || req.params.uid, action, {
            endpoint: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
          });
        }
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Usage tracking middleware error:', error);
      next(); // Continue without tracking
    }
  };
};

// Async function to track usage without blocking the response
async function trackUsageAsync(firebaseUid: string, action: string, metadata: any) {
  try {
    if (!firebaseUid) return;

    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) return;

    const updateData: any = {
      lastActiveDate: new Date()
    };

    switch (action) {
      case 'resume_created':
        updateData.resumesCreated = { increment: 1 };
        updateData.monthlyResumes = { increment: 1 };
        break;
      case 'resume_downloaded':
        updateData.resumesDownloaded = { increment: 1 };
        updateData.monthlyDownloads = { increment: 1 };
        break;
      case 'template_accessed':
        updateData.templatesUsed = { increment: 1 };
        updateData.monthlyTemplateAccess = { increment: 1 };
        break;
      case 'ai_suggestion_used':
        updateData.aiSuggestionsUsed = { increment: 1 };
        break;
      case 'pro_template_accessed':
        updateData.proTemplatesAccessed = { increment: 1 };
        break;
    }

    await prisma.usageStats.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
        resumesCreated: action === 'resume_created' ? 1 : 0,
        resumesDownloaded: action === 'resume_downloaded' ? 1 : 0,
        templatesUsed: action === 'template_accessed' ? 1 : 0,
        monthlyResumes: action === 'resume_created' ? 1 : 0,
        monthlyDownloads: action === 'resume_downloaded' ? 1 : 0,
        monthlyTemplateAccess: action === 'template_accessed' ? 1 : 0,
        aiSuggestionsUsed: action === 'ai_suggestion_used' ? 1 : 0,
        proTemplatesAccessed: action === 'pro_template_accessed' ? 1 : 0,
        totalLoginDays: 1
      }
    });
  } catch (error) {
    console.error('Async usage tracking error:', error);
  }
}

// Middleware to check if user needs monthly reset
export const checkMonthlyReset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const firebaseUid = req.params.uid || req.body.userId || req.user?.firebaseUid;

    if (!firebaseUid) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: { usageStats: true }
    });

    if (!user || !user.usageStats) {
      return next();
    }

    const lastReset = new Date(user.usageStats.lastMonthlyReset);
    const now = new Date();
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    // Reset if it's been more than 30 days
    if (daysSinceReset >= 30) {
      await prisma.usageStats.update({
        where: { userId: user.id },
        data: {
          monthlyResumes: 0,
          monthlyDownloads: 0,
          monthlyTemplateAccess: 0,
          lastMonthlyReset: now
        }
      });
    }

    next();
  } catch (error) {
    console.error('Monthly reset check error:', error);
    next(); // Continue without reset
  }
};

export { USAGE_LIMITS }; 