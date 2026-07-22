/**
 * Minimalist line icons for the storefront categories, matched by slug.
 * Vector (scales crisply, tiny, inherits color) — styled to the store's
 * clean black-line aesthetic. Simple upright shapes for a consistent set.
 */
import type { SVGProps, ReactNode } from "react";

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS: Record<string, ReactNode> = {
  // Tattoo machine (wireless pen)
  "tattoo-machines": (
    <>
      <rect x="17" y="6" width="14" height="16" rx="3" />
      <circle cx="24" cy="12" r="2.2" />
      <path d="M24 6V4" />
      <path d="M20 22l4 10 4-10" />
      <path d="M24 32v10" />
    </>
  ),
  // Ink bottle
  "tattoo-ink": (
    <>
      <path d="M19 9h10v4l2 3v24a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V16l2-3z" />
      <path d="M22 9V5h4v4" />
      <path d="M17 27h14" />
    </>
  ),
  // Needle
  "tattoo-needles": (
    <>
      <circle cx="34" cy="11" r="3" />
      <path d="M32 13L14 38l-2 4 4-2z" />
    </>
  ),
  // Needle cartridge (upright)
  "tattoo-cartridges": (
    <>
      <path d="M19 6h10v6H19z" />
      <path d="M19 12h10v18a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z" />
      <path d="M22 34l2 8 2-8" />
    </>
  ),
  // Power supply
  "power-supplies": (
    <>
      <rect x="8" y="16" width="32" height="20" rx="2" />
      <rect x="12" y="20" width="12" height="12" rx="1.5" />
      <circle cx="32" cy="26" r="4" />
      <path d="M14 36v3M34 36v3" />
    </>
  ),
  // Grip / tube (upright cylinder with texture)
  grips: (
    <>
      <rect x="16" y="12" width="16" height="26" rx="5" />
      <path d="M24 12V7" />
      <path d="M16 18h16M16 24h16M16 30h16" />
    </>
  ),
  // Aftercare cream tube
  aftercare: (
    <>
      <path d="M17 15h14v21a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4z" />
      <path d="M17 15l3-6h8l3 6" />
      <path d="M22 9V6h4v3" />
      <path d="M20 40l4-3 4 3" />
    </>
  ),
  // Accessories (ink cap + clip cord)
  accessories: (
    <>
      <path d="M9 34h11l-1.5-7h-8z" />
      <circle cx="35" cy="14" r="3" />
      <path d="M35 17v9a6 6 0 0 1-6 6h-3" />
      <rect x="23" y="32" width="4" height="6" rx="1" />
    </>
  ),
  // Bundles & kits (open box with divider)
  "bundles-kits": (
    <>
      <path d="M8 20h32v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" />
      <path d="M8 20l4-6h24l4 6" />
      <path d="M24 14v26" />
      <path d="M13 27h7M28 27h7" />
    </>
  ),
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const icon = ICONS[slug] ?? ICONS["bundles-kits"];
  return (
    <svg {...base} className={className} aria-hidden>
      {icon}
    </svg>
  );
}
