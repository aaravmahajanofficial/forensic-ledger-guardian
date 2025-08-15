// React automatic runtime is enabled; explicit default import removed
import { Navigate } from "react-router-dom";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EvidenceVerifier from "@/components/verification/EvidenceVerifier";

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-8">
      {/* Role-specific dashboard content */}
      <RoleDashboard />

      {/* Common tools for all roles */}
      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-1 sm:inline-flex">
          <TabsTrigger value="verify">Evidence Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="verify">
          <EvidenceVerifier />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
