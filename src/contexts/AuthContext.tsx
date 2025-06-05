import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/services/web3Service";
import { useToast } from "@/hooks/use-toast";
import { secureStorage } from "@/utils/secureStorage";

// Define user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleTitle: string;
  address?: string; // Added address property as optional
}

// Mock users for development
const mockUsers = [
  {
    id: "1",
    email: "court@example.com",
    password: "court123",
    name: "Judge Smith",
    role: Role.Court,
    roleTitle: "Court Judge",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  {
    id: "2",
    email: "officer@example.com",
    password: "officer123",
    name: "Officer Johnson",
    role: Role.Officer,
    roleTitle: "Police Officer",
    address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  },
  {
    id: "3",
    email: "forensic@example.com",
    password: "forensic123",
    name: "Dr. Anderson",
    role: Role.Forensic,
    roleTitle: "Forensic Investigator",
    address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  },
  {
    id: "4",
    email: "lawyer@example.com",
    password: "lawyer123",
    name: "Attorney Davis",
    role: Role.Lawyer,
    roleTitle: "Defense Attorney",
    address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user from secure storage on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await secureStorage.getItem("forensicLedgerUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        // Clear potentially corrupted data
        secureStorage.removeItem("forensicLedgerUser");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find((u) => u.email === email);

    if (foundUser && foundUser.password === password) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;

      try {
        // Store user in state and secure storage
        setUser(userWithoutPassword);
        await secureStorage.setItem(
          "forensicLedgerUser",
          JSON.stringify(userWithoutPassword)
        );

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userWithoutPassword.name}`,
        });

        return true;
      } catch (error) {
        console.error("Failed to store user data securely:", error);
        // Still set user in state even if storage fails
        setUser(userWithoutPassword);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userWithoutPassword.name}. Note: Session may not persist after browser restart.`,
        });
        return true; // Still allow login even if storage fails
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    secureStorage.removeItem("forensicLedgerUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  // Show loading state while checking for stored user
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
