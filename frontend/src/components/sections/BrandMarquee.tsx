import { brands } from "@/data/mock";

/** Infinite, edge-faded logo marquee — premium social proof. */
export function BrandMarquee() {
  const row = [...brands, ...brands]; // duplicate for seamless loop
  return (
    <section className="border-y border-line bg-paper py-10">
      <div className="container-site">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Trusted brands we carry
        </p>
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-16 pr-16">
            {row.map((b, i) => (
              <span
                key={`${b.id}-${i}`}
                className="select-none whitespace-nowrap text-xl font-semibold tracking-tight text-ink/30 transition-colors hover:text-ink"
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
