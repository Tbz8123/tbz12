import { PrismaClient, Prisma } from '@prisma/client';
import gaService from './googleAnalyticsService';
import memoryAnalytics from './memoryAnalyticsService';

// Type definitions
interface TrackVisitorData {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  landingPage?: string;
}

interface TrackSessionData {
  sessionId: string;
  visitorId: string;
  userId?: string;
  startTime?: Date;
}

interface TrackActivityData {
  sessionId: string;
  visitorId: string;
  userId?: string;
  activityType: string;
  activityName: string;
  description?: string;
  metadata?: Record<string, any>;
  templateId?: string;
  templateType?: string;
  templateName?: string;
  downloadType?: string;
  pageUrl?: string;
  tier?: string;
  value?: number;
  duration?: number;
  successful?: boolean;
  errorMessage?: string;
  userTier?: string;
  country?: string;
  deviceType?: string;
  referrer?: string;
  userAgent?: string;
}

interface TrackTemplateDownloadData {
  sessionId: string;
  visitorId: string;
  userId?: string;
  templateId: string;
  templateType: 'snap' | 'pro';
  templateName: string;
  downloadType: string;
  successful?: boolean;
}

interface TrackUserRegistrationData {
  sessionId: string;
  visitorId: string;
  userId: string;
  conversionValue?: number;
}

interface TrackSubscriptionData {
  sessionId: string;
  visitorId: string;
  userId: string;
  subscriptionTier: string;
  value: number;
}

interface SessionContext {
  userTier?: string;
  country?: string;
  deviceType?: string;
  referrer?: string;
  userAgent?: string;
}

interface GeoData {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
}

interface UserAgentData {
  deviceType: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
}

const prisma = new PrismaClient();

// Helper function to get country from IP
const getCountryFromIP = async (ip: string): Promise<GeoData> => {
  try {
    // In production, you'd use a service like IP2Location, MaxMind, or ipapi.co
    // For now, we'll use a simple fallback
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json() as {
      country?: string;
      countryCode?: string;
      city?: string;
      regionName?: string;
    };

    return {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      city: data.city,
      region: data.regionName
    };
  } catch (error) {
    console.error('Error fetching country from IP:', error);
    return { country: 'Unknown', countryCode: 'XX' };
  }
};

// Helper function to parse user agent
const parseUserAgent = (userAgent: string): UserAgentData => {
  const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 
                    /Tablet|iPad/.test(userAgent) ? 'tablet' : 'desktop';

  let browserName = 'Unknown';
  let browserVersion = '';
  let osName = 'Unknown';
  let osVersion = '';

  // Simple browser detection
  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  }

  // Simple OS detection
  if (userAgent.includes('Windows')) {
    osName = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('Mac OS')) {
    osName = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_.]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('Linux')) {
    osName = 'Linux';
  }

  return { deviceType, browserName, browserVersion, osName, osVersion };
};

export class AnalyticsService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Track a new visitor or update existing visitor
  async trackVisitor(data: TrackVisitorData): Promise<Prisma.VisitorAnalyticsGetPayload<{}>> {
    try {
      const { sessionId, userId, ipAddress, userAgent, referrer, landingPage } = data;

      // Check if visitor already exists
      const existingVisitor = await prisma.visitorAnalytics.findUnique({
        where: { sessionId }
      });

      if (existingVisitor) {
        // Update existing visitor
        return await prisma.visitorAnalytics.update({
          where: { sessionId },
          data: {
            lastSeen: new Date(),
            totalSessions: { increment: 1 },
            userId: userId || existingVisitor.userId
          }
        });
      }

      // Get geographic data
      const geoData: GeoData = ipAddress ? await getCountryFromIP(ipAddress) : { country: 'Unknown', countryCode: 'XX' };

      // Parse user agent
      const userAgentData: UserAgentData = userAgent ? parseUserAgent(userAgent) : { deviceType: 'unknown', browserName: 'unknown', browserVersion: '', osName: 'unknown', osVersion: '' };

      // Create new visitor
      const visitor = await prisma.visitorAnalytics.create({
        data: {
          sessionId,
          userId,
          ipAddress,
          userAgent,
          country: geoData.country,
          city: geoData.city,
          region: geoData.region,
          referrer,
          landingPage,
          isRegistered: !!userId,
          ...userAgentData
        }
      });

      // Update geographic analytics
      await this.updateGeographicAnalytics(geoData.country, geoData.countryCode, !!userId);

      return visitor;
    } catch (error) {
      console.error('Error tracking visitor:', error);
      throw error;
    }
  }

  // Track a session
  async trackSession(data: TrackSessionData): Promise<Prisma.SessionAnalyticsGetPayload<{}>> {
    try {
      const { sessionId, visitorId, userId, startTime } = data;

      return await prisma.sessionAnalytics.create({
        data: {
          sessionId,
          visitorId,
          userId,
          startTime: startTime || new Date()
        }
      });
    } catch (error) {
      console.error('Error tracking session:', error);
      throw error;
    }
  }

  // End a session
  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await prisma.sessionAnalytics.findFirst({
        where: { sessionId }
      });

      if (session) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

        await prisma.sessionAnalytics.update({
          where: { id: session.id },
          data: {
            endTime,
            duration,
            bounceRate: session.pageViews <= 1
          }
        });
      }
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  // Track an activity - Now using Google Analytics and Memory Analytics instead of database
  async trackActivity(data: TrackActivityData): Promise<void> {
    try {
      console.log('📊 Tracking activity:', data.activityType, data.activityName);

      // Get additional context from session if available
      const sessionData = await this.getSessionContext(data.sessionId);
      const enhancedData = {
        ...data,
        userTier: data.userTier || sessionData?.userTier,
        country: data.country || sessionData?.country,
        deviceType: data.deviceType || sessionData?.deviceType
      };

      // Track in memory analytics for real-time dashboard
      const memoryData = {
        sessionId: enhancedData.sessionId,
        userId: enhancedData.userId,
        activityType: enhancedData.activityType,
        activityName: enhancedData.activityName,
        description: enhancedData.description,
        metadata: enhancedData.metadata,
        templateId: enhancedData.templateId,
        templateType: enhancedData.templateType as 'snap' | 'pro' | undefined,
        templateName: enhancedData.templateName,
        downloadType: enhancedData.downloadType as 'pdf' | 'docx' | 'txt' | undefined,
        pageUrl: enhancedData.pageUrl,
        userTier: enhancedData.userTier,
        country: enhancedData.country,
        deviceType: enhancedData.deviceType,
        successful: enhancedData.successful,
        errorMessage: enhancedData.errorMessage
      };
      memoryAnalytics.trackActivity(memoryData);

      // Track in Google Analytics based on activity type
      let gaSuccess = false;

      switch (data.activityType) {
        case 'PAGE_VIEW':
          gaSuccess = await gaService.trackPageView({
            sessionId: data.sessionId,
            userId: data.userId,
            pageUrl: data.pageUrl || '',
            pageTitle: data.description,
            referrer: data.referrer || enhancedData.referrer,
            userAgent: data.userAgent || enhancedData.userAgent,
            country: enhancedData.country,
            deviceType: enhancedData.deviceType,
            userTier: enhancedData.userTier
          });
          break;

        case 'TEMPLATE_DOWNLOAD':
          gaSuccess = await gaService.trackTemplateDownload({
            sessionId: data.sessionId,
            userId: data.userId,
            templateId: data.templateId!,
            templateName: data.templateName!,
            templateType: data.templateType as 'snap' | 'pro',
            downloadType: data.downloadType as 'pdf' | 'docx' | 'txt',
            userTier: enhancedData.userTier,
            successful: data.successful
          });
          break;

        case 'TEMPLATE_VIEW':
          gaSuccess = await gaService.trackTemplateView({
            sessionId: data.sessionId,
            userId: data.userId,
            templateId: data.templateId!,
            templateName: data.templateName!,
            templateType: data.templateType as 'snap' | 'pro',
            userTier: enhancedData.userTier
          });
          break;

        case 'USER_REGISTRATION':
          gaSuccess = await gaService.trackUserRegistration({
            sessionId: data.sessionId,
            userId: data.userId!,
            userTier: data.userTier || 'FREE',
            method: data.metadata?.method
          });
          break;

        case 'USER_LOGIN':
          gaSuccess = await gaService.trackUserLogin({
            sessionId: data.sessionId,
            userId: data.userId!,
            userTier: data.userTier || 'FREE',
            method: data.metadata?.method
          });
          break;

        case 'SUBSCRIPTION_START':
          gaSuccess = await gaService.trackSubscription({
            sessionId: data.sessionId,
            userId: data.userId!,
            subscriptionType: data.metadata?.subscriptionType || 'upgrade',
            fromTier: data.metadata?.fromTier || 'FREE',
            toTier: data.metadata?.toTier || 'PREMIUM',
            value: data.value
          });
          break;

        case 'SEARCH_QUERY':
          gaSuccess = await gaService.trackSearch({
            sessionId: data.sessionId,
            userId: data.userId,
            searchTerm: data.metadata?.searchTerm || '',
            category: data.metadata?.category || 'general',
            results: data.metadata?.results || 0,
            userTier: enhancedData.userTier
          });
          break;

        case 'ERROR_OCCURRED':
          gaSuccess = await gaService.trackError({
            sessionId: data.sessionId,
            userId: data.userId,
            errorMessage: data.errorMessage || data.description || 'Unknown error',
            errorType: data.metadata?.errorType,
            pageUrl: data.pageUrl,
            userTier: enhancedData.userTier
          });
          break;

        case 'FEATURE_USED':
          gaSuccess = await gaService.trackFeatureUsage({
            sessionId: data.sessionId,
            userId: data.userId,
            featureName: data.activityName,
            featureData: data.metadata,
            userTier: enhancedData.userTier
          });
          break;

        default:
          // Track as custom event
          gaSuccess = await gaService.trackCustomEvent({
            sessionId: data.sessionId,
            userId: data.userId,
            eventName: data.activityName,
            eventParams: {
              activity_type: data.activityType,
              description: data.description,
              template_id: data.templateId,
              template_type: data.templateType,
              template_name: data.templateName,
              download_type: data.downloadType,
              page_url: data.pageUrl,
              tier: data.tier,
              value: data.value,
              duration: data.duration,
              successful: data.successful,
              error_message: data.errorMessage,
              ...data.metadata
            },
            userTier: enhancedData.userTier
          });
      }

      // Update session page views if it's a page view (keep this for dashboard)
      if (data.activityType === 'PAGE_VIEW') {
        await this.updateSessionPageViews(data.sessionId, data.pageUrl);
      }

      // Update template analytics if it's a template-related activity (keep this for dashboard)
      if (data.templateId && data.templateType) {
        await this.updateTemplateAnalytics(data.templateId, data.templateType, data.templateName, data.activityType);
      }

      console.log(`📊 Activity tracked - GA: ${gaSuccess ? '✅' : '❌'}, Memory: ✅`);
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  // Get session context for enhanced tracking
  private async getSessionContext(sessionId: string): Promise<SessionContext | null> {
    try {
      const visitor = await prisma.visitorAnalytics.findUnique({
        where: { sessionId },
        include: {
          user: {
            select: {
              currentTier: true
            }
          }
        }
      });

      if (!visitor) return null;

      return {
        userTier: visitor.user?.currentTier || (visitor.isRegistered ? 'FREE' : undefined),
        country: visitor.country || undefined,
        deviceType: visitor.deviceType || undefined,
        referrer: visitor.referrer || undefined,
        userAgent: visitor.userAgent || undefined
      };
    } catch (error) {
      console.error('Error getting session context:', error);
      return null;
    }
  }

  // Track template download
  async trackTemplateDownload(data: TrackTemplateDownloadData) {
    try {
      // Track the activity
      await this.trackActivity({
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        userId: data.userId,
        activityType: 'TEMPLATE_DOWNLOAD',
        activityName: 'template_download',
        description: `Downloaded ${data.templateType} template: ${data.templateName}`,
        templateId: data.templateId,
        templateType: data.templateType,
        templateName: data.templateName,
        downloadType: data.downloadType,
        tier: data.templateType,
        successful: data.successful !== undefined ? data.successful : true
      });

      // Update usage stats for registered users
      if (data.userId) {
        await this.updateUserUsageStats(data.userId, data.templateType);
      }

      // Update geographic analytics
      const visitor = await prisma.visitorAnalytics.findUnique({
        where: { sessionId: data.sessionId }
      });

      if (visitor && visitor.country) {
        await this.updateGeographicDownloads(visitor.country, 'XX', data.templateType);
      }

      return true;
    } catch (error) {
      console.error('Error tracking template download:', error);
      throw error;
    }
  }

  // Track user registration
  async trackUserRegistration(data: TrackUserRegistrationData) {
    try {
      await this.trackActivity({
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        userId: data.userId,
        activityType: 'USER_REGISTRATION',
        activityName: 'user_registration',
        description: 'User completed registration',
        value: data.conversionValue || 0
      });

      // Update visitor to mark as registered
      await prisma.visitorAnalytics.update({
        where: { sessionId: data.sessionId },
        data: {
          isRegistered: true,
          userId: data.userId
        }
      });

      // Update geographic analytics
      const visitor = await prisma.visitorAnalytics.findUnique({
        where: { sessionId: data.sessionId }
      });

      if (visitor && visitor.country) {
        await this.updateGeographicRegistrations(visitor.country, 'XX');
      }

      return true;
    } catch (error) {
      console.error('Error tracking user registration:', error);
      throw error;
    }
  }

  // Track subscription
  async trackSubscription(data: TrackSubscriptionData) {
    try {
      await this.trackActivity({
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        userId: data.userId,
        activityType: 'SUBSCRIPTION_START',
        activityName: 'subscription_start',
        description: `Started ${data.subscriptionTier} subscription`,
        tier: data.subscriptionTier,
        value: data.value
      });

      // Update geographic analytics
      const visitor = await prisma.visitorAnalytics.findUnique({
        where: { sessionId: data.sessionId }
      });

      if (visitor && visitor.country) {
        await this.updateGeographicSubscriptions(visitor.country, 'XX');
      }

      return true;
    } catch (error) {
      console.error('Error tracking subscription:', error);
      throw error;
    }
  }

  // Update session page views
  private async updateSessionPageViews(sessionId: string, pageUrl?: string) {
    try {
      const session = await prisma.sessionAnalytics.findFirst({
        where: { sessionId }
      });

      if (session) {
        const pagesVisited = session.pagesVisited as string[] || [];
        if (pageUrl && !pagesVisited.includes(pageUrl)) {
          pagesVisited.push(pageUrl);
        }

        await prisma.sessionAnalytics.update({
          where: { id: session.id },
          data: {
            pageViews: { increment: 1 },
            pagesVisited
          }
        });
      }
    } catch (error) {
      console.error('Error updating session page views:', error);
    }
  }

  // Update template analytics
  private async updateTemplateAnalytics(templateId: string, templateType: string, templateName?: string, activityType?: string) {
    try {
      const existing = await prisma.templateAnalytics.findUnique({
        where: { templateId_templateType: { templateId, templateType } }
      });

      if (existing) {
        const updateData: any = { lastViewedAt: new Date() };

        if (activityType === 'TEMPLATE_VIEW') {
          updateData.totalViews = { increment: 1 };
          updateData.uniqueVisitors = { increment: 1 };
        } else if (activityType === 'TEMPLATE_DOWNLOAD') {
          updateData.totalDownloads = { increment: 1 };
        }

        await prisma.templateAnalytics.update({
          where: { templateId_templateType: { templateId, templateType } },
          data: updateData
        });
      } else {
        await prisma.templateAnalytics.create({
          data: {
            templateId,
            templateName: templateName || `Template ${templateId}`,
            templateType,
            totalViews: activityType === 'TEMPLATE_VIEW' ? 1 : 0,
            totalDownloads: activityType === 'TEMPLATE_DOWNLOAD' ? 1 : 0,
            uniqueVisitors: 1
          }
        });
      }
    } catch (error) {
      console.error('Error updating template analytics:', error);
    }
  }

  // Update user usage stats
  private async updateUserUsageStats(userId: string, templateType: 'snap' | 'pro') {
    try {
      const existing = await prisma.usageStats.findUnique({
        where: { userId }
      });

      if (existing) {
        const updateData: any = { resumesDownloaded: { increment: 1 } };

        if (templateType === 'snap') {
          updateData.snapTemplateDownloads = { increment: 1 };
          updateData.monthlySnapDownloads = { increment: 1 };
        } else if (templateType === 'pro') {
          updateData.proTemplateDownloads = { increment: 1 };
          updateData.monthlyProDownloads = { increment: 1 };
        }

        await prisma.usageStats.update({
          where: { userId },
          data: updateData
        });
      } else {
        await prisma.usageStats.create({
          data: {
            userId,
            resumesDownloaded: 1,
            snapTemplateDownloads: templateType === 'snap' ? 1 : 0,
            proTemplateDownloads: templateType === 'pro' ? 1 : 0,
            monthlySnapDownloads: templateType === 'snap' ? 1 : 0,
            monthlyProDownloads: templateType === 'pro' ? 1 : 0
          }
        });
      }
    } catch (error) {
      console.error('Error updating user usage stats:', error);
    }
  }

  // Update geographic analytics
  private async updateGeographicAnalytics(country: string, countryCode: any, isRegistered: boolean) {
    try {
      const existing = await prisma.geographicAnalytics.findUnique({
        where: { country }
      });

      if (existing) {
        const updateData: any = {
          totalVisitors: { increment: 1 },
          lastUpdated: new Date()
        };

        if (isRegistered) {
          updateData.registeredUsers = { increment: 1 };
        } else {
          updateData.unregisteredUsers = { increment: 1 };
        }

        await prisma.geographicAnalytics.update({
          where: { country },
          data: updateData
        });
      } else {
        await prisma.geographicAnalytics.create({
          data: {
            country,
            countryCode,
            totalVisitors: 1,
            registeredUsers: isRegistered ? 1 : 0,
            unregisteredUsers: isRegistered ? 0 : 1
          }
        });
      }
    } catch (error) {
      console.error('Error updating geographic analytics:', error);
    }
  }

  // Update geographic downloads
  private async updateGeographicDownloads(country: string, countryCode: any, templateType: 'snap' | 'pro') {
    try {
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
      }
    } catch (error) {
      console.error('Error updating geographic downloads:', error);
    }
  }

  // Update geographic registrations
  private async updateGeographicRegistrations(country: string, countryCode: any) {
    try {
      const existing = await prisma.geographicAnalytics.findUnique({
        where: { country }
      });

      if (existing) {
        const updateData: any = {
          registeredUsers: { increment: 1 },
          unregisteredUsers: { decrement: 1 },
          lastUpdated: new Date()
        };

        await prisma.geographicAnalytics.update({
          where: { country },
          data: updateData
        });
      }
    } catch (error) {
      console.error('Error updating geographic registrations:', error);
    }
  }

  // Update geographic subscriptions
  private async updateGeographicSubscriptions(country: string, countryCode: any) {
    try {
      const existing = await prisma.geographicAnalytics.findUnique({
        where: { country }
      });

      if (existing) {
        const updateData: any = {
          subscriptions: { increment: 1 },
          lastUpdated: new Date()
        };

        await prisma.geographicAnalytics.update({
          where: { country },
          data: updateData
        });
      }
    } catch (error) {
      console.error('Error updating geographic subscriptions:', error);
    }
  }

  // Get analytics dashboard data
  async getDashboardData(dateRange?: { start: Date; end: Date }) {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      console.log(`📊 Analytics request - Date range: ${dateRange ? `${dateRange.start.toISOString()} to ${dateRange.end.toISOString()}` : 'No filter'}`);
      console.log(`📊 Today start: ${todayStart.toISOString()}`);

      // For visitor analytics, always use the rolling 24-hour window for "today's" data
      let totalVisitors = 0;
      let registeredUsers = 0;
      
      try {
        totalVisitors = await prisma.visitorAnalytics.count({ 
          where: { firstVisit: { gte: last24Hours } } 
        });
        registeredUsers = await prisma.visitorAnalytics.count({ 
          where: { 
            firstVisit: { gte: last24Hours },
            isRegistered: true 
          } 
        });
      } catch (error) {
        console.warn('⚠️ visitorAnalytics table not found, using default values:', error);
        totalVisitors = 0;
        registeredUsers = 0;
      }
      const unregisteredUsers = totalVisitors - registeredUsers;

      console.log(`📊 Visitor stats - Total: ${totalVisitors}, Registered: ${registeredUsers}, Unregistered: ${unregisteredUsers}`);

      // For filtered data (when date range is provided), use the actual date range
      let filteredRegisteredUsers, filteredSnapDownloads, filteredProDownloads, filteredNewRegistrations;

      if (dateRange) {
        // Ensure we're comparing dates correctly
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        // If it's the same day, set end time to end of day
        if (startDate.toDateString() === endDate.toDateString()) {
          endDate.setHours(23, 59, 59, 999);
        }

        console.log(`📅 Using date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

        // Get new registrations for the date range
        filteredNewRegistrations = await prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
        console.log(`📊 New registrations found: ${filteredNewRegistrations}`);

        // Get downloads for the date range
        filteredSnapDownloads = await prisma.download.count({
          where: { 
            templateType: 'snap',
            downloadedAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
        console.log(`📊 Snap downloads found: ${filteredSnapDownloads}`);

        filteredProDownloads = await prisma.download.count({
          where: { 
            templateType: 'pro',
            downloadedAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
        console.log(`📊 Pro downloads found: ${filteredProDownloads}`);

        // Get registered users for the date range (for total count)
        filteredRegisteredUsers = await prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
        console.log(`📊 Filtered registered users: ${filteredRegisteredUsers}`);

      } else {
        // No date filter - get all-time totals
        filteredRegisteredUsers = await prisma.user.count();
        filteredSnapDownloads = await prisma.download.count({ where: { templateType: 'snap' } });
        filteredProDownloads = await prisma.download.count({ where: { templateType: 'pro' } });
        filteredNewRegistrations = await prisma.user.count({ where: { createdAt: { gte: todayStart } } });

        console.log(`📊 All-time totals - Users: ${filteredRegisteredUsers}, Snap: ${filteredSnapDownloads}, Pro: ${filteredProDownloads}, New: ${filteredNewRegistrations}`);
      }

      // Get total subscribers (filtered or all-time)
      let totalSubscribers;
      if (dateRange) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        if (startDate.toDateString() === endDate.toDateString()) {
          endDate.setHours(23, 59, 59, 999);
        }
        totalSubscribers = await prisma.user.count({
          where: {
            subscriptionStatus: 'ACTIVE',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
      } else {
        totalSubscribers = await prisma.user.count({
          where: { subscriptionStatus: 'ACTIVE' }
        });
      }

      console.log(`📊 Total subscribers: ${totalSubscribers}`);

      // Get geographic data
      const geographicData = await prisma.geographicAnalytics.findMany({
        where: { totalVisitors: { gt: 0 } },
        orderBy: { totalVisitors: 'desc' },
        take: 10
      });

      // Get top templates (use filtered data if date range provided)
      let templateDownloads;
      if (dateRange) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        if (startDate.toDateString() === endDate.toDateString()) {
          endDate.setHours(23, 59, 59, 999);
        }
        templateDownloads = await prisma.download.groupBy({
          by: ['templateId', 'templateType', 'templateName'],
          where: {
            downloadedAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: { templateId: true },
          orderBy: { _count: { templateId: 'desc' } },
          take: 10
        });
      } else {
        templateDownloads = await prisma.download.groupBy({
          by: ['templateId', 'templateType', 'templateName'],
          _count: { templateId: true },
          orderBy: { _count: { templateId: 'desc' } },
          take: 10
        });
      }

      const topTemplates = templateDownloads.map((template: any) => ({
         templateId: template.templateId,
         templateName: template.templateName || `Template ${template.templateId}`,
        templateType: template.templateType,
        totalDownloads: template._count.templateId,
        totalViews: template._count.templateId * 2,
        conversionRate: 50
      }));

      // Get active users from memory analytics
      const realtimeStats = memoryAnalytics.getRealtimeStats();
      const activeUsers = realtimeStats.summary.totalActiveSessions || 0;

      // Get recent activities from memory analytics
      const recentActivities = memoryAnalytics.getRecentActivities(50);

      const allTimeDownloads = filteredSnapDownloads + filteredProDownloads;

      console.log(`📊 Final results - Total Downloads: ${allTimeDownloads}, Active Users: ${activeUsers}`);

      return {
        overview: {
          totalVisitors,
          registeredUsers: filteredRegisteredUsers,
          unregisteredUsers,
          snapDownloads: filteredSnapDownloads,
          proDownloads: filteredProDownloads,
          totalDownloads: allTimeDownloads,
          newRegistrations: filteredNewRegistrations,
          activeUsers,
          totalRegisteredUsers: filteredRegisteredUsers,
          totalSubscribers,
          totalSnapDownloads: filteredSnapDownloads,
          totalProDownloads: filteredProDownloads,
          allTimeDownloads,
          conversionRate: totalVisitors > 0 ? (filteredRegisteredUsers / totalVisitors) * 100 : 0
        },
        geographicData,
        topTemplates,
        recentActivities
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // Get country analytics
  async getCountryAnalytics() {
    try {
      return await prisma.geographicAnalytics.findMany({
        where: { totalVisitors: { gt: 0 } },
        orderBy: { totalVisitors: 'desc' }
      });
    } catch (error) {
      console.error('Error getting country analytics:', error);
      throw error;
    }
  }

  // Get template analytics
  async getTemplateAnalytics(templateType?: 'snap' | 'pro') {
    try {
      const whereClause = templateType ? { templateType } : {};

      // Get template analytics from actual download data
      const templateDownloads = await prisma.download.groupBy({
        by: ['templateId', 'templateType', 'templateName'],
        where: whereClause,
        _count: {
          templateId: true
        },
        orderBy: {
          _count: {
            templateId: 'desc'
          }
        }
      });

      // Transform to match expected format
      return templateDownloads.map((template: any) => ({
        templateId: template.templateId,
        templateName: template.templateName || `Template ${template.templateId}`,
        templateType: template.templateType,
        totalDownloads: template._count.templateId,
        totalViews: template._count.templateId * 2, // Estimate views as 2x downloads
        uniqueVisitors: template._count.templateId, // Estimate unique visitors same as downloads
        conversionRate: 50, // Estimate 50% conversion rate
        lastViewedAt: new Date() // Current time as estimate
      }));
    } catch (error) {
      console.error('Error getting template analytics:', error);
      throw error;
    }
  }

  // Generate daily summary
  async generateDailySummary(date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const whereClause = {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      };

      // Get daily statistics
      const totalVisitors = await prisma.visitorAnalytics.count({ where: whereClause });
      const newVisitors = await prisma.visitorAnalytics.count({ 
        where: { ...whereClause, firstVisit: { gte: startOfDay, lte: endOfDay } } 
      });
      const registeredUsers = await prisma.visitorAnalytics.count({ 
        where: { ...whereClause, isRegistered: true } 
      });

      const snapDownloads = await prisma.download.count({
        where: { 
          templateType: 'snap',
          downloadedAt: { gte: startOfDay, lte: endOfDay }
        }
      });

      const proDownloads = await prisma.download.count({
        where: { 
          templateType: 'pro',
          downloadedAt: { gte: startOfDay, lte: endOfDay }
        }
      });

      const newRegistrations = await prisma.user.count({
        where: { 
          createdAt: { gte: startOfDay, lte: endOfDay }
        }
      });

      // Subscriptions tracking would need to be implemented differently
      // For now, using a placeholder
      const newSubscriptions = 0;

      // Create or update summary
      const summary = await prisma.analyticsSummary.upsert({
        where: { date: startOfDay },
        update: {
          totalVisitors,
          newVisitors,
          returningVisitors: totalVisitors - newVisitors,
          registeredUsers,
          unregisteredUsers: totalVisitors - registeredUsers,
          newRegistrations,
          snapDownloads,
          proDownloads,
          totalDownloads: snapDownloads + proDownloads,
          newSubscriptions,
          conversionRate: totalVisitors > 0 ? (registeredUsers / totalVisitors) * 100 : 0
        },
        create: {
          date: startOfDay,
          totalVisitors,
          newVisitors,
          returningVisitors: totalVisitors - newVisitors,
          registeredUsers,
          unregisteredUsers: totalVisitors - registeredUsers,
          newRegistrations,
          snapDownloads,
          proDownloads,
          totalDownloads: snapDownloads + proDownloads,
          newSubscriptions,
          conversionRate: totalVisitors > 0 ? (registeredUsers / totalVisitors) * 100 : 0
        }
      });

      return summary;
    } catch (error) {
      console.error('Error generating daily summary:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();