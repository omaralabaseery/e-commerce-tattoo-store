"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { api, apiEnabled, imageSrc } from "@/lib/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, cn } from "@/lib/utils";

interface ImageDto {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
}

interface AttributeDto {
  name: string;
  value: string;
}

interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  categoryId?: number;
  brandId?: number;
  price: number;
  discountPrice?: number | null;
  wholesalePrice?: number | null;
  stockQuantity: number;
  lowStockLimit?: number;
  status: string;
  isFeatured?: boolean;
  images: ImageDto[];
  attributes: AttributeDto[];
}

interface PageResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

const emptyForm = {
  name: "",
  sku: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: "",
  discountPrice: "",
  wholesalePrice: "",
  stockQuantity: "0",
  status: "ACTIVE",
  isFeatured: false,
  imageUrls: [] as string[],
  attributes: [] as AttributeDto[],
};

type FormState = typeof emptyForm;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async (pageNum: number) => {
    if (!apiEnabled) {
      setError("API not configured — set NEXT_PUBLIC_API_URL to manage real products.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api<PageResponse<AdminProduct>>(
        `/api/admin/products?page=${pageNum}&size=20`,
        { auth: true }
      );
      setProducts(res.content);
      setTotalPages(res.totalPages || 1);
      setTotal(res.totalElements);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
    if (apiEnabled) {
      api<Category[]>("/api/categories").then(setCategories).catch(() => undefined);
      api<Brand[]>("/api/brands").then(setBrands).catch(() => undefined);
    }
  }, [load]);

  async function handleDelete(p: AdminProduct) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, { method: "DELETE", auth: true });
      load(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted">{total} products</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {error && (
        <p className="rounded-card border border-line bg-mist px-4 py-3 text-sm">{error}</p>
      )}

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No products yet — click “Add Product” to create the first one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-line last:border-0 transition-colors hover:bg-mist/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageSrc(p.images[0].imageUrl)}
                            alt=""
                            className="h-9 w-9 rounded-lg border border-line object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg border border-line bg-mist" />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">{p.sku}</td>
                    <td className="px-5 py-3">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("font-medium", p.stockQuantity <= 5 && "text-ink")}>
                        {p.stockQuantity}
                        {p.stockQuantity <= 5 && (
                          <span className="ml-1 text-xs text-muted">low</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-lg p-1.5 hover:bg-mist"
                          aria-label="Edit"
                          onClick={() => {
                            setEditing(p);
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-lg p-1.5 hover:bg-mist"
                          aria-label="Delete"
                          onClick={() => handleDelete(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
            <button
              className="btn-ghost disabled:opacity-40"
              disabled={page === 0}
              onClick={() => load(page - 1)}
            >
              Previous
            </button>
            <span className="text-muted">
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn-ghost disabled:opacity-40"
              disabled={page + 1 >= totalPages}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <ProductFormModal
          product={editing}
          categories={categories}
          brands={brands}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load(page);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  categories,
  brands,
  onClose,
  onSaved,
}: {
  product: AdminProduct | null;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          name: product.name,
          sku: product.sku,
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          categoryId: product.categoryId?.toString() ?? "",
          brandId: product.brandId?.toString() ?? "",
          price: product.price.toString(),
          discountPrice: product.discountPrice?.toString() ?? "",
          wholesalePrice: product.wholesalePrice?.toString() ?? "",
          stockQuantity: product.stockQuantity.toString(),
          status: product.status,
          isFeatured: Boolean(product.isFeatured),
          imageUrls: (product.images ?? [])
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((i) => i.imageUrl),
          attributes: product.attributes ?? [],
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => {
          const body = new FormData();
          body.append("file", file);
          return api<{ url: string }>("/api/admin/uploads", {
            method: "POST",
            body,
            auth: true,
          }).then((res) => res.url);
        })
      );
      // functional update: don't clobber removals made while uploads were in flight
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...uploaded] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      sku: form.sku,
      shortDescription: form.shortDescription || null,
      description: form.description || null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      brandId: form.brandId ? Number(form.brandId) : null,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : null,
      stockQuantity: Number(form.stockQuantity),
      status: form.status,
      isFeatured: form.isFeatured,
      imageUrls: form.imageUrls,
      attributes: form.attributes.filter((a) => a.name.trim() && a.value.trim()),
    };

    try {
      if (product) {
        await api(`/api/admin/products/${product.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          auth: true,
        });
      } else {
        await api("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
          auth: true,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-card border border-line bg-paper p-6 shadow-lift">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {product ? `Edit — ${product.name}` : "Add Product"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-mist" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name *">
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="SKU *">
              <input
                required
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="input"
              >
                <option value="">— none —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Brand">
              <select
                value={form.brandId}
                onChange={(e) => set("brandId", e.target.value)}
                className="input"
              >
                <option value="">— none —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (EGP) *">
              <input
                required
                type="number"
                step="0.001"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Discount price">
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.discountPrice}
                onChange={(e) => set("discountPrice", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Wholesale price (admin only)">
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.wholesalePrice}
                onChange={(e) => set("wholesalePrice", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Stock quantity *">
              <input
                required
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="input"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </Field>
          </div>

          <Field label="Short description">
            <input
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="input h-auto py-2.5"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
            />
            Featured on homepage
          </label>

          {/* Images */}
          <div>
            <p className="mb-2 text-sm text-muted">Images</p>
            <div className="flex flex-wrap gap-3">
              {form.imageUrls.map((url, i) => (
                <div key={`${url}-${i}`} className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc(url)}
                    alt=""
                    className="h-20 w-20 rounded-xl border border-line object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() =>
                      set(
                        "imageUrls",
                        form.imageUrls.filter((_, idx) => idx !== i)
                      )
                    }
                    className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-ink text-paper group-hover:flex"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-xs text-muted hover:border-ink hover:text-ink disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              First image is the main one shown in the store. JPG / PNG / WebP, max 10 MB.
            </p>
          </div>

          {/* Attributes */}
          <div>
            <p className="mb-2 text-sm text-muted">Specifications (optional)</p>
            <div className="space-y-2">
              {form.attributes.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Name (e.g. Voltage)"
                    value={a.name}
                    onChange={(e) =>
                      set(
                        "attributes",
                        form.attributes.map((x, idx) =>
                          idx === i ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                    className="input flex-1"
                  />
                  <input
                    placeholder="Value (e.g. 5–12V)"
                    value={a.value}
                    onChange={(e) =>
                      set(
                        "attributes",
                        form.attributes.map((x, idx) =>
                          idx === i ? { ...x, value: e.target.value } : x
                        )
                      )
                    }
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    aria-label="Remove specification"
                    onClick={() =>
                      set(
                        "attributes",
                        form.attributes.filter((_, idx) => idx !== i)
                      )
                    }
                    className="rounded-lg px-2 hover:bg-mist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("attributes", [...form.attributes, { name: "", value: "" }])}
                className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
              >
                + Add specification
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
              {saving ? "Saving…" : product ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
