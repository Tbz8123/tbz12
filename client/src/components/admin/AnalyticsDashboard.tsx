import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  Download, 
  Globe, 
  TrendingUp, 
  Eye,
  UserCheck,
  UserPlus,
  Calendar,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Trash2,
  CalendarDays
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    registeredUsers: number;
    unregisteredUsers: number;
    snapDownloads: number;
    proDownloads: number;
    totalDownloads: number;
    totalRegisteredUsers: number;
    totalSubscribers: number;
    totalSnapDownloads: number;
    totalProDownloads: number;
    allTimeDownloads: number;
    conversionRate: number;
  };
  geographicData: Array<{
    country: string;
    countryCode: string;
    totalVisitors: number;
    registeredUsers: number;
    unregisteredUsers: number;
    snapDownloads: number;
    proDownloads: number;
    totalDownloads: number;
    subscriptions: number;
    conversionRate: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    templateType: string;
    totalViews: number;
    totalDownloads: number;
    conversionRate: number;
  }>;
  recentActivities: Array<{
    id: string;
    activityType: string;
    activityName: string;
    description: string;
    timestamp: string;
    user?: {
      name: string;
      email: string;
    };
    templateName?: string;
    templateType?: string;
  }>;
}

interface RealtimeStats {
  todayVisitors: number;
  newRegistrations: number;
  todayDownloads: number;
  activeUsers: number;
  totalRegisteredUsers: number;
  totalSubscribers: number;
  totalSnapDownloads: number;
  totalProDownloads: number;
  totalDownloads: number;
  topCountries: Array<{
    country: string;
    countryCode: string;
    totalVisitors: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateType: string;
    templateName: string;
    _count: {
      templateId: number;
    };
  }>;
}

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
  lastLoginAt: string;
  currentTier: string;
  isActive: boolean;
  totalDownloads: number;
  snapDownloads: number;
  proDownloads: number;
  totalSessions: number;
  lastActiveAt: string;
  recentDownloads: Array<{
    templateName: string;
    templateType: string;
    downloadedAt: string;
  }>;
}

interface UnregisteredUser {
  anonymousId: string;
  userAgent: string;
  country: string;
  totalDownloads: number;
  snapDownloads: number;
  proDownloads: number;
  lastActivity: string;
  downloads: Array<{
    templateName: string;
    templateType: string;
    downloadedAt: string;
  }>;
}

interface VisitorData {
  registered: RegisteredUser[];
  unregistered: UnregisteredUser[];
  summary: {
    totalRegistered: number;
    totalUnregistered: number;
    totalActiveNow: number;
    registeredActiveNow: number;
    unregisteredActiveNow: number;
  };
}

interface DateFilter {
  label: string;
  value: string;
  startDate?: string;
  endDate?: string;
}

// Remove the static DATE_FILTERS array and make it dynamic
const getDateFilters = (): DateFilter[] => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calculate week start (Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Calculate month start
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split('T')[0];

  // Calculate rolling periods
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last90Days = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  return [
    { label: 'All Time', value: 'all-time' },
    { label: 'Today', value: 'today', startDate: todayStr, endDate: todayStr },
    { label: 'This Week', value: 'this-week', startDate: weekStartStr, endDate: todayStr },
    { label: 'This Month', value: 'this-month', startDate: monthStartStr, endDate: todayStr },
    { label: 'Last 7 Days', value: 'last-7-days', startDate: last7Days.toISOString().split('T')[0], endDate: todayStr },
    { label: 'Last 30 Days', value: 'last-30-days', startDate: last30Days.toISOString().split('T')[0], endDate: todayStr },
    { label: 'Last 90 Days', value: 'last-90-days', startDate: last90Days.toISOString().split('T')[0], endDate: todayStr },
    { label: 'Custom Range', value: 'custom' }
  ];
};

interface DashboardData {
  totalUsers: number;
  totalResumes: number;
  totalDownloads: number;
  activeUsers: number;
  recentUsers: any[];
  downloadStats: { pdf: number; docx: number; txt: number };
  userGrowth: any[];
  resumeCreationTrend: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all-time');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const getCurrentDateRange = useCallback(() => {
    const selectedFilter = getDateFilters().find(f => f.value === selectedDateFilter);
    if (selectedFilter?.value === 'custom') {
      return { start: customDateRange.start, end: customDateRange.end };
    }
    if (selectedFilter?.value === 'all-time') {
      return null; // No date filtering for all-time
    }
    return { start: selectedFilter?.startDate || null, end: selectedFilter?.endDate || null };
  }, [selectedDateFilter, customDateRange]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const dateRange = getCurrentDateRange();
      let url = '/api/analytics/dashboard';

      if (dateRange?.start && dateRange?.end) {
        url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    }
  }, [getCurrentDateRange]);

  const fetchRealtimeStats = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const data = await response.json();
      setRealtimeStats(data);
    } catch (error) {
      console.error('Error fetching realtime stats:', error);
    }
  }, []);

  const fetchVisitorData = useCallback(async () => {
    try {
      const dateRange = getCurrentDateRange();
      let url = '/api/analytics/visitors';

      if (dateRange?.start && dateRange?.end) {
        url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setVisitorData(data);
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    }
  }, [getCurrentDateRange]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAnalyticsData(), fetchRealtimeStats(), fetchVisitorData()]);
    setRefreshing(false);
  }, [fetchAnalyticsData, fetchRealtimeStats, fetchVisitorData]);

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all analytics history? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      const response = await fetch('/api/memory-analytics/clear', {
        method: 'DELETE',
      });

      if (response.ok) {
        setAnalyticsData(null);
        setRealtimeStats(null);
        setVisitorData(null);
        await refreshData();
        console.log('✅ Analytics history cleared successfully');
        alert('Analytics history cleared successfully!');
      } else {
        console.error('❌ Failed to clear analytics history');
        alert('Failed to clear analytics history. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error clearing analytics history:', error);
      alert('Error clearing analytics history. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  const handleDateFilterChange = (value: string) => {
    setSelectedDateFilter(value);
    if (value !== 'custom') {
      // Data will be refreshed by useEffect
    }
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setCustomDateRange(prev => ({ ...prev, [field]: value }));
  };

  const getDateRangeLabel = () => {
    const selectedFilter = getDateFilters().find(f => f.value === selectedDateFilter);
    if (selectedFilter?.value === 'custom') {
      return `${customDateRange.start} to ${customDateRange.end}`;
    }
    return selectedFilter?.label || 'All Time';
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchAnalyticsData(), fetchRealtimeStats(), fetchVisitorData()]);
      setLoading(false);
    };

    loadData();
  }, [fetchAnalyticsData, fetchRealtimeStats, fetchVisitorData]);

  // Auto-refresh realtime stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchRealtimeStats, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtimeStats]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode || countryCode === 'XX') return '🌍';
    return String.fromCodePoint(
      ...(countryCode.toUpperCase().split('').map(char => 
        0x1F1E6 + char.charCodeAt(0) - 65
      ))
    );
  };

  const getCountryFlagByName = (countryName: string): string => {
    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'India': '🇮🇳',
      'Netherlands': '🇳🇱',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'South Korea': '🇰🇷'
    };
    return flagMap[countryName] || '🌍';
  };

  const getBrowserFromUserAgent = (userAgent: string): string => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'PAGE_VIEW': return <Eye className="w-4 h-4" />;
      case 'TEMPLATE_DOWNLOAD': return <Download className="w-4 h-4" />;
      case 'USER_REGISTRATION': return <UserPlus className="w-4 h-4" />;
      case 'USER_LOGIN': return <UserCheck className="w-4 h-4" />;
      case 'SUBSCRIPTION_START': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'PAGE_VIEW': return 'bg-blue-100 text-blue-800';
      case 'TEMPLATE_DOWNLOAD': return 'bg-green-100 text-green-800';
      case 'USER_REGISTRATION': return 'bg-purple-100 text-purple-800';
      case 'USER_LOGIN': return 'bg-yellow-100 text-yellow-800';
      case 'SUBSCRIPTION_START': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Analytics Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <button 
                onClick={fetchAnalyticsData}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData || !realtimeStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track visitor behavior, downloads, and user engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={refreshData} 
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Real-time Stats (Today's Data - No Date Filtering) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Visitors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(realtimeStats?.todayVisitors || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Downloads</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(realtimeStats?.todayDownloads || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Registrations</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(realtimeStats?.newRegistrations || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(realtimeStats?.activeUsers || 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-700">Filter Total Metrics & Analytics</h3>
            <span className="text-xs text-gray-500">• {getDateRangeLabel()}</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <Select value={selectedDateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {getDateFilters().map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {selectedDateFilter === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Metrics Cards (With Date Filtering) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedDateFilter === 'all-time' ? 'Total Registered Users' : 'Registered Users'}
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatNumber(analyticsData?.overview?.registeredUsers || 0)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedDateFilter === 'all-time' ? 'Total Subscribers' : 'Subscribers'}
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatNumber(analyticsData?.overview?.totalSubscribers || 0)}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedDateFilter === 'all-time' ? 'Total Downloads' : 'Downloads'}
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {formatNumber(analyticsData?.overview?.totalDownloads || 0)}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Snap:</span>
                    <span>{formatNumber(analyticsData?.overview?.snapDownloads || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pro:</span>
                    <span>{formatNumber(analyticsData?.overview?.proDownloads || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Download className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(analyticsData?.overview?.totalVisitors || 0)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Registered</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData?.overview?.registeredUsers || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unregistered</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData?.overview?.unregisteredUsers || 0)}
                    </span>
                  </div>
                  <Progress 
                    value={analyticsData?.overview?.totalVisitors > 0 ? 
                      ((analyticsData?.overview?.registeredUsers || 0) / analyticsData.overview.totalVisitors) * 100 : 0
                    } 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Template Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(analyticsData?.overview?.totalDownloads || 0)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Snap Templates</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData?.overview?.snapDownloads || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pro Templates</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData?.overview?.proDownloads || 0)}
                    </span>
                  </div>
                  <Progress 
                    value={analyticsData?.overview?.totalDownloads > 0 ? 
                      ((analyticsData?.overview?.snapDownloads || 0) / analyticsData.overview.totalDownloads) * 100 : 0
                    } 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatPercentage(analyticsData?.overview?.conversionRate || 0)}
                </div>
                <p className="text-sm text-gray-600">
                  Visitors who registered
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="space-y-4">
          {visitorData ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Registered</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatNumber(visitorData?.summary?.totalRegistered || 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Unregistered</p>
                        <p className="text-2xl font-bold text-gray-600">
                          {formatNumber(visitorData?.summary?.totalUnregistered || 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Now</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatNumber(visitorData?.summary?.totalActiveNow || 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Registered Active</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatNumber(visitorData?.summary?.registeredActiveNow || 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <UserCheck className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registered Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Registered Users</span>
                    <Badge variant="secondary">{visitorData?.registered?.length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitorData?.registered?.length > 0 ? (
                      visitorData?.registered?.map((user) => (
                        <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">{getCountryFlagByName(user.country)}</span>
                                <div>
                                  <h4 className="font-medium text-gray-900">{user.name || 'Unknown'}</h4>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-500">Country</p>
                                  <p className="text-sm font-medium">{user.country}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Tier</p>
                                  <Badge variant={user.currentTier === 'FREE' ? 'secondary' : 'default'}>
                                    {user.currentTier}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Total Downloads</p>
                                  <p className="text-sm font-medium">{user.totalDownloads}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Sessions</p>
                                  <p className="text-sm font-medium">{user.totalSessions}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs text-gray-600">
                                    Snap: {user.snapDownloads}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span className="text-xs text-gray-600">
                                    Pro: {user.proDownloads}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    Last active: {new Date(user.lastActiveAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {user.recentDownloads?.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 mb-2">Recent Downloads:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {user.recentDownloads?.slice(0, 3).map((download, index) => (
                                      <Badge 
                                        key={index} 
                                        variant={download.templateType === 'pro' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {download.templateName}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-xs text-gray-600">
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No registered users yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Unregistered Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Unregistered Users</span>
                    <Badge variant="secondary">{visitorData?.unregistered?.length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitorData?.unregistered?.length > 0 ? (
                      visitorData?.unregistered?.map((user) => (
                        <div key={user.anonymousId} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">{getCountryFlagByName(user.country)}</span>
                                <div>
                                  <h4 className="font-medium text-gray-900">Anonymous User</h4>
                                  <p className="text-sm text-gray-600">{user.anonymousId}</p>
                                  <p className="text-xs text-gray-500">
                                    Browser: {getBrowserFromUserAgent(user.userAgent)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-500">Country</p>
                                  <p className="text-sm font-medium">{user.country}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Total Downloads</p>
                                  <p className="text-sm font-medium">{user.totalDownloads}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Snap Downloads</p>
                                  <p className="text-sm font-medium">{user.snapDownloads}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Pro Downloads</p>
                                  <p className="text-sm font-medium">{user.proDownloads}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs text-gray-600">
                                    Snap: {user.snapDownloads}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span className="text-xs text-gray-600">
                                    Pro: {user.proDownloads}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    Last activity: {new Date(user.lastActivity).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {user.downloads.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 mb-2">Recent Downloads:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {user.downloads.slice(0, 3).map((download, index) => (
                                      <Badge 
                                        key={index} 
                                        variant={download.templateType === 'pro' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {download.templateName}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No unregistered user activity yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </TabsContent>

        {/* Countries Tab */}
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Geographic Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.geographicData?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.geographicData.map((country) => (
                      <div key={country.country} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getCountryFlag(country.countryCode)}</span>
                            <span className="font-medium">{country.country}</span>
                          </div>
                          <Badge variant="secondary">
                            {formatNumber(country.totalVisitors)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Registered:</span>
                            <span className="font-medium">{formatNumber(country.registeredUsers)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Downloads:</span>
                            <span className="font-medium">{formatNumber(country.totalDownloads)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Snap:</span>
                            <span className="font-medium">{formatNumber(country.snapDownloads)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pro:</span>
                            <span className="font-medium">{formatNumber(country.proDownloads)}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={country.totalVisitors > 0 ? 
                              (country.registeredUsers / country.totalVisitors) * 100 : 0
                            } 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            {formatPercentage(country.conversionRate)} conversion rate
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No geographic data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Top Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.topTemplates?.length > 0 ? (
                  analyticsData.topTemplates.map((template, index) => (
                    <div key={template.templateId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{template.templateName}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={template.templateType === 'pro' ? 'default' : 'secondary'}>
                              {template.templateType.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {formatNumber(template.totalViews)} views
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatNumber(template.totalDownloads)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPercentage(template.conversionRate)} conversion
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No template data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.recentActivities?.length > 0 ? (
                  analyticsData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.activityType)}`}>
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {activity.user && (
                            <span className="text-xs text-gray-600">
                              {activity.user.name || activity.user.email}
                            </span>
                          )}
                          {activity.templateName && (
                            <Badge variant="outline" className="text-xs">
                              {activity.templateName}
                            </Badge>
                          )}
                          {activity.templateType && (
                            <Badge variant={activity.templateType === 'pro' ? 'default' : 'secondary'} className="text-xs">
                              {activity.templateType.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;