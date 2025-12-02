/**
 * Shared routes accessible by multiple roles or all authenticated users
 */
import { Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SecureRoute from '@/components/auth/SecureRoute';
import { Role } from '@/services/web3Service';

// Shared pages
import Dashboard from '@/pages/Dashboard';
import Cases from '@/pages/Cases';
import Evidence from '@/pages/Evidence';
import Upload from '@/pages/Upload';
import Verify from '@/pages/Verify';
import Help from '@/pages/Help';
import FAQ from '@/pages/help/Faq';
import Settings from '@/pages/Settings';
import Activity from '@/pages/Activity';
import WalletManagement from '@/pages/WalletManagement';
import MetaMaskHelp from '@/pages/help/MetaMaskHelp';
import CaseDetail from '@/pages/cases/CaseDetail';
import CreateCase from '@/pages/cases/CreateCase';
import FIR from '@/pages/fir/Fir';
import View from '@/pages/fir/View';

/**
 * Routes accessible by all authenticated users
 */
export const SharedRoutes = () => (
  <>
    {/* Main Dashboard - adapts based on user role */}
    <Route
      path="/dashboard"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Dashboard />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Role-specific dashboard routes */}
    <Route
      path="/dashboard/court"
      element={
        <Layout>
          <SecureRoute allowedRoles={[Role.Court]} requireAuth={true}>
            <Dashboard />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/dashboard/officer"
      element={
        <Layout>
          <SecureRoute allowedRoles={[Role.Officer]} requireAuth={true}>
            <Dashboard />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/dashboard/forensic"
      element={
        <Layout>
          <SecureRoute allowedRoles={[Role.Forensic]} requireAuth={true}>
            <Dashboard />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/dashboard/lawyer"
      element={
        <Layout>
          <SecureRoute allowedRoles={[Role.Lawyer]} requireAuth={true}>
            <Dashboard />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Cases - shared but filtered by role */}
    <Route
      path="/cases"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Cases />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/cases/:caseId"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <CaseDetail />
          </SecureRoute>
        </Layout>
      }
    />

    <Route
      path="/fir/view/:id"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <View />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Case Creation - Court and Officer can create cases */}
    <Route
      path="/cases/create"
      element={
        <Layout>
          <SecureRoute allowedRoles={[Role.Court]} requireAuth={true}>
            <CreateCase />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Evidence Management */}
    <Route
      path="/evidence"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Evidence />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/upload"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Upload />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/verify"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Verify />
          </SecureRoute>
        </Layout>
      }
    />

    {/* FIR Routes - accessible to all but functionality varies by role */}
    <Route
      path="/fir"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <FIR />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Help and Documentation */}
    <Route
      path="/help"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Help />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/help/faq"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <FAQ />
          </SecureRoute>
        </Layout>
      }
    />
    <Route
      path="/help/metamask"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <MetaMaskHelp />
          </SecureRoute>
        </Layout>
      }
    />

    {/* User Settings */}
    <Route
      path="/settings"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Settings />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Activity Log */}
    <Route
      path="/activity"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <Activity />
          </SecureRoute>
        </Layout>
      }
    />

    {/* Wallet Management */}
    <Route
      path="/wallet"
      element={
        <Layout>
          <SecureRoute requireAuth={true}>
            <WalletManagement />
          </SecureRoute>
        </Layout>
      }
    />
  </>
);