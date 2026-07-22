/**
 * Thin API client for the Spring Boot backend.
 *
 * Auth is split into two independent scopes so the admin dashboard and the
 * storefront customer can be signed in at the same time in one browser without
 * clobbering each other:
 *   - "admin"    — used for /api/admin/* requests (admin dashboard session)
 *   - "customer" — used for everything else (storefront shopper session)
 * Each scope keeps its own tokens + persisted user under separate keys.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Server-side (SSR) requests inside Docker reach the backend on its internal hostname. */
export const API_URL_SSR =
  typeof window === "undefined" ? process.env.API_URL_INTERNAL || API_URL : API_URL;

export const apiEnabled = Boolean(API_URL);

/** Resolves backend-served upload paths (e.g. "/uploads/x.jpg") to absolute browser URLs. */
export function imageSrc(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/uploads/") && API_URL) return `${API_URL}${url}`;
  return url;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type Scope = "customer" | "admin";

const KEYS: Record<Scope, { access: string; refresh: string; persist: string }> = {
  customer: { access: "accessToken", refresh: "refreshToken", persist: "tattoo-auth" },
  admin: { access: "admin.accessToken", refresh: "admin.refreshToken", persist: "tattoo-auth-admin" },
};

/** /api/admin/* uses the admin session; everything else uses the customer session. */
function scopeForPath(path: string): Scope {
  return path.startsWith("/api/admin") ? "admin" : "customer";
}

type Tokens = { accessToken: string | null; refreshToken: string | null };

function readTokens(scope: Scope): Tokens {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  const k = KEYS[scope];
  return {
    accessToken: localStorage.getItem(k.access),
    refreshToken: localStorage.getItem(k.refresh),
  };
}

export function readRefreshToken(scope: Scope): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS[scope].refresh);
}

export function storeTokens(
  accessToken: string | null,
  refreshToken: string | null,
  scope: Scope = "customer"
) {
  if (typeof window === "undefined") return;
  const k = KEYS[scope];
  if (accessToken) localStorage.setItem(k.access, accessToken);
  else localStorage.removeItem(k.access);
  if (refreshToken) localStorage.setItem(k.refresh, refreshToken);
  else localStorage.removeItem(k.refresh);
}

/** True when the JWT's exp claim is in the past (with a 10s safety margin). */
function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now() + 10_000;
  } catch {
    return false;
  }
}

// Refresh tokens are single-use on the backend, so concurrent 401s in a scope
// must share one rotation instead of racing with the same (soon-revoked) token.
const refreshInFlight: Record<Scope, Promise<string | null> | null> = {
  customer: null,
  admin: null,
};

function tryRefresh(scope: Scope): Promise<string | null> {
  if (!refreshInFlight[scope]) {
    refreshInFlight[scope] = doRefresh(scope).finally(() => {
      refreshInFlight[scope] = null;
    });
  }
  return refreshInFlight[scope]!;
}

async function doRefresh(scope: Scope): Promise<string | null> {
  const { refreshToken } = readTokens(scope);
  if (!refreshToken || !API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      // Definitive rejection: this scope's session is over. Clear its tokens
      // and persisted user so the UI stops showing a signed-in state.
      storeTokens(null, null, scope);
      if (typeof window !== "undefined") localStorage.removeItem(KEYS[scope].persist);
      return null;
    }
    const data = await res.json();
    storeTokens(data.accessToken, data.refreshToken, scope);
    return data.accessToken as string;
  } catch {
    // Network blip — keep tokens and let a later request retry.
    return null;
  }
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = API_URL_SSR;
  if (!base) throw new Error("API not configured (set NEXT_PUBLIC_API_URL)");

  const scope = scopeForPath(path);
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (options.auth) {
    let { accessToken } = readTokens(scope);
    // Proactive refresh: some endpoints (e.g. POST /api/orders) are permitAll,
    // so an expired token is silently ignored server-side instead of returning
    // 401. Refresh before sending so the request is properly attributed.
    if (accessToken && isExpired(accessToken)) {
      accessToken = (await tryRefresh(scope)) ?? null;
    }
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${base}${path}`, { ...options, headers });

  // Access token expired → rotate this scope's refresh token and retry once.
  if (res.status === 401 && options.auth) {
    const newToken = await tryRefresh(scope);
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(`${base}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
