"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { RatingStars } from "@/components/rating-stars";
import { discountPercent, formatPrice, type Product } from "@/lib/types";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(product.shades[0] ?? null);
  const discount = discountPercent(product.price, product.compareAt);

  return (
    <div className="lg:sticky lg:top-32">
      <p className="eyebrow text-gold">{product.collection}</p>
      <h1 className="display-font mt-3 text-[2.7rem] leading-[0.98] sm:text-[3.4rem]">{product.name}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <a href="#reviews" className="text-xs font-semibold text-wine underline underline-offset-4 hover:text-plum">Read reviews</a>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="display-font text-[2.4rem] leading-none text-wine">{formatPrice(product.price)}</span>
        {product.compareAt && <span className="text-sm text-plum/40 line-through">{formatPrice(product.compareAt)}</span>}
        {discount > 0 && <span className="bg-cream px-2 py-1 text-[0.62rem] font-bold tracking-[0.12em] text-wine uppercase">Save {discount}%</span>}
      </div>
      <p className="mt-2 text-xs text-plum/45">Inclusive of all taxes · Complimentary shipping over ₹2,999</p>

      <p className="mt-7 text-sm leading-7 text-plum/70">{product.shortDescription}</p>

      {product.shades.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <span className="field-label mb-0">{product.category === "bangles" ? "Select size" : "Select option"}</span>
            <span className="text-xs text-plum/50">{variant}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.shades.map((shade) => (
              <button
                type="button"
                key={shade}
                onClick={() => setVariant(shade)}
                aria-pressed={variant === shade}
                className={`min-w-14 border px-4 py-2.5 text-xs font-semibold transition-all ${variant === shade ? "border-plum bg-plum text-white" : "border-plum/18 bg-white/50 text-plum/70 hover:border-gold"}`}
              >
                {shade}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex h-[52px] shrink-0 items-center border border-plum/20 bg-white/50">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" className="grid h-full w-12 place-items-center hover:bg-cream">
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} aria-label="Increase quantity" className="grid h-full w-12 place-items-center hover:bg-cream">
            <Plus size={15} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => addItem(product, quantity, variant)}
          disabled={product.stock < 1}
          className="btn-primary h-[52px] flex-1"
        >
          <ShoppingBag size={16} strokeWidth={1.7} />
          {product.stock < 1 ? "Sold out" : "Add to shopping bag"}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-plum/60">
        <span className="h-2 w-2 rounded-full bg-[#8aa67c]" />
        {product.stock > 6 ? "In stock and ready to ship" : product.stock > 0 ? `Only ${product.stock} left in stock` : "Currently unavailable"}
      </div>

      <div className="mt-8 border-t border-plum/12">
        <details className="group border-b border-plum/12 py-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-[0.7rem] font-bold tracking-[0.16em] text-plum uppercase">
            Product details <span className="text-lg font-normal transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-plum/65">
            {product.details.map((detail) => (
              <li key={detail} className="flex gap-3"><span className="text-gold">✦</span>{detail}</li>
            ))}
          </ul>
        </details>
        <details className="group border-b border-plum/12 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[0.7rem] font-bold tracking-[0.16em] text-plum uppercase">
            The story <span className="text-lg font-normal transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-plum/65">{product.description}</p>
        </details>
        <details className="group border-b border-plum/12 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[0.7rem] font-bold tracking-[0.16em] text-plum uppercase">
            Delivery & care <span className="text-lg font-normal transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-plum/65">
            Packed in our signature gift box within 24 hours. Standard delivery takes 3–5 working days; express delivery takes 1–2 days.
            Store jewellery in its cotton pouch and keep cosmetics away from direct sunlight.
          </p>
        </details>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3 text-center">
        {[
          { title: "Gift wrapped", sub: "Always" },
          { title: "Easy returns", sub: "7 days" },
          { title: "Small batch", sub: "Hand finished" },
        ].map((item) => (
          <div key={item.title} className="border border-plum/10 bg-white/40 px-2 py-4">
            <p className="text-[0.62rem] font-bold tracking-[0.1em] text-plum uppercase">{item.title}</p>
            <p className="mt-1 text-[0.65rem] text-plum/50">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
