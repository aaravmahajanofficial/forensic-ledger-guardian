import React from "react";
import { APP_CONSTANTS } from "@/config";

// Role type for convenience
type Role = (typeof APP_CONSTANTS.ROLES)[keyof typeof APP_CONSTANTS.ROLES];

interface RoleGuidesProps {
  role?: Role;
}

const RoleGuides: React.FC<RoleGuidesProps> = () => {
  return null;
};

export default RoleGuides;
