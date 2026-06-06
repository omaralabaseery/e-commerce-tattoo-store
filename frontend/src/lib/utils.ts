import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY = "KWD";

export function formatPrice(value: number): string {
  return `${value.toFixed(3)} ${CURRENCY}`;
}

export function discountPercent(price: number, discount?: number | null): number | null {
  if (!discount || discount >= price) return null;
  return Math.round(((price - discount) / price) * 100);
}
