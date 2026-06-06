import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Machines", href: "/products?category=1" },
      { label: "Ink", href: "/products?category=2" },
      { label: "Bundles & Kits", href: "/products?category=9" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return Policy", href: "/return-policy" },
    ],
  },
  {
    title: "Safety",
    links: [
      { label: "Tattoo Safety Guide", href: "/safety-guide" },
      { label: "Aftercare Guide", href: "/aftercare-guide" },
      { label: "Hygiene Policy", href: "/safety-guide#hygiene" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              TATTOO<span className="text-muted">STORE</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Professional tattoo equipment for serious artists. Curated, authentic, and built to last.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink/80 transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Tattoo Store. All rights reserved.</p>
          <p className="max-w-md">
            ⚠️ Age restriction: tattoo supplies are sold to professionals and adults (18+). Always follow
            hygiene and safety guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
