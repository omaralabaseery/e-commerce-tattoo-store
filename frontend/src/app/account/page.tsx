"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, Settings, LogOut, ShieldCheck } from "lucide-react";
import { apiEnabled } from "@/lib/api";
import { useAuth, isAdminRole } from "@/lib/auth";

const links = [
  { href: "/account/orders", label: "My Orders", desc: "Track and review purchases", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", desc: "Saved products", icon: Heart },
  { href: "/account/addresses", label: "Addresses", desc: "Manage delivery addresses", icon: MapPin },
  { href: "/account/settings", label: "Profile Settings", desc: "Update your details", icon: Settings },
];

export default function AccountPage() {
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (apiEnabled && hydrated && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [hydrated, user, router]);

  if (apiEnabled && (!hydrated || !user)) {
    return (
      <div className="container-site flex justify-center py-24 text-sm text-muted">
        Loading your account…
      </div>
    );
  }

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  return (
    <div className="container-site py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Account</h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back{user ? `, ${user.name}` : ", Artist"}.
          </p>
        </div>
        <button onClick={handleSignOut} className="btn-ghost">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {links.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-card border border-line p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mist">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          </Link>
        ))}

        {isAdminRole(user?.role) && (
          <Link
            href="/admin"
            className="group flex items-start gap-4 rounded-card border border-line p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Admin Dashboard</p>
              <p className="text-sm text-muted">Manage products, orders & customers</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
