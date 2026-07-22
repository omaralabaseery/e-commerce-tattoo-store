import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { StoreChrome } from "@/components/layout/StoreChrome";
import { normalizeLang, dirFor } from "@/lib/i18n";
import { getCategories } from "@/lib/catalog";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Ghazak3ndna — Professional Tattoo Equipment",
    template: "%s · Ghazak3ndna",
  },
  description:
    "Premium tattoo supplies for serious artists — machines, ink, needles, cartridges, power supplies, grips, aftercare and kits.",
  keywords: ["tattoo machines", "tattoo ink", "tattoo needles", "tattoo cartridges", "tattoo supplies"],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Ghazak3ndna — Professional Tattoo Equipment",
    description: "Premium tattoo supplies for serious artists.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = normalizeLang(cookies().get("lang")?.value);
  const categories = await getCategories(lang);
  return (
    <html lang={lang} dir={dirFor(lang)} className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen">
        <StoreChrome categories={categories}>{children}</StoreChrome>
      </body>
    </html>
  );
}
