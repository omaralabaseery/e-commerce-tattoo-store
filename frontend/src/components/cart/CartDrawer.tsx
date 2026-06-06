"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

export function CartDrawer() {
  const { isOpen, close, items, setQuantity, remove } = useCart();
  const subtotal = useCart((s) => s.subtotal());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Your Cart</h2>
              <button aria-label="Close cart" onClick={close} className="rounded-full p-1 hover:bg-mist">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist">
                  <ShoppingBag className="h-7 w-7 text-muted" />
                </div>
                <p className="text-sm text-muted">Your cart is empty.</p>
                <button onClick={close} className="btn-primary">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <ProductImage src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-lg" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                          <button
                            aria-label="Remove"
                            onClick={() => remove(item.productId)}
                            className="text-muted hover:text-ink"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                        <div className="mt-auto flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              aria-label="Decrease"
                              onClick={() => setQuantity(item.productId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              aria-label="Increase"
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-line px-5 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Delivery & discounts calculated at checkout.</p>
                  <Link href="/checkout" onClick={close} className="btn-primary w-full">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
