import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      setLocation(redirectTo);
    }
  }, [setLocation, redirectTo]);

  // Check if user is authenticated
  const mockUser = localStorage.getItem('mockUser');

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-400 rounded-full mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 