import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import { AnalyticsService } from '../services/analyticsService';

// Type definitions for analytics
type VisitorAnalyticsWithUser = {
  id: string;
  sessionId: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  deviceType?: string | null;
  browserName?: string | null;
  browserVersion?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  isRegistered: boolean;
  firstVisit: Date;
  lastSeen: Date;
  totalSessions: number;
  totalPageViews: number;
  sessionDuration?: number | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    currentTier: string;
  } | null;
};

type SessionAnalyticsWithUser = {
  id: string;
  sessionId: string;
  visitorId: string;
  userId?: string | null;
  startTime: Date;
  endTime?: Date | null;
  duration?: number | null;
  pageViews: number;
  pagesVisited?: any;
  bounceRate: boolean;
  exitPage?: string | null;
  conversionType?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
};

// Extended Request interface for analytics tracking
interface ExtendedRequest extends Request {
  sessionId?: string;
  visitorId?: string;
  userId?: string;
}

const router = Router();

// Initialize Prisma with error handling
let prisma: PrismaClient;
let analyticsServiceInstance: AnalyticsService;

try {
  prisma = new PrismaClient();
  analyticsServiceInstance = new AnalyticsService();
  console.log('✅ Analytics service initialized successfully');
} catch (error: unknown) {
  console.error('❌ Failed to initialize analytics service:', error);
}

// Get analytics dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Analytics dashboard request received:');
    console.log('  startDate:', req.query.startDate);
    console.log('  endDate:', req.query.endDate);
    console.log('  Query params:', req.query);

    // Check if analytics service is initialized
    if (!analyticsServiceInstance || !prisma) {
      console.error('❌ Analytics service not properly initialized');
      return res.status(500).json({ 
        error: 'Analytics service not available',
        details: 'Database connection not established'
      });
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const data = await analyticsServiceInstance.getDashboardData(startDate && endDate ? { start: startDate, end: endDate } : undefined);
    res.json(data);
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get country analytics
router.get('/countries', async (req: Request, res: Response) => {
  try {
    const data = await analyticsServiceInstance.getCountryAnalytics();
    res.json(data);
  } catch (error: unknown) {
    console.error('Error fetching country analytics:', error);
    res.status(500).json({ error: 'Failed to fetch country analytics' });
  }
});

// Get template analytics
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const templateType = type as 'snap' | 'pro' | undefined;

    const data = await analyticsServiceInstance.getTemplateAnalytics(templateType);
    res.json(data);
  } catch (error: unknown) {
    console.error('Error fetching template analytics:', error);
    res.status(500).json({ error: 'Failed to fetch template analytics' });
  }
});

// Get visitor analytics
router.get('/visitors', async (req: Request, res: Response) => {
  try {
    // Check if prisma is initialized and has the visitorAnalytics model
    if (!prisma) {
      return res.status(500).json({ error: 'Database not available' });
    }

    // Check if the visitorAnalytics table exists
    if (!prisma.visitorAnalytics) {
      console.warn('⚠️ visitorAnalytics table not found, returning empty array');
      return res.json([]);
    }

    const { startDate, endDate, limit = 50 } = req.query;

    const whereClause: {
      createdAt?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Get all visitors
    const visitors = await prisma.visitorAnalytics.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            currentTier: true
          }
        }
      }
    });

    // Get active users (last 30 minutes)
    const activeThreshold = new Date(Date.now() - 30 * 60 * 1000);
    const activeVisitors = await prisma.visitorAnalytics.findMany({
      where: {
        lastSeen: { gte: activeThreshold }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            currentTier: true
          }
        }
      }
    });

    // Separate registered and unregistered visitors
    const registeredVisitors = visitors.filter((v: VisitorAnalyticsWithUser) => v.isRegistered && v.user);
    const unregisteredVisitors = visitors.filter((v: VisitorAnalyticsWithUser) => !v.isRegistered || !v.user);

    // Count active users
    const activeRegistered = activeVisitors.filter((v: VisitorAnalyticsWithUser) => v.isRegistered && v.user).length;
    const activeUnregistered = activeVisitors.filter((v: VisitorAnalyticsWithUser) => !v.isRegistered || !v.user).length;

    // Transform data for frontend
    const registered = registeredVisitors.map((v: VisitorAnalyticsWithUser) => ({
      id: v.userId || v.id,
      name: v.user?.name || 'Unknown',
      email: v.user?.email || 'Unknown',
      country: v.country || 'Unknown',
      createdAt: v.createdAt.toISOString(),
      lastLoginAt: v.lastSeen.toISOString(),
      currentTier: v.user?.currentTier || 'FREE',
      isActive: v.lastSeen > activeThreshold,
      totalDownloads: 0, // TODO: Get from activity logs
      snapDownloads: 0,
      proDownloads: 0,
      totalSessions: v.totalSessions,
      lastActiveAt: v.lastSeen.toISOString(),
      recentDownloads: []
    }));

    const unregistered = unregisteredVisitors.map((v: VisitorAnalyticsWithUser) => ({
      anonymousId: v.sessionId,
      userAgent: v.userAgent || 'Unknown',
      country: v.country || 'Unknown',
      totalDownloads: 0,
      snapDownloads: 0,
      proDownloads: 0,
      lastActivity: v.lastSeen.toISOString(),
      downloads: []
    }));

    const summary = {
      totalRegistered: registeredVisitors.length,
      totalUnregistered: unregisteredVisitors.length,
      totalActiveNow: activeVisitors.length,
      registeredActiveNow: activeRegistered,
      unregisteredActiveNow: activeUnregistered
    };

    res.json({
      registered,
      unregistered,
      summary
    });
  } catch (error: unknown) {
    console.error('Error fetching visitor analytics:', error);
    res.status(500).json({ error: 'Failed to fetch visitor analytics' });
  }
});

// Get activity logs
router.get('/activities', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, activityType, limit = 100 } = req.query;

    const startTimestamp = startDate ? new Date(startDate as string).getTime() : undefined;
    const endTimestamp = endDate ? new Date(endDate as string).getTime() : undefined;

    // Activity logs now handled by memory analytics
    const memoryAnalytics = await import('../services/memoryAnalyticsService');
    let activities = memoryAnalytics.default.getRecentActivities(parseInt(limit as string));

    // Filter by date range if provided
    if (startTimestamp && endTimestamp) {
      activities = activities.filter(activity => 
        activity.timestamp >= startTimestamp && activity.timestamp <= endTimestamp
      );
    }

    // Filter by activity type if provided
    if (activityType) {
      activities = activities.filter(activity => activity.activityType === activityType);
    }

    res.json(activities);
  } catch (error: unknown) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Get session analytics
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = '50' } = req.query;

    const whereClause: {
      startTime?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const sessions = await prisma.sessionAnalytics.findMany({
      where: whereClause,
      orderBy: { startTime: 'desc' },
      take: parseInt(limit as string),
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

    res.json(sessions);
  } catch (error: unknown) {
    console.error('Error fetching session analytics:', error);
    res.status(500).json({ error: 'Failed to fetch session analytics' });
  }
});

// Get analytics summary by date range
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause: {
      date?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const summaries = await prisma.analyticsSummary.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    });

    res.json(summaries);
  } catch (error: unknown) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

// Get real-time statistics
router.get('/realtime', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    // Check if prisma is initialized
    if (!prisma) {
      return res.status(500).json({ error: 'Database not available' });
    }

    let todayVisitors = 0;
    try {
      if (prisma.visitorAnalytics) {
        todayVisitors = await prisma.visitorAnalytics.count({
          where: { 
            firstVisit: { gte: last24Hours }
          }
        });
      } else {
        console.warn('⚠️ visitorAnalytics model not available on prisma client');
        todayVisitors = 0;
      }
    } catch (error) {
      console.warn('⚠️ Error accessing visitorAnalytics table:', error);
      todayVisitors = 0;
    }

    const todayRegistrations = await prisma.user.count({
      where: {
        createdAt: { gte: todayStart }
      }
    });

    const todayDownloads = await prisma.download.count({
      where: {
        downloadedAt: { gte: todayStart }
      }
    });

    // Get active users from memory analytics (last hour)
    const memoryAnalytics = await import('../services/memoryAnalyticsService');
    const realtimeStats = memoryAnalytics.default.getRealtimeStats();
    const activeUsers = realtimeStats.summary.totalActiveSessions || 0;

    // Get total registered users from database (real-time)
    const totalRegisteredUsers = await prisma.user.count();

    // Get total subscribers (users with active subscriptions)
    const totalSubscribers = await prisma.user.count({
      where: {
        subscriptionStatus: 'ACTIVE'
      }
    });

    // Get total downloads from database (real-time)
    const totalSnapDownloads = await prisma.download.count({
      where: { templateType: 'snap' }
    });

    const totalProDownloads = await prisma.download.count({
      where: { templateType: 'pro' }
    });

    const totalDownloads = totalSnapDownloads + totalProDownloads;

    // Get top countries today
    const topCountries = await prisma.geographicAnalytics.findMany({
      where: { lastUpdated: { gte: todayStart } },
      orderBy: { totalVisitors: 'desc' },
      take: 5
    });

    // Get most downloaded templates today
    const topTemplates = await prisma.download.groupBy({
      by: ['templateId', 'templateType', 'templateName'],
      where: {
        downloadedAt: { gte: todayStart }
      },
      _count: {
        templateId: true
      },
      orderBy: {
        _count: {
          templateId: 'desc'
        }
      },
      take: 5
    });

    res.json({
      todayVisitors,
      newRegistrations: todayRegistrations,
      todayDownloads,
      activeUsers,
      totalRegisteredUsers,
      totalSubscribers,
      totalSnapDownloads,
      totalProDownloads,
      totalDownloads,
      topCountries,
      topTemplates
    });
  } catch (error: unknown) {
    console.error('Error fetching real-time statistics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time statistics' });
  }
});

// Generate daily summary (admin endpoint)
router.post('/generate-summary', async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();

    const summary = await analyticsServiceInstance.generateDailySummary(targetDate);
    res.json(summary);
  } catch (error: unknown) {
    console.error('Error generating daily summary:', error);
    res.status(500).json({ error: 'Failed to generate daily summary' });
  }
});

// Get conversion funnel data
router.get('/funnel', async (req: Request, res: Response) => {
  try {
    const { funnelType, startDate, endDate } = req.query;

    const whereClause: {
      funnelType?: string;
      completedAt?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    if (funnelType) {
      whereClause.funnelType = funnelType as string;
    }
    if (startDate && endDate) {
      whereClause.completedAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const funnelData = await prisma.conversionFunnel.findMany({
      where: whereClause,
      orderBy: { completedAt: 'desc' }
    });

    // Group by funnel type and step
    interface FunnelAnalysisItem {
      funnelType: string;
      step: string;
      stepOrder: number;
      count: number;
      totalTime: number;
      avgTime: number;
    }

    const funnelAnalysis = funnelData.reduce((acc: Record<string, FunnelAnalysisItem>, item: {
      id: number;
      funnelType: string;
      step: string;
      stepOrder: number;
      timeToComplete?: number;
      completedAt: Date;
    }) => {
      const key = `${item.funnelType}-${item.step}`;
      if (!acc[key]) {
        acc[key] = {
          funnelType: item.funnelType,
          step: item.step,
          stepOrder: item.stepOrder,
          count: 0,
          totalTime: 0,
          avgTime: 0
        };
      }
      acc[key].count++;
      if (item.timeToComplete) {
        acc[key].totalTime += item.timeToComplete;
      }
      return acc;
    }, {} as Record<string, FunnelAnalysisItem>);

    // Calculate averages
    Object.values(funnelAnalysis).forEach((item) => {
      if (item.totalTime > 0) {
        item.avgTime = item.totalTime / item.count;
      }
    });

    res.json(Object.values(funnelAnalysis));
  } catch (error: unknown) {
    console.error('Error fetching conversion funnel:', error);
    res.status(500).json({ error: 'Failed to fetch conversion funnel' });
  }
});

// Track custom event endpoint
router.post('/track', async (req: Request, res: Response) => {
  try {
    const {
      activityType,
      activityName,
      description,
      metadata,
      templateId,
      templateType,
      templateName,
      downloadType,
      pageUrl,
      tier,
      value,
      duration,
      successful,
      errorMessage
    } = req.body;

    const extendedReq = req as ExtendedRequest;
    const sessionId = extendedReq.sessionId;
    const visitorId = extendedReq.visitorId;
    const userId = extendedReq.userId;

    if (!sessionId || !visitorId) {
      return res.status(400).json({ error: 'Session not found' });
    }

    await analyticsServiceInstance.trackActivity({
      sessionId,
      visitorId,
      userId,
      activityType,
      activityName,
      description,
      metadata,
      templateId,
      templateType,
      templateName,
      downloadType,
      pageUrl,
      tier,
      value,
      duration,
      successful,
      errorMessage
    });

    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Error tracking custom event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get real-time statistics
router.get('/real-time', async (req: Request, res: Response) => {
  try {
    // Check if prisma is initialized
    if (!prisma) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check if visitorAnalytics table exists
    if (!prisma.visitorAnalytics) {
      console.warn('⚠️ visitorAnalytics table not found, returning default values');
      return res.json({
        onlineUsers: 0,
        recentActivity: 0,
        timestamp: now.toISOString()
      });
    }

    const recentActivity = await prisma.visitorAnalytics.count({
      where: {
        timestamp: {
          gte: oneHourAgo
        }
      }
    });

    const onlineUsers = await prisma.visitorAnalytics.count({
      where: {
        timestamp: {
          gte: new Date(now.getTime() - 5 * 60 * 1000) // Last 5 minutes
        }
      }
    });

    res.json({
      onlineUsers,
      recentActivity,
      timestamp: now.toISOString()
    });
  } catch (error: unknown) {
    console.error('Error fetching real-time statistics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time statistics' });
  }
});

export default router;