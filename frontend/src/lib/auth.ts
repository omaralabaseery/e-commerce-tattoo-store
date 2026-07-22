"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, storeTokens, readRefreshToken, type Scope } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
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
  setSession: (res: AuthResponse) => void;
  logout: () => Promise<void>;
}

function createAuthStore(scope: Scope, persistName: string) {
  return create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        hydrated: false,
        setHydrated: () => set({ hydrated: true }),

        setSession: (res) => {
          storeTokens(res.accessToken, res.refreshToken, scope);
          set({ user: res.user });
        },

        logout: async () => {
          const refreshToken = readRefreshToken(scope);
          if (refreshToken) {
            await api("/api/auth/logout", {
              method: "POST",
              body: JSON.stringify({ refreshToken }),
            }).catch(() => undefined);
          }
          storeTokens(null, null, scope);
          set({ user: null });
        },
      }),
      {
        name: persistName,
        partialize: (s) => ({ user: s.user }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated();
        },
      }
    )
  );
}

/** Storefront shopper session. */
export const useAuth = createAuthStore("customer", "tattoo-auth");

/** Admin dashboard session — independent from the storefront session. */
export const useAdminAuth = createAuthStore("admin", "tattoo-auth-admin");

/** Authenticate without storing anything — the caller routes tokens to a scope by role. */
export async function authenticate(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  return api<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
