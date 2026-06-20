"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  createdAt?: string;
  profile: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    phone: string | null;
    company: string | null;
  } | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Silent-refresh cadence. Kept below the access-token TTL (15m) so the access
// token is renewed before it expires and middleware/server guards stay happy.
const SILENT_REFRESH_MS = 10 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      // /me self-heals an expired access token via the DB refresh token.
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    timerRef.current = setInterval(() => {
      fetch("/api/auth/refresh", { method: "POST" }).catch(() => undefined);
    }, SILENT_REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
