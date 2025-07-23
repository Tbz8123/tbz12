import React from "react";
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
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ResumeBuilder from "@/pages/ResumeBuilder";
import Preview from "@/pages/Preview";
import PackageSelection from "@/pages/PackageSelection";
import ProSuitePage from "@/pages/ProSuitePage";
import TemplatesPage from "@/pages/TemplatesPage";
import UploadOptionsPage from "@/pages/UploadOptionsPage";
import PersonalInformationPage from "@/pages/PersonalInformationPage";
import WhyNeedResumePage from "@/pages/WhyNeedResumePage";
import WorkExperienceDetailsPage from "@/pages/WorkExperienceDetailsPage";
import JobDescriptionPage from "@/pages/JobDescriptionPage";
import WorkHistorySummaryPage from "@/pages/WorkHistorySummaryPage";
import EducationPage from "@/pages/EducationPage";
import EducationSummaryPage from "@/pages/EducationSummaryPage";
import SkillsPage from "@/pages/SkillsPage";
import SkillsSummaryPage from "@/pages/SkillsSummaryPage";
import ProfessionalSummaryPage from "@/pages/ProfessionalSummaryPage";
import AddSectionPage from "@/pages/AddSectionPage";
import SectionDetailFormPage from "@/pages/SectionDetailFormPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminSnapPage from "@/pages/AdminSnapPage";
import AdminProPage from "@/pages/AdminProPage";
import AuthPage from "@/pages/AuthPage";
import LoginPage from "@/pages/LoginPage";
import DatabaseManagementPage from "@/pages/DatabaseManagementPage";
import SnapTemplateEditor from "@/pages/Admin/SnapTemplateEditor";
import ProTemplateEditor from "@/pages/Admin/ProTemplateEditor";
import TemplatesManagement from "@/pages/Admin/TemplatesManagement";
import EditTemplate from "@/pages/Admin/EditTemplate";
import ViewTemplate from "@/pages/Admin/ViewTemplate";
import ProTemplatesManagement from "@/pages/Admin/ProTemplatesManagement";
import EditProTemplate from "@/pages/Admin/EditProTemplate";
import ViewProTemplate from "@/pages/Admin/ViewProTemplate";
import JobTitlesManagement from "@/pages/Admin/JobTitlesManagement";
import SkillsManagement from "@/pages/Admin/SkillsManagement";
import ProfessionalSummaryManagement from "@/pages/Admin/ProfessionalSummaryManagement";
import AdminTierSelectionPage from "@/pages/AdminTierSelectionPage";
import FinalPage from "@/pages/FinalPage";
import ImportHistoryPage from "@/pages/Admin/ImportHistoryPage";
import Dashboard from "@/pages/Dashboard";
import UserManagementPage from "@/pages/UserManagementPage";
import SubscriptionManagement from "@/pages/Admin/SubscriptionManagement";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";



const SnapTemplateEditorPage = () => <SnapTemplateEditor />;
const ProTemplateEditorPage = () => <ProTemplateEditor />;

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
      <Route path="/admin/snap" component={AdminSnapPage} />
      <Route path="/admin/pro" component={AdminProPage} />
      <Route path="/admin/tier-selection" component={AdminTierSelectionPage} />
      <Route path="/admin/database" component={DatabaseManagementPage} />
      <Route path="/admin/templates/new" component={SnapTemplateEditorPage} />
      <Route path="/admin/templates/pro-editor" component={ProTemplateEditorPage} />
      <Route path="/admin/templates" component={TemplatesManagement} />
      <Route path="/admin/templates/edit/:id" component={EditTemplate} />
      <Route path="/admin/templates/view/:id" component={ViewTemplate} />
      <Route path="/admin/snap/templates/management" component={TemplatesManagement} />
      <Route path="/admin/pro/templates/management" component={ProTemplatesManagement} />
      <Route path="/admin/pro-templates/edit/:id" component={EditProTemplate} />
      <Route path="/admin/pro-templates/view/:id" component={ViewProTemplate} />
      <Route path="/admin/jobs" component={JobTitlesManagement} />
      <Route path="/admin/skills" component={SkillsManagement} />
      <Route path="/admin/professional-summaries" component={ProfessionalSummaryManagement} />
      <Route path="/admin/import-history" component={ImportHistoryPage} />
      <Route path="/admin/users" component={UserManagementPage} />
      <Route path="/admin/subscription" component={SubscriptionManagement} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/final" component={FinalPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success/:id" component={OrderSuccessPage} />
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
            <Router />
          </main>
          {/* <Footer /> */}
        </div>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
