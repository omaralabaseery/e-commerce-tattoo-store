"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products as mockProducts } from "@/data/mock";
import type { Product } from "@/lib/types";
import { api, apiEnabled, imageSrc } from "@/lib/api";
import { ProductGrid } from "@/components/sections/ProductGrid";

interface ApiSummary {
  id: number;
  name: string;
  slug: string;
  categoryId?: number | null;
  brandId?: number | null;
  price: number;
  discountPrice?: number | null;
  rating?: number | null;
  stockQuantity: number;
  isFeatured?: boolean;
  imageUrl?: string | null;
}

function toProduct(p: ApiSummary): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: "",
    categoryId: p.categoryId ?? undefined,
    brandId: p.brandId ?? undefined,
    price: p.price,
    discountPrice: p.discountPrice ?? null,
    stockQuantity: p.stockQuantity,
    rating: p.rating ?? 0,
    isFeatured: p.isFeatured,
    images: p.imageUrl ? [imageSrc(p.imageUrl)] : [],
  };
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [apiResults, setApiResults] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!apiEnabled) return;
    const t = setTimeout(() => {
      const query = q.trim()
        ? `/api/products?search=${encodeURIComponent(q.trim())}&page=0&size=48`
        : "/api/products?page=0&size=48";
      api<{ content: ApiSummary[] }>(query)
        .then((res) => setApiResults(res.content.map(toProduct)))
        .catch(() => setApiResults(null));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const mockResults = useMemo(() => {
    if (!q.trim()) return mockProducts;
    const t = q.toLowerCase();
    return mockProducts.filter(
      (p) => p.name.toLowerCase().includes(t) || p.shortDescription?.toLowerCase().includes(t)
    );
  }, [q]);

  // With a live API never leak mock products into results — their IDs don't
  // exist in the real DB. Before the first fetch resolves just show nothing.
  const results = apiEnabled ? (apiResults ?? []) : mockResults;

  return (
    <div className="container-site py-10">
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-line px-5">
        <Search className="h-5 w-5 text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>
      <div className="mt-10">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
