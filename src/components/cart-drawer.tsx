"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/types";

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeCart}
        aria-label="Close shopping bag"
        className={`absolute inset-0 h-full w-full bg-plum/45 backdrop-blur-[2px] transition-opacity duration-400 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute top-0 right-0 flex h-full w-full max-w-[460px] flex-col bg-ivory shadow-[-20px_0_70px_rgba(40,25,32,0.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-plum/10 px-6 py-5">
          <div>
            <p className="eyebrow text-gold">Your selection</p>
            <h2 className="display-font mt-1 text-3xl">Shopping Bag <span className="text-lg text-plum/45">({itemCount})</span></h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full border border-plum/15 transition-colors hover:bg-cream">
            <X size={18} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-plum/10 bg-cream/50 px-6 py-4">
            <p className="text-xs font-medium text-plum/75">
              {remaining > 0 ? (
                <>You are <strong className="text-wine">{formatPrice(remaining)}</strong> away from complimentary shipping</>
              ) : (
                <><strong className="text-wine">Complimentary shipping unlocked</strong> — beautifully packed, on us</>
              )}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-plum/10">
              <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream/70">
                <ShoppingBag size={28} strokeWidth={1.3} className="text-wine" />
              </span>
              <h3 className="display-font mt-7 text-3xl">Your bag is waiting</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-plum/60">Discover hand-finished bangles, soft glam colour and glow-giving rituals made for every day.</p>
              <Link href="/shop" onClick={closeCart} className="btn-primary mt-7">Explore the shop <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 border-b border-plum/10 pb-6 last:border-0">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="h-24 w-20 shrink-0 overflow-hidden bg-cream">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${item.slug}`} onClick={closeCart} className="display-font block truncate text-xl leading-tight hover:text-wine">{item.name}</Link>
                        {item.variant && <p className="mt-1 text-[0.68rem] tracking-wide text-plum/50 uppercase">{item.variant}</p>}
                        <p className="mt-1 text-sm font-semibold text-wine">{formatPrice(item.price)}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`} className="text-plum/40 transition-colors hover:text-wine">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 inline-flex items-center border border-plum/15 bg-white/60">
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label={`Decrease ${item.name}`} className="grid h-8 w-8 place-items-center hover:bg-cream">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label={`Increase ${item.name}`} className="grid h-8 w-8 place-items-center hover:bg-cream">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-plum/10 bg-white/50 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-plum/65">
              <span>Subtotal</span>
              <span className="text-lg font-semibold text-plum">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[0.68rem] text-plum/45">Shipping and taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary mt-5 w-full">
              Continue to checkout <ArrowRight size={15} />
            </Link>
            <button type="button" onClick={closeCart} className="mt-3 w-full py-2 text-[0.68rem] font-bold tracking-[0.16em] text-plum/55 uppercase hover:text-wine">
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
