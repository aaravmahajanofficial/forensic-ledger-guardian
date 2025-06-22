/**
 * Authentication context for user sessions and authorization
 *
 * @module Contexts/AuthContext
 */

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { authService, LoginCredentials } from "@/services/authService";
import { logError, logSecurityEvent, logDebug } from "@/utils/logger";
import { secureStorage } from "@/utils/secureStorage";

/**
 * Interface defining the Authentication context API
 */
export interface AuthContextType {
  /** The currently authenticated user */
  user: User | null;

  /** Authenticate a user with email and password */
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;

  /** Request a password reset */
  requestPasswordReset: (email: string) => Promise<boolean>;

  /** Reset password with token */
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;

  /** Log out the current user */
  logout: () => void;

  /** Whether a user is currently logged in */
  isLoggedIn: boolean;

  /** Whether authentication is being checked */
  isLoading: boolean;

  /** Check if a user has a specific permission */
  hasPermission: (permission: string) => boolean;
}

// Create the context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component for authentication state
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Load user and validate session on component mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logDebug("Initializing authentication...", { auth: true });

        // Check for session token
        const token = secureStorage.getSessionToken();
        if (!token) {
          logDebug("No session token found", { auth: true });
          setIsLoading(false);
          return;
        }

        // Validate the token
        const isValid = await authService.validateSession();
        if (isValid) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            logSecurityEvent("User session restored", {
              userId: currentUser.id,
              email: currentUser.email,
            });
          }
        } else {
          // Clean up invalid tokens
          secureStorage.removeSessionToken();
        }
      } catch (error) {
        logError(
          "Failed to initialize authentication",
          {},
          error instanceof Error ? error : new Error(String(error))
        );
        // Clean up on error
        secureStorage.removeSessionToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in a user with email and password
   */
  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe = false
    ): Promise<boolean> => {
      try {
        setIsLoading(true);

        if (!email || !password) {
          toast({
            title: "Login Failed",
            description: "Email and password are required",
            variant: "destructive",
          });
          return false;
        }

        const credentials: LoginCredentials = {
          email,
          password,
          rememberMe,
        };

        const result = await authService.login(credentials);

        if (result.success && result.user) {
          setUser(result.user);

          logSecurityEvent("User logged in", {
            userId: result.user.id,
            email: result.user.email,
            rememberMe,
          });

          toast({
            title: "Login Successful",
            description: `Welcome back, ${
              result.user.name || result.user.email
            }`,
          });

          return true;
        } else {
          logSecurityEvent("Failed login attempt", {
            email,
            reason: result.error || "Invalid credentials",
          });

          toast({
            title: "Login Failed",
            description: result.error || "Invalid email or password",
            variant: "destructive",
          });

          return false;
        }
      } catch (error) {
        logError(
          "Login failed",
          { email },
          error instanceof Error ? error : new Error(String(error))
        );

        toast({
          title: "Login Failed",
          description: "An error occurred during login. Please try again.",
          variant: "destructive",
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  /**
   * Request a password reset email
   */
  const requestPasswordReset = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        if (!email) {
          toast({
            title: "Reset Failed",
            description: "Email is required",
            variant: "destructive",
          });
          return false;
        }

        const success = await authService.requestPasswordReset(email);

        if (success) {
          toast({
            title: "Reset Email Sent",
            description: "Check your email for password reset instructions",
          });
          return true;
        } else {
          toast({
            title: "Reset Failed",
            description: "Failed to send reset email",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        logError(
          "Password reset request failed",
          { email },
          error instanceof Error ? error : new Error(String(error))
        );

        toast({
          title: "Reset Failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });

        return false;
      }
    },
    [toast]
  );

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<boolean> => {
      try {
        if (!token || !newPassword) {
          toast({
            title: "Reset Failed",
            description: "Missing required information",
            variant: "destructive",
          });
          return false;
        }

        const success = await authService.resetPassword(token, newPassword);

        if (success) {
          toast({
            title: "Password Reset",
            description:
              "Your password has been updated successfully. Please log in.",
          });
          navigate("/login");
          return true;
        } else {
          toast({
            title: "Reset Failed",
            description: "Invalid or expired reset token",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        logError(
          "Password reset failed",
          { tokenLength: token?.length },
          error instanceof Error ? error : new Error(String(error))
        );

        toast({
          title: "Reset Failed",
          description:
            "An error occurred. Please try again or request a new reset link.",
          variant: "destructive",
        });

        return false;
      }
    },
    [toast, navigate]
  );

  /**
   * Log out the current user
   */
  const logout = useCallback(async () => {
    try {
      if (user) {
        logSecurityEvent("User logging out", {
          userId: user.id,
          email: user.email,
        });
      }

      await authService.logout();
      setUser(null);

      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });

      navigate("/");
    } catch (error) {
      logError(
        "Logout failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );

      // Still navigate away even if logout fails
      setUser(null);
      navigate("/");
    }
  }, [user, navigate, toast]);

  /**
   * Check if the user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user || !user.permissions) {
        return false;
      }

      return user.permissions.some((p) => p === permission);
    },
    [user]
  );

  // Create a memorized value for the context to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      user,
      login,
      requestPasswordReset,
      resetPassword,
      logout,
      isLoggedIn: !!user,
      isLoading,
      hasPermission,
    }),
    [
      user,
      login,
      requestPasswordReset,
      resetPassword,
      logout,
      isLoading,
      hasPermission,
    ]
  );

  // Show loading state while checking for stored user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-blue-600">Loading authentication...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook for accessing authentication context
 *
 * @throws Error if used outside of AuthProvider
 * @returns The authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
