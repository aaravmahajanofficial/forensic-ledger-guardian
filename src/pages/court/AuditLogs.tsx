import { Activity } from "lucide-react";
import PlaceholderPage from "@/components/shared/PlaceholderPage";

const AuditLogs = () => {
  return (
    <PlaceholderPage
      title="Audit Logs"
      description="View and investigate system activity and user actions for compliance and security monitoring."
      icon={<Activity className="h-8 w-8 text-forensic-court" />}
    />
  );
};

export default AuditLogs;
