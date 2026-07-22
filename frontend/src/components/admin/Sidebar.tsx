"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ListTree, Boxes, ShoppingCart,
  Users, CreditCard, Ticket, BarChart3, Settings, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-paper px-3 py-5 lg:flex">
      <Link href="/admin" className="flex items-center gap-2 px-3 text-base font-semibold tracking-tight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="h-7 w-7 rounded-full" />
        <span>
          GHAZAK<span className="text-muted">3NDNA</span>
          <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-widest text-muted">Admin</span>
        </span>
      </Link>

      <nav className="mt-7 flex-1 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-muted hover:bg-mist hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to store
      </Link>
    </aside>
  );
}
