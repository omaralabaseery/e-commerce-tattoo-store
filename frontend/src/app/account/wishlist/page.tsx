"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-site py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-line py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist">
            <Heart className="h-7 w-7 text-muted" />
          </div>
          <p className="text-sm text-muted">Your wishlist is empty.</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
