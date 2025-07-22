// Google Analytics 4 Service
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = 'G-8JYCB3QQQ5';

// Initialize GA4
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced measurement
    enhanced_measurement: true,
    // User engagement
    engagement_time_msec: 100,
    // Custom dimensions
    custom_map: {
      'user_tier': 'user_tier',
      'template_type': 'template_type',
      'download_type': 'download_type',
      'visitor_type': 'visitor_type'
    }
  });

  console.log('🔍 Google Analytics 4 initialized');
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    event_category: 'user_interaction',
    event_label: eventName,
    value: 1,
    ...parameters
  });
};

// Track user registration
export const trackUserRegistration = (userId: string, tier: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: 'email',
    user_id: userId,
    user_tier: tier,
    event_category: 'user_lifecycle',
    event_label: 'registration'
  });

  // Set user properties
  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
    custom_map: {
      'user_tier': tier
    }
  });
};

// Track user login
export const trackUserLogin = (userId: string, tier: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'login', {
    method: 'email',
    user_id: userId,
    user_tier: tier,
    event_category: 'user_lifecycle',
    event_label: 'login'
  });
};

// Track template downloads (Enhanced Ecommerce)
export const trackTemplateDownload = (templateData: {
  templateId: string;
  templateName: string;
  templateType: 'snap' | 'pro';
  downloadType: 'pdf' | 'docx' | 'txt';
  userId?: string;
  tier?: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Enhanced Ecommerce event
  window.gtag('event', 'purchase', {
    transaction_id: `download_${Date.now()}`,
    value: templateData.templateType === 'pro' ? 1 : 0,
    currency: 'USD',
    items: [{
      item_id: templateData.templateId,
      item_name: templateData.templateName,
      item_category: 'template',
      item_variant: templateData.templateType,
      item_category2: templateData.downloadType,
      quantity: 1,
      price: templateData.templateType === 'pro' ? 1 : 0
    }],
    // Custom parameters
    template_type: templateData.templateType,
    download_type: templateData.downloadType,
    user_tier: templateData.tier || 'free',
    event_category: 'ecommerce',
    event_label: 'template_download'
  });

  // Also track as custom event
  window.gtag('event', 'template_download', {
    template_id: templateData.templateId,
    template_name: templateData.templateName,
    template_type: templateData.templateType,
    download_type: templateData.downloadType,
    user_tier: templateData.tier || 'free',
    event_category: 'downloads',
    event_label: `${templateData.templateType}_${templateData.downloadType}`
  });
};

// Track template views
export const trackTemplateView = (templateData: {
  templateId: string;
  templateName: string;
  templateType: 'snap' | 'pro';
  userId?: string;
  tier?: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item', {
    item_id: templateData.templateId,
    item_name: templateData.templateName,
    item_category: 'template',
    item_variant: templateData.templateType,
    template_type: templateData.templateType,
    user_tier: templateData.tier || 'free',
    event_category: 'engagement',
    event_label: 'template_view'
  });
};

// Track user journey steps
export const trackUserJourney = (step: string, stepData?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'user_journey', {
    journey_step: step,
    event_category: 'user_flow',
    event_label: step,
    ...stepData
  });
};

// Track search queries
export const trackSearch = (searchTerm: string, category: string, results: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    search_category: category,
    search_results: results,
    event_category: 'search',
    event_label: searchTerm
  });
};

// Track tier upgrades
export const trackTierUpgrade = (userId: string, fromTier: string, toTier: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'tier_upgrade', {
    user_id: userId,
    from_tier: fromTier,
    to_tier: toTier,
    event_category: 'conversion',
    event_label: `${fromTier}_to_${toTier}`,
    value: toTier === 'pro' ? 10 : 5 // Arbitrary value for tracking
  });
};

// Track errors
export const trackError = (error: string, errorDetails?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error,
    fatal: false,
    event_category: 'errors',
    event_label: error,
    ...errorDetails
  });
};

// Track session duration
export const trackSessionDuration = (duration: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'session_duration', {
    duration_seconds: duration,
    event_category: 'engagement',
    event_label: 'session_time'
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, featureData?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'feature_use', {
    feature_name: featureName,
    event_category: 'features',
    event_label: featureName,
    ...featureData
  });
};

// Track conversion events
export const trackConversion = (conversionType: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    conversion_type: conversionType,
    value: value || 1,
    event_category: 'conversions',
    event_label: conversionType
  });
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    custom_map: properties
  });
};

// Enhanced measurement events
export const enableEnhancedMeasurement = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    enhanced_measurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: true,
      file_downloads: true,
      page_changes: true
    }
  });
};

// Debug mode (for development)
export const enableDebugMode = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    debug_mode: true
  });

  console.log('🔍 GA4 Debug mode enabled');
};

// Export measurement ID for use in other components
export { GA_MEASUREMENT_ID }; 