import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";

/** Full-bleed dark conversion banner — the rare moment the palette inverts. */
export function CtaBanner() {
  return (
    <section className="container-site py-20">
      <FadeUp>
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-8 py-16 text-paper sm:px-16 sm:py-20">
          {/* subtle floating accents on the dark surface */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-white/5 blur-2xl animate-floatY" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl animate-floatYslow" />
          </div>

          <div className="relative max-w-2xl">
            <h2 className="text-display-sm font-semibold">
              Set up your station with confidence.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70">
              From first machine to full studio kit — authentic gear, fast delivery, and support
              from people who understand the craft.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products?category=9"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-all duration-300 ease-premium hover:scale-[1.02] active:scale-[0.98]"
              >
                Shop Kits
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-white/10"
              >
                Browse Everything
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
