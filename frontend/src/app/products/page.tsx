import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";
import { getProducts, getCategories, getBrands } from "@/lib/catalog";

export const metadata = { title: "Shop All Products" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <Suspense fallback={<div className="container-site py-20 text-sm text-muted">Loading…</div>}>
      <ProductsClient products={products} categories={categories} brands={brands} />
    </Suspense>
  );
}
