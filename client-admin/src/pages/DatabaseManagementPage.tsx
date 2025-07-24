
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Database, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DatabaseManagementPage = () => {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [envVars, setEnvVars] = useState({
    SESSION_SECRET: '',
    PGDATABASE: '',
    PGHOST: '',
    PGPORT: '',
    PGUSER: '',
    PGPASSWORD: '',
    DATABASE_URL: ''
  });

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const fetchEnvVars = async () => {
    try {
      const response = await fetch('/api/admin/env/database');
      if (!response.ok) throw new Error('Failed to fetch environment variables');
      const data = await response.json();
      setEnvVars(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load database configuration",
        variant: "destructive",
      });
    }
  };

  const handleEnvUpdate = async () => {
    try {
      const response = await fetch('/api/admin/env/database/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envVars),
      });

      if (!response.ok) throw new Error('Failed to update environment variables');

      toast({
        title: "Success",
        description: "Database configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update database configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Database className="h-8 w-8 mr-3 text-primary" />
            <CardTitle className="text-2xl">Database Configuration</CardTitle>
          </div>
          <CardDescription>
            Update your database connection settings and environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{key}</label>
              <div className="relative">
                <Input
                  type={key.includes('PASSWORD') || key.includes('SECRET') ? (showPassword[key] ? 'text' : 'password') : 'text'}
                  value={value}
                  onChange={(e) => setEnvVars(prev => ({ ...prev, [key]: e.target.value }))}
                  className="font-mono"
                />
                {(key.includes('PASSWORD') || key.includes('SECRET')) && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button onClick={handleEnvUpdate} className="w-full mt-4">
            Update Configuration
          </Button>

          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Changes to database configuration will require a server restart to take effect. Make sure to test your connection before saving.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManagementPage;
