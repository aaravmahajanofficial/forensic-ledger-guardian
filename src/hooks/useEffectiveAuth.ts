/**
 * useEffectiveAuth - Unified authentication hook
 *
 * This hook consolidates authentication state from both AuthContext (email/password)
 * and Web3Context (wallet authentication), providing a single source of truth for
 * user role and authentication status.
 *
 * Priority:
 * 1. AuthContext user role (email-authenticated users)
 * 2. Web3Context role (wallet-authenticated users)
 * 3. Role.None if neither is authenticated
 */

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Role } from "@/services/web3Service";

export interface EffectiveAuthState {
  /** The effective user role from either auth source */
  effectiveRole: Role;
  /** Whether the user is authenticated via any method */
  isAuthenticated: boolean;
  /** Whether authentication is currently loading */
  isLoading: boolean;
  /** The authentication method used ('email' | 'wallet' | null) */
  authMethod: "email" | "wallet" | null;
  /** User display name */
  displayName: string | null;
  /** User email (if email auth) */
  email: string | null;
  /** Wallet address (if wallet auth or linked) */
  walletAddress: string | null;
  /** Whether user has Court (admin) privileges */
  isCourtAdmin: boolean;
  /** Whether user can create cases */
  canCreateCases: boolean;
  /** Whether user can manage users */
  canManageUsers: boolean;
  /** Whether user can upload evidence */
  canUploadEvidence: boolean;
  /** Whether user can view evidence */
  canViewEvidence: boolean;
  /** Check if user has a specific role */
  hasRole: (role: Role) => boolean;
  /** Check if user can access a role's features (Court can access all) */
  canAccessRole: (role: Role) => boolean;
}

export function useEffectiveAuth(): EffectiveAuthState {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const { userRole: web3Role, isConnected, account } = useWeb3();

  return useMemo(() => {
    // Determine effective role - prioritize AuthContext (email) over Web3
    let effectiveRole: Role = Role.None;
    let authMethod: "email" | "wallet" | null = null;

    if (user && isLoggedIn) {
      // Email-authenticated user takes priority
      effectiveRole = user.role;
      authMethod = user.authType;
    } else if (isConnected && web3Role !== Role.None) {
      // Fall back to wallet authentication
      effectiveRole = web3Role;
      authMethod = "wallet";
    }

    const isAuthenticated = effectiveRole !== Role.None;
    const isCourtAdmin = effectiveRole === Role.Court;

    // Permission helpers
    const hasRole = (role: Role): boolean => effectiveRole === role;

    const canAccessRole = (role: Role): boolean => {
      if (isCourtAdmin) return true; // Court can access everything
      return effectiveRole === role;
    };

    // Feature-based permissions
    const canCreateCases = isCourtAdmin; // Only Court can create cases
    const canManageUsers = isCourtAdmin; // Only Court can manage users
    const canUploadEvidence = [
      Role.Court,
      Role.Officer,
      Role.Forensic,
    ].includes(effectiveRole);
    const canViewEvidence = effectiveRole !== Role.None; // All authenticated users can view

    return {
      effectiveRole,
      isAuthenticated,
      isLoading: authLoading,
      authMethod,
      displayName: user?.name ?? null,
      email: user?.email ?? null,
      walletAddress: user?.address ?? account ?? null,
      isCourtAdmin,
      canCreateCases,
      canManageUsers,
      canUploadEvidence,
      canViewEvidence,
      hasRole,
      canAccessRole,
    };
  }, [user, isLoggedIn, authLoading, web3Role, isConnected, account]);
}

export default useEffectiveAuth;
