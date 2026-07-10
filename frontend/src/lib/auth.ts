"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, storeTokens } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: AuthUser;
}

export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "SUPPORT_AGENT",
];

export function isAdminRole(role?: string | null): boolean {
  return Boolean(role && ADMIN_ROLES.includes(role));
}

interface AuthState {
  user: AuthUser | null;
  /** true once the persisted state has been rehydrated on the client */
  hydrated: boolean;
  setHydrated: () => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      login: async (email, password) => {
        const res = await api<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        storeTokens(res.accessToken, res.refreshToken);
        set({ user: res.user });
        return res.user;
      },

      register: async (data) => {
        const res = await api<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(data),
        });
        storeTokens(res.accessToken, res.refreshToken);
        set({ user: res.user });
        return res.user;
      },

      logout: async () => {
        const refreshToken =
          typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
        if (refreshToken) {
          await api("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
          }).catch(() => undefined);
        }
        storeTokens(null, null);
        set({ user: null });
      },
    }),
    {
      name: "tattoo-auth",
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
