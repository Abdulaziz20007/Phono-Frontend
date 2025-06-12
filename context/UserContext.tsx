"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../api/api";
import { UserProfile } from "../api/types";
import toast from "react-hot-toast";

// Ensure we're running on the client side
const isBrowser = typeof window !== "undefined";

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Only run in the browser
    if (!isBrowser) return;

    const checkAuthentication = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          await loadUserProfile(token);
        } catch (error) {
          console.error("Initial auth check failed:", error);
          // Clear invalid token
          localStorage.removeItem("accessToken");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      setIsLoading(true);
      const userData = await api.user.me(token);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error("Failed to load user profile:", error);

      if ((error as Error).message === "Yaroqsiz refresh token") {
        throw error;
      }

      // Try to refresh the token
      try {
        const refreshResponse = await api.auth.refreshToken();
        const newToken = refreshResponse.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Try with the new token
        const userData = await api.user.me(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
        await logout();
        throw refreshError;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("accessToken", token);
    try {
      await loadUserProfile(token);
      toast.success("Вы успешно вошли в систему!");
    } catch (error) {
      console.error("Login profile loading failed:", error);
      localStorage.removeItem("accessToken");
      toast.error("Не удалось загрузить профиль пользователя");
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await api.auth.logout();
        toast.success("Вы успешно вышли из системы");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
