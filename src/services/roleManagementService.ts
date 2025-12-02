import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/services/web3Service";

// Supabase error codes
const POSTGRES_ERROR = {
  NO_ROWS: "PGRST116",
  TABLE_NOT_FOUND: "42P01",
  RLS_VIOLATION: "42501",
} as const;

export interface RoleAssignment {
  id: string;
  address: string;
  role: Role;
  role_name: string;
  assigned_by: string;
  assigned_at: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  role_title: string;
  address?: string;
  is_court_admin: boolean;
}

export interface RoleOperationResult {
  success: boolean;
  error?: string;
}

class RoleManagementService {
  private static readonly ROLE_NAMES: Record<Role, string> = {
    [Role.None]: "None",
    [Role.Court]: "Court Official",
    [Role.Officer]: "Police Officer",
    [Role.Forensic]: "Forensic Expert",
    [Role.Lawyer]: "Legal Counsel",
  };

  /**
   * Validates an Ethereum wallet address format
   */
  private isValidWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Normalizes wallet address to lowercase
   */
  private normalizeAddress(address: string): string {
    return address.toLowerCase();
  }

  /**
   * Get role name string
   */
  public getRoleName(role: Role): string {
    return RoleManagementService.ROLE_NAMES[role] ?? "None";
  }

  /**
   * Check if a wallet address is already assigned to a role
   */
  async isWalletAssigned(walletAddress: string): Promise<boolean> {
    if (!supabase) {
      console.warn("Supabase not available, assuming wallet not assigned");
      return false;
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      console.warn("Invalid wallet address format:", walletAddress);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("role_assignments")
        .select("address")
        .eq("address", this.normalizeAddress(walletAddress))
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error checking wallet assignment:", error);
        return false;
      }

      return data !== null;
    } catch (error) {
      console.error("Unexpected error checking wallet assignment:", error);
      return false;
    }
  }

  /**
   * Get role for a wallet address
   */
  async getRoleForWallet(walletAddress: string): Promise<Role> {
    if (!supabase) {
      console.warn("Supabase not available, returning Role.None");
      return Role.None;
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      return Role.None;
    }

    try {
      const { data, error } = await supabase
        .from("role_assignments")
        .select("role")
        .eq("address", this.normalizeAddress(walletAddress))
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error getting role for wallet:", error);
        return Role.None;
      }

      // Handle case where role could be 0 (Role.None)
      if (data === null || data.role === undefined || data.role === null) {
        return Role.None;
      }

      return data.role as Role;
    } catch (error) {
      console.error("Unexpected error getting role for wallet:", error);
      return Role.None;
    }
  }

  /**
   * Assign wallet address to a role (only court can do this)
   */
  async assignWalletToRole(
    walletAddress: string,
    role: Role,
    assignedBy: string
  ): Promise<RoleOperationResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      return { success: false, error: "Invalid wallet address format" };
    }

    if (role === Role.None) {
      return { success: false, error: "Cannot assign Role.None" };
    }

    try {
      const isAssigned = await this.isWalletAssigned(walletAddress);
      if (isAssigned) {
        return { success: false, error: "Wallet address is already assigned to a role" };
      }

      const { error } = await supabase.from("role_assignments").insert({
        address: this.normalizeAddress(walletAddress),
        role: role,
        role_name: this.getRoleName(role),
        assigned_by: assignedBy,
        is_active: true,
      });

      if (error) {
        console.error("Error assigning wallet to role:", error);
        return { success: false, error: "Failed to assign role" };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error assigning wallet to role:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  /**
   * Update an existing wallet's role assignment
   */
  async updateWalletRole(
    walletAddress: string,
    newRole: Role,
    updatedBy: string
  ): Promise<RoleOperationResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      return { success: false, error: "Invalid wallet address format" };
    }

    try {
      const { error } = await supabase
        .from("role_assignments")
        .update({
          role: newRole,
          role_name: this.getRoleName(newRole),
          assigned_by: updatedBy,
        })
        .eq("address", this.normalizeAddress(walletAddress))
        .eq("is_active", true);

      if (error) {
        console.error("Error updating wallet role:", error);
        return { success: false, error: "Failed to update role" };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error updating wallet role:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  /**
   * Revoke wallet assignment (only court can do this)
   */
  async revokeWalletAssignment(walletAddress: string): Promise<RoleOperationResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      return { success: false, error: "Invalid wallet address format" };
    }

    try {
      const { error } = await supabase
        .from("role_assignments")
        .update({ is_active: false })
        .eq("address", this.normalizeAddress(walletAddress))
        .eq("is_active", true);

      if (error) {
        console.error("Error revoking wallet assignment:", error);
        return { success: false, error: "Failed to revoke assignment" };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error revoking wallet assignment:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  /**
   * Get all active role assignments
   */
  async getAllRoleAssignments(): Promise<RoleAssignment[]> {
    if (!supabase) {
      console.warn("Supabase not available, returning empty assignments");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("role_assignments")
        .select("*")
        .eq("is_active", true)
        .order("assigned_at", { ascending: false });

      if (error) {
        // Table doesn't exist yet - not an error in early setup
        if (error.code === POSTGRES_ERROR.TABLE_NOT_FOUND) {
          console.warn("role_assignments table does not exist yet");
          return [];
        }
        console.error("Error getting role assignments:", error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      console.error("Unexpected error getting role assignments:", error);
      return [];
    }
  }

  /**
   * Get role assignments filtered by role type
   */
  async getRoleAssignmentsByRole(role: Role): Promise<RoleAssignment[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("role_assignments")
        .select("*")
        .eq("role", role)
        .eq("is_active", true)
        .order("assigned_at", { ascending: false });

      if (error) {
        console.error("Error getting role assignments by role:", error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      console.error("Unexpected error getting role assignments:", error);
      return [];
    }
  }

  /**
   * Update user profile with wallet address
   */
  async linkWalletToProfile(
    userId: string,
    walletAddress: string
  ): Promise<RoleOperationResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    if (!this.isValidWalletAddress(walletAddress)) {
      return { success: false, error: "Invalid wallet address format" };
    }

    if (!userId || userId.trim().length === 0) {
      return { success: false, error: "Invalid user ID" };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ address: this.normalizeAddress(walletAddress) })
        .eq("id", userId);

      if (error) {
        console.error("Error linking wallet to profile:", error);
        return { success: false, error: "Failed to link wallet" };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error linking wallet to profile:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  /**
   * Get user profile by email
   */
  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    if (!supabase) {
      return null;
    }

    if (!email || !email.includes("@")) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error("Error getting user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error getting user profile:", error);
      return null;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfileById(userId: string): Promise<UserProfile | null> {
    if (!supabase || !userId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error getting user profile by ID:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error getting user profile:", error);
      return null;
    }
  }

  /**
   * Create initial court admin profile
   */
  async createCourtAdminProfile(
    userId: string,
    email: string,
    name: string
  ): Promise<RoleOperationResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    if (!userId || !email || !name) {
      return { success: false, error: "Missing required fields" };
    }

    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: email.toLowerCase(),
        name: name.trim(),
        role: Role.Court,
        role_title: "Court Administrator",
        is_court_admin: true,
      });

      if (error) {
        console.error("Error creating court admin profile:", error);

        if (error.code === POSTGRES_ERROR.RLS_VIOLATION || error.message?.includes("policy")) {
          return {
            success: false,
            error: "RLS policy preventing profile creation. Database policy update required.",
          };
        }

        return { success: false, error: "Failed to create profile" };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error creating court admin profile:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  /**
   * Check if user is court admin
   */
  async isCourtAdmin(userId: string): Promise<boolean> {
    if (!supabase || !userId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_court_admin, role")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        // Table doesn't exist - not necessarily an error
        if (error.code === POSTGRES_ERROR.TABLE_NOT_FOUND) {
          console.warn("profiles table does not exist yet");
          return false;
        }
        console.error("Error checking court admin status:", error);
        return false;
      }

      if (!data) {
        return false;
      }

      return data.is_court_admin === true && data.role === Role.Court;
    } catch (error) {
      console.error("Unexpected error checking court admin status:", error);
      return false;
    }
  }

  /**
   * Count active users by role
   */
  async countUsersByRole(): Promise<Record<Role, number>> {
    const counts: Record<Role, number> = {
      [Role.None]: 0,
      [Role.Court]: 0,
      [Role.Officer]: 0,
      [Role.Forensic]: 0,
      [Role.Lawyer]: 0,
    };

    if (!supabase) {
      return counts;
    }

    try {
      const { data, error } = await supabase
        .from("role_assignments")
        .select("role")
        .eq("is_active", true);

      if (error) {
        console.error("Error counting users by role:", error);
        return counts;
      }

      for (const row of data ?? []) {
        if (row.role in counts) {
          counts[row.role as Role]++;
        }
      }

      return counts;
    } catch (error) {
      console.error("Unexpected error counting users by role:", error);
      return counts;
    }
  }
}

export const roleManagementService = new RoleManagementService();
