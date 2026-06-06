import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminProducts } from "@/data/adminMock";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, cn } from "@/lib/utils";

export const metadata = { title: "Products · Admin" };

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted">{adminProducts.length} products</p>
        </div>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
      </div>

      <div className="rounded-card border border-line bg-paper shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminProducts.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 transition-colors hover:bg-mist/50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-muted">{p.sku}</td>
                  <td className="px-5 py-3 text-muted">{p.category}</td>
                  <td className="px-5 py-3">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={cn("font-medium", p.stock <= 5 && "text-ink")}>
                      {p.stock}
                      {p.stock <= 5 && <span className="ml-1 text-xs text-muted">low</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-1.5 hover:bg-mist" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button className="rounded-lg p-1.5 hover:bg-mist" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
