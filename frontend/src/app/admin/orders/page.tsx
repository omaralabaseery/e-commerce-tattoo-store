import { recentOrders } from "@/data/adminMock";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Orders · Admin" };

const filters = ["All", "PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <button
            key={f}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors " +
              (i === 0 ? "border-ink bg-ink text-paper" : "border-line hover:border-ink")
            }
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.number} className="border-b border-line last:border-0 transition-colors hover:bg-mist/50">
                  <td className="px-5 py-3 font-medium">{o.number}</td>
                  <td className="px-5 py-3 text-muted">{o.customer}</td>
                  <td className="px-5 py-3 text-muted">{o.date}</td>
                  <td className="px-5 py-3">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
