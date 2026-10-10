"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type User = { id: number; name: string; email: string; role: "USER" | "ADMIN" };
type Ctx = { user: User | null; ready: boolean; setAuth: (t: string, u: User) => void; logout: () => void };

const AuthCtx = createContext<Ctx>({ user: null, ready: false, setAuth: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}
    setReady(true);
  }, []);

  const setAuth = (t: string, u: User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, ready, setAuth, logout }}>{children}</AuthCtx.Provider>;
}