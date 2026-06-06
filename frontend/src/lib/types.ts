export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  imageUrl?: string;
  status?: string;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  categoryId?: number;
  brandId?: number;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  rating: number;
  isFeatured?: boolean;
  badge?: "New" | "Bestseller" | "Limited";
  images: string[];
  attributes?: ProductAttribute[];
}

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethod = "KNET" | "CARD" | "APPLE_PAY" | "COD";
