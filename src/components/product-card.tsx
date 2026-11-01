"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { RatingStars } from "@/components/rating-stars";
import { discountPercent, formatPrice, type Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compareAt);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full w-full">
          <img
            src={product.images[0] ?? "/images/gift-set.jpg"}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="product-image h-full w-full object-cover"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#fffaf5]/95 px-3 py-1.5 text-[0.58rem] font-bold tracking-[0.16em] text-wine uppercase backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-plum px-2.5 py-1.5 text-[0.58rem] font-bold tracking-[0.12em] text-white uppercase">
            −{discount}%
          </span>
        )}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute right-3 bottom-3 flex items-center gap-2 bg-[#fffaf5]/95 px-4 py-2.5 text-[0.62rem] font-bold tracking-[0.14em] text-plum uppercase opacity-100 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-plum hover:text-white lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <ShoppingBag size={14} strokeWidth={1.7} /> Add to bag
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow text-[0.58rem] text-gold">{product.collection}</p>
        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="display-font text-[1.42rem] leading-tight transition-colors hover:text-wine">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-plum/55">{product.shortDescription}</p>
        <div className="mt-3">
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-sm font-bold text-wine">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-xs text-plum/40 line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
