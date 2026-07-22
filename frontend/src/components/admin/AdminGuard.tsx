"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiEnabled } from "@/lib/api";
import { useAdminAuth, isAdminRole } from "@/lib/auth";

/**
 * Client-side gate for /admin pages: requires a signed-in user with an admin
 * role. The backend enforces the real authorization on every /api/admin call;
 * this only keeps non-admins out of the UI.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAdminAuth();
  const router = useRouter();

  // Without a configured API there is nothing to authenticate against (mock mode).
  const allowed = !apiEnabled || isAdminRole(user?.role);

  useEffect(() => {
    if (hydrated && !allowed) {
      router.replace("/login?redirect=/admin");
    }
  }, [hydrated, allowed, router]);

  if (apiEnabled && (!hydrated || !allowed)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
