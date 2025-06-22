import { useAuth } from "@/contexts/AuthContext";
import { ROLES, ROLE_NAMES } from "@/constants";
import { Badge } from "@/components/ui/badge";

// Role type and enum-like object for convenience
type Role = (typeof ROLES)[keyof typeof ROLES];
const Role = ROLES;
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
      [Role.NONE]: "bg-muted text-muted-foreground",
      [Role.COURT]: "bg-secondary text-secondary-foreground",
      [Role.OFFICER]: "bg-primary text-primary-foreground",
      [Role.FORENSIC]: "bg-accent text-accent-foreground",
      [Role.LAWYER]: "bg-warning text-warning-foreground",
    };

    return (
      <Badge
        className={`${roleColors[user.role]} px-3 py-1 font-semibold text-xs uppercase tracking-wider`}
      >
        {ROLE_NAMES[user.role as Role]}
      </Badge>
    );
  };

  const renderDashboardByRole = () => {
    switch (user.role) {
      case Role.COURT:
        return <CourtDashboard />;
      case Role.OFFICER:
        return <OfficerDashboard />;
      case Role.FORENSIC:
        return <ForensicDashboard />;
      case Role.LAWYER:
        return <LawyerDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s your personalized dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-muted-foreground">Your Role:</span>
          {renderRoleBadge()}
        </div>
      </div>

      {renderDashboardByRole()}
    </div>
  );
};

export default RoleDashboard;
