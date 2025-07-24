import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface FirebaseProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const FirebaseProtectedRoute: React.FC<FirebaseProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser, loading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    localStorage.removeItem('mockUser');
    if (!loading) {
      // Check for mock user in localStorage first
      const mockUserData = localStorage.getItem('mockUser');
      let hasMockAuth = false;
      
      if (mockUserData) {
        try {
          const parsedData = JSON.parse(mockUserData);
          if (parsedData.isAdmin && parsedData.role === 'ADMIN') {
            hasMockAuth = true;
          }
        } catch (error) {
          console.error('Error parsing mock user data:', error);
          localStorage.removeItem('mockUser');
        }
      }

      // If no mock auth and no current user, redirect to login
      if (!hasMockAuth && !currentUser) {
        setLocation('/login');
        return;
      }

      // If admin required, check both mock auth and Firebase auth
      if (requireAdmin) {
        const isAdminViaMock = hasMockAuth;
        const isAdminViaFirebase = currentUser && currentUser.role === 'ADMIN';
        
        if (!isAdminViaMock && !isAdminViaFirebase) {
          setLocation('/login');
          return;
        }
      }
    }
  }, [currentUser, loading, requireAdmin, setLocation]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Check authentication status
  const mockUserData = localStorage.getItem('mockUser');
  let hasMockAuth = false;
  
  if (mockUserData) {
    try {
      const parsedData = JSON.parse(mockUserData);
      if (parsedData.isAdmin && parsedData.role === 'ADMIN') {
        hasMockAuth = true;
      }
    } catch (error) {
      console.error('Error parsing mock user data:', error);
    }
  }

  // Allow access if user has mock admin auth or Firebase admin auth
  const hasAccess = hasMockAuth || (currentUser && (!requireAdmin || currentUser.role === 'ADMIN'));
  
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default FirebaseProtectedRoute;