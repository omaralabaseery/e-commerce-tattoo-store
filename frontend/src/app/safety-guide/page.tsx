import { PageShell } from "@/components/content/PageShell";
export const metadata = { title: "Tattoo Safety Guide" };

export default function Page() {
  return (
    <PageShell
      title="Tattoo Safety Guide"
      intro="Tattoo supplies are regulated, professional products. Follow these guidelines to protect yourself and your clients."
    >
      <h2 id="hygiene">Hygiene & Sterilization</h2>
      <p>
        Use single-use, sterile needles and cartridges only. Never reuse single-use items. Autoclave any
        reusable tools and maintain a clean, barrier-protected workstation.
      </p>
      <h2>Age Restriction</h2>
      <p>
        Products are sold to professionals and adults aged <strong>18 and over</strong>. By purchasing you
        confirm you meet local legal requirements for tattoo practice.
      </p>
      <h2>Handling Inks</h2>
      <p>
        Pour only what you need into single-use caps. Never return ink to the bottle. Check expiry dates and
        store inks away from direct sunlight.
      </p>
      <h2>Sharps Disposal</h2>
      <p>Dispose of needles and cartridges in approved sharps containers in line with local regulations.</p>
      <h2>Disclaimer</h2>
      <p>
        Tattoo Store provides supplies, not medical advice. You are responsible for safe, compliant, and
        hygienic practice.
      </p>
    </PageShell>
  );
}
