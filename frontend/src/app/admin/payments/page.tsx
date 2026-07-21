"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";

interface Payment {
  id: number;
  orderId: number;
  orderNumber?: string;
  customerName?: string;
  paymentMethod: string;
  transactionId?: string;
  amount: number;
  status: string;
  createdAt: string;
}
interface Page<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api<Page<Payment>>(`/api/admin/payments?page=${pageNum}&size=20`, { auth: true });
      setPayments(res.content);
      setTotalPages(res.totalPages || 1);
      setTotal(res.totalElements);
      setPage(pageNum);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-muted">{total} transactions</p>
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Transaction</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No payments yet.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3 font-medium">{p.orderNumber ?? `#${p.orderId}`}</td>
                    <td className="px-5 py-3 text-muted">{p.customerName ?? "—"}</td>
                    <td className="px-5 py-3">{p.paymentMethod}</td>
                    <td className="px-5 py-3 text-muted">{p.transactionId ?? "—"}</td>
                    <td className="px-5 py-3">{formatPrice(p.amount)}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-muted">{p.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
            <button className="btn-ghost disabled:opacity-40" disabled={page === 0} onClick={() => load(page - 1)}>Previous</button>
            <span className="text-muted">Page {page + 1} of {totalPages}</span>
            <button className="btn-ghost disabled:opacity-40" disabled={page + 1 >= totalPages} onClick={() => load(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
