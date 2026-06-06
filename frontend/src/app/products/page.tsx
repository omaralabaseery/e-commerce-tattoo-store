import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";

export const metadata = { title: "Shop All Products" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-sm text-muted">Loading…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
