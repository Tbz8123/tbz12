import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

// Use global prisma instance or create a new one
const prisma = global.prisma || new PrismaClient();

// In-memory storage for active visitors - keeping for backwards compatibility
interface VisitorSession {
  sessionId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
  isRegistered: boolean;
  country?: string;
  city?: string;
}

// Store active sessions in memory (for fast access)
const activeSessions = new Map<string, VisitorSession>();

// Clean up inactive sessions every 2 minutes (both memory and database)
setInterval(() => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  console.log(`🧹 Cleaning up inactive sessions... Current sessions: ${activeSessions.size}`);

  // Clean up memory sessions
  for (const [sessionId, session] of activeSessions) {
    if (session.lastActivity < fiveMinutesAgo) {
      console.log(`🗑️ Removing inactive session: ${sessionId}`);
      activeSessions.delete(sessionId);
    }
  }

  // Clean up database sessions (older than 30 minutes)
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  cleanupDatabaseSessions(thirtyMinutesAgo);

  console.log(`✅ Cleanup complete. Active sessions: ${activeSessions.size}`);
}, 2 * 60 * 1000); // 2 minutes

// Clean up database sessions older than specified time
async function cleanupDatabaseSessions(cutoffTime: Date) {
  try {
    const deletedSessions = await globalPrisma.visitorAnalytics.deleteMany({
      where: {
        lastSeen: {
          lt: cutoffTime
        }
      }
    });

    if (deletedSessions.count > 0) {
      console.log(`🗑️ Database cleanup: Removed ${deletedSessions.count} old sessions`);
    }
  } catch (error) {
    console.error('Error cleaning up database sessions:', error);
  }
}

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extract IP address from request
function getClientIP(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         '127.0.0.1';
}

// Visitor tracking middleware
export function trackVisitor(req: Request, res: Response, next: NextFunction) {
  // Skip tracking for static files, health checks, and most API routes
  // BUT track analytics dashboard requests to count admin visits
  if ((req.path.startsWith('/api/') && !req.path.includes('/api/analytics/dashboard')) || 
      req.path.includes('.css') || 
      req.path.includes('.js') || 
      req.path.includes('.ico') || 
      req.path.includes('.png') || 
      req.path.includes('.jpg') || 
      req.path === '/health' ||
      req.method !== 'GET') {
    return next();
  }

  console.log(`🔍 Tracking visitor for: ${req.method} ${req.path}`);

  const ipAddress = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  let sessionId = req.cookies?.sessionId;

  // Generate new session ID if not exists
  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  // Get or create session in database
  handleVisitorSession(sessionId, ipAddress, userAgent, req.path)
    .then(session => {
      // Update memory cache for fast access
      activeSessions.set(sessionId, {
        sessionId: session.sessionId,
        userId: session.userId || undefined,
        ipAddress: session.ipAddress || ipAddress,
        userAgent: session.userAgent || userAgent,
        lastActivity: new Date(),
        isRegistered: session.isRegistered,
        country: session.country || undefined,
        city: session.city || undefined
      });

      console.log(`${session.isNewSession ? '👤 New visitor session created' : '🔄 Existing visitor activity updated'}: ${sessionId}`);

      // Get updated stats
      const stats = getCurrentVisitorStats();
      console.log(`📊 Current stats: ${stats.totalActive} active, ${stats.registeredActive} registered, ${stats.unregisteredActive} unregistered`);

      // Add session info to request for other middleware
      req.visitorSession = session;
    })
    .catch(error => {
      console.error('Error handling visitor session:', error);
      // Continue with request even if tracking fails
    });

  next();
}

// Handle visitor session in database
async function handleVisitorSession(sessionId: string, ipAddress: string, userAgent: string, currentPath: string) {
  try {
    // Skip database operations if prisma is not available
    const globalPrisma = (global as any).prisma;
    if (!globalPrisma) {
      console.warn('⚠️ Database not available, skipping visitor tracking');
      return { sessionId, isNewSession: false, ipAddress, userAgent };
    }

    // Check if session exists in database
    const existingSession = await globalPrisma.visitorAnalytics.findUnique({
      where: { sessionId }
    });

    if (existingSession) {
      // Update existing session
      const updatedSession = await globalPrisma.visitorAnalytics.update({
        where: { sessionId },
        data: {
          lastSeen: new Date(),
          totalPageViews: { increment: 1 }
        }
      });

      // Track page view
      await trackPageView(sessionId, existingSession.id, currentPath);

      return {
        ...updatedSession,
        isNewSession: false
      };
    } else {
      // Create new session with upsert to handle race conditions
      const geoInfo = await getGeoInfo(ipAddress);

      // Check if user is registered (based on IP or other available info)
      const user = await findUserByIP(ipAddress);

      const deviceInfo = parseUserAgent(userAgent);

      // Use upsert to handle race conditions where multiple requests might try to create the same session
      const newSession = await globalPrisma.visitorAnalytics.upsert({
        where: { sessionId },
        create: {
          sessionId,
          userId: user?.id,
          ipAddress,
          userAgent,
          country: geoInfo.country,
          city: geoInfo.city,
          deviceType: deviceInfo.deviceType,
          browserName: deviceInfo.browserName,
          browserVersion: deviceInfo.browserVersion,
          osName: deviceInfo.osName,
          osVersion: deviceInfo.osVersion,
          landingPage: currentPath,
          isRegistered: !!user,
          firstVisit: new Date(),
          lastSeen: new Date(),
          totalPageViews: 1,
          totalSessions: 1
        },
        update: {
          lastSeen: new Date(),
          totalPageViews: { increment: 1 }
        }
      });

      // Only do the following if this is actually a new session (not an update)
      if (newSession.firstVisit.getTime() === newSession.lastSeen.getTime()) {
        // Update geographic analytics
        if (geoInfo.country && geoInfo.countryCode) {
          await updateGeographicAnalytics(geoInfo.country, geoInfo.countryCode, !!user);
        }

        // Track initial activity using new analytics system
        const { analyticsService } = await import('../services/analyticsService');
        await analyticsService.trackActivity({
          sessionId: sessionId,
          visitorId: newSession.id,
          userId: user?.id,
          activityType: 'PAGE_VIEW',
          activityName: 'session_start',
          description: `New ${user ? 'registered' : 'anonymous'} visitor session started`,
          metadata: {
            country: geoInfo.country,
            city: geoInfo.city,
            deviceType: deviceInfo.deviceType,
            browserName: deviceInfo.browserName,
            isFirstVisit: true
          },
          pageUrl: currentPath,
          tier: user?.currentTier || 'free',
          successful: true
        });

        // Update usage stats for registered users
        if (user) {
          await prisma.usageStats.upsert({
            where: { userId: user.id },
            update: { 
              lastActiveDate: new Date(),
              totalLoginDays: { increment: 1 }
            },
            create: {
              userId: user.id,
              lastActiveDate: new Date(),
              totalLoginDays: 1
            }
          });
        }
      }

      return {
        ...newSession,
        isNewSession: newSession.firstVisit.getTime() === newSession.lastSeen.getTime()
      };
    }
  } catch (error) {
    console.error('Error handling visitor session:', error);
    throw error;
  }
}

// Track page view using new analytics system
async function trackPageView(sessionId: string, visitorId: string, pageUrl: string) {
  try {
    // Get user ID and context from session
    const session = await prisma.visitorAnalytics.findUnique({
      where: { sessionId },
      select: { 
        userId: true, 
        country: true, 
        deviceType: true, 
        referrer: true, 
        userAgent: true,
        user: {
          select: {
            currentTier: true
          }
        }
      }
    });

    // Import analytics service dynamically to avoid circular dependency
    const { analyticsService } = await import('../services/analyticsService');

    // Track using the new analytics system (GA4 + Memory)
    await analyticsService.trackActivity({
      sessionId: sessionId,
      visitorId: visitorId,
      userId: session?.userId,
      activityType: 'PAGE_VIEW',
      activityName: 'page_view',
      description: `Page viewed: ${pageUrl}`,
      pageUrl: pageUrl,
      successful: true,
      userTier: session?.user?.currentTier,
      country: session?.country,
      deviceType: session?.deviceType,
      referrer: session?.referrer,
      userAgent: session?.userAgent
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Find user by IP address (or other available info)
async function findUserByIP(ipAddress: string): Promise<any> {
  try {
    // This is a placeholder - in a real system you might track user IPs differently
    // For now, we'll return null for anonymous users
    return null;
  } catch (error) {
    console.error('Error finding user by IP:', error);
    return null;
  }
}

// Update geographic analytics
async function updateGeographicAnalytics(country: string, countryCode: string, isRegistered: boolean) {
  try {
    if (!country || country === 'Unknown') return;

    const existing = await prisma.geographicAnalytics.findUnique({
      where: { country }
    });

    if (existing) {
      await prisma.geographicAnalytics.update({
        where: { country },
        data: {
          totalVisitors: { increment: 1 },
          ...(isRegistered && { registeredUsers: { increment: 1 } }),
          ...(!isRegistered && { unregisteredUsers: { increment: 1 } }),
          lastUpdated: new Date()
        }
      });
    } else {
      await prisma.geographicAnalytics.create({
        data: {
          country,
          countryCode,
          totalVisitors: 1,
          registeredUsers: isRegistered ? 1 : 0,
          unregisteredUsers: isRegistered ? 0 : 1,
          snapDownloads: 0,
          proDownloads: 0,
          totalDownloads: 0,
          subscriptions: 0,
          conversionRate: 0,
          lastUpdated: new Date()
        }
      });
    }

    console.log(`📊 Updated geographic analytics for ${country}`);
  } catch (error) {
    console.error('Error updating geographic analytics:', error);
  }
}

// Update geographic downloads
async function updateGeographicDownloads(country: string, countryCode: string, templateType: string) {
  try {
    if (!country || country === 'Unknown') return;

    const existing = await prisma.geographicAnalytics.findUnique({
      where: { country }
    });

    if (existing) {
      const updateData: any = {
        totalDownloads: { increment: 1 },
        lastUpdated: new Date()
      };

      if (templateType === 'snap') {
        updateData.snapDownloads = { increment: 1 };
      } else if (templateType === 'pro') {
        updateData.proDownloads = { increment: 1 };
      }

      await prisma.geographicAnalytics.update({
        where: { country },
        data: updateData
      });
    } else {
      // Create new record if it doesn't exist
      await prisma.geographicAnalytics.create({
        data: {
          country,
          countryCode,
          totalVisitors: 0,
          registeredUsers: 0,
          unregisteredUsers: 0,
          snapDownloads: templateType === 'snap' ? 1 : 0,
          proDownloads: templateType === 'pro' ? 1 : 0,
          totalDownloads: 1,
          subscriptions: 0,
          conversionRate: 0,
          lastUpdated: new Date()
        }
      });
    }

    console.log(`📊 Updated geographic downloads for ${country} (${templateType})`);
  } catch (error) {
    console.error('Error updating geographic downloads:', error);
  }
}

// Real geo info using ip-api.com (free service)
async function getGeoInfo(ip: string): Promise<{country?: string, city?: string, countryCode?: string}> {
  // For localhost or private IPs, return a default
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return { country: 'Local Network', city: 'Local', countryCode: 'LOCAL' };
  }

  try {
    console.log(`🌍 Getting geo info for IP: ${ip}`);

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,lat,lon,timezone,query`);
    const data = await response.json();

    if (data.status === 'success') {
      console.log(`📍 Geo info found: ${data.country}, ${data.city} (${data.regionName})`);
      return {
        country: data.country,
        city: data.city,
        countryCode: data.countryCode
      };
    } else {
      console.log(`❌ Geo lookup failed: ${data.message || 'Unknown error'}`);
      return { country: 'Unknown', city: 'Unknown', countryCode: 'XX' };
    }
  } catch (error) {
    console.error('Error getting geo info:', error);
    return { country: 'Unknown', city: 'Unknown', countryCode: 'XX' };
  }
}

// Parse user agent for device information
function parseUserAgent(userAgent: string): {
  deviceType: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
} {
  const ua = userAgent.toLowerCase();

  // Device type detection
  let deviceType = 'desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
  }

  // Browser detection
  let browserName = 'unknown';
  let browserVersion = 'unknown';

  if (ua.includes('chrome')) {
    browserName = 'chrome';
    const match = ua.match(/chrome\/(\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('firefox')) {
    browserName = 'firefox';
    const match = ua.match(/firefox\/(\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('safari')) {
    browserName = 'safari';
    const match = ua.match(/version\/(\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('edge')) {
    browserName = 'edge';
    const match = ua.match(/edge\/(\d+)/);
    if (match) browserVersion = match[1];
  }

  // OS detection
  let osName = 'unknown';
  let osVersion = 'unknown';

  if (ua.includes('windows')) {
    osName = 'windows';
    if (ua.includes('windows nt 10')) osVersion = '10';
    else if (ua.includes('windows nt 6.3')) osVersion = '8.1';
    else if (ua.includes('windows nt 6.2')) osVersion = '8';
    else if (ua.includes('windows nt 6.1')) osVersion = '7';
  } else if (ua.includes('mac os x')) {
    osName = 'macos';
    const match = ua.match(/mac os x (\d+_\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  } else if (ua.includes('linux')) {
    osName = 'linux';
  } else if (ua.includes('android')) {
    osName = 'android';
    const match = ua.match(/android (\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    osName = 'ios';
    const match = ua.match(/os (\d+_\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  }

  return {
    deviceType,
    browserName,
    browserVersion,
    osName,
    osVersion
  };
}



// Export function to get current visitor stats (now from database + memory)
export function getCurrentVisitorStats() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // Get active sessions from memory (for performance)
  let totalActive = 0;
  let registeredActive = 0;
  const countries = new Map<string, number>();

  for (const session of activeSessions.values()) {
    if (session.lastActivity >= fiveMinutesAgo) {
      totalActive++;
      if (session.isRegistered) {
        registeredActive++;
      }

      if (session.country) {
        countries.set(session.country, (countries.get(session.country) || 0) + 1);
      }
    }
  }

  return {
    totalActive,
    registeredActive,
    unregisteredActive: totalActive - registeredActive,
    recentVisitors: totalActive, // Same as total active for now
    countries: Array.from(countries.entries()).map(([country, count]) => ({ country, count }))
  };
}

// Export function to get database visitor stats
export async function getDatabaseVisitorStats() {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const activeVisitors = await prisma.visitorAnalytics.findMany({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo
        }
      },
      select: {
        sessionId: true,
        userId: true,
        isRegistered: true,
        country: true,
        city: true,
        lastSeen: true
      }
    });

    const totalActive = activeVisitors.length;
    const registeredActive = activeVisitors.filter(v => v.isRegistered).length;
    const countries = new Map<string, number>();

    activeVisitors.forEach(visitor => {
      if (visitor.country) {
        countries.set(visitor.country, (countries.get(visitor.country) || 0) + 1);
      }
    });

    return {
      totalActive,
      registeredActive,
      unregisteredActive: totalActive - registeredActive,
      recentVisitors: totalActive,
      countries: Array.from(countries.entries()).map(([country, count]) => ({ country, count })),
      activeVisitors
    };
  } catch (error) {
    console.error('Error getting database visitor stats:', error);
    return {
      totalActive: 0,
      registeredActive: 0,
      unregisteredActive: 0,
      recentVisitors: 0,
      countries: [],
      activeVisitors: []
    };
  }
}

// Export function to get all visitor sessions from database
export async function getAllVisitorSessions(limit: number = 100) {
  try {
    const sessions = await prisma.visitorAnalytics.findMany({
      take: limit,
      orderBy: { lastSeen: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            currentTier: true
          }
        },
        activities: {
          select: {
            activityType: true,
            activityName: true,
            pageUrl: true,
            timestamp: true
          },
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    return sessions;
  } catch (error) {
    console.error('Error getting all visitor sessions:', error);
    return [];
  }
}

// Export function to delete visitor session
export async function deleteVisitorSession(sessionId: string) {
  try {
    // Delete from database
    await prisma.visitorAnalytics.delete({
      where: { sessionId }
    });

    // Delete from memory
    activeSessions.delete(sessionId);

    console.log(`🗑️ Deleted visitor session: ${sessionId}`);
    return true;
  } catch (error) {
    console.error('Error deleting visitor session:', error);
    return false;
  }
}

// Export function to delete multiple visitor sessions
export async function deleteVisitorSessions(sessionIds: string[]) {
  try {
    // Delete from database
    const result = await prisma.visitorAnalytics.deleteMany({
      where: {
        sessionId: {
          in: sessionIds
        }
      }
    });

    // Delete from memory
    sessionIds.forEach(sessionId => {
      activeSessions.delete(sessionId);
    });

    console.log(`🗑️ Deleted ${result.count} visitor sessions`);
    return result.count;
  } catch (error) {
    console.error('Error deleting visitor sessions:', error);
    return 0;
  }
}

// Export function to clear all visitor sessions
export async function clearAllVisitorSessions() {
  try {
    // Clear database
    const result = await prisma.visitorAnalytics.deleteMany({});

    // Clear memory
    activeSessions.clear();

    console.log(`🗑️ Cleared all visitor sessions: ${result.count} deleted`);
    return result.count;
  } catch (error) {
    console.error('Error clearing all visitor sessions:', error);
    return 0;
  }
}

// Middleware to track template downloads
export function trackTemplateDownload(req: Request, res: Response, next: NextFunction) {
  // Store original send function
  const originalSend = res.send;

  res.send = function(body: any) {
    // Only track if response is successful
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const sessionId = req.cookies?.sessionId;
      if (sessionId) {
        const { templateId } = req.params;
        const { templateType = 'snap', downloadType = 'pdf' } = req.body;

        // Get template name from body or default
        const templateName = req.body.templateName || `Template ${templateId}`;

        // Track download event asynchronously
        trackDownloadEvent(sessionId, {
          templateId,
          templateType,
          templateName,
          downloadType
        }).catch(console.error);
      }
    }

    // Call original send function
    return originalSend.call(this, body);
  };

  next();
}

// Track download event in database
async function trackDownloadEvent(sessionId: string, downloadData: any) {
  try {
    const session = await prisma.visitorAnalytics.findUnique({
      where: { sessionId },
      select: { id: true, userId: true, country: true, countryCode: true }
    });

    if (session) {
      // Track download using new analytics system
      const { analyticsService } = await import('../services/analyticsService');
      await analyticsService.trackActivity({
        sessionId: sessionId,
        visitorId: session.id,
        userId: session.userId,
        activityType: 'TEMPLATE_DOWNLOAD',
        activityName: 'template_download',
        description: `Downloaded template: ${downloadData.templateName}`,
        templateId: downloadData.templateId,
        templateType: downloadData.templateType,
        templateName: downloadData.templateName,
        downloadType: downloadData.downloadType,
        tier: downloadData.templateType === 'pro' ? 'pro' : 'free',
        successful: true
      });

      // Update geographic analytics for downloads
      if (session.country && session.countryCode) {
        await updateGeographicDownloads(session.country, session.countryCode, downloadData.templateType);
      }
    }
  } catch (error) {
    console.error('Error tracking download event:', error);
  }
}

// Extend Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      visitorSession?: any; // Changed to any as the type is no longer VisitorSession
    }
  }
} 