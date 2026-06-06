"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories, brands } from "@/data/mock";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price_asc" | "price_desc" | "newest" | "rating";

export function ProductsClient() {
  const params = useSearchParams();
  const initialCategory = params.get("category") ? Number(params.get("category")) : null;
  const initialSort = (params.get("sort") as Sort) || "featured";

  const [category, setCategory] = useState<number | null>(initialCategory);
  const [brand, setBrand] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [inStock, setInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const price = p.discountPrice ?? p.price;
      if (category && p.categoryId !== category) return false;
      if (brand && p.brandId !== brand) return false;
      if (price > maxPrice) return false;
      if (inStock && p.stockQuantity <= 0) return false;
      if (minRating && p.rating < minRating) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const pa = a.discountPrice ?? a.price;
      const pb = b.discountPrice ?? b.price;
      switch (sort) {
        case "price_asc": return pa - pb;
        case "price_desc": return pb - pa;
        case "rating": return b.rating - a.rating;
        case "newest": return b.id - a.id;
        default: return Number(b.isFeatured) - Number(a.isFeatured);
      }
    });
    return list;
  }, [category, brand, maxPrice, inStock, minRating, sort]);

  const reset = () => {
    setCategory(null);
    setBrand(null);
    setMaxPrice(500);
    setInStock(false);
    setMinRating(0);
  };

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setCategory(null)}
            className={cn("block text-sm", category === null ? "font-medium text-ink" : "text-muted")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn("block text-sm", category === c.id ? "font-medium text-ink" : "text-muted")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setBrand(brand === b.id ? null : b.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                brand === b.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Max price: {maxPrice} KWD
        </h3>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-ink"
        />
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Rating</h3>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                minRating === r ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-ink" />
        In stock only
      </label>

      <button onClick={reset} className="text-sm text-muted underline-offset-4 hover:underline">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="container-site py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-1 text-sm text-muted">{filtered.length} products</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="btn-ghost lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="ml-auto rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          <ProductGrid products={filtered} />
        </div>
      </div>

      {/* mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-card bg-paper p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
