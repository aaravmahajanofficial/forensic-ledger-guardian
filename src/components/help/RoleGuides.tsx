import React from "react";
import { ROLES } from "@/constants";

// Role type for convenience
type Role = (typeof ROLES)[keyof typeof ROLES];

interface RoleGuidesProps {
  role?: Role;
}

const RoleGuides: React.FC<RoleGuidesProps> = () => {
  return null;
};

export default RoleGuides;
