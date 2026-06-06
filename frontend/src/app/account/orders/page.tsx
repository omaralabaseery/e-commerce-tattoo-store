import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "My Orders" };

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

const mockOrders = [
  { number: "TS-260601120501", date: "2026-06-01", total: 357.5, status: "OUT_FOR_DELIVERY", items: 3 },
  { number: "TS-260520093210", date: "2026-05-20", total: 84.0, status: "DELIVERED", items: 1 },
];

export default function OrdersPage() {
  return (
    <div className="container-site py-12">
      <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>

      <div className="mt-8 space-y-5">
        {mockOrders.map((o) => {
          const currentIndex = STEPS.indexOf(o.status as (typeof STEPS)[number]);
          return (
            <div key={o.number} className="rounded-card border border-line p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{o.number}</p>
                  <p className="text-sm text-muted">{o.date} · {o.items} item(s)</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(o.total)}</p>
              </div>

              {/* status timeline */}
              <div className="mt-6 flex items-center">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <div
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        i <= currentIndex ? "bg-ink" : "bg-line"
                      )}
                    />
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
            </div>
          );
        })}
      </div>

      <Link href="/products" className="btn-ghost mt-8">Continue Shopping</Link>
    </div>
  );
}
