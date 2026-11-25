"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "student" | "lecturer" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
}

interface UserContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  login: (u: SessionUser) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock: read from localStorage so login survives refresh.
  // Replace with a real /api/me call when backend is live.
  useEffect(() => {
    const raw = localStorage.getItem("acadex_user");
    // eslint-disable-next-line
    if (raw) setUser(JSON.parse(raw));
    setIsLoading(false);
  }, []);

  const login = (u: SessionUser) => {
    localStorage.setItem("acadex_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("acadex_user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}