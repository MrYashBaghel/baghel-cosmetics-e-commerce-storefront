import type { Metadata } from "next";
import Link from "next/link";
import { ShopBrowser } from "@/components/shop-browser";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse bangles, makeup, skincare, fragrance and beauty gifts from Baghel Cosmetics. Filter by category, price and offers.",
};

type ShopPageProps = {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[]; sort?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getProducts();
  const initialCategory = firstValue(params.category);
  const initialQuery = firstValue(params.q);
  const initialSort = firstValue(params.sort);

  return (
    <>
      <section className="relative overflow-hidden border-b border-plum/10 bg-cream/55">
        <div className="absolute top-0 right-0 hidden h-full w-[38%] lg:block">
          <img src="/images/bangles-glass.jpg" alt="Rose and champagne bangles" className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/40 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <nav className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.15em] text-plum/45 uppercase" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-wine">Home</Link>
            <span>/</span>
            <span className="text-wine">Shop</span>
          </nav>
          <p className="eyebrow mt-8 text-gold">The Baghel collection</p>
          <h1 className="display-font mt-3 max-w-2xl text-6xl leading-[0.9] sm:text-7xl">Beauty for every kind of day</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-plum/65">
            From hand-finished bangle stacks to soft glam colour and glow-giving rituals, find the pieces that feel like you — beautifully packed and ready to gift.
          </p>
        </div>
      </section>

      <ShopBrowser products={products} initialCategory={initialCategory} initialQuery={initialQuery} initialSort={initialSort} />
    </>
  );
}
