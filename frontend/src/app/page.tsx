import { Hero } from "@/components/sections/Hero";
import { TrustBand } from "@/components/sections/TrustBand";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ProductRail } from "@/components/sections/ProductRail";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { cookies } from "next/headers";
import { getFeatured, getNewArrivals, getBestSellers, getCategories } from "@/lib/catalog";
import { normalizeLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lang = normalizeLang(cookies().get("lang")?.value);
  const [bestSellers, featured, newArrivals, categories] = await Promise.all([
    getBestSellers(lang),
    getFeatured(lang),
    getNewArrivals(lang),
    getCategories(lang),
  ]);

  return (
    <>
      <Hero />
      <TrustBand />
      <CategoryGrid categories={categories} />
      <ProductRail
        title="Best Sellers"
        subtitle="What professional artists reach for first."
        products={bestSellers}
        href="/products?sort=rating"
      />
      <BrandMarquee />
      <ProductRail
        title="Featured"
        subtitle="Hand-picked equipment we stand behind."
        products={featured}
        href="/products"
      />
      <ProductRail
        title="New Arrivals"
        subtitle="The latest additions to the catalog."
        products={newArrivals}
        href="/products?sort=newest"
      />
      <CtaBanner />
      <WhatsAppButton />
    </>
  );
}
