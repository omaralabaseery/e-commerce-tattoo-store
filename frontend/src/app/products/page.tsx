import { Suspense } from "react";
import { cookies } from "next/headers";
import { ProductsClient } from "./ProductsClient";
import { getProducts, getCategories, getBrands } from "@/lib/catalog";
import { normalizeLang } from "@/lib/i18n";

export const metadata = { title: "Shop All Products" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const lang = normalizeLang(cookies().get("lang")?.value);
  const [products, categories, brands] = await Promise.all([
    getProducts(lang),
    getCategories(lang),
    getBrands(),
  ]);

  return (
    <Suspense fallback={<div className="container-site py-20 text-sm text-muted">Loading…</div>}>
      <ProductsClient products={products} categories={categories} brands={brands} />
    </Suspense>
  );
}
