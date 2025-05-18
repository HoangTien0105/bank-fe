"use client";

import { loginApi, logoutApi } from "@/api/auth";
import { Token } from "@/app/login/_types/auth";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: Token | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Tạo context với giá trị mặc định
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
};

// Tạo và export context
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const existToken = localStorage.getItem("auth_token");
    if (existToken) {
      try {
        const tokenData = JSON.parse(existToken);
        setUser(tokenData);
      } catch (error) {
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Sử dụng API từ file api/auth.ts
      const tokenData = await loginApi(username, password);

      //Lưu token vào storage
      localStorage.setItem("auth_token", JSON.stringify(tokenData));
      setUser(tokenData);

      toaster.success({
        title: "Login success",
        duration: 3000,
        closable: true,
      });

      router.push("/dashboard");
    } catch (error) {
      toaster.error({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please review your information",
        duration: 3000,
        closable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("auth_token");
      setUser(null);

      toaster.success({
        title: "Logout successfully",
        duration: 3000,
        closable: true,
      });
      router.push("/login");
    } catch (error) {
      toaster.error({
        title: "Logout failure",
        description:
          error instanceof Error ? error.message : "Please try again",
        duration: 3000,
        closable: true,
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
