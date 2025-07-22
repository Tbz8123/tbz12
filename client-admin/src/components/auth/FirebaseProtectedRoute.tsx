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
    if (!loading) {
      if (!currentUser) {
        // Redirect to login if not authenticated
        setLocation('/login');
        return;
      }

      if (requireAdmin && !currentUser.isAdmin) {
        // Redirect to dashboard if admin required but user is not admin
        setLocation('/dashboard');
        return;
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

  // Don't render children if not authenticated or not admin (when required)
  if (!currentUser || (requireAdmin && !currentUser.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default FirebaseProtectedRoute; 