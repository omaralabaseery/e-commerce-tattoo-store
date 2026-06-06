import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Aftercare Guide" };

export default function Page() {
  return (
    <PageShell title="Aftercare Guide" intro="Share these steps with clients to support clean, even healing.">
      <h2>First 24 Hours</h2>
      <p>Keep the wrap on as advised. Wash gently with fragrance-free soap and lukewarm water, then pat dry.</p>
      <h2>Days 2–14</h2>
      <p>Apply a thin layer of aftercare balm 2–3 times daily. Avoid soaking, direct sun, and picking at scabs.</p>
      <h2>What to Avoid</h2>
      <p>No swimming, saunas, or heavy sweating until fully healed. Keep the area clean and moisturized.</p>
      <h2>When to Seek Help</h2>
      <p>If signs of infection appear (spreading redness, swelling, fever), advise the client to seek medical care.</p>
    </PageShell>
  );
}
