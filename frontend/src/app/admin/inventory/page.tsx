"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
  lowStockLimit?: number;
  status: string;
}
interface Page<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [onlyLow, setOnlyLow] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const load = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api<Page<Product>>(`/api/admin/products?page=${pageNum}&size=50`, { auth: true });
      setProducts(res.content);
      setTotalPages(res.totalPages || 1);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  async function save(p: Product) {
    const raw = drafts[p.id];
    const value = Number(raw);
    if (raw === undefined || raw === "" || Number.isNaN(value)) return;
    setSavingId(p.id);
    try {
      await api(`/api/admin/products/${p.id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ stockQuantity: value }),
        auth: true,
      });
      setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, stockQuantity: value } : x)));
      setDrafts((d) => { const c = { ...d }; delete c[p.id]; return c; });
      setSavedId(p.id);
      setTimeout(() => setSavedId((s) => (s === p.id ? null : s)), 1500);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  const isLow = (p: Product) => p.stockQuantity <= (p.lowStockLimit ?? 5);
  const shown = onlyLow ? products.filter(isLow) : products;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted">Adjust stock levels and watch low-stock items.</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="accent-ink" />
          Low stock only
        </label>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Current</th>
                <th className="px-5 py-3 font-medium">Limit</th>
                <th className="px-5 py-3 font-medium">Set stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : shown.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Nothing here.</td></tr>
              ) : (
                shown.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-muted">{p.sku}</td>
                    <td className="px-5 py-3">
                      <span className={cn("font-medium", isLow(p) && "text-ink")}>{p.stockQuantity}</span>
                      {isLow(p) && <span className="ml-1 rounded-full bg-mist px-2 py-0.5 text-[10px] text-muted">low</span>}
                    </td>
                    <td className="px-5 py-3 text-muted">{p.lowStockLimit ?? 5}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={drafts[p.id] ?? ""}
                          placeholder={String(p.stockQuantity)}
                          onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                          className="input h-9 w-24"
                        />
                        <button
                          onClick={() => save(p)}
                          disabled={savingId === p.id || drafts[p.id] === undefined || drafts[p.id] === ""}
                          className="btn-ghost h-9 px-3 py-0 text-xs disabled:opacity-40"
                        >
                          {savingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : savedId === p.id ? <Check className="h-4 w-4" /> : "Save"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && !onlyLow && (
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
