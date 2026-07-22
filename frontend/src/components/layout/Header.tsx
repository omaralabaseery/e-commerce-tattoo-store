"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { categories } from "@/data/mock";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search/SearchModal";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const user = useAuth((s) => s.user);
  // avoid SSR/client hydration mismatch: only trust persisted auth state after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const signedIn = mounted && Boolean(user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 ease-premium",
          scrolled ? "glass border-b border-line shadow-soft" : "bg-transparent"
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Ghazak3ndna" className="h-9 w-9 rounded-full" />
              <span className="text-lg font-semibold tracking-tight">
                GHAZAK<span className="text-muted">3NDNA</span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                className="link-underline text-sm text-ink/80 transition-colors hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist sm:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href={signedIn ? "/account" : "/login"}
              aria-label={signedIn ? "Account" : "Sign in"}
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist sm:flex"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              aria-label="Cart"
              onClick={openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-line bg-paper md:hidden">
            <nav className="container-site flex flex-col py-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm text-ink/80"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
