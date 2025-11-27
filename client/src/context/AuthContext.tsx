import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "@/api/auth";
import { getMyProfile } from "@/api/profile";

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
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Load user data
          const userData = await getMe();
          
          // Try to load profile data and merge it
          try {
            const profileData = await getMyProfile();
            
            // Merge profile data with user data
            const mergedUser = {
              ...userData,
              id: userData._id || userData.id,
              _id: userData._id || userData.id, // Ensure both id and _id are set
              username: profileData.username || userData.name || userData.username,
              profileImage: profileData.profileImage || profileData.avatar || userData.profileImage || null,
              email: profileData.email || userData.email,
            };
            
            setUser(mergedUser);
          } catch (profileError: any) {
            // If profile load fails (404 means route doesn't exist yet, which is OK), just use user data
            if (profileError?.response?.status === 404) {
              // Route doesn't exist - this is expected if server hasn't restarted
              console.warn('Profile route not found (404) - server may need restart. Using user data only.');
            } else {
              console.warn('Profile not found, using user data only:', profileError);
            }
            setUser({
              ...userData,
              username: userData.name || userData.username,
            });
          }
        } catch (error) {
          // Silently handle auth errors - token might be expired or invalid
          // Only remove token, don't show error toast (handled by axios interceptor if needed)
          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
      // Re-fetch user data to ensure the context is updated with the latest user info
      try {
        const userData = await getMe();
        
        // Try to load profile data and merge it
        try {
          const profileData = await getMyProfile();
          
          // Merge profile data with user data
          const mergedUser = {
            ...userData,
            id: userData._id || userData.id,
            _id: userData._id || userData.id, // Ensure both id and _id are set
            username: profileData.username || userData.name || userData.username,
            profileImage: profileData.profileImage || profileData.avatar || userData.profileImage || null,
            email: profileData.email || userData.email,
          };
          
          setUser(mergedUser);
      } catch (profileError: any) {
        // If profile load fails, just use user data
        console.warn('Profile not found, using user data only:', profileError?.response?.status || profileError);
        setUser({
          ...userData,
          id: userData._id || userData.id,
          username: userData.name || userData.username,
        });
      }
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
