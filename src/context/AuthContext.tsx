import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally fetch user data with the token
      api.get("/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await api.post("/register", { name, email, password });
    localStorage.setItem("token", response.data.token);
    setUser({ name, email });
  };

  const login = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser({ name: response.data.name, email }); // Assuming the response contains the user's name
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
