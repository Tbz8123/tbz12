import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Logo from "@/components/layout/Logo"; // Assuming you have a Logo component

// Schema for login form validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for registration form validation
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [_, navigate] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Login attempt:", values);
    // Mock login: redirect to user dashboard
    localStorage.setItem('mockUser', JSON.stringify({ username: values.username, isAdmin: false }));
    navigate("/dashboard"); 
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    console.log("Register attempt:", values);
    // Mock registration: redirect to user dashboard
    localStorage.setItem('mockUser', JSON.stringify({ username: values.username, isAdmin: false }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl"
        >
          <div className="mb-8 text-center">
            <Logo size="large" />
            <h2 className="mt-6 text-3xl font-bold text-gray-800">User Access</h2>
            <p className="mt-2 text-gray-600">Sign in or register to access your account</p>
          </div>

          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 rounded-md transition-colors">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 rounded-md transition-colors">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">User Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to sign in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Username</FormLabel>
                            <FormControl>
                              <Input className="border-gray-300 focus:border-primary focus:ring-primary" placeholder="Enter your username" {...field} />
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
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input className="border-gray-300 focus:border-primary focus:ring-primary" type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base transition-colors" 
                        // disabled={loginMutation?.isPending} // Assuming no mutation hook for now
                      >
                        {/* {loginMutation?.isPending ? "Signing in..." : "Sign In"} */}
                        Sign In
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Create Account</CardTitle>
                  <CardDescription>
                    Create a new user account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Admin Username</FormLabel>
                            <FormControl>
                              <Input className="border-gray-300 focus:border-primary focus:ring-primary" placeholder="Choose an admin username" {...field} />
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
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input className="border-gray-300 focus:border-primary focus:ring-primary" type="password" placeholder="Create a strong password" {...field} />
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
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <Input className="border-gray-300 focus:border-primary focus:ring-primary" type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base transition-colors" 
                        // disabled={registerMutation?.isPending} // Assuming no mutation hook
                      >
                        {/* {registerMutation?.isPending ? "Creating Account..." : "Create Admin Account"} */}
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1585079350158-860e5712b8b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')"}}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center p-10 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm"
        >
          <h1 className="text-5xl font-bold text-white mb-4">TbzResumeBuilder</h1>
          <p className="text-xl text-gray-200">Empowering Your Career Journey.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;