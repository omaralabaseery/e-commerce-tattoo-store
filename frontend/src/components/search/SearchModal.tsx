"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { products as mockProducts } from "@/data/mock";
import type { Product } from "@/lib/types";
import { api, apiEnabled, imageSrc } from "@/lib/api";
import { getClientLang } from "@/lib/i18n";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";

const POPULAR = ["Cheyenne", "Black Ink", "Cartridges", "Power Supply"];

interface ApiSummary {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const requestSeq = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    if (!apiEnabled) {
      const lower = q.toLowerCase();
      setResults(
        mockProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p.shortDescription?.toLowerCase().includes(lower)
          )
          .slice(0, 6)
      );
      return;
    }

    // debounce live search against the API
    const seq = ++requestSeq.current;
    const lang = getClientLang();
    const t = setTimeout(() => {
      api<{ content: ApiSummary[] }>(
        `/api/products?search=${encodeURIComponent(q)}&page=0&size=6${lang !== "en" ? `&lang=${lang}` : ""}`
      )
        .then((res) => {
          // ignore out-of-order responses from older queries
          if (seq !== requestSeq.current) return;
          setResults(
            res.content.map((p) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              sku: "",
              price: p.price,
              discountPrice: p.discountPrice ?? null,
              stockQuantity: 0,
              rating: 0,
              images: p.imageUrl ? [imageSrc(p.imageUrl)] : [],
            }))
          );
        })
        .catch(() => {
          if (seq === requestSeq.current) setResults([]);
        });
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/20 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-card bg-paper shadow-lift"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-5 w-5 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() === "" ? (
                <div className="p-3">
                  <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="rounded-full border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted">No products found for “{query}”.</p>
              ) : (
                results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-mist"
                  >
                    <ProductImage src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{formatPrice(p.discountPrice ?? p.price)}</p>
                    </div>
                    <CornerDownLeft className="h-4 w-4 text-line" />
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
