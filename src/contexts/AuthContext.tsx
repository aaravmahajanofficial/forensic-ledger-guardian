
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '@/services/web3Service';
import { useToast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

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
    id: '1',
    email: 'court@example.com',
    password: 'court123',
    name: 'Judge Smith',
    role: Role.Court,
    roleTitle: 'Court Judge',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  },
  {
    id: '2',
    email: 'officer@example.com',
    password: 'officer123',
    name: 'Officer Johnson',
    role: Role.Officer,
    roleTitle: 'Police Officer',
    address: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'
  },
  {
    id: '3',
    email: 'forensic@example.com',
    password: 'forensic123',
    name: 'Dr. Anderson',
    role: Role.Forensic,
    roleTitle: 'Forensic Investigator',
    address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
  },
  {
    id: '4',
    email: 'lawyer@example.com',
    password: 'lawyer123',
    name: 'Attorney Davis',
    role: Role.Lawyer,
    roleTitle: 'Defense Attorney',
    address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db'
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('forensicLedgerUser');
    if (storedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(storedUser, process.env.REACT_APP_SECRET_KEY!);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (error) {
        console.error("Failed to decrypt user data:", error);
        return null;
      }
    }
    return null;
  });
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(userWithoutPassword),
        process.env.REACT_APP_SECRET_KEY!
      ).toString();
      localStorage.setItem('forensicLedgerUser', encryptedData);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userWithoutPassword.name}`,
      });
      
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forensicLedgerUser');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };

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
