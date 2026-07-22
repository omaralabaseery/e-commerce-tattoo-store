"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { SectionHeader } from "./SectionHeader";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="container-site py-20">
      <SectionHeader title="Shop by Category" subtitle="Find exactly what your craft demands." href="/products" linkLabel="All categories" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/products?category=${c.id}`}
              className="group flex h-32 items-end justify-between overflow-hidden rounded-card border border-line bg-gradient-to-br from-mist via-white to-line p-4 transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-lift sm:h-40"
            >
              <span className="text-sm font-medium">{c.name}</span>
              <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
