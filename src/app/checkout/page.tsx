import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Baghel Cosmetics order with a fast, gift-wrapped checkout.",
};

export default function CheckoutPage() {
  return (
    <>
      <section className="border-b border-plum/10 bg-cream/50">
        <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <nav className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.15em] text-plum/45 uppercase" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-wine">Home</Link><span>/</span>
            <Link href="/shop" className="hover:text-wine">Shop</Link><span>/</span>
            <span className="text-wine">Checkout</span>
          </nav>
          <p className="eyebrow mt-7 text-gold">Almost yours</p>
          <h1 className="display-font mt-3 text-5xl leading-none sm:text-6xl">A beautiful checkout</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-plum/60">Just a few details and your pieces are on their way — hand wrapped, carefully packed and ready to delight.</p>
        </div>
      </section>
      <CheckoutForm />
    </>
  );
}
