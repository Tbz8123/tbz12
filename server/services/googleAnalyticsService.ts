// Server-side Google Analytics 4 Service using Measurement Protocol
import { v4 as uuidv4 } from 'uuid';

// GA4 Configuration
const GA_MEASUREMENT_ID = 'G-8JYCB3QQQ5';
const GA_API_SECRET = process.env.GA_API_SECRET || 'your-ga-api-secret'; // This should be set in environment variables
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

// Types
interface GAEvent {
  name: string;
  params: Record<string, any>;
}

interface GAUser {
  client_id: string;
  user_id?: string;
  user_properties?: Record<string, any>;
}

interface GAPayload {
  client_id: string;
  user_id?: string;
  timestamp_micros?: number;
  user_properties?: Record<string, any>;
  events: GAEvent[];
}

class GoogleAnalyticsService {
  private generateClientId(): string {
    return uuidv4();
  }

  private async sendEvent(payload: GAPayload): Promise<boolean> {
    try {
      // Skip if no API secret is configured
      if (!GA_API_SECRET || GA_API_SECRET === 'your-ga-api-secret') {
        console.warn('⚠️ GA4 API Secret not configured, skipping event tracking');
        return false;
      }

      const response = await fetch(GA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('❌ GA4 API Error:', response.status, response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ GA4 Service Error:', error);
      return false;
    }
  }

  // Track page view
  async trackPageView(data: {
    sessionId: string;
    userId?: string;
    pageUrl: string;
    pageTitle?: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
    deviceType?: string;
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'page_view',
        params: {
          page_location: data.pageUrl,
          page_title: data.pageTitle || 'Unknown',
          page_referrer: data.referrer,
          user_agent: data.userAgent,
          country: data.country,
          device_type: data.deviceType,
          visitor_type: data.userId ? 'registered' : 'anonymous'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track template download
  async trackTemplateDownload(data: {
    sessionId: string;
    userId?: string;
    templateId: string;
    templateName: string;
    templateType: 'snap' | 'pro';
    downloadType: 'pdf' | 'docx' | 'txt';
    userTier?: string;
    successful?: boolean;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'template_download',
        params: {
          template_id: data.templateId,
          template_name: data.templateName,
          template_type: data.templateType,
          download_type: data.downloadType,
          user_tier: data.userTier || 'free',
          success: data.successful !== false,
          event_category: 'downloads',
          event_label: `${data.templateType}_${data.downloadType}`
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track user registration
  async trackUserRegistration(data: {
    sessionId: string;
    userId: string;
    userTier: string;
    method?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: {
        user_tier: { value: data.userTier }
      },
      events: [{
        name: 'sign_up',
        params: {
          method: data.method || 'email',
          user_tier: data.userTier,
          event_category: 'user_lifecycle',
          event_label: 'registration'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track user login
  async trackUserLogin(data: {
    sessionId: string;
    userId: string;
    userTier: string;
    method?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: {
        user_tier: { value: data.userTier }
      },
      events: [{
        name: 'login',
        params: {
          method: data.method || 'email',
          user_tier: data.userTier,
          event_category: 'user_lifecycle',
          event_label: 'login'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track template view
  async trackTemplateView(data: {
    sessionId: string;
    userId?: string;
    templateId: string;
    templateName: string;
    templateType: 'snap' | 'pro';
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'view_item',
        params: {
          item_id: data.templateId,
          item_name: data.templateName,
          item_category: 'template',
          item_variant: data.templateType,
          template_type: data.templateType,
          user_tier: data.userTier || 'free',
          event_category: 'engagement',
          event_label: 'template_view'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track custom event
  async trackCustomEvent(data: {
    sessionId: string;
    userId?: string;
    eventName: string;
    eventParams: Record<string, any>;
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: data.eventName,
        params: {
          ...data.eventParams,
          user_tier: data.userTier || 'free'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track subscription event
  async trackSubscription(data: {
    sessionId: string;
    userId: string;
    subscriptionType: string;
    fromTier: string;
    toTier: string;
    value?: number;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: {
        user_tier: { value: data.toTier }
      },
      events: [{
        name: 'subscription_start',
        params: {
          subscription_type: data.subscriptionType,
          from_tier: data.fromTier,
          to_tier: data.toTier,
          value: data.value || 0,
          event_category: 'conversion',
          event_label: `${data.fromTier}_to_${data.toTier}`
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track search
  async trackSearch(data: {
    sessionId: string;
    userId?: string;
    searchTerm: string;
    category: string;
    results: number;
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'search',
        params: {
          search_term: data.searchTerm,
          search_category: data.category,
          search_results: data.results,
          event_category: 'search',
          event_label: data.searchTerm
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track error
  async trackError(data: {
    sessionId: string;
    userId?: string;
    errorMessage: string;
    errorType?: string;
    pageUrl?: string;
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'exception',
        params: {
          description: data.errorMessage,
          error_type: data.errorType || 'unknown',
          page_location: data.pageUrl,
          fatal: false,
          event_category: 'errors',
          event_label: data.errorType || 'unknown'
        }
      }]
    };

    return await this.sendEvent(payload);
  }

  // Track feature usage
  async trackFeatureUsage(data: {
    sessionId: string;
    userId?: string;
    featureName: string;
    featureData?: Record<string, any>;
    userTier?: string;
  }): Promise<boolean> {
    const payload: GAPayload = {
      client_id: data.sessionId,
      user_id: data.userId,
      timestamp_micros: Date.now() * 1000,
      user_properties: data.userTier ? {
        user_tier: { value: data.userTier }
      } : undefined,
      events: [{
        name: 'feature_use',
        params: {
          feature_name: data.featureName,
          ...data.featureData,
          event_category: 'features',
          event_label: data.featureName
        }
      }]
    };

    return await this.sendEvent(payload);
  }
}

// Export singleton instance
export const gaService = new GoogleAnalyticsService();
export default gaService; 