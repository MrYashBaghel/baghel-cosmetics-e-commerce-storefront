"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-context";

const links = [
  { label: "Shop All", href: "/shop" },
  { label: "Bangles", href: "/shop?category=bangles" },
  { label: "Makeup", href: "/shop?category=makeup" },
  { label: "Skincare", href: "/shop?category=skincare" },
  { label: "Fragrance", href: "/shop?category=fragrance" },
  { label: "Gifting", href: "/shop?category=gifting" },
];

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9ded2] bg-[#fbf7f2]/95 backdrop-blur-lg">
      <div className="overflow-hidden bg-plum py-2 text-center text-[0.62rem] font-semibold tracking-[0.18em] text-[#f8eee4] uppercase">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center gap-12 px-6">
              <span>Complimentary shipping over ₹2,999</span>
              <span className="text-gold">✦</span>
              <span>Hand-finished in small batches</span>
              <span className="text-gold">✦</span>
              <span>Gift wrapping on every order</span>
              <span className="text-gold">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-plum/15 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/70 bg-cream/60 transition-colors group-hover:bg-cream">
            <span className="display-font text-[1.65rem] leading-none text-wine">B</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="display-font text-[1.55rem] tracking-tight text-plum sm:text-[1.75rem]">Baghel</span>
            <span className="mt-1 text-[0.53rem] font-bold tracking-[0.32em] text-gold uppercase">Cosmetics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-[0.68rem] font-bold tracking-[0.13em] text-plum/75 uppercase transition-colors hover:text-wine after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form action="/shop" method="get" className="hidden items-center gap-2 rounded-full border border-plum/15 bg-white/60 px-4 py-2 md:flex">
            <Search size={15} className="text-plum/55" />
            <input
              type="search"
              name="q"
              placeholder="Search the collection"
              className="w-36 bg-transparent text-xs outline-none placeholder:text-plum/40 lg:w-48"
              aria-label="Search products"
            />
          </form>
          <button
            type="button"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-plum/15 bg-white/50 transition-colors hover:bg-cream"
            aria-label={`Open shopping bag, ${itemCount} items`}
          >
            <ShoppingBag size={18} strokeWidth={1.6} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-[0.6rem] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e9ded2] bg-ivory px-5 py-6 lg:hidden">
          <form action="/shop" method="get" className="mb-5 flex items-center gap-2 rounded-full border border-plum/15 bg-white px-4 py-3 md:hidden">
            <Search size={16} className="text-plum/55" />
            <input
              type="search"
              name="q"
              placeholder="Search bangles, lipstick, gifts..."
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search products"
            />
          </form>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-plum/10 py-3 text-xs font-bold tracking-[0.15em] text-plum/80 uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/#story" onClick={() => setMenuOpen(false)} className="mt-5 block text-xs font-semibold tracking-[0.15em] text-wine uppercase">
            Our story →
          </Link>
        </div>
      )}
    </header>
  );
}
