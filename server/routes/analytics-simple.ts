import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  getCurrentVisitorStats, 
  getDatabaseVisitorStats, 
  getAllVisitorSessions, 
  deleteVisitorSession, 
  deleteVisitorSessions, 
  clearAllVisitorSessions 
} from '../middleware/visitorTracking';

const router = Router();
const prisma = new PrismaClient();

// Test endpoint to check visitor tracking
router.get('/visitor-test', (req, res) => {
  const stats = getCurrentVisitorStats();
  console.log('🧪 Visitor test endpoint called');
  console.log('📊 Current visitor stats:', stats);
  res.json({
    message: 'Visitor tracking test',
    currentStats: stats,
    sessionInfo: req.visitorSession
  });
});

// Get database visitor stats
router.get('/database-stats', async (req, res) => {
  try {
    console.log('📊 Database visitor stats endpoint called');
    const stats = await getDatabaseVisitorStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching database visitor stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch database visitor stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all visitor sessions from database
router.get('/sessions', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    console.log('📋 Getting all visitor sessions from database');

    const sessions = await getAllVisitorSessions(parseInt(limit as string));

    res.json({
      sessions,
      total: sessions.length,
      message: 'Visitor sessions retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error fetching visitor sessions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch visitor sessions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a specific visitor session
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`🗑️ Deleting visitor session: ${sessionId}`);

    const success = await deleteVisitorSession(sessionId);

    if (success) {
      res.json({ 
        message: 'Visitor session deleted successfully',
        sessionId 
      });
    } else {
      res.status(404).json({ 
        error: 'Visitor session not found',
        sessionId 
      });
    }
  } catch (error) {
    console.error('❌ Error deleting visitor session:', error);
    res.status(500).json({ 
      error: 'Failed to delete visitor session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete multiple visitor sessions
router.delete('/sessions', async (req, res) => {
  try {
    const { sessionIds } = req.body;

    if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request. sessionIds must be a non-empty array' 
      });
    }

    console.log(`🗑️ Deleting ${sessionIds.length} visitor sessions`);

    const deletedCount = await deleteVisitorSessions(sessionIds);

    res.json({ 
      message: `${deletedCount} visitor sessions deleted successfully`,
      deletedCount,
      requestedCount: sessionIds.length
    });
  } catch (error) {
    console.error('❌ Error deleting visitor sessions:', error);
    res.status(500).json({ 
      error: 'Failed to delete visitor sessions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clear all visitor sessions
router.delete('/sessions/all', async (req, res) => {
  try {
    console.log('🗑️ Clearing all visitor sessions');

    const deletedCount = await clearAllVisitorSessions();

    res.json({ 
      message: `All visitor sessions cleared successfully`,
      deletedCount
    });
  } catch (error) {
    console.error('❌ Error clearing all visitor sessions:', error);
    res.status(500).json({ 
      error: 'Failed to clear all visitor sessions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get visitor session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`🔍 Getting visitor session details: ${sessionId}`);

    const session = await prisma.visitorAnalytics.findUnique({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            currentTier: true,
            isActive: true
          }
        },
        activities: {
          select: {
            id: true,
            activityType: true,
            activityName: true,
            description: true,
            pageUrl: true,
            templateId: true,
            templateType: true,
            templateName: true,
            downloadType: true,
            tier: true,
            successful: true,
            timestamp: true
          },
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ 
        error: 'Visitor session not found',
        sessionId 
      });
    }

    res.json({
      session,
      message: 'Visitor session details retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error fetching visitor session details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch visitor session details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get detailed visitor information (keeping existing functionality)
router.get('/visitors', async (req, res) => {
  try {
    console.log('👥 Detailed visitors endpoint called');

    // Get current visitor stats
    const visitorStats = getCurrentVisitorStats();

    // Get registered users with their details
    const registeredUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLoginAt: true,
        currentTier: true,
        isActive: true,
        downloads: {
          select: {
            id: true,
            templateName: true,
            templateType: true,
            downloadedAt: true
          },
          orderBy: {
            downloadedAt: 'desc'
          }
        },
        usageStats: {
          select: {
            snapTemplateDownloads: true,
            proTemplateDownloads: true,
            totalLoginDays: true,
            lastActiveDate: true
          }
        }
      },
      where: {
        isActive: true
      },
      orderBy: {
        lastLoginAt: 'desc'
      }
    });

    // Get unregistered users from active sessions
    const unregisteredUsers: { [key: string]: any } = {};

    // Get active sessions from database
    const activeDbSessions = await prisma.visitorAnalytics.findMany({
      where: {
        isRegistered: false,
        lastSeen: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      },
      include: {
        activities: {
          select: {
            templateName: true,
            templateType: true,
            downloadType: true,
            timestamp: true
          },
          where: {
            activityType: 'TEMPLATE_DOWNLOAD'
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        lastSeen: 'desc'
      }
    });

    // Process database sessions
    activeDbSessions.forEach(session => {
      const countryCode = session.country ? session.country.substring(0, 2).toUpperCase() : 'XX';

      unregisteredUsers[session.sessionId] = {
        id: session.sessionId,
        sessionId: session.sessionId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        country: session.country || 'Unknown',
        city: session.city || 'Unknown',
        deviceType: session.deviceType || 'Unknown',
        browserName: session.browserName || 'Unknown',
        isActive: true,
        lastSeen: session.lastSeen,
        firstVisit: session.firstVisit,
        totalSessions: session.totalSessions,
        totalPageViews: session.totalPageViews,
        totalDownloads: session.activities.length,
        snapDownloads: session.activities.filter(a => a.templateType === 'snap').length,
        proDownloads: session.activities.filter(a => a.templateType === 'pro').length,
        recentDownloads: session.activities.map(a => a.templateName).slice(0, 3)
      };
    });

    // Convert to array and add mock countries for registered users
    const unregisteredUsersArray = Object.values(unregisteredUsers);

    // Format registered users data
    const formattedRegisteredUsers = registeredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      country: getRandomCountry(), // Mock country - in real app, store user's country
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      currentTier: user.currentTier,
      isActive: user.isActive,
      totalDownloads: user.downloads.length,
      snapDownloads: user.downloads.filter(d => d.templateType === 'snap').length,
      proDownloads: user.downloads.filter(d => d.templateType === 'pro').length,
      totalSessions: user.usageStats?.totalLoginDays || 0,
      lastActiveAt: user.usageStats?.lastActiveDate || user.lastLoginAt,
      recentDownloads: user.downloads.slice(0, 5) // Last 5 downloads
    }));

    const data = {
      registered: formattedRegisteredUsers,
      unregistered: unregisteredUsersArray,
      summary: {
        totalRegistered: formattedRegisteredUsers.length,
        totalUnregistered: unregisteredUsersArray.length,
        totalActiveNow: visitorStats.totalActive,
        registeredActiveNow: visitorStats.registeredActive,
        unregisteredActiveNow: visitorStats.unregisteredActive
      }
    };

    console.log('✅ Detailed visitor data prepared successfully');
    res.json(data);

  } catch (error) {
    console.error('❌ Error fetching detailed visitor data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch detailed visitor data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Analytics dashboard requested');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get current visitor stats
    const visitorStats = getCurrentVisitorStats();
    const dbStats = await getDatabaseVisitorStats();

    // Get today's statistics
    const todayStats = await prisma.visitorAnalytics.aggregate({
      where: { firstVisit: { gte: today } },
      _count: { id: true }
    });

    const yesterdayStats = await prisma.visitorAnalytics.aggregate({
      where: { 
        firstVisit: { 
          gte: yesterday,
          lt: today
        }
      },
      _count: { id: true }
    });

    // Get download statistics from actual Download table
    const downloadsToday = await prisma.download.count({
      where: {
        downloadedAt: { gte: today }
      }
    });

    const downloadsYesterday = await prisma.download.count({
      where: {
        downloadedAt: { 
          gte: yesterday,
          lt: today
        }
      }
    });

    // Get registrations
    const registrationsToday = await prisma.user.count({
      where: { createdAt: { gte: today } }
    });

    const registrationsYesterday = await prisma.user.count({
      where: { 
        createdAt: { 
          gte: yesterday,
          lt: today
        }
      }
    });

    // Get top countries
    const topCountries = await prisma.geographicAnalytics.findMany({
      orderBy: { totalVisitors: 'desc' },
      take: 10
    });

    // Get popular templates from actual Download table
    const popularTemplates = await prisma.download.groupBy({
      by: ['templateName', 'templateType'],
      where: {
        downloadedAt: { gte: lastMonth }
      },
      _count: { templateName: true },
      orderBy: { _count: { templateName: 'desc' } },
      take: 10
    });

    // Get recent activity from memory analytics instead
    const memoryAnalytics = await import('../services/memoryAnalyticsService');
        const recentActivity = memoryAnalytics.default.getRecentActivities(20);

    const data = {
      overview: {
        activeVisitors: visitorStats.totalActive,
        registeredActive: visitorStats.registeredActive,
        unregisteredActive: visitorStats.unregisteredActive,
        todayVisitors: todayStats._count.id,
        yesterdayVisitors: yesterdayStats._count.id,
        visitorChange: yesterdayStats._count.id > 0 ? 
          ((todayStats._count.id - yesterdayStats._count.id) / yesterdayStats._count.id * 100) : 0,
        downloadsToday,
        downloadsYesterday,
        downloadChange: downloadsYesterday > 0 ? 
          ((downloadsToday - downloadsYesterday) / downloadsYesterday * 100) : 0,
        registrationsToday,
        registrationsYesterday,
        registrationChange: registrationsYesterday > 0 ? 
          ((registrationsToday - registrationsYesterday) / registrationsYesterday * 100) : 0
      },
      activeVisitors: dbStats.activeVisitors,
      topCountries,
      popularTemplates: popularTemplates.map(t => ({
        templateName: t.templateName,
        templateType: t.templateType,
        downloads: t._count.templateName
      })),
      recentActivity,
      countries: visitorStats.countries
    };

    console.log('✅ Analytics data prepared successfully');
    res.json(data);

  } catch (error) {
    console.error('❌ Error preparing analytics data:', error);
    res.status(500).json({ 
      error: 'Failed to prepare analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mock function to generate random countries
function getRandomCountry() {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
    'Australia', 'Japan', 'India', 'China', 'Brazil', 'Mexico', 'Russia',
    'South Korea', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway'
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

export default router; 