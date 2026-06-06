import { Hero } from "@/components/sections/Hero";
import { TrustBand } from "@/components/sections/TrustBand";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ProductRail } from "@/components/sections/ProductRail";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { products, featured, bestSellers } from "@/data/mock";

export default function HomePage() {
  const newArrivals = [...products].slice(-8).reverse();

  return (
    <>
      <Hero />
      <TrustBand />
      <CategoryGrid />
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
