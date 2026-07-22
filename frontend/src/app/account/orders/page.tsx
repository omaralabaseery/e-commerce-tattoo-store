"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, apiEnabled } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatPrice, cn } from "@/lib/utils";

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: { id: number }[];
}
interface Page<T> {
  content: T[];
}

export default function OrdersPage() {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiEnabled) {
      setLoading(false);
      return;
    }
    if (!hydrated) return;
    if (!user) {
      router.replace("/login?redirect=/account/orders");
      return;
    }
    api<Page<Order>>("/api/orders/my-orders?page=0&size=50", { auth: true })
      .then((res) => setOrders(res.content))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [hydrated, user, router]);

  if (apiEnabled && (!hydrated || (user && loading))) {
    return (
      <div className="container-site flex justify-center py-24 text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-site py-12">
      <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-card border border-line p-10 text-center">
          <p className="text-muted">You have no orders yet.</p>
          <Link href="/products" className="btn-primary mt-5">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => {
            const cancelled = o.orderStatus === "CANCELLED" || o.orderStatus === "RETURNED";
            const currentIndex = STEPS.indexOf(o.orderStatus as (typeof STEPS)[number]);
            return (
              <div key={o.id} className="rounded-card border border-line p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-sm text-muted">
                      {o.createdAt?.slice(0, 10)} · {o.items.length} item(s)
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(o.totalAmount)}</p>
                </div>

                {cancelled ? (
                  <p className="mt-5 inline-flex rounded-full bg-mist px-3 py-1 text-xs font-medium text-muted">
                    {o.orderStatus === "CANCELLED" ? "Cancelled" : "Returned"}
                  </p>
                ) : (
                  <>
                    <div className="mt-6 flex items-center">
                      {STEPS.map((s, i) => (
                        <div key={s} className="flex flex-1 items-center last:flex-none">
                          <div className={cn("h-2.5 w-2.5 shrink-0 rounded-full", i <= currentIndex ? "bg-ink" : "bg-line")} />
                          {i < STEPS.length - 1 && (
                            <div className={cn("mx-1 h-px flex-1", i < currentIndex ? "bg-ink" : "bg-line")} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted">
                      <span>Pending</span>
                      <span>Delivered</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link href="/products" className="btn-ghost mt-8">Continue Shopping</Link>
    </div>
  );
}
