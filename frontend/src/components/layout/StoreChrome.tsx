"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/**
 * Wraps storefront chrome (header/footer/cart) and hides it on admin routes,
 * which provide their own dashboard shell.
 */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
    </>
  );
}
