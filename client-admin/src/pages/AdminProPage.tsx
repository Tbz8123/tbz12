import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, FileText, Users, Settings, Database, Shield, Server, Layers, BookText } from "lucide-react";
import AuthDebug from '@/components/debug/AuthDebug';

const AdminProPage = () => {
  const [, setLocation] = useLocation();

  const adminCategories = [
    {
      id: "templates",
      name: "Templates",
      description: "Manage resume templates and layouts",
      icon: <FileText className="h-6 w-6" />,
      items: [
        {
          title: "Snap Templates",
          description: "Quick and simple resume templates",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/snap/templates/management",
          color: "bg-purple-500"
        },
        {
          title: "Pro Templates",
          description: "Professional resume templates with advanced features",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/pro/templates/management",
          color: "bg-blue-500"
        },
        {
          title: "Template Editor",
          description: "Create and edit resume templates",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/templates/new",
          color: "bg-green-500"
        }
      ]
    },
    {
      id: "content",
      name: "Content Management",
      description: "Manage resume content and data",
      icon: <Database className="h-6 w-6" />,
      items: [
        {
          title: "Job Titles & Descriptions",
          description: "Manage job titles and their descriptions",
          icon: <FileText className="h-5 w-5" />,
          path: "/admin/jobs",
          color: "bg-emerald-500"
        },
        {
          title: "Import History",
          description: "Track and manage data import operations",
          icon: <Database className="h-5 w-5" />,
          path: "/admin/import-history",
          color: "bg-violet-500"
        },
        {
          title: "Skills Management",
          description: "Manage skill categories and individual skills",
          icon: <Layers className="h-5 w-5" />,
          path: "/admin/skills",
          color: "bg-orange-500"
        },
        {
          title: "Professional Summaries",
          description: "Manage professional summaries by job title",
          icon: <BookText className="h-5 w-5" />,
          path: "/admin/professional-summaries",
          color: "bg-teal-500"
        }
      ]
    },
    {
      id: "system",
      name: "System Management",
      description: "Manage system settings and configurations",
      icon: <Settings className="h-6 w-6" />,
      items: [
        {
          title: "User Management",
          description: "Manage user accounts, permissions, and subscriptions",
          icon: <Users className="h-5 w-5" />,
          path: "/admin/users",
          color: "bg-indigo-500"
        },
        {
          title: "Subscription Management",
          description: "Manage subscription packages, pricing, and discount codes",
          icon: <Settings className="h-5 w-5" />,
          path: "/admin/subscription",
          color: "bg-purple-500"
        },
        {
          title: "Database",
          description: "Database management and maintenance",
          icon: <Database className="h-5 w-5" />,
          path: "/admin/database",
          color: "bg-cyan-500"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-20">
      <AuthDebug />
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(147,51,234,0.03)_50%,transparent_65%)]"></div>
      </div>

      <div className="container mx-auto py-10 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Developer Dashboard</h1>
              <p className="text-gray-300 mt-1">
                Welcome to the TbzResumeBuilder developer portal. Manage templates, users and system settings.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Logged in as Admin</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white">
                  <Server className="h-5 w-5 mr-2 text-purple-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-lg flex flex-col border border-green-500/20">
                    <span className="text-xs text-green-400 font-medium">API</span>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm font-medium text-white">Operational</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-lg flex flex-col border border-green-500/20">
                    <span className="text-xs text-green-400 font-medium">Database</span>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm font-medium text-white">Connected</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-lg flex flex-col border border-green-500/20">
                    <span className="text-xs text-green-400 font-medium">Storage</span>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm font-medium text-white">Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="w-full mb-6 flex justify-center bg-white/5 backdrop-blur-xl border border-white/10">
            {adminCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center text-gray-300 data-[state=active]:text-white data-[state=active]:bg-purple-500/30"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {adminCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-white">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((item) => (
                    <Card key={item.title} className="h-full flex flex-col bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 shadow-xl">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                          {item.icon}
                        </div>
                        <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
                          onClick={() => setLocation(item.path)}
                        >
                          <LayoutGrid className="h-4 w-4 mr-2" /> Access
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminProPage;