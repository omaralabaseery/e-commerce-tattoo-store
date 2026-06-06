"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { useCart, useWishlist } from "@/lib/store";
import { ProductImage } from "@/components/ui/ProductImage";
import { StarRating } from "@/components/ui/StarRating";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const [added, setAdded] = useState(false);

  const off = discountPercent(product.price, product.discountPrice);
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      whileHover={{ y: -6 }}
      className="group card overflow-hidden hover:shadow-lift hover:border-ink/15"
    >
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <ProductImage src={product.images[0]} alt={product.name} className="aspect-square w-full" />
        </Link>

        {/* gradient veil on hover for quick-view affordance */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && <span className="badge bg-ink text-paper border-ink">{product.badge}</span>}
          {off && <span className="badge bg-paper">-{off}%</span>}
          {lowStock && <span className="badge bg-paper">Only {product.stockQuantity} left</span>}
        </div>

        <button
          aria-label="Add to wishlist"
          onClick={() => toggleWish(product.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-all duration-300 ease-premium hover:scale-110 active:scale-95"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-ink text-ink" : "text-muted")} />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-ink">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-ink">
              {formatPrice(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            aria-label="Add to cart"
            onClick={handleAdd}
            disabled={product.stockQuantity <= 0}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-paper transition-all duration-300 ease-premium hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30",
              added ? "bg-ink" : "bg-ink hover:bg-ink-soft"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
