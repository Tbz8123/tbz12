import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Copy, 
  User, 
  Settings, 
  BarChart3, 
  Calendar, 
  Clock,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import FirebaseProtectedRoute from '@/components/auth/FirebaseProtectedRoute';

// Floating Particles Component (reused from Home page)
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Resume Card Component
interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    updatedAt: string;
    template?: string;
    status?: 'draft' | 'completed';
  };
  index: number;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ 
  resume, 
  index, 
  onEdit, 
  onPreview, 
  onDownload, 
  onDuplicate, 
  onDelete 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Card className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-purple-200/20 hover:border-purple-400/40 transition-all duration-300 overflow-hidden">
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg font-bold mb-2 line-clamp-1">
                {resume.title || 'Untitled Resume'}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge 
              variant={resume.status === 'completed' ? 'default' : 'secondary'}
              className="ml-2"
            >
              {resume.status === 'completed' ? 'Complete' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Resume Preview Placeholder */}
          <div className="bg-white/10 rounded-lg p-4 mb-4 h-32 flex items-center justify-center border border-purple-200/20">
            <FileText className="h-8 w-8 text-purple-300" />
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2 flex-wrap"
              >
                <Button
                  size="sm"
                  onClick={() => onEdit(resume.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(resume.id)}
                  className="border-purple-300 text-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(resume.id)}
                  className="border-green-300 text-green-300 hover:bg-green-600 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDuplicate(resume.id)}
                  className="border-yellow-300 text-yellow-300 hover:bg-yellow-600 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(resume.id)}
                  className="border-red-300 text-red-300 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-purple-200/20 hover:border-purple-400/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${color}`}>
                <TrendingUp className="h-4 w-4 inline mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-br ${color.replace('text-', 'from-').replace('-400', '-500/20')} to-transparent`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('resumes');
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration - in production, this would come from your API
  const mockStats = {
    totalResumes: 12,
    totalDownloads: 89,
    profileViews: 234,
    successRate: 94
  };

  const mockResumes = [
    {
      id: '1',
      title: 'Senior Software Engineer Resume',
      updatedAt: '2024-01-15',
      template: 'Professional',
      status: 'completed' as const
    },
    {
      id: '2', 
      title: 'Marketing Manager Resume',
      updatedAt: '2024-01-14',
      template: 'Modern',
      status: 'draft' as const
    },
    {
      id: '3',
      title: 'Data Scientist Resume',
      updatedAt: '2024-01-13',
      template: 'Creative',
      status: 'completed' as const
    }
  ];

  const handleEditResume = (id: string) => {
    setLocation(`/resume-builder?resume=${id}`);
  };

  const handlePreviewResume = (id: string) => {
    setLocation(`/preview/${id}`);
  };

  const handleDownloadResume = (id: string) => {
    toast({
      title: "Download Started",
      description: "Your resume is being downloaded...",
    });
  };

  const handleDuplicateResume = (id: string) => {
    toast({
      title: "Resume Duplicated",
      description: "A copy of your resume has been created.",
    });
  };

  const handleDeleteResume = (id: string) => {
    toast({
      title: "Resume Deleted",
      description: "Your resume has been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Floating Particles Background */}
      {!isMobile && <FloatingParticles />}

      {/* Enhanced Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-purple-400/30 shadow-lg">
                    <AvatarImage src={currentUser?.photoURL || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-lg font-bold">
                      {getInitials(currentUser?.displayName || currentUser?.email || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {currentUser?.displayName || 'User'}!
                  </h1>
                  <p className="text-purple-200">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Button
                  onClick={() => setLocation('/resume-builder')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatsCard
              title="Total Resumes"
              value={mockStats.totalResumes}
              change="+2 this month"
              icon={<FileText className="w-6 h-6" />}
              color="from-blue-500 to-cyan-500"
            />
            <StatsCard
              title="Downloads"
              value={mockStats.totalDownloads}
              change="+12 this week"
              icon={<Download className="w-6 h-6" />}
              color="from-green-500 to-emerald-500"
            />
            <StatsCard
              title="Profile Views"
              value={mockStats.profileViews}
              change="+5.2% this month"
              icon={<Eye className="w-6 h-6" />}
              color="from-purple-500 to-pink-500"
            />
            <StatsCard
              title="Success Rate"
              value={`${mockStats.successRate}%`}
              change="+2.1% this month"
              icon={<TrendingUp className="w-6 h-6" />}
              color="from-orange-500 to-red-500"
            />
          </motion.div>

          {/* Main Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1">
                <TabsTrigger 
                  value="resumes" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg text-white hover:bg-white/20 transition-all duration-300 rounded-lg py-3"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Resumes
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg text-white hover:bg-white/20 transition-all duration-300 rounded-lg py-3"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg text-white hover:bg-white/20 transition-all duration-300 rounded-lg py-3"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resumes" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">My Resumes</h2>
                  <Button
                    onClick={() => setLocation('/resume-builder')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Resume
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockResumes.map((resume, index) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      index={index}
                      onEdit={handleEditResume}
                      onPreview={handlePreviewResume}
                      onDownload={handleDownloadResume}
                      onDuplicate={handleDuplicateResume}
                      onDelete={handleDeleteResume}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Analytics & Insights</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Resume Views</span>
                          <span className="font-bold">1,234</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Download Rate</span>
                          <span className="font-bold">23%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Interview Callbacks</span>
                          <span className="font-bold">18</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-900" />
                          </div>
                          <div>
                            <p className="font-medium">Resume Master</p>
                            <p className="text-sm text-gray-300">Created 10+ resumes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-green-900" />
                          </div>
                          <div>
                            <p className="font-medium">High Performer</p>
                            <p className="text-sm text-gray-300">90%+ success rate</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Name
                          </label>
                          <p className="text-white">{currentUser?.displayName || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <p className="text-white">{currentUser?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Account Type
                          </label>
                          <Badge variant="secondary" className="bg-purple-600 text-white">
                            {currentUser?.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Default Template
                          </label>
                          <p className="text-white">Professional</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notifications
                          </label>
                          <p className="text-white">Email notifications enabled</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Privacy
                          </label>
                          <p className="text-white">Profile is private</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <FirebaseProtectedRoute>
      <DashboardContent />
    </FirebaseProtectedRoute>
  );
};

export default Dashboard; 