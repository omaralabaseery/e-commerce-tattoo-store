import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Terms & Conditions" };

export default function Page() {
  return (
    <PageShell title="Terms & Conditions">
      <p>By using this site and purchasing products, you agree to the following terms.</p>
      <h2>Professional Use</h2>
      <p>Products are intended for professional and adult (18+) use. You are responsible for safe, legal, hygienic practice.</p>
      <h2>Pricing & Availability</h2>
      <p>Prices and stock are subject to change. We reserve the right to cancel orders affected by errors.</p>
      <h2>Liability</h2>
      <p>Tattoo Store is not liable for misuse of products or for outcomes resulting from improper practice.</p>
    </PageShell>
  );
}
