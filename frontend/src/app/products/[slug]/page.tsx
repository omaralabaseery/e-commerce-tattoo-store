import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getRelated, products } from "@/data/mock";
import { ProductDetailClient } from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const related = getRelated(product);
  return <ProductDetailClient product={product} related={related} />;
}
