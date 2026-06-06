import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <PageShell title="Privacy Policy">
      <p>We collect only the information needed to process orders and improve your experience.</p>
      <h2>What We Collect</h2>
      <p>Contact details, delivery address, order history, and payment status (we never store full card numbers).</p>
      <h2>How We Use It</h2>
      <p>To fulfill orders, provide support, and send order updates. We do not sell your data.</p>
      <h2>Your Rights</h2>
      <p>You may request access to or deletion of your personal data at any time via support@tattoostore.com.</p>
    </PageShell>
  );
}
