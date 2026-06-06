import Link from "next/link";
import { Package, Heart, MapPin, Settings, LogOut } from "lucide-react";

export const metadata = { title: "My Account" };

const links = [
  { href: "/account/orders", label: "My Orders", desc: "Track and review purchases", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", desc: "Saved products", icon: Heart },
  { href: "/account/addresses", label: "Addresses", desc: "Manage delivery addresses", icon: MapPin },
  { href: "/account/settings", label: "Profile Settings", desc: "Update your details", icon: Settings },
];

export default function AccountPage() {
  return (
    <div className="container-site py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Account</h1>
          <p className="mt-1 text-sm text-muted">Welcome back, Artist.</p>
        </div>
        <Link href="/login" className="btn-ghost">
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
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
      </div>
    </div>
  );
}
