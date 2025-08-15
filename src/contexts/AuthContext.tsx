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
import CryptoJS from "crypto-js";

// Helper function to derive a strong key from password and salt using PBKDF2
function deriveKey(password: string, salt: string): CryptoJS.lib.WordArray {
  // 256-bit key, 100,000 iterations
  return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 100000 });
}
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

// Helper function to encrypt data before storing in localStorage
function encryptData(data: object, password: string, salt: string): string {
  const derivedKey = deriveKey(password, salt);
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey).toString();
  return ciphertext;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const loadUserProfile = async (userId: string, email: string, password: string) => {
    const parseRole = (role: unknown): Role => {
      if (typeof role === "string") {
        const roleKey = Object.keys(Role).find(
          (key) => key.toLowerCase() === role.toLowerCase()
        );
        if (roleKey) {
          return Role[roleKey as keyof typeof Role];
        }
      }
      if (typeof role === "number" && Role[role]) {
        return role;
      }
      return Role.None; // Default or error case
    };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, role, roleTitle, address")
        .eq("id", userId)
        .single();
      if (error) {
        console.warn("Could not load profile, attempting to create fallback for demo user", error);
        const roleFromEmail = email.split('@')[0];
        const role = parseRole(roleFromEmail);

        if (role !== Role.None) {
            const name = roleFromEmail.charAt(0).toUpperCase() + roleFromEmail.slice(1) + " User";
            const fullUser: User = {
                id: userId,
                email,
                name: name,
                role: role,
                roleTitle: roleFromEmail.charAt(0).toUpperCase() + roleFromEmail.slice(1),
                address: undefined,
            };
            setUser(fullUser);
            localStorage.setItem(
              "forensicLedgerUser",
              encryptData(fullUser, password, email) // Use password and email as salt
            );
            return fullUser;
        }

        console.error("Error loading profile and could not create fallback:", error);
        return null;
      }

      const fullUser: User = {
        id: userId,
        email,
        name: data.name,
        role: parseRole(data.role),
        roleTitle: data.roleTitle,
        address: data.address || undefined,
      };
      setUser(fullUser);
      localStorage.setItem(
        "forensicLedgerUser",
        encryptData(fullUser, password, email) // Use password and email as salt
      );
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
        await loadUserProfile(data.user.id, email, password);
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
