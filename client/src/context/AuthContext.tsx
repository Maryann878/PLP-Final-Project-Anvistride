import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "@/api/auth";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch((error) => {
          // Silently handle auth errors - token might be expired or invalid
          // Only remove token, don't show error toast (handled by axios interceptor if needed)
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    // Re-fetch user data to ensure the context is updated with the latest user info
    // In a real app, you might also pass user data directly from login response
    try {
      const data = await getMe();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user data after login:", error);
      localStorage.removeItem("token"); // Clear token if user data fetch fails
      setUser(null);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (userData: Partial<any>) => {
    setUser((prev: any) => {
      const updated = { ...prev, ...userData };
      // Save to localStorage if needed
      const stored = localStorage.getItem('anvistride-user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localStorage.setItem('anvistride-user', JSON.stringify({ ...parsed, ...userData }));
        } catch {
          localStorage.setItem('anvistride-user', JSON.stringify(updated));
        }
      } else {
        localStorage.setItem('anvistride-user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
