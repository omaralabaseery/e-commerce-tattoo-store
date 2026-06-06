import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Return Policy" };

export default function Page() {
  return (
    <PageShell title="Return Policy">
      <h2>Eligibility</h2>
      <p>Unopened, unused products in original packaging may be returned within 14 days of delivery.</p>
      <h2>Hygiene Exclusions</h2>
      <p>
        For health and safety reasons, opened <strong>needles, cartridges, and inks</strong> cannot be returned
        once the seal is broken.
      </p>
      <h2>Refunds</h2>
      <p>Approved refunds are issued to the original payment method. Cash on Delivery orders are refunded via bank transfer.</p>
    </PageShell>
  );
}
