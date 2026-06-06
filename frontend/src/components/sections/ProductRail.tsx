"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "./SectionHeader";

/** Horizontal scrolling rail used for Best Sellers / New Arrivals. */
export function ProductRail({
  title,
  subtitle,
  products,
  href,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="container-site py-20">
      <SectionHeader title={title} subtitle={subtitle} href={href} />
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
        {products.map((p, i) => (
          <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[270px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
