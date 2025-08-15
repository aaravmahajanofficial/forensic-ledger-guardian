import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import {
  CourtDashboardPage,
  OfficerDashboardPage,
  ForensicDashboardPage,
  LawyerDashboardPage,
} from "./pages/RoleDashboards";
import Cases from "./pages/Cases";
import Evidence from "./pages/Evidence";
import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Help from "./pages/Help";
import FAQ from "./pages/help/Faq";
import NotFound from "./pages/NotFound";
import { Web3Provider } from "./contexts/Web3Context";
import { AuthProvider } from "./contexts/AuthContext";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";

// FIR pages
import FIR from "./pages/fir/Fir";

// Court role specific pages
import UserManagement from "./pages/users/Manage";
import RoleManagement from "./pages/court/RoleManagement";
import SystemConfiguration from "./pages/court/SystemConfiguration";
import AuditLogs from "./pages/court/AuditLogs";
import ReportsAnalytics from "./pages/court/ReportsAnalytics";
import CreateCase from "./pages/cases/CreateCase";
import CasesApproval from "./pages/cases/CasesApproval";
import CaseDetail from "./pages/cases/CaseDetail";
import AddUser from "./pages/users/AddUser";

// Officer role specific pages
import FIRManagement from "./pages/officer/FIRManagement";
import EvidenceConfirmation from "./pages/officer/EvidenceConfirmation";
import OfficerReports from "./pages/officer/Reports";

// Forensic role specific pages
import EvidenceAnalysis from "./pages/forensic/EvidenceAnalysis";
import TechnicalVerification from "./pages/forensic/TechnicalVerification";
import ForensicReports from "./pages/forensic/Reports";

// Lawyer role specific pages
import LegalDocumentation from "./pages/lawyer/LegalDocumentation";
import ChainOfCustodyVerification from "./pages/lawyer/ChainOfCustodyVerification";
import LegalReports from "./pages/lawyer/Reports";
import CourtPreparation from "./pages/lawyer/CourtPreparation";
import ClientManagement from "./pages/lawyer/ClientManagement";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Web3Provider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              {/* Role-specific dashboards */}
              <Route
                path="/dashboard/court"
                element={
                  <Layout>
                    <CourtDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/dashboard/officer"
                element={
                  <Layout>
                    <OfficerDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/dashboard/forensic"
                element={
                  <Layout>
                    <ForensicDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/dashboard/lawyer"
                element={
                  <Layout>
                    <LawyerDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/cases"
                element={
                  <Layout>
                    <Cases />
                  </Layout>
                }
              />
              <Route
                path="/cases/:caseId"
                element={
                  <Layout>
                    <CaseDetail />
                  </Layout>
                }
              />
              <Route
                path="/evidence"
                element={
                  <Layout>
                    <Evidence />
                  </Layout>
                }
              />
              <Route
                path="/upload"
                element={
                  <Layout>
                    <Upload />
                  </Layout>
                }
              />
              <Route
                path="/verify"
                element={
                  <Layout>
                    <Verify />
                  </Layout>
                }
              />
              <Route
                path="/help"
                element={
                  <Layout>
                    <Help />
                  </Layout>
                }
              />
              <Route
                path="/help/faq"
                element={
                  <Layout>
                    <FAQ />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                }
              />
              <Route
                path="/activity"
                element={
                  <Layout>
                    <Activity />
                  </Layout>
                }
              />

              {/* FIR routes */}
              <Route
                path="/fir"
                element={
                  <Layout>
                    <FIR />
                  </Layout>
                }
              />
              <Route
                path="/fir/new"
                element={
                  <Layout>
                    <FIRManagement mode="create" />
                  </Layout>
                }
              />

              {/* Court role specific routes */}
              <Route
                path="/users/manage"
                element={
                  <Layout>
                    <UserManagement />
                  </Layout>
                }
              />
              <Route
                path="/users/add"
                element={
                  <Layout>
                    <AddUser />
                  </Layout>
                }
              />
              <Route
                path="/users/roles"
                element={
                  <Layout>
                    <RoleManagement />
                  </Layout>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <Layout>
                    <SystemConfiguration />
                  </Layout>
                }
              />
              <Route
                path="/reports"
                element={
                  <Layout>
                    <ReportsAnalytics />
                  </Layout>
                }
              />
              <Route
                path="/cases/create"
                element={
                  <Layout>
                    <CreateCase />
                  </Layout>
                }
              />
              <Route
                path="/cases/approval"
                element={
                  <Layout>
                    <CasesApproval />
                  </Layout>
                }
              />

              {/* Officer role specific routes */}
              <Route
                path="/cases/update"
                element={
                  <Layout>
                    <Cases />
                  </Layout>
                }
              />
              <Route
                path="/cases/assigned"
                element={
                  <Layout>
                    <Cases />
                  </Layout>
                }
              />
              <Route
                path="/evidence/confirm"
                element={
                  <Layout>
                    <EvidenceConfirmation />
                  </Layout>
                }
              />
              <Route
                path="/officer/reports"
                element={
                  <Layout>
                    <OfficerReports />
                  </Layout>
                }
              />

              {/* Forensic role specific routes */}
              <Route
                path="/evidence/analysis"
                element={
                  <Layout>
                    <EvidenceAnalysis />
                  </Layout>
                }
              />
              <Route
                path="/evidence/verify"
                element={
                  <Layout>
                    <TechnicalVerification />
                  </Layout>
                }
              />
              <Route
                path="/forensic/reports"
                element={
                  <Layout>
                    <ForensicReports />
                  </Layout>
                }
              />

              {/* Lawyer role specific routes */}
              <Route
                path="/legal/documentation"
                element={
                  <Layout>
                    <LegalDocumentation />
                  </Layout>
                }
              />
              <Route
                path="/verify/custody"
                element={
                  <Layout>
                    <ChainOfCustodyVerification />
                  </Layout>
                }
              />
              <Route
                path="/legal/reports"
                element={
                  <Layout>
                    <LegalReports />
                  </Layout>
                }
              />
              <Route
                path="/cases/prepare"
                element={
                  <Layout>
                    <CourtPreparation />
                  </Layout>
                }
              />
              <Route
                path="/clients"
                element={
                  <Layout>
                    <ClientManagement />
                  </Layout>
                }
              />
              <Route
                path="/meetings"
                element={
                  <Layout>
                    <ClientManagement view="meetings" />
                  </Layout>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Web3Provider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
