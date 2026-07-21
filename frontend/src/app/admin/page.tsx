"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";

interface Overview {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
}
interface OrderRow {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}
interface LowStock {
  id: number;
  name: string;
  stock: number;
  limit: number;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<{ day: string; revenue: number }[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [lowStock, setLowStock] = useState<LowStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Overview>("/api/admin/reports/overview", { auth: true }),
      api<{ series: Record<string, number> }>("/api/admin/reports/sales?days=30", { auth: true }),
      api<{ content: OrderRow[] }>("/api/admin/orders?page=0&size=6", { auth: true }),
      api<{ lowStock: LowStock[] }>("/api/admin/reports/inventory", { auth: true }),
    ])
      .then(([ov, sales, ord, inv]) => {
        setOverview(ov);
        setSeries(
          Object.entries(sales.series || {}).map(([day, revenue]) => ({
            day: day.slice(5),
            revenue: Number(revenue),
          }))
        );
        setOrders(ord.content);
        setLowStock(inv.lowStock);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Sales" value={overview?.totalSales ?? 0} suffix=" EGP" decimals={0} />
        <StatCard label="Orders" value={overview?.totalOrders ?? 0} />
        <StatCard label="Customers" value={overview?.totalCustomers ?? 0} />
        <StatCard label="Products" value={overview?.totalProducts ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueChart data={series} />

        <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Low stock alerts</h3>
            <Link href="/admin/inventory" className="text-xs text-muted hover:text-ink">
              View all
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted">Everything is well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <p className="min-w-0 flex-1 truncate font-medium">{p.name}</p>
                  <span className="ml-2 rounded-full bg-mist px-2.5 py-1 text-xs font-medium">
                    {p.stock} / {p.limit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-sm font-semibold">Latest orders</h3>
          <span className="text-xs text-muted">{overview?.pendingOrders ?? 0} pending</span>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No orders yet.</p>
        ) : (
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
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-5 py-3 text-muted">{o.customerName}</td>
                    <td className="px-5 py-3 text-muted">{o.createdAt?.slice(0, 10)}</td>
                    <td className="px-5 py-3">{formatPrice(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
