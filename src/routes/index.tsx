import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";
import Loading from "@/components/shared/Loading"; // I'll need to create this component

// Lazy-loaded pages
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CourtDashboardPage = lazy(() =>
  import("@/pages/RoleDashboards").then((module) => ({
    default: module.CourtDashboardPage,
  }))
);
const OfficerDashboardPage = lazy(() =>
  import("@/pages/RoleDashboards").then((module) => ({
    default: module.OfficerDashboardPage,
  }))
);
const ForensicDashboardPage = lazy(() =>
  import("@/pages/RoleDashboards").then((module) => ({
    default: module.ForensicDashboardPage,
  }))
);
const LawyerDashboardPage = lazy(() =>
  import("@/pages/RoleDashboards").then((module) => ({
    default: module.LawyerDashboardPage,
  }))
);
const Cases = lazy(() => import("@/pages/Cases"));
const CaseDetail = lazy(() => import("@/pages/cases/CaseDetail"));
const Evidence = lazy(() => import("@/pages/Evidence"));
const Upload = lazy(() => import("@/pages/Upload"));
const Verify = lazy(() => import("@/pages/Verify"));
const Help = lazy(() => import("@/pages/Help"));
const FAQ = lazy(() => import("@/pages/help/Faq"));
const Settings = lazy(() => import("@/pages/Settings"));
const Activity = lazy(() => import("@/pages/Activity"));
const FIR = lazy(() => import("@/pages/fir/Fir"));
const FIRManagement = lazy(() => import("@/pages/officer/FIRManagement"));
const UserManagement = lazy(() => import("@/pages/users/Manage"));
const AddUser = lazy(() => import("@/pages/users/AddUser"));
const RoleManagement = lazy(() => import("@/pages/court/RoleManagement"));
const SystemConfiguration = lazy(
  () => import("@/pages/court/SystemConfiguration")
);
const ReportsAnalytics = lazy(() => import("@/pages/court/ReportsAnalytics"));
const CreateCase = lazy(() => import("@/pages/cases/CreateCase"));
const CasesApproval = lazy(() => import("@/pages/cases/CasesApproval"));
const EvidenceConfirmation = lazy(
  () => import("@/pages/officer/EvidenceConfirmation")
);
const OfficerReports = lazy(() => import("@/pages/officer/Reports"));
const EvidenceAnalysis = lazy(
  () => import("@/pages/forensic/EvidenceAnalysis")
);
const TechnicalVerification = lazy(
  () => import("@/pages/forensic/TechnicalVerification")
);
const ForensicReports = lazy(() => import("@/pages/forensic/Reports"));
const LegalDocumentation = lazy(
  () => import("@/pages/lawyer/LegalDocumentation")
);
const ChainOfCustodyVerification = lazy(
  () => import("@/pages/lawyer/ChainOfCustodyVerification")
);
const LegalReports = lazy(() => import("@/pages/lawyer/Reports"));
const CourtPreparation = lazy(() => import("@/pages/lawyer/CourtPreparation"));
const ClientManagement = lazy(() => import("@/pages/lawyer/ClientManagement"));
const RouteTest = lazy(() => import("@/pages/RouteTest"));

const AppRoutes = () => {
  console.log("AppRoutes component is rendering...");

  const LayoutWrapper = () => (
    <Layout>
      <Outlet />
    </Layout>
  );

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/court" element={<CourtDashboardPage />} />
          <Route path="/dashboard/officer" element={<OfficerDashboardPage />} />
          <Route
            path="/dashboard/forensic"
            element={<ForensicDashboardPage />}
          />
          <Route path="/dashboard/lawyer" element={<LawyerDashboardPage />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:caseId" element={<CaseDetail />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/faq" element={<FAQ />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/fir" element={<FIR />} />
          <Route path="/fir/new" element={<FIRManagement mode="create" />} />
          <Route path="/users/manage" element={<UserManagement />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/roles" element={<RoleManagement />} />
          <Route path="/settings/security" element={<SystemConfiguration />} />
          <Route path="/reports" element={<ReportsAnalytics />} />
          <Route path="/cases/create" element={<CreateCase />} />
          <Route path="/cases/approval" element={<CasesApproval />} />
          <Route path="/cases/update" element={<Cases />} />
          <Route path="/cases/assigned" element={<Cases />} />
          <Route path="/evidence/confirm" element={<EvidenceConfirmation />} />
          <Route path="/officer/reports" element={<OfficerReports />} />
          <Route path="/evidence/analysis" element={<EvidenceAnalysis />} />
          <Route path="/evidence/verify" element={<TechnicalVerification />} />
          <Route path="/forensic/reports" element={<ForensicReports />} />
          <Route path="/legal/documentation" element={<LegalDocumentation />} />
          <Route
            path="/verify/custody"
            element={<ChainOfCustodyVerification />}
          />
          <Route path="/legal/reports" element={<LegalReports />} />
          <Route path="/cases/prepare" element={<CourtPreparation />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route
            path="/meetings"
            element={<ClientManagement view="meetings" />}
          />
          <Route path="/route-test" element={<RouteTest />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
