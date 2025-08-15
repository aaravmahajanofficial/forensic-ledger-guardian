// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Role } from '@/services/web3Service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  roleTitle: string;
  address?: string;
}

  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  console.log('AuthProvider initialized');
  

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Login response:', data);
    console.log('Login error:', error);
    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Login Successful',
      description: `Welcome back, ${email}`,
    });

    if (data.user) {
      const profile = await loadUserProfile(data.user.id, email);
      if (!profile) {
        console.log('Failed to load user profile');
      };
    }

    navigate('/dashboard');
    return true;
  };

  const loadUserProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role, roleTitle, address')
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error loading profile:', error);
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
    localStorage.setItem('forensicLedgerUser', encryptData(JSON.stringify(fullUser)));
    return fullUser;
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Loading user profile:', { data });
      if (data.session?.user) {
        await loadUserProfile(data.session.user.id, data.session.user.email || '');
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        localStorage.removeItem('forensicLedgerUser');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('forensicLedgerUser');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
