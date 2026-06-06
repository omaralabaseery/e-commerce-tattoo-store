/**
 * Thin API client for the Spring Boot backend.
 *
 * The storefront ships with mock data (see `data/mock.ts`) so it runs without a
 * backend. When NEXT_PUBLIC_API_URL is set, these helpers hit the real API.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiEnabled = Boolean(BASE_URL);

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) throw new Error("API not configured (set NEXT_PUBLIC_API_URL)");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.auth && typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
