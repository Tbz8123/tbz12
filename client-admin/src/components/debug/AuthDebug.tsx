import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { currentUser, userData, loading } = useAuth();
  
  // Get localStorage data
  const mockUser = localStorage.getItem('mockUser');
  let parsedMockUser = null;
  try {
    parsedMockUser = mockUser ? JSON.parse(mockUser) : null;
  } catch (e) {
    console.error('Error parsing mock user:', e);
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Current User: {currentUser ? 'exists' : 'null'}</div>
        <div>User Role: {currentUser?.role || 'none'}</div>
        <div>User Email: {currentUser?.email || 'none'}</div>
        <div>User Data: {userData ? 'exists' : 'null'}</div>
        <div>LocalStorage Mock User: {mockUser ? 'exists' : 'null'}</div>
        {parsedMockUser && (
          <div className="mt-2">
            <div>Mock Role: {parsedMockUser.role || 'none'}</div>
            <div>Mock isAdmin: {parsedMockUser.isAdmin ? 'true' : 'false'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;