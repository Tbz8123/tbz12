import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';
import { Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react';

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for registration form validation
const registerSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const { login, signup, loginWithGoogle, currentUser } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      setLocation('/dashboard');
    }
  }, [currentUser, setLocation]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });
      setLocation('/dashboard');
    } catch (error: unknown) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await signup(values.email, values.password, values.displayName);
      toast({
        title: 'Account Created!',
        description: 'Your account has been created successfully.',
      });
      setLocation('/dashboard');
    } catch (error: unknown) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: 'Success!',
        description: 'You have been logged in with Google.',
      });
      setLocation('/dashboard');
    } catch (error: unknown) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Please try again.';
      if (error instanceof Error) {
        if (error.message === 'Sign-in was cancelled') {
          errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (error.message.includes('popup')) {
          errorMessage = 'Please allow popups and try again.';
        } else if (error.message.includes('unauthorized-domain')) {
          errorMessage = 'This domain is not configured for Google sign-in.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Google Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8">
            <Logo size="large" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <br />
            <span className="text-yellow-300">TBZ Resume Builder</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-md">
            Create professional resumes with our AI-powered platform. 
            Join thousands of professionals who've landed their dream jobs.
          </p>
          <div className="flex items-center justify-center space-x-8 text-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-sm">Resumes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="mb-8 text-center">
            <div className="md:hidden mb-6">
              <Logo size="medium" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join TBZ Today'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'login' 
                ? 'Sign in to continue building amazing resumes' 
                : 'Create your account and start building professional resumes'
              }
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-xl p-1">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm py-3 rounded-lg transition-all font-medium"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm py-3 rounded-lg transition-all font-medium"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              placeholder="Enter your email" 
                              type="email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 pr-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 h-12 text-base font-medium rounded-lg transition-all shadow-lg hover:shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              placeholder="Enter your full name" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              placeholder="Enter your email" 
                              type="email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 pr-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a password" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-10 pr-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg" 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm your password" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 h-12 text-base font-medium rounded-lg transition-all shadow-lg hover:shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
            disabled={isLoading}
          >
            <Chrome className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;