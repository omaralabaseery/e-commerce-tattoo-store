"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  imageUrl?: string;
  status?: string;
}

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setCats(await api<Category[]>("/api/categories"));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function handleDelete(c: Category) {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await api(`/api/admin/categories/${c.id}`, { method: "DELETE", auth: true });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const nameById = (id?: number | null) => cats.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted">{cats.length} categories</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Parent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              ) : cats.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No categories yet.</td></tr>
              ) : (
                cats.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-muted">{c.slug}</td>
                    <td className="px-5 py-3 text-muted">{c.parentId ? nameById(c.parentId) : "—"}</td>
                    <td className="px-5 py-3 text-muted">{c.status ?? "ACTIVE"}</td>
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
        <CategoryForm
          category={editing}
          categories={cats}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function CategoryForm({
  category, categories, onClose, onSaved,
}: {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [parentId, setParentId] = useState(category?.parentId?.toString() ?? "");
  const [status, setStatus] = useState(category?.status ?? "ACTIVE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name,
      slug: slug || undefined,
      parentId: parentId ? Number(parentId) : null,
      status,
    };
    try {
      if (category) {
        await api(`/api/admin/categories/${category.id}`, { method: "PUT", body: JSON.stringify(payload), auth: true });
      } else {
        await api("/api/admin/categories", { method: "POST", body: JSON.stringify(payload), auth: true });
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
      <div className="w-full max-w-md rounded-card border border-line bg-paper p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{category ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-mist"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Name *</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Slug (auto if empty)</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input" placeholder="e.g. tattoo-machines" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Parent category</span>
            <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="input">
              <option value="">— none (top level) —</option>
              {categories.filter((c) => c.id !== category?.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          {error && <p className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
