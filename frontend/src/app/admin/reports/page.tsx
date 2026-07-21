"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface Overview {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
}

export default function AdminReportsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<{ day: string; revenue: number }[]>([]);
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api<Overview>("/api/admin/reports/overview", { auth: true }),
      api<{ series: Record<string, number> }>(`/api/admin/reports/sales?days=${days}`, { auth: true }),
      api<Record<string, number>>("/api/admin/reports/orders", { auth: true }),
    ])
      .then(([ov, sales, os]) => {
        setOverview(ov);
        setSeries(Object.entries(sales.series || {}).map(([day, revenue]) => ({ day: day.slice(5), revenue: Number(revenue) })));
        setByStatus(os);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted">Sales, orders and inventory insights.</p>
        </div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="input h-9 w-auto">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Sales" value={overview?.totalSales ?? 0} suffix=" EGP" />
        <StatCard label="Orders" value={overview?.totalOrders ?? 0} />
        <StatCard label="Customers" value={overview?.totalCustomers ?? 0} />
        <StatCard label="Low stock" value={overview?.lowStockCount ?? 0} />
      </div>

      <RevenueChart data={series} />

      <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-semibold">Orders by status</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="rounded-xl border border-line p-3 text-center">
              <div className="text-xl font-semibold">{count}</div>
              <div className="mt-1"><StatusBadge status={status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
