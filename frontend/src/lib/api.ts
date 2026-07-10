/**
 * Thin API client for the Spring Boot backend.
 *
 * The storefront ships with mock data (see `data/mock.ts`) so it runs without a
 * backend. When NEXT_PUBLIC_API_URL is set, these helpers hit the real API.
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

type Tokens = { accessToken: string | null; refreshToken: string | null };

function readTokens(): Tokens {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

export function storeTokens(accessToken: string | null, refreshToken: string | null) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  else localStorage.removeItem("accessToken");
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  else localStorage.removeItem("refreshToken");
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

// Refresh tokens are single-use on the backend, so concurrent 401s must share
// one rotation instead of racing each other with the same (soon-revoked) token.
let refreshInFlight: Promise<string | null> | null = null;

/** Rotates the refresh token. Returns the new access token, or null if re-login is needed. */
function tryRefresh(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<string | null> {
  const { refreshToken } = readTokens();
  if (!refreshToken || !API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      // Definitive rejection: session is over. Clear the dead credentials and
      // the persisted user so the UI stops showing a signed-in state.
      storeTokens(null, null);
      if (typeof window !== "undefined") localStorage.removeItem("tattoo-auth");
      return null;
    }
    const data = await res.json();
    storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    // Network blip — keep tokens and let a later request retry.
    return null;
  }
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = API_URL_SSR;
  if (!base) throw new Error("API not configured (set NEXT_PUBLIC_API_URL)");

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (options.auth) {
    let { accessToken } = readTokens();
    // Proactive refresh: endpoints like POST /api/orders are permitAll, so an
    // expired token is silently ignored server-side instead of returning 401 —
    // the order would be created as a guest order. Refresh before sending.
    if (accessToken && isExpired(accessToken)) {
      accessToken = (await tryRefresh()) ?? null;
    }
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${base}${path}`, { ...options, headers });

  // Access token expired → rotate the refresh token and retry once.
  if (res.status === 401 && options.auth) {
    const newToken = await tryRefresh();
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
