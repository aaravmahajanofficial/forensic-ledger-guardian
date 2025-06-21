import React, { Suspense } from "react";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ErrorBoundary,
  AuthErrorBoundary,
} from "@/components/shared/ErrorBoundary";
import {
  ProtectedRoute,
  CourtOnlyRoute,
  OfficerOnlyRoute,
  ForensicOnlyRoute,
  LawyerOnlyRoute,
  LawEnforcementRoute,
  LegalRoute,
} from "@/components/shared/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { Web3Provider } from "./contexts/Web3Context";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy loaded components for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Cases = React.lazy(() => import("./pages/Cases"));
const Evidence = React.lazy(() => import("./pages/Evidence"));
const Upload = React.lazy(() => import("./pages/Upload"));
const Verify = React.lazy(() => import("./pages/Verify"));
const Help = React.lazy(() => import("./pages/Help"));
const FAQ = React.lazy(() => import("./pages/help/Faq"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Activity = React.lazy(() => import("./pages/Activity"));

// FIR pages
const FIR = React.lazy(() => import("./pages/fir/Fir"));
const FIRManagement = React.lazy(() => import("./pages/officer/FIRManagement"));

// Court role specific pages
const UserManagement = React.lazy(() => import("./pages/users/Manage"));
const RoleManagement = React.lazy(() => import("./pages/court/RoleManagement"));
const SystemConfiguration = React.lazy(
  () => import("./pages/court/SystemConfiguration")
);
const AuditLogs = React.lazy(() => import("./pages/court/AuditLogs"));
const ReportsAnalytics = React.lazy(
  () => import("./pages/court/ReportsAnalytics")
);
const CreateCase = React.lazy(() => import("./pages/cases/CreateCase"));
const CasesApproval = React.lazy(() => import("./pages/cases/CasesApproval"));
const CaseDetail = React.lazy(() => import("./pages/cases/CaseDetail"));
const AddUser = React.lazy(() => import("./pages/users/AddUser"));

// Officer role specific pages
const EvidenceConfirmation = React.lazy(
  () => import("./pages/officer/EvidenceConfirmation")
);
const OfficerReports = React.lazy(() => import("./pages/officer/Reports"));

// Forensic role specific pages
const EvidenceAnalysis = React.lazy(
  () => import("./pages/forensic/EvidenceAnalysis")
);
const TechnicalVerification = React.lazy(
  () => import("./pages/forensic/TechnicalVerification")
);
const ForensicReports = React.lazy(() => import("./pages/forensic/Reports"));

// Lawyer role specific pages
const LegalDocumentation = React.lazy(
  () => import("./pages/lawyer/LegalDocumentation")
);
const ChainOfCustodyVerification = React.lazy(
  () => import("./pages/lawyer/ChainOfCustodyVerification")
);
const LegalReports = React.lazy(() => import("./pages/lawyer/Reports"));
const CourtPreparation = React.lazy(
  () => import("./pages/lawyer/CourtPreparation")
);
const ClientManagement = React.lazy(
  () => import("./pages/lawyer/ClientManagement")
);

// Optimized loading component with accessibility
const LoadingSpinner = React.memo(() => (
  <div
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forensic-50 to-forensic-100"
    role="status"
    aria-label="Loading application"
  >
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-forensic-600 mx-auto"></div>
        <div className="animate-ping absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border border-forensic-400 rounded-full opacity-30"></div>
      </div>
      <div className="space-y-2">
        <p className="text-forensic-700 font-medium">
          Loading Forensic Guardian
        </p>
        <p className="text-forensic-500 text-sm">
          Securing evidence integrity...
        </p>
      </div>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// Create Query Client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (error && typeof error === "object" && "response" in error) {
          const httpError = error as { response: { status: number } };
          if (
            httpError.response?.status >= 400 &&
            httpError.response?.status < 500
          ) {
            return false;
          }
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AuthErrorBoundary>
              <AuthProvider>
                <Web3Provider>
                  <Toaster />
                  <Sonner />
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="*" element={<NotFound />} />

                      {/* Protected routes - Common */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cases"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Cases />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cases/:caseId"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <CaseDetail />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/evidence"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Evidence />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/upload"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Upload />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/verify"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Verify />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/help"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Help />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/help/faq"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <FAQ />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Settings />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/activity"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Activity />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* FIR routes - Officer and Court */}
                      <Route
                        path="/fir"
                        element={
                          <LawEnforcementRoute>
                            <Layout>
                              <FIR />
                            </Layout>
                          </LawEnforcementRoute>
                        }
                      />
                      <Route
                        path="/fir/new"
                        element={
                          <OfficerOnlyRoute>
                            <Layout>
                              <FIRManagement mode="create" />
                            </Layout>
                          </OfficerOnlyRoute>
                        }
                      />

                      {/* Court role specific routes */}
                      <Route
                        path="/users/manage"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <UserManagement />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/users/add"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <AddUser />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/users/roles"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <RoleManagement />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/settings/security"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <SystemConfiguration />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <ReportsAnalytics />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/audit"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <AuditLogs />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />
                      <Route
                        path="/cases/create"
                        element={
                          <LawEnforcementRoute>
                            <Layout>
                              <CreateCase />
                            </Layout>
                          </LawEnforcementRoute>
                        }
                      />
                      <Route
                        path="/cases/approval"
                        element={
                          <CourtOnlyRoute>
                            <Layout>
                              <CasesApproval />
                            </Layout>
                          </CourtOnlyRoute>
                        }
                      />

                      {/* Officer role specific routes */}
                      <Route
                        path="/evidence/confirm"
                        element={
                          <OfficerOnlyRoute>
                            <Layout>
                              <EvidenceConfirmation />
                            </Layout>
                          </OfficerOnlyRoute>
                        }
                      />
                      <Route
                        path="/officer/reports"
                        element={
                          <OfficerOnlyRoute>
                            <Layout>
                              <OfficerReports />
                            </Layout>
                          </OfficerOnlyRoute>
                        }
                      />

                      {/* Forensic role specific routes */}
                      <Route
                        path="/evidence/analysis"
                        element={
                          <ForensicOnlyRoute>
                            <Layout>
                              <EvidenceAnalysis />
                            </Layout>
                          </ForensicOnlyRoute>
                        }
                      />
                      <Route
                        path="/evidence/verify"
                        element={
                          <ForensicOnlyRoute>
                            <Layout>
                              <TechnicalVerification />
                            </Layout>
                          </ForensicOnlyRoute>
                        }
                      />
                      <Route
                        path="/forensic/reports"
                        element={
                          <ForensicOnlyRoute>
                            <Layout>
                              <ForensicReports />
                            </Layout>
                          </ForensicOnlyRoute>
                        }
                      />

                      {/* Lawyer role specific routes */}
                      <Route
                        path="/legal/documentation"
                        element={
                          <LawyerOnlyRoute>
                            <Layout>
                              <LegalDocumentation />
                            </Layout>
                          </LawyerOnlyRoute>
                        }
                      />
                      <Route
                        path="/verify/custody"
                        element={
                          <LegalRoute>
                            <Layout>
                              <ChainOfCustodyVerification />
                            </Layout>
                          </LegalRoute>
                        }
                      />
                      <Route
                        path="/legal/reports"
                        element={
                          <LawyerOnlyRoute>
                            <Layout>
                              <LegalReports />
                            </Layout>
                          </LawyerOnlyRoute>
                        }
                      />
                      <Route
                        path="/cases/prepare"
                        element={
                          <LawyerOnlyRoute>
                            <Layout>
                              <CourtPreparation />
                            </Layout>
                          </LawyerOnlyRoute>
                        }
                      />
                      <Route
                        path="/clients"
                        element={
                          <LawyerOnlyRoute>
                            <Layout>
                              <ClientManagement />
                            </Layout>
                          </LawyerOnlyRoute>
                        }
                      />
                      <Route
                        path="/meetings"
                        element={
                          <LawyerOnlyRoute>
                            <Layout>
                              <ClientManagement view="meetings" />
                            </Layout>
                          </LawyerOnlyRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </Web3Provider>
              </AuthProvider>
            </AuthErrorBoundary>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
