import { ShieldCheck, Truck, BadgeCheck, Headphones } from "lucide-react";

const items = [
  { icon: BadgeCheck, title: "100% Authentic", desc: "Sourced from official brands" },
  { icon: Truck, title: "Fast Delivery", desc: "Across Kuwait & the GCC" },
  { icon: ShieldCheck, title: "Sterile & Safe", desc: "Medical-grade supplies" },
  { icon: Headphones, title: "Artist Support", desc: "WhatsApp & email" },
];

export function TrustBand() {
  return (
    <section className="border-y border-line bg-mist/50">
      <div className="container-site grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
