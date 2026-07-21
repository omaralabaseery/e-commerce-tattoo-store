"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}
interface Page<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await api<Page<Customer>>(
        `/api/admin/customers?page=${pageNum}&size=20${q ? `&search=${encodeURIComponent(q)}` : ""}`,
        { auth: true }
      );
      setCustomers(res.content);
      setTotalPages(res.totalPages || 1);
      setTotal(res.totalElements);
      setPage(pageNum);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search, 0), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted">{total} customers</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line px-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className="h-9 w-48 bg-transparent text-sm outline-none placeholder:text-muted sm:w-64"
          />
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total spent</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No customers found.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted">{c.status}</div>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      <div>{c.email}</div>
                      {c.phone && <div className="text-xs">{c.phone}</div>}
                    </td>
                    <td className="px-5 py-3">{c.orderCount}</td>
                    <td className="px-5 py-3">{formatPrice(c.totalSpent)}</td>
                    <td className="px-5 py-3 text-muted">{c.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
            <button className="btn-ghost disabled:opacity-40" disabled={page === 0} onClick={() => load(search, page - 1)}>Previous</button>
            <span className="text-muted">Page {page + 1} of {totalPages}</span>
            <button className="btn-ghost disabled:opacity-40" disabled={page + 1 >= totalPages} onClick={() => load(search, page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
