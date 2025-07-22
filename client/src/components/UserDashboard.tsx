import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserUsageStats, 
  getUserNotifications, 
  markNotificationAsRead,
  createSupportTicket 
} from '../lib/firebase';

interface DashboardStats {
  resumesCreated: number;
  resumesDownloaded: number;
  templatesUsed: number;
  monthlyResumes: number;
  monthlyDownloads: number;
  monthlyTemplateAccess: number;
  aiSuggestionsUsed: number;
  proTemplatesAccessed: number;
  totalLoginDays: number;
  lastActiveDate: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const { currentUser, canAccessFeature, getRemainingUsage, trackUsage } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'notifications' | 'support'>('overview');

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    try {
      const [usageStats, userNotifications] = await Promise.all([
        getUserUsageStats(currentUser.uid),
        getUserNotifications(currentUser.uid)
      ]);

      setStats(usageStats);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    if (!currentUser) return;

    try {
      await markNotificationAsRead(currentUser.uid, notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return 'text-green-600'; // Unlimited
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatUsage = (current: number, limit: number) => {
    if (limit === -1) return `${current} / Unlimited`;
    return `${current} / ${limit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {currentUser?.userProfile?.firstName || currentUser?.displayName || 'User'}!
              </h1>
              <p className="text-gray-600">
                Manage your resume building experience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(currentUser?.currentTier || 'FREE')}`}>
                {currentUser?.currentTier || 'FREE'} Plan
              </span>
              {currentUser?.currentTier === 'FREE' && (
                <button 
                  onClick={() => window.location.href = '/upgrade'}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'usage', label: 'Usage & Limits' },
              { key: 'notifications', label: 'Notifications' },
              { key: 'support', label: 'Support' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.key === 'notifications' && notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    📄
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Resumes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.resumesCreated || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    ⬇️
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Downloads</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.resumesDownloaded || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    🎨
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Templates Used</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.templatesUsed || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    🔥
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Login Days</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalLoginDays || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Usage Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatUsage(stats?.monthlyResumes || 0, getRemainingUsage('resumes') + (stats?.monthlyResumes || 0))}
                  </div>
                  <p className="text-sm text-gray-500">Resumes Created</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((stats?.monthlyResumes || 0) / (getRemainingUsage('resumes') + (stats?.monthlyResumes || 0))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatUsage(stats?.monthlyDownloads || 0, getRemainingUsage('downloads') + (stats?.monthlyDownloads || 0))}
                  </div>
                  <p className="text-sm text-gray-500">Downloads</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((stats?.monthlyDownloads || 0) / (getRemainingUsage('downloads') + (stats?.monthlyDownloads || 0))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatUsage(stats?.monthlyTemplateAccess || 0, getRemainingUsage('templates') + (stats?.monthlyTemplateAccess || 0))}
                  </div>
                  <p className="text-sm text-gray-500">Template Access</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((stats?.monthlyTemplateAccess || 0) / (getRemainingUsage('templates') + (stats?.monthlyTemplateAccess || 0))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Access */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'ACCESS_PRO_TEMPLATES', label: 'Pro Templates', icon: '🎨' },
                  { key: 'AI_SUGGESTIONS', label: 'AI Suggestions', icon: '🤖' },
                  { key: 'EXPORT_MULTIPLE_FORMATS', label: 'Multiple Export Formats', icon: '📁' },
                  { key: 'CUSTOM_BRANDING', label: 'Custom Branding', icon: '🎯' },
                  { key: 'UNLIMITED_DOWNLOADS', label: 'Unlimited Downloads', icon: '⬇️' },
                  { key: 'PRIORITY_SUPPORT', label: 'Priority Support', icon: '🚀' }
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{feature.icon}</span>
                      <span className="font-medium">{feature.label}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      canAccessFeature(feature.key) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {canAccessFeature(feature.key) ? 'Available' : 'Upgrade Required'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Support</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">📚 Help Center</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Find answers to common questions and learn how to use our features.
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Visit Help Center →
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">💬 Contact Support</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Need help? Our support team is here to assist you.
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Create Support Ticket →
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => trackUsage('feature_requested', { feature: 'tutorial' })}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-medium">Tutorial</div>
                    <div className="text-sm text-gray-600">Learn the basics</div>
                  </button>

                  <button 
                    onClick={() => trackUsage('feature_requested', { feature: 'feedback' })}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="text-2xl mb-2">💡</div>
                    <div className="font-medium">Feedback</div>
                    <div className="text-sm text-gray-600">Share your thoughts</div>
                  </button>

                  <button 
                    onClick={() => trackUsage('feature_requested', { feature: 'feature_request' })}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="font-medium">Feature Request</div>
                    <div className="text-sm text-gray-600">Suggest improvements</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard; 