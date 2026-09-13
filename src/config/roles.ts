/**
 * Centralized Role Configuration
 * This file defines roles, permissions, and role-specific settings
 */

import { Role } from "@/services/web3Service";
import {
  Users,
  Settings,
  Activity,
  BarChart3,
  AlignLeft,
  FileText,
  CheckCircle,
  Upload,
  Search,
  Scale,
  BookOpen,
  UserCheck,
  LucideIcon,
} from "lucide-react";

export interface RolePermission {
  action: string;
  resource: string;
  description: string;
}

export interface RoleConfig {
  id: Role;
  name: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  permissions: RolePermission[];
  features: string[];
  dashboardPath: string;
}

export interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  description?: string;
}

/**
 * Core role permissions
 */
export const ROLE_PERMISSIONS: Record<Role, RolePermission[]> = {
  [Role.None]: [],
  [Role.Court]: [
    { action: "manage", resource: "users", description: "Manage system users" },
    {
      action: "assign",
      resource: "roles",
      description: "Assign roles to users",
    },
    {
      action: "configure",
      resource: "system",
      description: "System configuration",
    },
    { action: "view", resource: "audit_logs", description: "View audit logs" },
    { action: "view", resource: "reports", description: "View all reports" },
    { action: "create", resource: "cases", description: "Create cases" },
    { action: "approve", resource: "cases", description: "Approve cases" },
    { action: "close", resource: "cases", description: "Close cases" },
    { action: "seal", resource: "cases", description: "Seal cases" },
  ],
  [Role.Officer]: [
    { action: "create", resource: "fir", description: "Create FIR reports" },
    {
      action: "update",
      resource: "cases",
      description: "Update case information",
    },
    {
      action: "confirm",
      resource: "evidence",
      description: "Confirm evidence authenticity",
    },
    {
      action: "view",
      resource: "reports",
      description: "View officer reports",
    },
    {
      action: "create",
      resource: "cases",
      description: "Create cases from FIR",
    },
  ],
  [Role.Forensic]: [
    {
      action: "analyze",
      resource: "evidence",
      description: "Analyze evidence",
    },
    {
      action: "verify",
      resource: "technical_data",
      description: "Technical verification",
    },
    { action: "upload", resource: "evidence", description: "Upload evidence" },
    {
      action: "view",
      resource: "reports",
      description: "View forensic reports",
    },
  ],
  [Role.Lawyer]: [
    {
      action: "verify",
      resource: "custody_chain",
      description: "Verify chain of custody",
    },
    {
      action: "create",
      resource: "legal_docs",
      description: "Create legal documentation",
    },
    {
      action: "prepare",
      resource: "court_cases",
      description: "Prepare for court",
    },
    { action: "manage", resource: "clients", description: "Manage clients" },
    { action: "view", resource: "reports", description: "View legal reports" },
  ],
};

/**
 * Role configurations
 */
export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  [Role.None]: {
    id: Role.None,
    name: "None",
    title: "No Role",
    description: "User has no assigned role",
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    permissions: ROLE_PERMISSIONS[Role.None],
    features: [],
    dashboardPath: "/dashboard",
  },
  [Role.Court]: {
    id: Role.Court,
    name: "Court",
    title: "Court Official",
    description:
      "Manages system users, approves cases, and oversees operations",
    color: "text-red-600",
    bgColor: "bg-forensic-court",
    permissions: ROLE_PERMISSIONS[Role.Court],
    features: [
      "User Management",
      "Role Assignment",
      "System Configuration",
      "Audit Logs",
      "Reports",
    ],
    dashboardPath: "/dashboard/court",
  },
  [Role.Officer]: {
    id: Role.Officer,
    name: "Officer",
    title: "Police Officer",
    description: "Files FIR reports, creates cases, and confirms evidence",
    color: "text-blue-600",
    bgColor: "bg-forensic-800",
    permissions: ROLE_PERMISSIONS[Role.Officer],
    features: ["FIR Management", "Case Creation", "Evidence Confirmation"],
    dashboardPath: "/dashboard/officer",
  },
  [Role.Forensic]: {
    id: Role.Forensic,
    name: "Forensic",
    title: "Forensic Expert",
    description: "Analyzes evidence and provides technical verification",
    color: "text-green-600",
    bgColor: "bg-forensic-accent",
    permissions: ROLE_PERMISSIONS[Role.Forensic],
    features: [
      "Evidence Analysis",
      "Technical Verification",
      "Evidence Upload",
    ],
    dashboardPath: "/dashboard/forensic",
  },
  [Role.Lawyer]: {
    id: Role.Lawyer,
    name: "Lawyer",
    title: "Legal Counsel",
    description: "Handles legal documentation and court preparation",
    color: "text-purple-600",
    bgColor: "bg-forensic-warning",
    permissions: ROLE_PERMISSIONS[Role.Lawyer],
    features: [
      "Legal Documentation",
      "Chain of Custody",
      "Court Preparation",
      "Client Management",
    ],
    dashboardPath: "/dashboard/lawyer",
  },
};

/**
 * Navigation items by role
 */
export const ROLE_NAVIGATION: Record<Role, NavigationItem[]> = {
  [Role.None]: [],
  [Role.Court]: [
    {
      to: "/bootstrap",
      label: "Role Management",
      icon: Users,
      roles: [Role.Court],
      description: "Assign roles and manage user permissions",
    },
    // {
    //   to: "/settings/security",
    //   label: "System Configuration",
    //   icon: Settings,
    //   roles: [Role.Court],
    //   description: "Configure system security settings",
    // },
    {
      to: "/activity",
      label: "Audit Logs",
      icon: Activity,
      roles: [Role.Court],
      description: "View system audit trails",
    },
    {
      to: "/reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      roles: [Role.Court],
      description: "View comprehensive system reports",
    },
  ],
  [Role.Officer]: [
    {
      to: "/fir",
      label: "FIR Management",
      icon: AlignLeft,
      roles: [Role.Officer],
      description: "Manage First Information Reports",
    },
    // {
    //   to: "/cases/update",
    //   label: "Update Cases",
    //   icon: FileText,
    //   roles: [Role.Officer],
    //   description: "Update case information and status",
    // },
    {
      to: "/evidence/confirm",
      label: "Confirm Evidence",
      icon: CheckCircle,
      roles: [Role.Officer],
      description: "Confirm evidence authenticity",
    },
    {
      to: "/officer/reports",
      label: "Reports",
      icon: BarChart3,
      roles: [Role.Officer],
      description: "View officer reports and statistics",
    },
  ],
  [Role.Forensic]: [
    {
      to: "/evidence/analyze",
      label: "Evidence Analysis",
      icon: Search,
      roles: [Role.Forensic],
      description: "Analyze submitted evidence",
    },
    {
      to: "/technical/verify",
      label: "Technical Verification",
      icon: UserCheck,
      roles: [Role.Forensic],
      description: "Perform technical verification",
    },
    {
      to: "/forensic/reports",
      label: "Reports",
      icon: BarChart3,
      roles: [Role.Forensic],
      description: "View forensic analysis reports",
    },
  ],
  [Role.Lawyer]: [
    {
      to: "/verify/custody",
      label: "Chain of Custody",
      icon: Scale,
      roles: [Role.Lawyer],
      description: "Verify evidence chain of custody",
    },
    {
      to: "/legal/docs",
      label: "Legal Documentation",
      icon: BookOpen,
      roles: [Role.Lawyer],
      description: "Manage legal documents",
    },
    {
      to: "/cases/prepare",
      label: "Court Preparation",
      icon: Scale,
      roles: [Role.Lawyer],
      description: "Prepare cases for court proceedings",
    },
    {
      to: "/clients",
      label: "Client Management",
      icon: Users,
      roles: [Role.Lawyer],
      description: "Manage client relationships",
    },
    {
      to: "/legal/reports",
      label: "Legal Reports",
      icon: BarChart3,
      roles: [Role.Lawyer],
      description: "View legal reports and documentation",
    },
  ],
};

/**
 * Utility functions
 */
export const getRoleConfig = (role: Role): RoleConfig => {
  return ROLE_CONFIGS[role] || ROLE_CONFIGS[Role.None];
};

export const hasPermission = (
  userRole: Role,
  action: string,
  resource: string,
): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(
    (p) => p.action === action && p.resource === resource,
  );
};

export const getRoleNavigation = (role: Role): NavigationItem[] => {
  return ROLE_NAVIGATION[role] || [];
};

export const isValidRole = (role: unknown): role is Role => {
  return Object.values(Role).includes(role as Role);
};

export const getRoleTitle = (role: Role): string => {
  return getRoleConfig(role).title;
};

export const getRoleColor = (role: Role): string => {
  return getRoleConfig(role).color;
};
