"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: number;
  code: string;
  type: string; // PERCENTAGE | FIXED
  value: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
}
interface Page<T> { content: T[]; totalElements: number }

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api<Page<Coupon>>("/api/admin/coupons?page=0&size=100", { auth: true });
      setCoupons(res.content);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(c: Coupon) {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await api(`/api/admin/coupons/${c.id}`, { method: "DELETE", auth: true });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons &amp; Offers</h1>
          <p className="text-sm text-muted">{coupons.length} coupons</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Discount</th>
                <th className="px-5 py-3 font-medium">Min order</th>
                <th className="px-5 py-3 font-medium">Usage</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No coupons yet — create your first offer.</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3 font-medium">{c.code}</td>
                    <td className="px-5 py-3">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : formatPrice(c.value)}
                      {c.maxDiscount ? <span className="text-xs text-muted"> (max {formatPrice(c.maxDiscount)})</span> : null}
                    </td>
                    <td className="px-5 py-3 text-muted">{c.minOrderAmount > 0 ? formatPrice(c.minOrderAmount) : "—"}</td>
                    <td className="px-5 py-3 text-muted">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-lg p-1.5 hover:bg-mist" aria-label="Edit" onClick={() => { setEditing(c); setShowForm(true); }}><Pencil className="h-4 w-4" /></button>
                        <button className="rounded-lg p-1.5 hover:bg-mist" aria-label="Delete" onClick={() => handleDelete(c)}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CouponForm coupon={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function CouponForm({ coupon, onClose, onSaved }: { coupon: Coupon | null; onClose: () => void; onSaved: () => void }) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState(coupon?.type ?? "PERCENTAGE");
  const [value, setValue] = useState(coupon?.value?.toString() ?? "");
  const [minOrderAmount, setMinOrderAmount] = useState(coupon?.minOrderAmount?.toString() ?? "");
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount?.toString() ?? "");
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit?.toString() ?? "");
  const [endDate, setEndDate] = useState(coupon?.endDate ? coupon.endDate.slice(0, 10) : "");
  const [status, setStatus] = useState(coupon?.status ?? "ACTIVE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      code,
      type,
      value: Number(value),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      endDate: endDate ? new Date(endDate + "T23:59:59Z").toISOString() : null,
      status,
    };
    try {
      if (coupon) {
        await api(`/api/admin/coupons/${coupon.id}`, { method: "PUT", body: JSON.stringify(payload), auth: true });
      } else {
        await api("/api/admin/coupons", { method: "POST", body: JSON.stringify(payload), auth: true });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 sm:p-8" onClick={onClose}>
      <div className="w-full max-w-lg rounded-card border border-line bg-paper p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{coupon ? "Edit Coupon" : "Add Coupon"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-mist"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-muted">Code *</span>
            <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input" placeholder="SUMMER25" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed (EGP)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Value *</span>
            <input required type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Min order (EGP)</span>
            <input type="number" step="0.01" min="0" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Max discount (EGP)</span>
            <input type="number" step="0.01" min="0" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="input" placeholder="optional" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Usage limit</span>
            <input type="number" min="0" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="input" placeholder="unlimited" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Expiry date</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-muted">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          {error && <p className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm sm:col-span-2">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-line pt-4 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
