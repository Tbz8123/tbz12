import React, { Suspense, lazy } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { 
  initGA, 
  trackPageView, 
  enableEnhancedMeasurement,
  enableDebugMode 
} from "@/services/googleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import FirebaseProtectedRoute from "@/components/auth/FirebaseProtectedRoute";

// Admin-only pages
const NotFound = lazy(() => import('@/pages/not-found'));
const AdminSnapPage = lazy(() => import('@/pages/AdminSnapPage'));
const AdminProPage = lazy(() => import('@/pages/AdminProPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DatabaseManagementPage = lazy(() => import('@/pages/DatabaseManagementPage'));
const SnapTemplateEditor = lazy(() => import('@/pages/Admin/SnapTemplateEditor'));
const ProTemplateEditor = lazy(() => import('@/pages/Admin/ProTemplateEditor'));
const TemplatesManagement = lazy(() => import('@/pages/Admin/TemplatesManagement'));
const EditTemplate = lazy(() => import('@/pages/Admin/EditTemplate'));
const ViewTemplate = lazy(() => import('@/pages/Admin/ViewTemplate'));
const ProTemplatesManagement = lazy(() => import('@/pages/Admin/ProTemplatesManagement'));
const EditProTemplate = lazy(() => import('@/pages/Admin/EditProTemplate'));
const ViewProTemplate = lazy(() => import('@/pages/Admin/ViewProTemplate'));
const JobTitlesManagement = lazy(() => import('@/pages/Admin/JobTitlesManagement'));
const SkillsManagement = lazy(() => import('@/pages/Admin/SkillsManagement'));
const ProfessionalSummaryManagement = lazy(() => import('@/pages/Admin/ProfessionalSummaryManagement'));
const AdminTierSelectionPage = lazy(() => import('@/pages/AdminTierSelectionPage'));
const ImportHistoryPage = lazy(() => import('@/pages/Admin/ImportHistoryPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const SubscriptionManagement = lazy(() => import('@/pages/Admin/SubscriptionManagement'));

function Router() {
  const [location] = useLocation();

  // Track page views when route changes
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Switch>
      {/* Redirect root to admin dashboard */}
      <Route path="/">
        <Redirect to="/admin/pro" />
      </Route>
      
      {/* Login route - accessible without authentication */}
      <Route path="/login" component={LoginPage} />
      
      {/* Auth route - accessible without authentication */}
      <Route path="/auth" component={AuthPage} />
      
      {/* All admin routes require authentication and admin privileges */}
      <Route path="/admin/snap">
        <FirebaseProtectedRoute requireAdmin={true}>
          <AdminSnapPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/pro">
        <FirebaseProtectedRoute requireAdmin={true}>
          <AdminProPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/tier-selection">
        <FirebaseProtectedRoute requireAdmin={true}>
          <AdminTierSelectionPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/database">
        <FirebaseProtectedRoute requireAdmin={true}>
          <DatabaseManagementPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/templates/new">
        <FirebaseProtectedRoute requireAdmin={true}>
          <SnapTemplateEditor />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/templates/pro-editor">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ProTemplateEditor />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/templates">
        <FirebaseProtectedRoute requireAdmin={true}>
          <TemplatesManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/templates/edit/:id">
        <FirebaseProtectedRoute requireAdmin={true}>
          <EditTemplate />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/templates/view/:id">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ViewTemplate />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/snap/templates/management">
        <FirebaseProtectedRoute requireAdmin={true}>
          <TemplatesManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/pro/templates/management">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ProTemplatesManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/pro-templates/edit/:id">
        <FirebaseProtectedRoute requireAdmin={true}>
          <EditProTemplate />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/pro-templates/view/:id">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ViewProTemplate />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/jobs">
        <FirebaseProtectedRoute requireAdmin={true}>
          <JobTitlesManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/skills">
        <FirebaseProtectedRoute requireAdmin={true}>
          <SkillsManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/professional-summaries">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ProfessionalSummaryManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/import-history">
        <FirebaseProtectedRoute requireAdmin={true}>
          <ImportHistoryPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <FirebaseProtectedRoute requireAdmin={true}>
          <UserManagementPage />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route path="/admin/subscription">
        <FirebaseProtectedRoute requireAdmin={true}>
          <SubscriptionManagement />
        </FirebaseProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  
  // Initialize Google Analytics 4
  useEffect(() => {
    // initGA();
    // enableEnhancedMeasurement();

    // // Enable debug mode in development
    // if (import.meta.env.DEV) {
    //   enableDebugMode();
    // }

    // For testing: Set mock admin user if not exists
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      console.log('Setting mock admin user for testing...');
      localStorage.setItem('mockUser', JSON.stringify({
        username: 'admin',
        isAdmin: true,
        role: 'ADMIN',
        role: 'ADMIN',
        tier: 'ENTERPRISE'
      }));
    }
  }, []);

  // Don't show header on login and auth pages
  const hideHeader = location === '/login' || location === '/auth';

  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          {!hideHeader && <Header />}
          <main className={hideHeader ? "min-h-screen" : "flex-grow"}>
            <Suspense fallback={<div>Loading...</div>}>
              <Router />
            </Suspense>
          </main>
        </div>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
