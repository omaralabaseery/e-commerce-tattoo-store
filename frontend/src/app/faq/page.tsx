import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "FAQ" };

const faqs = [
  { q: "Are your products authentic?", a: "Yes. Everything is sourced directly from official brands and verified for authenticity." },
  { q: "Do you ship outside Kuwait?", a: "Yes, we ship across the GCC. Delivery times and fees are shown at checkout." },
  { q: "Are needles and cartridges sterile?", a: "All needles and cartridges are medical-grade, sterile, and single-use." },
  { q: "What payment methods do you accept?", a: "KNET, Visa/Mastercard, Apple Pay, and Cash on Delivery." },
  { q: "Can I return a product?", a: "Unopened, unused items can be returned within the window described in our Return Policy. For hygiene reasons, opened needles, cartridges and inks cannot be returned." },
];

export default function Page() {
  return (
    <PageShell title="Frequently Asked Questions">
      <div className="space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-line p-4">
            <summary className="cursor-pointer list-none font-medium text-ink">{f.q}</summary>
            <p className="mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
