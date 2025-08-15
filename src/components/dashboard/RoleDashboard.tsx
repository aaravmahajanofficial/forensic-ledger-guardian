import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/services/web3Service";
import { Badge } from "@/components/ui/badge";
import ForensicDashboard from "./roles/ForensicDashboard";
import CourtDashboard from "./roles/CourtDashboard";
import OfficerDashboard from "./roles/OfficerDashboard";
import LawyerDashboard from "./roles/LawyerDashboard";

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please login to view your dashboard</div>;
  }

  const renderRoleBadge = () => {
    const roleColors: Record<Role, string> = {
      [Role.None]: "bg-gray-500",
      [Role.Court]: "bg-forensic-court text-white",
      [Role.Officer]: "bg-forensic-800 text-white",
      [Role.Forensic]: "bg-forensic-accent text-white",
      [Role.Lawyer]: "bg-forensic-warning text-forensic-900",
    };

    return (
      <Badge className={`${roleColors[user.role]} px-3 py-1`}>
        {user.roleTitle}
      </Badge>
    );
  };

  const renderDashboardByRole = () => {
    switch (user.role) {
      case Role.Court:
        return <CourtDashboard />;
      case Role.Officer:
        return <OfficerDashboard />;
      case Role.Forensic:
        return <ForensicDashboard />;
      case Role.Lawyer:
        return <LawyerDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
        <h1 className="text-2xl font-bold text-forensic-800">
          Welcome, {user.name}
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-forensic-500">Role: </span>
          {renderRoleBadge()}
        </div>
      </div>

      {renderDashboardByRole()}
    </div>
  );
};

export default RoleDashboard;
