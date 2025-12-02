// AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import authService, { AuthUser, AuthErrorCode } from "@/services/authService";
import { Role } from "@/services/web3Service";

// Re-export for backward compatibility
export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (walletAddress: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasPermission: (action: string, resource: string) => boolean;
  canAccessRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await authService.initializeFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((authUser) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.loginWithEmail(email, password);

      if (result.success && result.user) {
        setUser(result.user);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}`,
        });

        if (result.requiresSetup) {
          navigate("/bootstrap");
        } else {
          navigate("/dashboard");
        }

        return true;
      } else {
        // Use error code for better UX if available
        const isNetworkError = result.errorCode === AuthErrorCode.NETWORK_ERROR;
        toast({
          title: isNetworkError ? "Connection Error" : "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: authService.getErrorMessage(AuthErrorCode.UNKNOWN_ERROR),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (walletAddress: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.loginWithWallet(walletAddress);

      if (result.success && result.user) {
        setUser(result.user);

        toast({
          title: "Authentication Successful",
          description: `Welcome, ${result.user.roleTitle}!`,
        });

        if (result.requiresSetup) {
          navigate("/bootstrap");
        } else {
          navigate("/dashboard");
        }

        return true;
      } else {
        // Use error code for better UX if available
        const isNetworkError = result.errorCode === AuthErrorCode.NETWORK_ERROR;
        const isNotAuthorized =
          result.errorCode === AuthErrorCode.WALLET_NOT_AUTHORIZED;

        toast({
          title: isNetworkError
            ? "Connection Error"
            : isNotAuthorized
            ? "Access Denied"
            : "Authentication Failed",
          description: result.error || "Wallet not authorized",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Wallet authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: authService.getErrorMessage(AuthErrorCode.UNKNOWN_ERROR),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);

      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to home even if logout fails
      setUser(null);
      navigate("/");
    }
  };

  const hasPermission = (action: string, resource: string): boolean => {
    return authService.hasPermission(action, resource);
  };

  const canAccessRole = (role: Role): boolean => {
    return authService.canAccessRole(role);
  };

  // React 19: Render context directly without Provider
  return (
    <AuthContext
      value={{
        user,
        login,
        loginWithWallet,
        logout,
        isLoggedIn: !!user,
        isLoading,
        hasPermission,
        canAccessRole,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
