"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";

type Settings = Record<string, string>;

const FIELDS: { key: string; label: string; hint?: string; type?: string }[] = [
  { key: "storeName", label: "Store name" },
  { key: "currency", label: "Currency", hint: "Display code, e.g. EGP" },
  { key: "deliveryFee", label: "Delivery fee (EGP)", type: "number" },
  { key: "freeDeliveryThreshold", label: "Free delivery over (EGP)", hint: "Leave empty to disable", type: "number" },
  { key: "contactEmail", label: "Contact email", type: "email" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "whatsapp", label: "WhatsApp number", hint: "e.g. 201234567890" },
  { key: "address", label: "Store address" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "tiktok", label: "TikTok URL" },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Settings>("/api/admin/settings", { auth: true })
      .then(setValues)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await api<Settings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(values),
        auth: true,
      });
      setValues(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Store info, currency, delivery fees and contact details.</p>
      </div>

      <form onSubmit={save} className="max-w-2xl rounded-card border border-line bg-paper p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted">{f.label}</span>
              <input
                type={f.type ?? "text"}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="input"
              />
              {f.hint && <span className="text-xs text-muted">{f.hint}</span>}
            </label>
          ))}
        </div>

        {error && <p className="mt-4 rounded-xl border border-line bg-mist px-3 py-2.5 text-sm">{error}</p>}

        <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="flex items-center gap-1 text-sm text-muted"><Check className="h-4 w-4" /> Saved</span>}
        </div>
      </form>
    </div>
  );
}
