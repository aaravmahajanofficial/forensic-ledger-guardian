import { supabase } from "@/lib/supabaseClient";
import { roleManagementService } from "@/services/roleManagementService";
import web3Service, { Role } from "@/services/web3Service";
import { getRoleTitle } from "@/config/roles";
import { toast } from "@/hooks/use-toast";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  roleTitle: string;
  address?: string;
  authType: "email" | "wallet";
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  errorCode?: AuthErrorCode;
  requiresSetup?: boolean;
}

// Standard error codes for better error handling
export enum AuthErrorCode {
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  PROFILE_NOT_FOUND = "PROFILE_NOT_FOUND",
  WALLET_NOT_AUTHORIZED = "WALLET_NOT_AUTHORIZED",
  NETWORK_ERROR = "NETWORK_ERROR",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  ROLE_SYNC_FAILED = "ROLE_SYNC_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// User-friendly error messages
const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.SERVICE_UNAVAILABLE]:
    "Authentication service is currently unavailable. Please try again later.",
  [AuthErrorCode.INVALID_CREDENTIALS]:
    "Invalid email or password. Please check your credentials and try again.",
  [AuthErrorCode.PROFILE_NOT_FOUND]:
    "User profile not found. Please contact your administrator for access.",
  [AuthErrorCode.WALLET_NOT_AUTHORIZED]:
    "This wallet is not authorized. Please contact an administrator to request access.",
  [AuthErrorCode.NETWORK_ERROR]:
    "Network error. Please check your connection and try again.",
  [AuthErrorCode.SESSION_EXPIRED]:
    "Your session has expired. Please log in again.",
  [AuthErrorCode.ROLE_SYNC_FAILED]:
    "Failed to sync your role. Please try reconnecting or contact support.",
  [AuthErrorCode.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();
  private isInitializing: boolean = false;
  private initPromise: Promise<AuthUser | null> | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get user-friendly error message
  public getErrorMessage(code: AuthErrorCode): string {
    return ERROR_MESSAGES[code] || ERROR_MESSAGES[AuthErrorCode.UNKNOWN_ERROR];
  }

  // Subscribe to auth state changes
  public subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const userSnapshot = this.currentUser;
    this.listeners.forEach((listener) => {
      try {
        listener(userSnapshot);
      } catch (error) {
        console.error("Error in auth listener:", error);
      }
    });
  }

  // Get current authenticated user
  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Helper to create standardized error result
  private createErrorResult(
    code: AuthErrorCode,
    customMessage?: string
  ): AuthResult {
    return {
      success: false,
      error: customMessage || this.getErrorMessage(code),
      errorCode: code,
    };
  }

  // Email/password authentication
  public async loginWithEmail(
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      if (!supabase) {
        return this.createErrorResult(AuthErrorCode.SERVICE_UNAVAILABLE);
      }

      // Validate input
      if (!email || !password) {
        return this.createErrorResult(
          AuthErrorCode.INVALID_CREDENTIALS,
          "Email and password are required."
        );
      }

      // Clear any existing authentication state
      await this.clearAuthState();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Map Supabase errors to our error codes
        if (error.message.includes("Invalid login credentials")) {
          return this.createErrorResult(AuthErrorCode.INVALID_CREDENTIALS);
        }
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          return this.createErrorResult(AuthErrorCode.NETWORK_ERROR);
        }
        return this.createErrorResult(
          AuthErrorCode.UNKNOWN_ERROR,
          error.message
        );
      }

      if (!data.user) {
        return this.createErrorResult(AuthErrorCode.INVALID_CREDENTIALS);
      }

      // Load user profile
      const profileResult = await this.loadUserProfile(data.user.id, email);

      if (!profileResult.success) {
        // Check if this is the first user and should be Court admin
        const isFirstUser = await this.checkIfFirstUser();
        if (isFirstUser) {
          const setupResult = await this.createCourtAdmin(data.user.id, email);
          if (setupResult.success) {
            return {
              success: true,
              user: setupResult.user,
              requiresSetup: true,
            };
          }
        }

        // Clean up failed authentication
        await supabase.auth.signOut();
        return this.createErrorResult(AuthErrorCode.PROFILE_NOT_FOUND);
      }

      this.currentUser = profileResult.user!;
      this.saveAuthState();
      this.notifyListeners();

      return {
        success: true,
        user: this.currentUser,
      };
    } catch (error) {
      console.error("Email login error:", error);
      // Check for network-related errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return this.createErrorResult(AuthErrorCode.NETWORK_ERROR);
      }
      return this.createErrorResult(AuthErrorCode.UNKNOWN_ERROR);
    }
  }

  // MetaMask wallet authentication
  public async loginWithWallet(walletAddress: string): Promise<AuthResult> {
    try {
      // Validate wallet address format
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return this.createErrorResult(
          AuthErrorCode.WALLET_NOT_AUTHORIZED,
          "Invalid wallet address format."
        );
      }

      // Clear any existing authentication state
      await this.clearAuthState();

      // Get role from database (primary source of truth)
      let dbRole: Role;
      try {
        dbRole = await roleManagementService.getRoleForWallet(walletAddress);
      } catch (error) {
        console.error("Error fetching wallet role:", error);
        return this.createErrorResult(
          AuthErrorCode.NETWORK_ERROR,
          "Could not verify wallet authorization. Please try again."
        );
      }

      if (dbRole === Role.None) {
        // Check if this wallet is the contract owner
        let isOwner = false;
        try {
          isOwner = await web3Service.isContractOwner();
        } catch (error) {
          console.error("Error checking contract owner:", error);
          return this.createErrorResult(
            AuthErrorCode.NETWORK_ERROR,
            "Could not verify contract ownership. Please try again."
          );
        }

        if (isOwner) {
          // Initialize admin role
          const initSuccess = await web3Service.initializeAdminRole();
          if (initSuccess) {
            // Create database entry for court admin
            const assignResult = await roleManagementService.assignWalletToRole(
              walletAddress,
              Role.Court,
              walletAddress // Self-assigned as contract owner
            );

            if (assignResult.success) {
              const courtUser = this.createWalletUser(
                walletAddress,
                Role.Court
              );
              this.currentUser = courtUser;
              this.saveAuthState();
              this.notifyListeners();

              return {
                success: true,
                user: courtUser,
                requiresSetup: true,
              };
            }
          }
        }

        return this.createErrorResult(AuthErrorCode.WALLET_NOT_AUTHORIZED);
      }

      // Verify blockchain role matches database role (informational only)
      try {
        const blockchainRole = await web3Service.getUserRole();
        if (blockchainRole !== dbRole && blockchainRole !== Role.None) {
          console.warn(
            `Role mismatch: Database=${dbRole}, Blockchain=${blockchainRole}`
          );
          toast({
            title: "Role Mismatch Detected",
            description: `Using database role: ${getRoleTitle(
              dbRole
            )}. Blockchain role may need updating.`,
            variant: "default",
          });
        }
      } catch (error) {
        // Non-fatal: just log the error and continue with database role
        console.warn("Could not verify blockchain role:", error);
      }

      // Use database role as authoritative
      const walletUser = this.createWalletUser(walletAddress, dbRole);
      this.currentUser = walletUser;
      this.saveAuthState();
      this.notifyListeners();

      return {
        success: true,
        user: walletUser,
      };
    } catch (error) {
      console.error("Wallet login error:", error);
      // Check for network-related errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return this.createErrorResult(AuthErrorCode.NETWORK_ERROR);
      }
      return this.createErrorResult(
        AuthErrorCode.UNKNOWN_ERROR,
        "Failed to authenticate with wallet. Please try again."
      );
    }
  }

  // Logout and clear all auth state
  public async logout(): Promise<void> {
    try {
      // Clear Supabase session if exists
      if (supabase) {
        await supabase.auth.signOut();
      }

      await this.clearAuthState();
      this.notifyListeners();
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if remote logout fails
      await this.clearAuthState();
      this.notifyListeners();
    }
  }

  // Check if user has specific permission
  public hasPermission(action: string, resource: string): boolean {
    if (!this.currentUser) return false;

    // Court role has all permissions
    if (this.currentUser.role === Role.Court) return true;

    // TODO: Implement granular permissions based on role
    // For now, simplified role-based access
    switch (this.currentUser.role) {
      case Role.Officer:
        return resource === "cases" || resource === "evidence";
      case Role.Forensic:
        return resource === "evidence" || resource === "analysis";
      case Role.Lawyer:
        return (
          resource === "cases" || (resource === "evidence" && action === "view")
        );
      default:
        return false;
    }
  }

  // Check if user can access specific role areas
  public canAccessRole(targetRole: Role): boolean {
    if (!this.currentUser) return false;

    // Court can access everything
    if (this.currentUser.role === Role.Court) return true;

    // Users can only access their own role areas
    return this.currentUser.role === targetRole;
  }

  // Initialize auth state from storage
  public async initializeFromStorage(): Promise<AuthUser | null> {
    // Prevent concurrent initialization
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitializing) {
      return null;
    }

    this.isInitializing = true;
    this.initPromise = this.performInitialization();

    try {
      return await this.initPromise;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  private async performInitialization(): Promise<AuthUser | null> {
    try {
      const storedUser = localStorage.getItem("forensicLedgerUser");
      if (!storedUser) {
        return null;
      }

      let userData: unknown;
      try {
        userData = JSON.parse(storedUser);
      } catch {
        console.error("Invalid stored user data");
        await this.clearAuthState();
        return null;
      }

      // Validate stored user data
      if (!this.isValidUserData(userData)) {
        await this.clearAuthState();
        return null;
      }

      // For email users, verify Supabase session
      if (userData.authType === "email" && supabase) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // Session expired, clear storage
          await this.clearAuthState();
          return null;
        }
      }

      // For wallet users, validate role assignment still exists
      if (userData.authType === "wallet" && userData.address) {
        try {
          const currentRole = await roleManagementService.getRoleForWallet(
            userData.address
          );
          if (currentRole === Role.None) {
            // Role revoked, clear storage
            await this.clearAuthState();
            return null;
          }

          // Update role if changed
          if (currentRole !== userData.role) {
            userData.role = currentRole;
            userData.roleTitle = getRoleTitle(currentRole);
          }
        } catch (error) {
          // Network error - allow cached user but mark for re-validation
          console.warn(
            "Could not verify wallet role, using cached data:",
            error
          );
        }
      }

      this.currentUser = userData;
      this.saveAuthState(); // Update any changes
      return this.currentUser;
    } catch (error) {
      console.error("Error initializing auth from storage:", error);
      await this.clearAuthState();
      return null;
    }
  }

  // Private helper methods
  private async loadUserProfile(
    userId: string,
    email: string
  ): Promise<AuthResult> {
    if (!supabase) {
      return { success: false, error: "Database not available" };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, role, role_title, address")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        return { success: false, error: "Profile not found" };
      }

      const user: AuthUser = {
        id: userId,
        email,
        name: data.name,
        role: this.mapRoleIntToEnum(data.role),
        roleTitle: data.role_title,
        address: data.address || undefined,
        authType: "email",
      };

      return { success: true, user };
    } catch (error) {
      console.error("Error loading user profile:", error);
      return { success: false, error: "Failed to load profile" };
    }
  }

  private async checkIfFirstUser(): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error checking user count:", error);
        return false;
      }

      return count === 0;
    } catch (error) {
      console.error("Error checking if first user:", error);
      return false;
    }
  }

  private async createCourtAdmin(
    userId: string,
    email: string
  ): Promise<AuthResult> {
    if (!roleManagementService.createCourtAdminProfile) {
      return { success: false, error: "Role management not available" };
    }

    try {
      const created = await roleManagementService.createCourtAdminProfile(
        userId,
        email,
        "Court Administrator"
      );

      if (created) {
        return this.loadUserProfile(userId, email);
      }

      return { success: false, error: "Failed to create admin profile" };
    } catch (error) {
      console.error("Error creating court admin:", error);
      return { success: false, error: "Failed to create admin profile" };
    }
  }

  private createWalletUser(walletAddress: string, role: Role): AuthUser {
    return {
      id: `wallet-${walletAddress}`,
      email: `${walletAddress}@wallet.local`,
      name: `${getRoleTitle(role)} (${walletAddress.substring(
        0,
        6
      )}...${walletAddress.substring(walletAddress.length - 4)})`,
      role,
      roleTitle: getRoleTitle(role),
      address: walletAddress,
      authType: "wallet",
    };
  }

  private mapRoleIntToEnum(roleInt: number | null | undefined): Role {
    if (roleInt === null || roleInt === undefined) {
      return Role.None;
    }

    switch (roleInt) {
      case 1:
        return Role.Court;
      case 2:
        return Role.Officer;
      case 3:
        return Role.Forensic;
      case 4:
        return Role.Lawyer;
      default:
        return Role.None;
    }
  }

  private isValidUserData(data: unknown): data is AuthUser {
    return (
      data !== null &&
      typeof data === "object" &&
      "id" in data &&
      "email" in data &&
      "name" in data &&
      "role" in data &&
      "roleTitle" in data &&
      "authType" in data &&
      typeof (data as Record<string, unknown>).id === "string" &&
      typeof (data as Record<string, unknown>).email === "string" &&
      typeof (data as Record<string, unknown>).name === "string" &&
      typeof (data as Record<string, unknown>).role === "number" &&
      typeof (data as Record<string, unknown>).roleTitle === "string" &&
      ((data as Record<string, unknown>).authType === "email" ||
        (data as Record<string, unknown>).authType === "wallet")
    );
  }

  private async clearAuthState(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("forensicLedgerUser");
    sessionStorage.removeItem("forensicLedgerUser");
  }

  private saveAuthState(): void {
    if (this.currentUser) {
      localStorage.setItem(
        "forensicLedgerUser",
        JSON.stringify(this.currentUser)
      );
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;
