"use client";

import Link from "next/link";
import { Home, LayoutGrid, Search, Heart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Categories", icon: LayoutGrid },
  { href: "/search", label: "Search", icon: Search },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 backdrop-blur-md md:hidden">
      <div className="flex items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                active ? "text-ink" : "text-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "scale-110")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
