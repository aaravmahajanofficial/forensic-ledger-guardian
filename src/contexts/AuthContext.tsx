import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/services/web3Service";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  roleTitle: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, role, roleTitle, address")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error loading profile:", error);
        return null;
      }
      const fullUser: User = {
        id: userId,
        email,
        name: data.name,
        role: data.role as Role,
        roleTitle: data.roleTitle,
        address: data.address || undefined,
      };
      setUser(fullUser);
      localStorage.setItem("forensicLedgerUser", JSON.stringify(fullUser));
      return fullUser;
    } catch (err) {
      console.error("Unexpected error loading profile", err);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Supabase login error:", error);
        return false;
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${email}`,
      });

      if (data.user) {
        await loadUserProfile(data.user.id, email);
      }
      return true;
    } catch (err) {
      const e = err as unknown;
      console.error("Login error", e);
      const message =
        typeof e === "object" && e !== null && "message" in e
          ? (e as { message?: string }).message
          : undefined;
      toast({
        title: "Login Failed",
        description: message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("forensicLedgerUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          await loadUserProfile(
            data.session.user.id,
            data.session.user.email || ""
          );
        }
      } catch (err) {
        console.error("Error during auth init", err);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id, session.user.email || "");
        } else {
          setUser(null);
          localStorage.removeItem("forensicLedgerUser");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case Role.Court:
          navigate("/dashboard/court");
          break;
        case Role.Officer:
          navigate("/dashboard/officer");
          break;
        case Role.Forensic:
          navigate("/dashboard/forensic");
          break;
        case Role.Lawyer:
          navigate("/dashboard/lawyer");
          break;
        default:
          navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
