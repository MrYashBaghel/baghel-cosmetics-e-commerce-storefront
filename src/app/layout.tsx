import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Baghel Cosmetics — Bangles, Beauty & Modern Rituals",
    template: "%s | Baghel Cosmetics",
  },
  description:
    "Shop hand-finished bangles, flattering makeup, glow-giving skincare and thoughtful beauty gifts for women, girls and ladies at Baghel Cosmetics.",
  keywords: ["bangles", "cosmetics", "makeup", "skincare", "Indian beauty", "gifts for women"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-plum antialiased">
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-plum focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
