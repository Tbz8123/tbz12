import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Settings, Code, Layers, FileEdit, Plus, Database, Palette, Server, Shield, Briefcase, BookText } from 'lucide-react';

// Remove AnimatedSection if not present in the codebase
const AnimatedSection = ({ children, ...props }: any) => <div {...props}>{children}</div>;

const AdminSnapPage = () => {
  const [_, setLocation] = useLocation();
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get mock user from localStorage (set by AuthPage)
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  const snapCategories = [
    {
      id: 'snap-templates',
      name: 'Snap Template Management',
      description: 'Manage templates for the Snap tier',
      icon: <FileText className="h-6 w-6" />,
      items: [
        { title: 'All Templates', description: 'View and manage all resume templates', icon: <Layers className="h-5 w-5" />, path: '/admin/snap/templates/management', color: 'bg-blue-500' },
        { title: 'Create New Template', description: 'Add a new resume template', icon: <Plus className="h-5 w-5" />, path: '/admin/templates/new', color: 'bg-green-500' },
        { title: 'Basic Editor', description: 'Simple template editor interface', icon: <FileEdit className="h-5 w-5" />, path: '/admin/snap/templates/edit', color: 'bg-purple-500' },
        { title: 'Advanced Editor', description: 'Full-featured template editor with code access', icon: <Code className="h-5 w-5" />, path: '/admin/snap/templates/advanced-edit', color: 'bg-orange-500' },
        { title: 'Template Bindings', description: 'Connect template placeholders with data fields', icon: <Layers className="h-5 w-5" />, path: '/admin/snap/templates', color: 'bg-pink-500' },
      ],
    },
    {
      id: 'snap-content',
      name: 'Snap Content Management',
      description: 'Manage content for the Snap tier',
      icon: <BookText className="h-6 w-6" />,
      items: [
        { title: 'Job Titles & Descriptions', description: 'Manage job titles and their associated descriptions', icon: <Briefcase className="h-5 w-5" />, path: '/admin/snap/jobs', color: 'bg-emerald-500' },
        { title: 'Education Content', description: 'Manage education categories and examples', icon: <BookText className="h-5 w-5" />, path: '/admin/snap/education', color: 'bg-blue-500' },
        { title: 'Skills Management', description: 'Manage skills and their categories', icon: <Layers className="h-5 w-5" />, path: '/admin/snap/skills', color: 'bg-purple-500' },
        { title: 'Professional Summaries', description: 'Manage professional summary titles and descriptions', icon: <FileText className="h-5 w-5" />, path: '/admin/snap/professional-summary', color: 'bg-cyan-500' },
        { title: 'Job API Test', description: 'Test job descriptions API functionality', icon: <Server className="h-5 w-5" />, path: '/admin/snap/jobs/test-api', color: 'bg-indigo-500' },
      ],
    },
    {
      id: 'system',
      name: 'System Management',
      description: 'Manage system settings and configurations',
      icon: <Settings className="h-6 w-6" />, 
      items: [
        { title: 'Users', description: 'Manage user accounts and permissions', icon: <Users className="h-5 w-5" />, path: '/admin/users', color: 'bg-indigo-500' },
        { title: 'Settings', description: 'Configure system settings', icon: <Settings className="h-5 w-5" />, path: '/admin/settings', color: 'bg-teal-500' },
        { title: 'Database', description: 'Database management and maintenance', icon: <Database className="h-5 w-5" />, path: '/admin/database', color: 'bg-cyan-500' },
        { title: 'Theme', description: 'Customize the application appearance', icon: <Palette className="h-5 w-5" />, path: '/admin/theme', color: 'bg-pink-500' },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <AnimatedSection animation="fadeInUp" className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Snap Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to the TbzResumeBuilder Snap tier management portal. Manage basic templates, content, and system settings.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">Logged in as Admin: {user?.username}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapCategories.map((category) => (
            <Card key={category.id} className="shadow-md border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <Button
                      key={item.path}
                      className={`w-full flex items-center justify-start ${item.color} text-white`}
                      onClick={() => setLocation(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AdminSnapPage; 