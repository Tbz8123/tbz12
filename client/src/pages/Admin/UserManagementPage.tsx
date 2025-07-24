import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Shield, 
  Activity,
  Settings,
  BarChart3,
  HeadphonesIcon,
  RefreshCw,
  ArrowLeft,
  Globe
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  currentTier: string;
  subscriptionStatus: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  usageStats: {
    resumesCreated: number;
    resumesDownloaded: number;
    monthlyResumes: number;
    monthlyDownloads: number;
    snapDownloads: number;
    proDownloads: number;
  };
}

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'support' | 'settings' | 'user-data'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  // User Data tab state
  const [userDataSearch, setUserDataSearch] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [userDataError, setUserDataError] = useState<string | null>(null);

  // Load admin data on component mount
  useEffect(() => {
      loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      console.log('🔄 Loading admin data...');
      const [usersResponse, ticketsResponse] = await Promise.all([
        fetch('/api/admin/users?' + new Date().getTime()), // Add timestamp to prevent caching
        fetch('/api/admin/support-tickets?' + new Date().getTime())
      ]);

      if (usersResponse.ok && ticketsResponse.ok) {
        const [usersData, ticketsData] = await Promise.all([
          usersResponse.json(),
          ticketsResponse.json()
        ]);

        console.log('✅ Loaded users data:', usersData.length, 'users');
        console.log('📊 Sample user stats:', usersData[0]?.usageStats);

        setUsers(usersData);
        setTickets(ticketsData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserTier = async (userId: string, newTier: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });

      if (response.ok) {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Error updating user tier:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const fetchUserData = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUserDataError('Please enter an email address or user ID');
      return;
    }

    setUserDataLoading(true);
    setUserDataError(null);
    setUserData(null);

    try {
      const url = `/api/admin/user-data?search=${encodeURIComponent(searchQuery)}`;
      console.log('🔍 Fetching user data from:', url);

      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);

        if (response.status === 404) {
          setUserDataError('User not found');
        } else {
          setUserDataError(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      console.log('✅ User data received:', data);
      setUserData(data);
    } catch (error: unknown) {
      console.error('❌ Network error fetching user data:', error);
      setUserDataError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUserDataLoading(false);
    }
  };

  const handleUserDataSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData(userDataSearch);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search and tier
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || user.currentTier === filterTier;
    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
              <Button
                variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              Back
              </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users, analytics, and support</p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
            {[
              { key: 'users', label: 'Users', icon: Users, count: users.length },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'support', label: 'Support', icon: HeadphonesIcon, count: tickets.filter(t => t.status === 'OPEN').length },
              { key: 'user-data', label: 'User Data', icon: Search },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={loadAdminData}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-mono text-xs text-gray-600">{user.id}</div>
                            {user.firebaseUid && (
                              <div className="font-mono text-xs text-gray-400 truncate max-w-[100px]" title={user.firebaseUid}>
                                {user.firebaseUid.substring(0, 8)}...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTierColor(user.currentTier)}>
                            {user.currentTier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.subscriptionStatus)}>
                            {user.subscriptionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Resumes:</span>
                              <span className="font-medium">{user.usageStats.resumesCreated}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-600">Snap:</span>
                              <span className="font-medium text-blue-600">{user.usageStats.snapDownloads || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-600">Pro:</span>
                              <span className="font-medium text-purple-600">{user.usageStats.proDownloads || 0}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-1">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-medium">{(user.usageStats.snapDownloads || 0) + (user.usageStats.proDownloads || 0)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Select
                              value={user.currentTier}
                              onValueChange={(value) => updateUserTier(user.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="BASIC">Basic</SelectItem>
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {ticket.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.user.name}</div>
                            <div className="text-sm text-gray-500">{ticket.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN">Open</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'user-data' && (
          <div className="space-y-6">
            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle>Search User Data</CardTitle>
                <CardDescription>
                  Enter an email address or user ID to retrieve comprehensive user information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserDataSearch} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter email address or user ID..."
                      value={userDataSearch}
                      onChange={(e) => setUserDataSearch(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" disabled={userDataLoading}>
                    {userDataLoading ? 'Searching...' : 'Search'}
                  </Button>
                </form>

                {userDataError && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                    {userDataError}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Data Display */}
            {userData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-sm text-gray-900">{userData.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900">{userData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">User ID</label>
                        <p className="text-sm text-gray-900 font-mono">{userData.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Firebase UID</label>
                        <p className="text-sm text-gray-900 font-mono">{userData.firebaseUid || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{userData.phoneNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Title</label>
                        <p className="text-sm text-gray-900">{userData.title || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-sm text-gray-900">{userData.company || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-sm text-gray-900">{userData.location || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Tier</label>
                        <Badge className={getTierColor(userData.currentTier)}>
                          {userData.currentTier}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Subscription Status</label>
                        <Badge className={getStatusColor(userData.subscriptionStatus)}>
                          {userData.subscriptionStatus}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Active</label>
                        <Badge className={userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {userData.isActive ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Verified</label>
                        <Badge className={userData.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {userData.isEmailVerified ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <Badge className="bg-blue-100 text-blue-800">{userData.role}</Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                        <p className="text-sm text-gray-900">
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <p className="text-sm text-gray-900">{userData.currentLocation?.country || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State/Region</label>
                        <p className="text-sm text-gray-900">{userData.currentLocation?.region || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-sm text-gray-900">{userData.currentLocation?.city || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Seen</label>
                        <p className="text-sm text-gray-900">
                          {userData.currentLocation?.lastSeen ? 
                            new Date(userData.currentLocation.lastSeen).toLocaleString() : 
                            'Never'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Device & Browser Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Device & Browser Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Device Type</label>
                        <p className="text-sm text-gray-900 capitalize">{userData.device?.deviceType || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Operating System</label>
                        <p className="text-sm text-gray-900">
                          {userData.device?.osName || 'Unknown'} {userData.device?.osVersion || ''}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Browser</label>
                        <p className="text-sm text-gray-900">
                          {userData.device?.browserName || 'Unknown'} {userData.device?.browserVersion || ''}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">User Agent</label>
                        <p className="text-sm text-gray-900 truncate" title={userData.device?.userAgent || 'Unknown'}>
                          {userData.device?.userAgent || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Resumes Created</label>
                        <p className="text-lg font-semibold text-gray-900">{userData.usageStats.resumesCreated}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Downloads</label>
                        <p className="text-lg font-semibold text-gray-900">{userData.usageStats.totalDownloads}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-600">Snap Downloads</label>
                        <p className="text-lg font-semibold text-blue-600">{userData.usageStats.snapDownloads}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-purple-600">Pro Downloads</label>
                        <p className="text-lg font-semibold text-purple-600">{userData.usageStats.proDownloads}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Monthly Snap</label>
                        <p className="text-sm text-gray-900">{userData.usageStats.monthlySnapDownloads}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Monthly Pro</label>
                        <p className="text-sm text-gray-900">{userData.usageStats.monthlyProDownloads}</p>
                      </div>
                    </div>

                    {/* Download Formats */}
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Downloads by Format</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(userData.usageStats.downloadsByFormat).map(([format, count]) => (
                          <Badge key={format} variant="outline">
                            {format.toUpperCase()}: {count as number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Recent Downloads */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Downloads</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {userData.downloads.slice(0, 5).map((download: any) => (
                          <div key={download.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{download.templateName || `Template ${download.templateId}`}</span>
                            <div className="flex items-center gap-2">
                              <Badge className={download.templateType === 'snap' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                                {download.templateType}
                              </Badge>
                              <span className="text-gray-500">
                                {new Date(download.downloadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {userData.downloads.length === 0 && (
                          <p className="text-sm text-gray-500">No downloads yet</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Resumes */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Resumes</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {userData.resumes.slice(0, 5).map((resume: any) => (
                          <div key={resume.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{resume.title || 'Untitled Resume'}</span>
                            <span className="text-gray-500">
                              {new Date(resume.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                        {userData.resumes.length === 0 && (
                          <p className="text-sm text-gray-500">No resumes created yet</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">System settings will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserManagementPage;