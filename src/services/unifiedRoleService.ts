/**
 * Unified Role Management Service
 * Consolidates all role-related functionality and acts as a facade
 */

import { Role } from "@/services/web3Service";
import {
  getRoleConfig,
  hasPermission,
  isValidRole,
  getRoleTitle,
} from "@/config/roles";
import {
  roleManagementService,
  RoleAssignment,
  UserProfile,
} from "@/services/roleManagementService";

export class UnifiedRoleService {
  private static instance: UnifiedRoleService;

  private constructor() {}

  public static getInstance(): UnifiedRoleService {
    if (!UnifiedRoleService.instance) {
      UnifiedRoleService.instance = new UnifiedRoleService();
    }
    return UnifiedRoleService.instance;
  }

  // Role Configuration
  getRoleConfig(role: Role) {
    return getRoleConfig(role);
  }

  getRoleTitle(role: Role): string {
    return getRoleTitle(role);
  }

  isValidRole(role: unknown): role is Role {
    return isValidRole(role);
  }

  // Permission Management
  hasPermission(userRole: Role, action: string, resource: string): boolean {
    return hasPermission(userRole, action, resource);
  }

  canManageUsers(role: Role): boolean {
    return this.hasPermission(role, "manage", "users");
  }

  canAssignRoles(role: Role): boolean {
    return this.hasPermission(role, "assign", "roles");
  }

  canCreateCases(role: Role): boolean {
    return this.hasPermission(role, "create", "cases");
  }

  canUploadEvidence(role: Role): boolean {
    return this.hasPermission(role, "upload", "evidence");
  }

  canAnalyzeEvidence(role: Role): boolean {
    return this.hasPermission(role, "analyze", "evidence");
  }

  // Database Operations (delegated to roleManagementService)
  async getRoleForWallet(walletAddress: string): Promise<Role> {
    return roleManagementService.getRoleForWallet(walletAddress);
  }

  async isWalletAssigned(walletAddress: string): Promise<boolean> {
    return roleManagementService.isWalletAssigned(walletAddress);
  }

  async assignWalletToRole(
    walletAddress: string,
    role: Role,
    assignedBy: string
  ): Promise<boolean> {
    if (!this.isValidRole(role) || role === Role.None) {
      return false;
    }
    return roleManagementService.assignWalletToRole(
      walletAddress,
      role,
      assignedBy
    );
  }

  async revokeWalletAssignment(walletAddress: string): Promise<boolean> {
    return roleManagementService.revokeWalletAssignment(walletAddress);
  }

  async getAllRoleAssignments(): Promise<RoleAssignment[]> {
    return roleManagementService.getAllRoleAssignments();
  }

  async linkWalletToProfile(
    userId: string,
    walletAddress: string
  ): Promise<boolean> {
    return roleManagementService.linkWalletToProfile(userId, walletAddress);
  }

  // Role Validation
  validateRoleTransition(fromRole: Role, toRole: Role): boolean {
    // Only Court can assign roles
    if (fromRole !== Role.Court && fromRole !== Role.None) {
      return false;
    }

    // Cannot assign None role deliberately
    if (toRole === Role.None) {
      return false;
    }

    // Valid role assignment
    return this.isValidRole(toRole);
  }

  // Role Hierarchy
  getRoleHierarchy(): Record<Role, number> {
    return {
      [Role.None]: 0,
      [Role.Lawyer]: 1,
      [Role.Forensic]: 2,
      [Role.Officer]: 3,
      [Role.Court]: 4, // Highest authority
    };
  }

  hasHigherOrEqualAuthority(userRole: Role, targetRole: Role): boolean {
    const hierarchy = this.getRoleHierarchy();
    return hierarchy[userRole] >= hierarchy[targetRole];
  }

  // Role Capabilities
  getRoleCapabilities(role: Role) {
    const config = this.getRoleConfig(role);
    return {
      ...config,
      canManageUsers: this.canManageUsers(role),
      canAssignRoles: this.canAssignRoles(role),
      canCreateCases: this.canCreateCases(role),
      canUploadEvidence: this.canUploadEvidence(role),
      canAnalyzeEvidence: this.canAnalyzeEvidence(role),
    };
  }
}

// Export singleton instance
export const unifiedRoleService = UnifiedRoleService.getInstance();

// Export types for convenience
export type { RoleAssignment, UserProfile };
export { Role };
