import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Shipping Policy" };

export default function Page() {
  return (
    <PageShell title="Shipping Policy">
      <h2>Delivery Areas</h2>
      <p>We deliver across Kuwait and the wider GCC. Available options and fees are shown at checkout.</p>
      <h2>Processing Time</h2>
      <p>Orders are processed within 1 business day. Standard delivery takes 1–3 days; express is next-day where available.</p>
      <h2>Tracking</h2>
      <p>You can track your order status (Pending → Confirmed → Processing → Out for delivery → Delivered) from your account.</p>
    </PageShell>
  );
}
