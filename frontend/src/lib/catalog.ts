/**
 * Catalog data access.
 *
 * When NEXT_PUBLIC_API_URL is set these helpers fetch live data from the
 * backend; the bundled mock data is used ONLY when no API is configured.
 * With a live API, failures return empty results rather than mock products —
 * mock items have IDs/slugs that don't exist in the real database, and letting
 * them leak into carts produces orders that can never be fulfilled.
 */
import { cache } from "react";
import { api, apiEnabled, imageSrc } from "@/lib/api";
import type { Product, Category, Brand } from "@/lib/types";
import {
  products as mockProducts,
  categories as mockCategories,
  brands as mockBrands,
  featured as mockFeatured,
  bestSellers as mockBestSellers,
  getProduct as getMockProduct,
} from "@/data/mock";

interface ApiImage {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
}

interface ApiProductSummary {
  id: number;
  name: string;
  slug: string;
  categoryId?: number | null;
  brandId?: number | null;
  price: number;
  discountPrice?: number | null;
  rating?: number | null;
  stockQuantity: number;
  isFeatured?: boolean;
  imageUrl?: string | null;
}

interface ApiProductDetail extends Omit<ApiProductSummary, "imageUrl"> {
  sku: string;
  description?: string;
  shortDescription?: string;
  categoryId?: number;
  brandId?: number;
  status?: string;
  images: ApiImage[];
  attributes?: { name: string; value: string }[];
}

interface ApiPage<T> {
  content: T[];
}

// Cached for 60s in Next's data cache: anonymous traffic doesn't hammer the
// backend, while admin catalog edits still show up within a minute.
const cached: RequestInit = { next: { revalidate: 60 } };

function fromSummary(p: ApiProductSummary): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: "",
    categoryId: p.categoryId ?? undefined,
    brandId: p.brandId ?? undefined,
    price: p.price,
    discountPrice: p.discountPrice ?? null,
    stockQuantity: p.stockQuantity,
    rating: p.rating ?? 0,
    isFeatured: p.isFeatured,
    images: p.imageUrl ? [imageSrc(p.imageUrl)] : [],
  };
}

function fromDetail(p: ApiProductDetail): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.shortDescription,
    categoryId: p.categoryId,
    brandId: p.brandId,
    price: p.price,
    discountPrice: p.discountPrice ?? null,
    stockQuantity: p.stockQuantity,
    rating: p.rating ?? 0,
    isFeatured: p.isFeatured,
    images: (p.images ?? [])
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((i) => imageSrc(i.imageUrl)),
    attributes: p.attributes,
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!apiEnabled) return mockCategories;
  try {
    return await api<Category[]>("/api/categories", cached);
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  if (!apiEnabled) return mockBrands;
  try {
    return await api<Brand[]>("/api/brands", cached);
  } catch {
    return [];
  }
}

/** Full active catalog (used for client-side filtering / search). */
export async function getProducts(): Promise<Product[]> {
  if (!apiEnabled) return mockProducts;
  try {
    const res = await api<ApiPage<ApiProductSummary>>(
      "/api/products?page=0&size=200",
      cached
    );
    return res.content.map(fromSummary);
  } catch {
    return [];
  }
}

/** react cache(): generateMetadata + the page component share one fetch per request. */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!apiEnabled) return getMockProduct(slug) ?? null;
  try {
    const res = await api<ApiProductDetail>(
      `/api/products/${encodeURIComponent(slug)}`,
      cached
    );
    return fromDetail(res);
  } catch {
    return null;
  }
});

export async function getFeatured(): Promise<Product[]> {
  if (!apiEnabled) return mockFeatured;
  try {
    const res = await api<ApiProductSummary[]>("/api/products/featured", cached);
    return res.map(fromSummary);
  } catch {
    return [];
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!apiEnabled) return [...mockProducts].slice(-8).reverse();
  try {
    const res = await api<ApiProductSummary[]>("/api/products/new-arrivals", cached);
    return res.map(fromSummary);
  } catch {
    return [];
  }
}

export async function getBestSellers(): Promise<Product[]> {
  if (!apiEnabled) return mockBestSellers;
  try {
    const res = await api<ApiPage<ApiProductSummary>>(
      "/api/products?sort=rating&page=0&size=8",
      cached
    );
    return res.content.map(fromSummary);
  } catch {
    return [];
  }
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (!apiEnabled) {
    const others = mockProducts.filter((p) => p.id !== product.id);
    const same = others.filter(
      (p) => product.categoryId && p.categoryId === product.categoryId
    );
    return (same.length > 0 ? same : others).slice(0, 4);
  }
  try {
    const query = product.categoryId
      ? `/api/products?categoryId=${product.categoryId}&page=0&size=5`
      : "/api/products?page=0&size=5";
    const res = await api<ApiPage<ApiProductSummary>>(query, cached);
    return res.content
      .map(fromSummary)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  } catch {
    return [];
  }
}
