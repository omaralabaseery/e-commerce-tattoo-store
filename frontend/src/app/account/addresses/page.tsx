import { MapPin, Plus } from "lucide-react";

export const metadata = { title: "Addresses" };

const addresses = [
  { id: 1, label: "Home", line: "Block 4, Street 12, Building 8, Apt 3 · Salmiya, Kuwait", isDefault: true },
];

export default function AddressesPage() {
  return (
    <div className="container-site py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Saved Addresses</h1>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-card border border-line p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{a.label}</span>
              {a.isDefault && <span className="badge">Default</span>}
            </div>
            <p className="mt-2 text-sm text-muted">{a.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
