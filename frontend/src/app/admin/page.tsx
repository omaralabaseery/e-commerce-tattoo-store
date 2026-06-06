import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { stats, recentOrders, lowStock } from "@/data/adminMock";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Sales" value={stats.totalSales} suffix=" KWD" decimals={1} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueChart />

        <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
          <h3 className="mb-4 text-sm font-semibold">Low stock alerts</h3>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.sku} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.sku}</p>
                </div>
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium">
                  {p.stock} / {p.limit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-sm font-semibold">Latest orders</h3>
          <span className="text-xs text-muted">{stats.pendingOrders} pending</span>
        </div>
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
