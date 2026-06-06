import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "About Us" };

export default function Page() {
  return (
    <PageShell
      title="About Tattoo Store"
      intro="We supply professional tattoo artists and studios with authentic, reliable equipment — curated with the same care artists bring to their work."
    >
      <p>
        Tattoo Store began with a simple belief: professionals deserve tools they can trust. Every product
        we carry is sourced from official brands, checked for authenticity, and chosen for performance and
        safety.
      </p>
      <h2>Our promise</h2>
      <p>
        Authentic products, sterile and medical-grade where it matters, fast delivery across Kuwait and the
        GCC, and real support from people who understand the craft.
      </p>
    </PageShell>
  );
}
