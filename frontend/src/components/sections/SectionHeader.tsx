"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>}
      </motion.div>
      {href && (
        <Link href={href} className="link-underline shrink-0 text-sm font-medium text-ink">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
