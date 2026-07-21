"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, cn } from "@/lib/utils";

const STATUSES = [
  "PENDING", "CONFIRMED", "PROCESSING",
  "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED",
];
const FILTERS = ["All", ...STATUSES];

interface OrderItem {
  id: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}
interface Page<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async (status: string, pageNum: number) => {
    setLoading(true);
    try {
      const q =
        `/api/admin/orders?page=${pageNum}&size=20` +
        (status !== "All" ? `&status=${status}` : "");
      const res = await api<Page<Order>>(q, { auth: true });
      setOrders(res.content);
      setTotalPages(res.totalPages || 1);
      setTotal(res.totalElements);
      setPage(pageNum);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter, 0);
  }, [filter, load]);

  async function changeStatus(order: Order, status: string) {
    try {
      const updated = await api<Order>(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        auth: true,
      });
      setSelected(updated);
      load(filter, page);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <span className="text-sm text-muted">{total} orders</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              filter === f ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
            )}
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
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="cursor-pointer border-b border-line last:border-0 hover:bg-mist/50"
                  >
                    <td className="px-5 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-5 py-3">
                      <div className="text-ink">{o.customerName}</div>
                      <div className="text-xs text-muted">{o.customerPhone}</div>
                    </td>
                    <td className="px-5 py-3 text-muted">{o.createdAt?.slice(0, 10)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted">{o.paymentMethod}</span>{" "}
                      <StatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-5 py-3">{formatPrice(o.totalAmount)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
            <button className="btn-ghost disabled:opacity-40" disabled={page === 0} onClick={() => load(filter, page - 1)}>Previous</button>
            <span className="text-muted">Page {page + 1} of {totalPages}</span>
            <button className="btn-ghost disabled:opacity-40" disabled={page + 1 >= totalPages} onClick={() => load(filter, page + 1)}>Next</button>
          </div>
        )}
      </div>

      {selected && (
        <OrderDrawer order={selected} onClose={() => setSelected(null)} onStatus={changeStatus} />
      )}
    </div>
  );
}

function OrderDrawer({
  order, onClose, onStatus,
}: {
  order: Order;
  onClose: () => void;
  onStatus: (o: Order, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
            <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-mist"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-1 rounded-card border border-line p-4 text-sm">
          <p className="font-medium">{order.customerName}</p>
          <p className="text-muted">{order.customerPhone}</p>
          {order.customerEmail && <p className="text-muted">{order.customerEmail}</p>}
          {order.notes && <p className="mt-2 whitespace-pre-wrap text-muted">📝 {order.notes}</p>}
        </div>

        <div className="mt-4 rounded-card border border-line">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border-b border-line px-4 py-3 text-sm last:border-0">
              <div className="min-w-0">
                <p className="truncate font-medium">{it.productName}</p>
                <p className="text-xs text-muted">{it.sku} · ×{it.quantity}</p>
              </div>
              <span>{formatPrice(it.totalPrice)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discountAmount > 0 && <Row label={`Discount ${order.couponCode ? `(${order.couponCode})` : ""}`} value={`- ${formatPrice(order.discountAmount)}`} />}
          <Row label="Delivery" value={formatPrice(order.deliveryFee)} />
          <div className="flex justify-between border-t border-line pt-2 font-semibold">
            <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Order status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(order, s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  order.orderStatus === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                )}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span><span className="text-ink">{value}</span>
    </div>
  );
}
