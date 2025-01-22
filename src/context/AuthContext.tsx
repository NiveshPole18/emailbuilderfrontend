import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from "../utils/api.ts"

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User | null>({ name: 'Test User', email: 'test@example.com' });
  const [isLoading] = useState(false);

  const logout = () => {
    // TODO: Implement actual logout
  };

  const signUp = async (name: string, email: string, password: string) => {
    // TODO: Implement actual signup
    console.log('Signup:', { name, email, password });
  };

  const login = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token); // Store the token
    // Set user state or any other necessary state
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, signUp, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
