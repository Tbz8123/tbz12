import React, { Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { 
  initGA, 
  trackPageView, 
  enableEnhancedMeasurement,
  enableDebugMode 
} from "@/services/googleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";

const NotFound = lazy(() => import('@/pages/not-found'));
const Home = lazy(() => import('@/pages/Home'));
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder'));
const Preview = lazy(() => import('@/pages/Preview'));
const PackageSelection = lazy(() => import('@/pages/PackageSelection'));
const ProSuitePage = lazy(() => import('@/pages/ProSuitePage'));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'));
const UploadOptionsPage = lazy(() => import('@/pages/UploadOptionsPage'));
const PersonalInformationPage = lazy(() => import('@/pages/PersonalInformationPage'));
const WhyNeedResumePage = lazy(() => import('@/pages/WhyNeedResumePage'));
const WorkExperienceDetailsPage = lazy(() => import('@/pages/WorkExperienceDetailsPage'));
const JobDescriptionPage = lazy(() => import('@/pages/JobDescriptionPage'));
const WorkHistorySummaryPage = lazy(() => import('@/pages/WorkHistorySummaryPage'));
const EducationPage = lazy(() => import('@/pages/EducationPage'));
const EducationSummaryPage = lazy(() => import('@/pages/EducationSummaryPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const SkillsSummaryPage = lazy(() => import('@/pages/SkillsSummaryPage'));
const ProfessionalSummaryPage = lazy(() => import('@/pages/ProfessionalSummaryPage'));
const AddSectionPage = lazy(() => import('@/pages/AddSectionPage'));
const SectionDetailFormPage = lazy(() => import('@/pages/SectionDetailFormPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const FinalPage = lazy(() => import('@/pages/FinalPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));

// Admin pages
const AdminTierSelectionPage = lazy(() => import('@/pages/Admin/AdminTierSelectionPage'));
const AdminSnapPage = lazy(() => import('@/pages/Admin/AdminSnapPage'));
const AdminProPage = lazy(() => import('@/pages/Admin/AdminProPage'));
const UserManagementPage = lazy(() => import('@/pages/Admin/UserManagementPage'));
const DatabaseManagementPage = lazy(() => import('@/pages/Admin/DatabaseManagementPage'));
const AdminPanel = lazy(() => import('@/components/AdminPanel'));

// Admin sub-pages
const TemplatesManagement = lazy(() => import('@/pages/Admin/TemplatesManagement'));
const ProTemplatesManagement = lazy(() => import('@/pages/Admin/ProTemplatesManagement'));
const JobTitlesManagement = lazy(() => import('@/pages/Admin/JobTitlesManagement'));
const ImportHistoryPage = lazy(() => import('@/pages/Admin/ImportHistoryPage'));
const SnapTemplateEditor = lazy(() => import('@/pages/Admin/SnapTemplateEditor'));
const ProTemplateEditor = lazy(() => import('@/pages/Admin/ProTemplateEditor'));
const EditTemplate = lazy(() => import('@/pages/Admin/EditTemplate'));
const EditProTemplate = lazy(() => import('@/pages/Admin/EditProTemplate'));
const ViewTemplate = lazy(() => import('@/pages/Admin/ViewTemplate'));
const ViewProTemplate = lazy(() => import('@/pages/Admin/ViewProTemplate'));
const SkillsManagement = lazy(() => import('@/pages/Admin/SkillsManagement'));
const ProfessionalSummaryManagement = lazy(() => import('@/pages/Admin/ProfessionalSummaryManagement'));
const SubscriptionManagement = lazy(() => import('@/pages/Admin/SubscriptionManagement'));



function Router() {
  const [location] = useLocation();

  // Track page views when route changes
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/package-selection" component={PackageSelection} />
      <Route path="/pro-suite" component={ProSuitePage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/upload-options" component={UploadOptionsPage} />
      <Route path="/personal-information" component={PersonalInformationPage} />
      <Route path="/why-need-resume" component={WhyNeedResumePage} />
      <Route path="/work-experience-details" component={WorkExperienceDetailsPage} />
      <Route path="/job-description" component={JobDescriptionPage} />
      <Route path="/work-history-summary" component={WorkHistorySummaryPage} />
      <Route path="/education" component={EducationPage} />
      <Route path="/education-summary" component={EducationSummaryPage} />
      <Route path="/skills" component={SkillsPage} />
      <Route path="/skills-summary" component={SkillsSummaryPage} />
      <Route path="/professional-summary" component={ProfessionalSummaryPage} />
      <Route path="/add-section" component={AddSectionPage} />
      <Route path="/section/:sectionName" component={SectionDetailFormPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/final" component={FinalPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success/:id" component={OrderSuccessPage} />
      
      {/* Admin routes */}
      <Route path="/admin/tier-selection" component={AdminTierSelectionPage} />
      <Route path="/admin/snap" component={AdminSnapPage} />
      <Route path="/admin/pro" component={AdminProPage} />
      <Route path="/admin/users" component={UserManagementPage} />
      <Route path="/admin/database" component={DatabaseManagementPage} />
      
      {/* Admin sub-routes */}
      <Route path="/admin/snap/templates/management" component={TemplatesManagement} />
      <Route path="/admin/pro/templates/management" component={ProTemplatesManagement} />
      <Route path="/admin/templates/new" component={SnapTemplateEditor} />
      <Route path="/admin/templates/edit/:id" component={EditTemplate} />
      <Route path="/admin/templates/view/:id" component={ViewTemplate} />
      <Route path="/admin/pro/templates/new" component={ProTemplateEditor} />
      <Route path="/admin/templates/pro-editor" component={ProTemplateEditor} />
      <Route path="/admin/pro/templates/edit/:id" component={EditProTemplate} />
      <Route path="/admin/pro/templates/view/:id" component={ViewProTemplate} />
      <Route path="/admin/jobs" component={JobTitlesManagement} />
      <Route path="/admin/import-history" component={ImportHistoryPage} />
      <Route path="/admin/skills" component={SkillsManagement} />
      <Route path="/admin/summaries" component={ProfessionalSummaryManagement} />
      <Route path="/admin/professional-summaries" component={ProfessionalSummaryManagement} />
      <Route path="/admin/subscriptions" component={SubscriptionManagement} />
      <Route path="/admin/subscription" component={SubscriptionManagement} />
      
      <Route path="/admin" component={AdminPanel} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics 4
  useEffect(() => {
    initGA();
    enableEnhancedMeasurement();

    // Enable debug mode in development
    if (import.meta.env.DEV) {
      enableDebugMode();
    }
  }, []);

  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<div>Loading...</div>}>
              <Router />
            </Suspense>
          </main>
          {/* <Footer /> */}
        </div>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
