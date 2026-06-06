import type { Brand, Category, Product } from "@/lib/types";

export const categories: Category[] = [
  { id: 1, name: "Tattoo Machines", slug: "tattoo-machines" },
  { id: 2, name: "Tattoo Ink", slug: "tattoo-ink" },
  { id: 3, name: "Needles", slug: "tattoo-needles" },
  { id: 4, name: "Cartridges", slug: "tattoo-cartridges" },
  { id: 5, name: "Power Supplies", slug: "power-supplies" },
  { id: 6, name: "Grips", slug: "grips" },
  { id: 7, name: "Aftercare", slug: "aftercare" },
  { id: 8, name: "Accessories", slug: "accessories" },
  { id: 9, name: "Bundles & Kits", slug: "bundles-kits" },
];

export const brands: Brand[] = [
  { id: 1, name: "Cheyenne" },
  { id: 2, name: "FK Irons" },
  { id: 3, name: "Eternal Ink" },
  { id: 4, name: "Dynamic" },
  { id: 5, name: "Kwadron" },
  { id: 6, name: "Critical" },
];

export const products: Product[] = [
  {
    id: 1, name: "Cheyenne Hawk Pen", slug: "cheyenne-hawk-pen", sku: "MCH-001",
    shortDescription: "Professional rotary pen machine",
    description:
      "Precision rotary pen machine trusted by professionals worldwide. Ergonomic, lightweight, and whisper-quiet for long sessions.",
    categoryId: 1, brandId: 1, price: 185, discountPrice: 169,
    stockQuantity: 24, rating: 4.9, isFeatured: true, badge: "Bestseller",
    images: [], attributes: [
      { name: "Stroke", value: "3.5mm" }, { name: "Weight", value: "120g" }, { name: "Type", value: "Rotary Pen" },
    ],
  },
  {
    id: 2, name: "FK Irons Spektra Flux", slug: "fk-irons-spektra-flux", sku: "MCH-002",
    shortDescription: "Wireless rotary machine",
    description: "Wireless rotary machine with PowerBolt battery. Balanced, durable, and fully customizable give.",
    categoryId: 1, brandId: 2, price: 320, stockQuantity: 12, rating: 4.8, isFeatured: true, badge: "New",
    images: [], attributes: [{ name: "Battery", value: "PowerBolt" }, { name: "Type", value: "Wireless Rotary" }],
  },
  {
    id: 3, name: "Eternal Ink — Black Onyx 4oz", slug: "eternal-ink-black-onyx", sku: "INK-001",
    shortDescription: "Premium outlining black ink",
    description: "Industry-standard outlining black. Vegan, smooth, and consistent across all skin tones.",
    categoryId: 2, brandId: 3, price: 22, discountPrice: 18.5,
    stockQuantity: 80, rating: 4.9, isFeatured: true,
    images: [], attributes: [{ name: "Volume", value: "4oz" }, { name: "Vegan", value: "Yes" }],
  },
  {
    id: 4, name: "Dynamic Color Set — 12 Bottles", slug: "dynamic-color-set-12", sku: "INK-002",
    shortDescription: "12-bottle vivid color set",
    description: "A vivid 12-bottle color set for versatile work. Pre-dispersed and ready to use.",
    categoryId: 2, brandId: 4, price: 95, discountPrice: 84, stockQuantity: 30, rating: 4.7,
    images: [], attributes: [{ name: "Bottles", value: "12" }],
  },
  {
    id: 5, name: "Kwadron Cartridges — 20pk (3RL)", slug: "kwadron-cartridges-3rl", sku: "CRT-001",
    shortDescription: "Sterile 3RL cartridges, 20pk",
    description: "Medical-grade 3RL cartridges with membrane safety. Sterile, single-use.",
    categoryId: 4, brandId: 5, price: 28, stockQuantity: 120, rating: 4.8, isFeatured: true, badge: "Bestseller",
    images: [], attributes: [{ name: "Config", value: "3RL" }, { name: "Sterile", value: "Yes (EO gas)" }],
  },
  {
    id: 6, name: "Critical Power Supply CX-2", slug: "critical-power-cx2", sku: "PWR-001",
    shortDescription: "Dual digital power supply",
    description: "Dual-machine digital power supply with precise voltage control and a bright OLED display.",
    categoryId: 5, brandId: 6, price: 240, discountPrice: 219, stockQuantity: 18, rating: 4.9,
    images: [], attributes: [{ name: "Outputs", value: "2" }, { name: "Display", value: "OLED" }],
  },
  {
    id: 7, name: "Disposable Grips — 25mm (10pk)", slug: "disposable-grips-25mm", sku: "GRP-001",
    shortDescription: "Disposable cartridge grips",
    description: "Comfortable disposable cartridge grips. Ergonomic, hygienic, single-use.",
    categoryId: 6, brandId: 6, price: 19, stockQuantity: 60, rating: 4.6,
    images: [], attributes: [{ name: "Diameter", value: "25mm" }],
  },
  {
    id: 8, name: "Aftercare Healing Balm 50ml", slug: "aftercare-healing-balm", sku: "AFT-001",
    shortDescription: "Soothing vegan aftercare balm",
    description: "Vegan healing balm that soothes and protects fresh tattoos. Fragrance-free.",
    categoryId: 7, brandId: 3, price: 14.5, discountPrice: 11.9,
    stockQuantity: 200, rating: 4.8, isFeatured: true,
    images: [], attributes: [{ name: "Volume", value: "50ml" }, { name: "Vegan", value: "Yes" }],
  },
  {
    id: 9, name: "Starter Artist Kit", slug: "starter-artist-kit", sku: "KIT-001",
    shortDescription: "Complete beginner tattoo kit",
    description: "Everything an apprentice needs to start: machine, power supply, cartridges, grips and aftercare.",
    categoryId: 9, brandId: 2, price: 410, discountPrice: 369,
    stockQuantity: 10, rating: 4.7, isFeatured: true, badge: "Limited",
    images: [], attributes: [{ name: "Includes", value: "Machine + PSU + Supplies" }],
  },
  {
    id: 10, name: "Stainless Ink Cap Holder", slug: "stainless-ink-cap-holder", sku: "ACC-001",
    shortDescription: "Autoclavable ink cap holder",
    description: "Autoclavable stainless steel ink cap holder for a clean, organized workstation.",
    categoryId: 8, brandId: 6, price: 24, stockQuantity: 45, rating: 4.5,
    images: [], attributes: [{ name: "Material", value: "Stainless Steel" }],
  },
];

export const bestSellers = products.filter((p) =>
  ["Bestseller"].includes(p.badge ?? "")
).concat(products.filter((p) => p.rating >= 4.8)).slice(0, 8);

export const featured = products.filter((p) => p.isFeatured);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(product: Product) {
  return products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
}
