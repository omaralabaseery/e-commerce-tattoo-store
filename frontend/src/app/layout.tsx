import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { StoreChrome } from "@/components/layout/StoreChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Tattoo Store — Professional Tattoo Equipment",
    template: "%s · Tattoo Store",
  },
  description:
    "Premium tattoo supplies for serious artists — machines, ink, needles, cartridges, power supplies, grips, aftercare and kits.",
  keywords: ["tattoo machines", "tattoo ink", "tattoo needles", "tattoo cartridges", "tattoo supplies"],
  openGraph: {
    title: "Tattoo Store — Professional Tattoo Equipment",
    description: "Premium tattoo supplies for serious artists.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen">
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  );
}
