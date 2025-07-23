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
// AuthPage removed - admin authentication should only be in client-admin application
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const FinalPage = lazy(() => import('@/pages/FinalPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));

// Admin components removed - they should only exist in client-admin application



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
      <Route path="/final" component={FinalPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success/:id" component={OrderSuccessPage} />
      
      {/* Admin routes removed - they should only exist in client-admin application */}
      
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
    <Suspense fallback={<div>Loading...</div>}>
      <TooltipProvider>
        <AuthProvider>
          <Header />
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </Suspense>
  );
}

export default App;
