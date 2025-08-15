import { Users } from "lucide-react";
import PlaceholderPage from "@/components/shared/PlaceholderPage";

const UserManagement = () => (
  <PlaceholderPage
    title="User Management"
    description="Assign global roles to users, view all system users, and manage account access."
    icon={<Users className="h-8 w-8 text-forensic-court" />}
  />
);

export default UserManagement;
