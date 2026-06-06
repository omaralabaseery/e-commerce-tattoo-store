"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/mock";
import { ProductGrid } from "@/components/sections/ProductGrid";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return products;
    const t = q.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(t) || p.shortDescription?.toLowerCase().includes(t)
    );
  }, [q]);

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
