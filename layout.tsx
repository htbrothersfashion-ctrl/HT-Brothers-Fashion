import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "HT Brothers Fashion — Premium Menswear",
    template: "%s · HT Brothers Fashion",
  },
  description:
    "HT Brothers Fashion — premium men's t-shirts, hoodies, pants, shirts, jackets and shorts. Heavyweight fabrics, honest prices, free shipping over $75.",
  keywords: ["menswear", "men's fashion", "t-shirts", "hoodies", "pants", "shirts", "HT Brothers"],
};

export const viewport: Viewport = {
  themeColor: "#191510",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
