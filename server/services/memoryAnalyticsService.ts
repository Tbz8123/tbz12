// In-Memory Analytics Service for Real-time Data
import { EventEmitter } from 'events';

// Types
interface ActivityEvent {
  id: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  activityType: string;
  activityName: string;
  description?: string;
  metadata?: Record<string, any>;
  templateId?: string;
  templateType?: 'snap' | 'pro';
  templateName?: string;
  downloadType?: 'pdf' | 'docx' | 'txt';
  pageUrl?: string;
  tier?: string;
  userTier?: string;
  country?: string;
  deviceType?: string;
  successful?: boolean;
  errorMessage?: string;
}

interface VisitorSession {
  sessionId: string;
  userId?: string;
  userTier?: string;
  country?: string;
  deviceType?: string;
  browserName?: string;
  osName?: string;
  isRegistered: boolean;
  firstSeen: number;
  lastSeen: number;
  pageViews: number;
  activities: string[]; // Activity IDs
  referrer?: string;
  landingPage?: string;
}

interface TemplateStats {
  templateId: string;
  templateName: string;
  templateType: 'snap' | 'pro';
  views: number;
  downloads: number;
  uniqueVisitors: Set<string>;
  lastActivity: number;
}

interface CountryStats {
  country: string;
  visitors: number;
  registeredUsers: number;
  snapDownloads: number;
  proDownloads: number;
  totalDownloads: number;
  lastActivity: number;
}

class MemoryAnalyticsService extends EventEmitter {
  private activities: Map<string, ActivityEvent> = new Map();
  private sessions: Map<string, VisitorSession> = new Map();
  private templateStats: Map<string, TemplateStats> = new Map();
  private countryStats: Map<string, CountryStats> = new Map();
  private recentActivities: ActivityEvent[] = [];
  private maxRecentActivities = 100;
  private maxActivities = 10000; // Keep last 10k activities in memory
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    super();

    // Cleanup old data every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000); // 1 hour
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanup() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    // Clean up old activities (keep only last 24 hours)
    for (const [id, activity] of this.activities.entries()) {
      if (activity.timestamp < oneDayAgo) {
        this.activities.delete(id);
      }
    }

    // Clean up old sessions (keep only last 24 hours)
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastSeen < oneDayAgo) {
        this.sessions.delete(sessionId);
      }
    }

    // Clean up old template stats (reset daily)
    for (const [templateId, stats] of this.templateStats.entries()) {
      if (stats.lastActivity < oneDayAgo) {
        this.templateStats.delete(templateId);
      }
    }

    // Clean up old country stats (reset daily)
    for (const [country, stats] of this.countryStats.entries()) {
      if (stats.lastActivity < oneDayAgo) {
        this.countryStats.delete(country);
      }
    }

    // Limit activities to max size
    if (this.activities.size > this.maxActivities) {
      const sortedActivities = Array.from(this.activities.entries())
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .slice(0, this.maxActivities);

      this.activities.clear();
      sortedActivities.forEach(([id, activity]) => {
        this.activities.set(id, activity);
      });
    }

    console.log(`🧹 Memory Analytics cleanup: ${this.activities.size} activities, ${this.sessions.size} sessions`);
  }

  // Track activity
  trackActivity(data: {
    sessionId: string;
    userId?: string;
    activityType: string;
    activityName: string;
    description?: string;
    metadata?: Record<string, any>;
    templateId?: string;
    templateType?: 'snap' | 'pro';
    templateName?: string;
    downloadType?: 'pdf' | 'docx' | 'txt';
    pageUrl?: string;
    tier?: string;
    userTier?: string;
    country?: string;
    deviceType?: string;
    successful?: boolean;
    errorMessage?: string;
  }): ActivityEvent {
    const activity: ActivityEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...(data as any)
    };

    // Store activity
    this.activities.set(activity.id, activity);

    // Add to recent activities
    this.recentActivities.unshift(activity);
    if (this.recentActivities.length > this.maxRecentActivities) {
      this.recentActivities = this.recentActivities.slice(0, this.maxRecentActivities);
    }

    // Update session
    this.updateSession(activity);

    // Update template stats
    if (activity.templateId && activity.templateType) {
      this.updateTemplateStats(activity);
    }

    // Update country stats
    if (activity.country) {
      this.updateCountryStats(activity);
    }

    // Emit event for real-time updates
    this.emit('activity', activity);

    return activity;
  }

  private updateSession(activity: ActivityEvent) {
    let session = this.sessions.get(activity.sessionId);

    if (!session) {
      session = {
        sessionId: activity.sessionId,
        userId: activity.userId,
        userTier: activity.userTier,
        country: activity.country,
        deviceType: activity.deviceType,
        isRegistered: !!activity.userId,
        firstSeen: activity.timestamp,
        lastSeen: activity.timestamp,
        pageViews: 1,
        activities: [],
        referrer: activity.metadata?.referrer,
        landingPage: activity.pageUrl
      };
    }

    // Update session
    session.lastSeen = activity.timestamp;
    session.userId = activity.userId || session.userId;
    session.userTier = activity.userTier || session.userTier;
    session.country = activity.country || session.country;
    session.deviceType = activity.deviceType || session.deviceType;
    session.isRegistered = !!activity.userId || session.isRegistered;
    session.activities.push(activity.id);

    if (activity.activityType === 'page_view') {
      session.pageViews++;
    }

    this.sessions.set(activity.sessionId, session);
  }

  private updateTemplateStats(activity: ActivityEvent) {
    if (!activity.templateId || !activity.templateType) return;

    let stats = this.templateStats.get(activity.templateId);

    if (!stats) {
      stats = {
        templateId: activity.templateId,
        templateName: activity.templateName || `Template ${activity.templateId}`,
        templateType: activity.templateType,
        views: 0,
        downloads: 0,
        uniqueVisitors: new Set(),
        lastActivity: activity.timestamp
      };
    }

    stats.lastActivity = activity.timestamp;
    stats.uniqueVisitors.add(activity.sessionId);

    if (activity.activityType === 'template_view') {
      stats.views++;
    } else if (activity.activityType === 'template_download') {
      stats.downloads++;
    }

    this.templateStats.set(activity.templateId, stats);
  }

  private updateCountryStats(activity: ActivityEvent) {
    if (!activity.country) return;

    let stats = this.countryStats.get(activity.country);

    if (!stats) {
      stats = {
        country: activity.country,
        visitors: 0,
        registeredUsers: 0,
        snapDownloads: 0,
        proDownloads: 0,
        totalDownloads: 0,
        lastActivity: activity.timestamp
      };
    }

    stats.lastActivity = activity.timestamp;

    // Only count unique visitors
    const existingSession = this.sessions.get(activity.sessionId);
    if (!existingSession || existingSession.firstSeen === activity.timestamp) {
      stats.visitors++;
      if (activity.userId) {
        stats.registeredUsers++;
      }
    }

    if (activity.activityType === 'template_download') {
      stats.totalDownloads++;
      if (activity.templateType === 'snap') {
        stats.snapDownloads++;
      } else if (activity.templateType === 'pro') {
        stats.proDownloads++;
      }
    }

    this.countryStats.set(activity.country, stats);
  }

  // Get real-time statistics
  getRealtimeStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Active sessions (last 30 minutes for active users)
    const activeThreshold = now - (30 * 60 * 1000);
    const activeSessions = Array.from(this.sessions.values())
      .filter(s => s.lastSeen > activeThreshold);

    // All sessions from last 24 hours
    const last24HoursSessions = Array.from(this.sessions.values())
      .filter(s => s.firstSeen > oneDayAgo);

    // Recent activities (last hour)
    const recentActivities = Array.from(this.activities.values())
      .filter(a => a.timestamp > oneHourAgo);

    // Today's activities
    const todayActivities = Array.from(this.activities.values())
      .filter(a => a.timestamp > oneDayAgo);

    return {
      summary: {
        totalActiveSessions: activeSessions.length,
        registeredActiveSessions: activeSessions.filter(s => s.isRegistered).length,
        unregisteredActiveSessions: activeSessions.filter(s => !s.isRegistered).length,
        totalActivities: this.activities.size,
        recentActivities: recentActivities.length,
        todayActivities: todayActivities.length,
        totalSessions: last24HoursSessions.length, // Sessions from last 24 hours
        uniqueCountries: this.countryStats.size,
        totalTemplates: this.templateStats.size,
        last24HoursSessions: last24HoursSessions.length
      },
      recentActivities: this.recentActivities.slice(0, 20),
      topTemplates: this.getTopTemplates(),
      topCountries: this.getTopCountries(),
      activeSessions: activeSessions
    };
  }

  // Get recent activities
  getRecentActivities(limit: number = 50): ActivityEvent[] {
    return this.recentActivities.slice(0, limit);
  }

  // Get template statistics
  getTemplateStats(): any[] {
    return Array.from(this.templateStats.values())
      .map(stats => ({
        ...stats,
        uniqueVisitors: stats.uniqueVisitors.size
      }))
      .sort((a, b) => b.downloads - a.downloads);
  }

  // Get country statistics
  getCountryStats(): CountryStats[] {
    return Array.from(this.countryStats.values())
      .sort((a, b) => b.visitors - a.visitors);
  }

  // Get top templates
  getTopTemplates(limit: number = 10) {
    return Array.from(this.templateStats.values())
      .map(stats => ({
        templateId: stats.templateId,
        templateName: stats.templateName,
        templateType: stats.templateType,
        views: stats.views,
        downloads: stats.downloads,
        uniqueVisitors: stats.uniqueVisitors.size,
        conversionRate: stats.views > 0 ? (stats.downloads / stats.views) * 100 : 0
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  // Get top countries
  getTopCountries(limit: number = 10) {
    return Array.from(this.countryStats.values())
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, limit);
  }

  // Get session details
  getSessionDetails(sessionId: string): VisitorSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get activity details
  getActivityDetails(activityId: string): ActivityEvent | undefined {
    return this.activities.get(activityId);
  }

  // Get activities by type
  getActivitiesByType(activityType: string, limit: number = 100): ActivityEvent[] {
    return Array.from(this.activities.values())
      .filter(a => a.activityType === activityType)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get activities by user
  getActivitiesByUser(userId: string, limit: number = 100): ActivityEvent[] {
    return Array.from(this.activities.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get activities by session
  getActivitiesBySession(sessionId: string): ActivityEvent[] {
    return Array.from(this.activities.values())
      .filter(a => a.sessionId === sessionId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Clear all data (for testing)
  clear() {
    this.activities.clear();
    this.sessions.clear();
    this.templateStats.clear();
    this.countryStats.clear();
    this.recentActivities = [];
  }

  // Get memory usage stats
  getMemoryUsage() {
    return {
      activities: this.activities.size,
      sessions: this.sessions.size,
      templateStats: this.templateStats.size,
      countryStats: this.countryStats.size,
      recentActivities: this.recentActivities.length
    };
  }

  // Cleanup on shutdown
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Export singleton instance
export const memoryAnalytics = new MemoryAnalyticsService();
export default memoryAnalytics;

// Cleanup on process exit
process.on('beforeExit', () => {
  memoryAnalytics.destroy();
});

process.on('SIGINT', () => {
  memoryAnalytics.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  memoryAnalytics.destroy();
  process.exit(0);
});