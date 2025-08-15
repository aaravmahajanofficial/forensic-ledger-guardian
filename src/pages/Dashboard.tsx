// React automatic runtime is enabled; explicit default import removed
import { Navigate } from "react-router-dom";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EvidenceVerifier from "@/components/verification/EvidenceVerifier";
import RoleGuides from "@/components/help/RoleGuides";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-8">
      {/* Role-specific dashboard content */}
      <RoleDashboard />

      {/* Common tools for all roles */}
      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="verify">Evidence Verification</TabsTrigger>
          <TabsTrigger value="help">Help & Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="verify">
          <EvidenceVerifier />
        </TabsContent>

        <TabsContent value="help">
          <RoleGuides role={user?.role} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
