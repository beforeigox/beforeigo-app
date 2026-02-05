import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { mockUser, testCredentials } from '../utils/mockData';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(savedUser),
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with Supabase later
    if (email === testCredentials.email && password === testCredentials.password) {
      const user = mockUser;
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}