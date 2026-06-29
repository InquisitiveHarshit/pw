"use client";

import { useState, useEffect, useCallback } from "react";
import { login as apiLogin, getMe, type AuthUser, type LoginData } from "@/lib/api/auth";

const TOKEN_KEY = "pw_token";
const USER_KEY = "pw_user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  /** Login — stores token + user in localStorage */
  const login = useCallback(async (data: LoginData) => {
    const res = await apiLogin(data);
    const { token, ...userData } = res.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    setUser(res.data);

    return res.data;
  }, []);

  /** Logout — clears localStorage */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  /** Refresh user data from backend */
  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser((prev) => (prev ? { ...prev, ...res.data } : res.data));
    } catch {
      logout();
    }
  }, [logout]);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    refreshUser,
  };
}
