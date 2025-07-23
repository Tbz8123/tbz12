import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  signUp, 
  signIn, 
  signInWithGoogle, 
  logOut, 
  getUserData, 
  updateUserData, 
  onAuthStateChange,
  getUserProfile,
  updateUserProfile,
  getUserUsageStats,
  trackUserUsage,
  getUserSubscription,
  getUserNotifications,
  getUserPermissions
} from '../lib/firebase';
import { 
  trackUserRegistration, 
  trackUserLogin, 
  setUserProperties 
} from '../services/googleAnalytics';

// Extended user interface with comprehensive user data
interface ExtendedUser extends User {
  // Basic user info
  currentTier?: string;
  subscriptionStatus?: string;
  role?: string;

  // Profile data
  userProfile?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    company?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    preferredLanguage?: string;
    emailNotifications?: boolean;
    marketingEmails?: boolean;
    autoSave?: boolean;
  };

  // Usage stats
  usageStats?: {
    resumesCreated?: number;
    resumesDownloaded?: number;
    templatesUsed?: number;
    monthlyResumes?: number;
    monthlyDownloads?: number;
    monthlyTemplateAccess?: number;
    aiSuggestionsUsed?: number;
    proTemplatesAccessed?: number;
    totalLoginDays?: number;
    lastActiveDate?: string;
  };

  // Subscription info
  subscription?: {
    tier?: string;
    status?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };

  // Permissions
  permissions?: Array<{
    permission: string;
    grantedAt: string;
  }>;

  // Notifications
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

interface AuthContextType {
  currentUser: ExtendedUser | null;
  userData: any;
  loading: boolean;

  // Authentication methods
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // User management methods
  updateUserProfile: (data: any) => Promise<void>;
  refreshUserData: () => Promise<void>;

  // Usage tracking
  trackUsage: (action: string, metadata?: any) => Promise<void>;

  // Subscription helpers
  hasPermission: (permission: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  getRemainingUsage: (type: string) => number;

  // Mock auth methods for admin
  mockLogin: (username: string, password: string) => Promise<void>;
  mockSignup: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Removed duplicate useEffect - consolidated into single auth handler below

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const result = await signUp(email, password, displayName);

      // Track user registration with GA4
      if (result?.user) {
        try {
          trackUserRegistration(result.user.uid, 'FREE');
          setUserProperties({
            user_tier: 'FREE',
            registration_method: 'email',
            user_name: displayName
          });
          console.log('✅ GA4 user registration tracked');
        } catch (gaError) {
          console.error('❌ GA4 registration tracking failed:', gaError);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const mockLogin = async (username: string, password: string) => {
    try {
      // Mock admin login validation
      if (username === 'admin' && password === 'admin123') {
        const mockUser = {
          uid: 'mock-admin-uid',
          email: 'admin@tbzresumebuilder.com',
          displayName: 'Admin User',
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          },
          providerData: [],
          refreshToken: 'mock-refresh-token',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-id-token',
          getIdTokenResult: async () => ({ token: 'mock-id-token' } as any),
          reload: async () => {},
          toJSON: () => ({}),
          phoneNumber: null,
          photoURL: null,
          providerId: 'mock',
          role: 'ADMIN',
          currentTier: 'ENTERPRISE',
          subscriptionStatus: 'ACTIVE'
        } as ExtendedUser;

        setCurrentUser(mockUser);
        setUserData({ role: 'ADMIN', currentTier: 'ENTERPRISE' });
        
        // Store in localStorage for persistence
        localStorage.setItem('mockUser', JSON.stringify({ 
          username, 
          isAdmin: true, 
          role: 'ADMIN',
          tier: 'ENTERPRISE'
        }));
        
        console.log('✅ Mock admin login successful');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Mock login error:', error);
      throw error;
    }
  };

  const mockSignup = async (username: string, password: string) => {
    try {
      // For admin client, redirect to login instead of creating new accounts
      throw new Error('Admin registration is not allowed. Please contact system administrator.');
    } catch (error) {
      console.error('Mock signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);

      // Track user login with GA4
      if (result?.user) {
        try {
          // Get user data to determine tier
          const userData = await getUserData(result.user.uid);
          const userTier = userData?.currentTier || 'FREE';

          trackUserLogin(result.user.uid, userTier);
          setUserProperties({
            user_tier: userTier,
            login_method: 'email'
          });
          console.log('✅ GA4 user login tracked');
        } catch (gaError) {
          console.error('❌ GA4 login tracking failed:', gaError);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();

      // Track Google login with GA4
      if (result?.user) {
        try {
          // Get user data to determine tier
          const userData = await getUserData(result.user.uid);
          const userTier = userData?.currentTier || 'FREE';

          trackUserLogin(result.user.uid, userTier);
          setUserProperties({
            user_tier: userTier,
            login_method: 'google'
          });
          console.log('✅ GA4 Google login tracked');
        } catch (gaError) {
          console.error('❌ GA4 Google login tracking failed:', gaError);
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
      setUserData(null);
      // Clear localStorage
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    if (currentUser) {
      try {
        await updateUserData(currentUser.uid, data);
        // Refresh user data after update
        await refreshUserData();
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  };

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const [userData, profile, usageStats, subscription, notifications, permissions] = await Promise.all([
          getUserData(currentUser.uid),
          getUserProfile(currentUser.uid),
          getUserUsageStats(currentUser.uid),
          getUserSubscription(currentUser.uid),
          getUserNotifications(currentUser.uid, true), // unread only
          getUserPermissions(currentUser.uid)
        ]);

        const extendedUser: ExtendedUser = {
          ...currentUser,
          currentTier: userData?.currentTier || 'FREE',
          subscriptionStatus: userData?.subscriptionStatus || 'INACTIVE',
          role: userData?.role || 'USER',
          userProfile: profile,
          usageStats: usageStats,
          subscription: subscription,
          notifications: notifications,
          permissions: permissions
        };

        setCurrentUser(extendedUser);
        setUserData(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const trackUsage = async (action: string, metadata?: any) => {
    if (currentUser) {
      try {
        await trackUserUsage(currentUser.uid, action, metadata);
        // Optionally refresh usage stats
        const updatedStats = await getUserUsageStats(currentUser.uid);
        if (updatedStats && currentUser.usageStats) {
          setCurrentUser(prev => prev ? {
            ...prev,
            usageStats: updatedStats
          } : null);
        }
      } catch (error) {
        console.error('Error tracking usage:', error);
      }
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser?.permissions) return false;
    return currentUser.permissions.some(p => p.permission === permission);
  };

  const canAccessFeature = (feature: string): boolean => {
    const tier = currentUser?.currentTier || 'FREE';
    const permissions = currentUser?.permissions || [];

    // Define tier-based access
    const tierAccess = {
      FREE: ['CREATE_RESUME', 'DOWNLOAD_RESUME'],
      BASIC: ['CREATE_RESUME', 'DOWNLOAD_RESUME', 'ACCESS_PRO_TEMPLATES'],
      PREMIUM: ['CREATE_RESUME', 'DOWNLOAD_RESUME', 'ACCESS_PRO_TEMPLATES', 'UNLIMITED_DOWNLOADS', 'AI_SUGGESTIONS', 'EXPORT_MULTIPLE_FORMATS'],
      ENTERPRISE: ['CREATE_RESUME', 'DOWNLOAD_RESUME', 'ACCESS_PRO_TEMPLATES', 'UNLIMITED_DOWNLOADS', 'AI_SUGGESTIONS', 'EXPORT_MULTIPLE_FORMATS', 'CUSTOM_BRANDING', 'TEAM_COLLABORATION', 'ANALYTICS_ACCESS']
    };

    // Check tier-based access
    if (tierAccess[tier as keyof typeof tierAccess]?.includes(feature)) {
      return true;
    }

    // Check explicit permissions
    return permissions.some(p => p.permission === feature);
  };

  const getRemainingUsage = (type: string): number => {
    const stats = currentUser?.usageStats;
    const tier = currentUser?.currentTier || 'FREE';

    if (!stats) return 0;

    // Define limits by tier
    const limits = {
      FREE: { resumes: 3, downloads: 5, templates: 2 },
      BASIC: { resumes: 10, downloads: 20, templates: 5 },
      PREMIUM: { resumes: -1, downloads: -1, templates: -1 }, // unlimited
      ENTERPRISE: { resumes: -1, downloads: -1, templates: -1 }
    };

    const tierLimits = limits[tier as keyof typeof limits];
    if (!tierLimits) return 0;

    switch (type) {
      case 'resumes':
        return tierLimits.resumes === -1 ? -1 : Math.max(0, tierLimits.resumes - (stats.monthlyResumes || 0));
      case 'downloads':
        return tierLimits.downloads === -1 ? -1 : Math.max(0, tierLimits.downloads - (stats.monthlyDownloads || 0));
      case 'templates':
        return tierLimits.templates === -1 ? -1 : Math.max(0, tierLimits.templates - (stats.monthlyTemplateAccess || 0));
      default:
        return 0;
    }
  };

  // Single authentication state management with mock auth support
  useEffect(() => {
    console.log('🔍 AuthContext: Initializing authentication...');
    
    // Check for existing mock user first
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      try {
        const parsedUser = JSON.parse(mockUser);
        console.log('🔍 AuthContext: Found mock user:', parsedUser);
        
        if (parsedUser.role === 'ADMIN' || parsedUser.isAdmin) {
          console.log('✅ AuthContext: Setting up mock admin user');
          
          const adminUser = {
            uid: 'mock-admin-uid',
            email: 'admin@tbzresumebuilder.com',
            displayName: 'Admin User',
            emailVerified: true,
            isAnonymous: false,
            metadata: {
              creationTime: new Date().toISOString(),
              lastSignInTime: new Date().toISOString()
            },
            providerData: [],
            refreshToken: 'mock-refresh-token',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'mock-id-token',
            getIdTokenResult: async () => ({ token: 'mock-id-token' } as any),
            reload: async () => {},
            toJSON: () => ({}),
            phoneNumber: null,
            photoURL: null,
            providerId: 'mock',
            role: 'ADMIN',
            currentTier: 'ENTERPRISE',
            subscriptionStatus: 'ACTIVE'
          } as ExtendedUser;
          
          setCurrentUser(adminUser);
          setUserData({ role: 'ADMIN', currentTier: 'ENTERPRISE' });
          setLoading(false);
          console.log('✅ AuthContext: Mock admin authentication complete');
          return;
        }
      } catch (error) {
        console.error('❌ AuthContext: Error parsing mock user:', error);
        localStorage.removeItem('mockUser');
      }
    }

    console.log('🔍 AuthContext: No mock user found, setting up Firebase auth listener');
    
    // Fallback to Firebase auth state listener
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('🔍 AuthContext: Firebase auth state changed:', user ? 'User found' : 'No user');
      
      if (user) {
        try {
          // Get comprehensive user data
          const [userData, profile, usageStats, subscription, notifications, permissions] = await Promise.all([
            getUserData(user.uid),
            getUserProfile(user.uid),
            getUserUsageStats(user.uid),
            getUserSubscription(user.uid),
            getUserNotifications(user.uid, true), // unread only
            getUserPermissions(user.uid)
          ]);

          // Check if user has admin role
          if (userData?.role !== 'ADMIN') {
            console.warn('❌ AuthContext: Non-admin user attempting to access admin client');
            await logOut();
            setCurrentUser(null);
            setUserData(null);
            setLoading(false);
            return;
          }

          // Combine Firebase user with additional data
          const extendedUser: ExtendedUser = {
            ...user,
            currentTier: userData?.currentTier || 'FREE',
            subscriptionStatus: userData?.subscriptionStatus || 'INACTIVE',
            role: userData?.role || 'USER',
            userProfile: profile,
            usageStats: usageStats,
            subscription: subscription,
            notifications: notifications,
            permissions: permissions
          };

          setCurrentUser(extendedUser);
          setUserData(userData);
          console.log('✅ AuthContext: Firebase admin authentication complete');
        } catch (error) {
          console.error('❌ AuthContext: Error loading user data:', error);
          // Set basic user data if comprehensive data fails
          setCurrentUser(user as ExtendedUser);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    refreshUserData,
    trackUsage,
    hasPermission,
    canAccessFeature,
    getRemainingUsage,
    mockLogin,
    mockSignup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};