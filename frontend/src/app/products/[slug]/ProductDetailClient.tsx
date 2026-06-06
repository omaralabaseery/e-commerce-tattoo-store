"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Heart, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart, useWishlist } from "@/lib/store";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "usage">("description");
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  const off = discountPercent(product.price, product.discountPrice);
  const price = product.discountPrice ?? product.price;

  return (
    <div className="container-site py-8">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-ink">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductImage src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-card border border-line" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ProductImage key={i} src={product.images[i]} alt={product.name} className="aspect-square rounded-xl border border-line" />
            ))}
          </div>
        </motion.div>

        {/* info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2">
            {product.badge && <span className="badge bg-ink text-paper border-ink">{product.badge}</span>}
            {off && <span className="badge">-{off}% OFF</span>}
          </div>
          <h1 className="mt-3 text-display-sm font-semibold">{product.name}</h1>
          <div className="mt-2"><StarRating rating={product.rating} /></div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-base text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{product.shortDescription}</p>

          <p className={cn("mt-4 text-sm", product.stockQuantity > 0 ? "text-ink" : "text-muted")}>
            {product.stockQuantity > 0 ? `In stock · ${product.stockQuantity} available` : "Out of stock"}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center" aria-label="Decrease">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center" aria-label="Increase">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => add(product, qty)}
              disabled={product.stockQuantity <= 0}
              className="btn-primary flex-1 disabled:opacity-30"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              aria-label="Wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
            >
              <Heart className={cn("h-5 w-5", wished ? "fill-ink text-ink" : "text-muted")} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-line p-3 text-xs">
              <Truck className="h-4 w-4" /> Fast delivery in Kuwait
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line p-3 text-xs">
              <ShieldCheck className="h-4 w-4" /> Sterile & authentic
            </div>
          </div>

          {/* safety disclaimer for regulated supplies */}
          <div className="mt-4 rounded-xl border border-line bg-mist/50 p-4 text-xs leading-relaxed text-muted">
            ⚠️ <span className="font-medium text-ink">Safety notice:</span> Tattoo needles, cartridges and inks
            are single-use, professional supplies. Sold to adults (18+). Always sterilize equipment and follow
            hygiene guidelines. See our{" "}
            <Link href="/safety-guide" className="underline">Tattoo Safety Guide</Link>.
          </div>
        </motion.div>
      </div>

      {/* tabs */}
      <div className="mt-14">
        <div className="flex gap-6 border-b border-line">
          {(["description", "specs", "usage"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative pb-3 text-sm capitalize transition-colors",
                tab === t ? "text-ink" : "text-muted hover:text-ink"
              )}
            >
              {t === "specs" ? "Specifications" : t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm leading-relaxed text-muted">
          {tab === "description" && <p className="max-w-prose">{product.description}</p>}
          {tab === "specs" && (
            <dl className="grid max-w-md grid-cols-1 gap-2">
              {(product.attributes ?? []).map((a) => (
                <div key={a.name} className="flex justify-between border-b border-line py-2">
                  <dt className="text-ink">{a.name}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === "usage" && (
            <p className="max-w-prose">
              Follow professional usage and hygiene practices. Use sterile, single-use items where applicable,
              dispose of sharps in approved containers, and refer to the Aftercare Guide for client guidance.
            </p>
          )}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* sticky mobile buy bar — conversion */}
      <div className="fixed inset-x-0 bottom-[57px] z-30 border-t border-line bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-base font-semibold leading-none">{formatPrice(price)}</p>
            {product.discountPrice && (
              <p className="mt-0.5 text-xs text-muted line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <button
            onClick={() => add(product, qty)}
            disabled={product.stockQuantity <= 0}
            className="btn-primary flex-1 disabled:opacity-30"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
