import React, { createContext, useState, useContext, useEffect } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  setAuthToken,
} from "@/lib/api";

interface User {
  id: number;
  email: string;
  full_name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name: string,
    phone_number?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user if token exists
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token);
      const user = await getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error loading user:", err);
      localStorage.removeItem("token");
      setAuthToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (
    email: string,
    password: string,
    full_name: string,
    phone_number?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerUser(email, password, full_name, phone_number);
      setAuthToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(email, password);
      setAuthToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
