"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-context";
import { calculateShipping, deliveryLabel, type DeliveryMethod } from "@/lib/pricing";
import { formatPrice } from "@/lib/types";

type PaymentMethod = "upi" | "card" | "cod";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, hydrated, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");

  const shipping = calculateShipping(subtotal, deliveryMethod);
  const total = subtotal + shipping;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: String(data.get("customerName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          addressLine: String(data.get("addressLine") ?? ""),
          city: String(data.get("city") ?? ""),
          state: String(data.get("state") ?? ""),
          postalCode: String(data.get("postalCode") ?? ""),
          deliveryMethod,
          paymentMethod,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      const result = (await response.json()) as { error?: string; orderNumber?: string };
      if (!response.ok || !result.orderNumber) {
        setError(result.error ?? "We could not place your order. Please try again.");
        return;
      }
      setPlaced(true);
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}`);
    } catch {
      setError("We could not reach the store. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-[1200px] px-5 py-24 text-center text-sm text-plum/50">Preparing your bag…</div>;
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-24 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream/70">
          <ShoppingBag size={28} strokeWidth={1.3} className="text-wine" />
        </span>
        <p className="eyebrow mt-8 text-gold">Checkout</p>
        <h1 className="display-font mt-3 text-5xl">Your bag is empty</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-plum/60">Add a beautiful piece to your bag before checking out. Your selections are saved on this device.</p>
        <Link href="/shop" className="btn-primary mt-8">Explore the collection <ArrowRight size={15} /></Link>
      </div>
    );
  }

  if (placed) {
    return <div className="mx-auto max-w-[700px] px-5 py-24 text-center text-sm text-plum/60">Your order is confirmed. Taking you to the receipt…</div>;
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_400px] lg:gap-16 lg:px-12 lg:py-16">
      <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
        <section>
          <div className="flex items-baseline gap-4">
            <span className="display-font text-2xl text-gold">01</span>
            <h2 className="display-font text-3xl">Contact details</h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="customerName">Full name *</label>
              <input id="customerName" name="customerName" required minLength={2} autoComplete="name" className="field-input" placeholder="Your full name" />
            </div>
            <div>
              <label className="field-label" htmlFor="email">Email address *</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="field-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="field-label" htmlFor="phone">Phone number *</label>
              <input id="phone" name="phone" type="tel" required minLength={10} autoComplete="tel" className="field-input" placeholder="10-digit mobile number" />
            </div>
          </div>
        </section>

        <section className="border-t border-plum/12 pt-10">
          <div className="flex items-baseline gap-4">
            <span className="display-font text-2xl text-gold">02</span>
            <h2 className="display-font text-3xl">Delivery address</h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="addressLine">Street address *</label>
              <input id="addressLine" name="addressLine" required minLength={5} autoComplete="street-address" className="field-input" placeholder="House / flat, street, landmark" />
            </div>
            <div>
              <label className="field-label" htmlFor="city">City *</label>
              <input id="city" name="city" required autoComplete="address-level2" className="field-input" placeholder="City" />
            </div>
            <div>
              <label className="field-label" htmlFor="state">State *</label>
              <input id="state" name="state" required autoComplete="address-level1" className="field-input" placeholder="State" />
            </div>
            <div>
              <label className="field-label" htmlFor="postalCode">PIN code *</label>
              <input id="postalCode" name="postalCode" required minLength={4} autoComplete="postal-code" className="field-input" placeholder="6-digit PIN" />
            </div>
          </div>
        </section>

        <section className="border-t border-plum/12 pt-10">
          <div className="flex items-baseline gap-4">
            <span className="display-font text-2xl text-gold">03</span>
            <h2 className="display-font text-3xl">Delivery & payment</h2>
          </div>

          <div className="mt-6 space-y-3">
            {(["standard", "express"] as DeliveryMethod[]).map((method) => (
              <label key={method} className={`flex cursor-pointer items-center justify-between gap-4 border p-4 transition-colors ${deliveryMethod === method ? "border-wine bg-cream/60" : "border-plum/15 bg-white/40 hover:border-gold"}`}>
                <span className="flex items-start gap-3">
                  <input type="radio" name="deliveryMethod" value={method} checked={deliveryMethod === method} onChange={() => setDeliveryMethod(method)} className="mt-1 accent-[#71394a]" />
                  <span>
                    <span className="block text-sm font-bold capitalize">{method === "standard" ? "Standard delivery" : "Express delivery"}</span>
                    <span className="mt-1 block text-xs text-plum/55">{deliveryLabel(method)}</span>
                  </span>
                </span>
                <span className="text-sm font-bold text-wine">{shippingForDisplay(subtotal, method)}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {([
              { key: "upi", title: "UPI", detail: "Pay at dispatch" },
              { key: "card", title: "Card", detail: "Demo checkout" },
              { key: "cod", title: "Pay on delivery", detail: "At your door" },
            ] as { key: PaymentMethod; title: string; detail: string }[]).map((option) => (
              <label key={option.key} className={`cursor-pointer border p-4 transition-colors ${paymentMethod === option.key ? "border-wine bg-cream/60" : "border-plum/15 bg-white/40 hover:border-gold"}`}>
                <input type="radio" name="paymentMethod" value={option.key} checked={paymentMethod === option.key} onChange={() => setPaymentMethod(option.key)} className="sr-only" />
                <span className="flex items-center justify-between">
                  <span className="text-sm font-bold">{option.title}</span>
                  <span className={`h-3 w-3 rounded-full border ${paymentMethod === option.key ? "border-wine bg-wine" : "border-plum/30"}`} />
                </span>
                <span className="mt-1 block text-[0.68rem] text-plum/50">{option.detail}</span>
              </label>
            ))}
          </div>

          <p className="mt-4 border border-gold/35 bg-cream/50 px-4 py-3 text-xs leading-5 text-plum/65">
            This is a demonstration storefront. No payment details are collected and no charge is made; your confirmation is saved securely in our order book.
          </p>
        </section>

        {error && <p className="border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-wine">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-4 lg:hidden">
          {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`} <ArrowRight size={15} />
        </button>
      </form>

      <aside className="lg:sticky lg:top-32 lg:h-fit">
        <div className="border border-plum/12 bg-white/60 p-6 sm:p-7">
          <p className="eyebrow text-gold">Order summary</p>
          <h2 className="display-font mt-2 text-3xl">Your beautiful things</h2>

          <ul className="no-scrollbar mt-6 max-h-[320px] space-y-5 overflow-y-auto border-y border-plum/10 py-5">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4">
                <div className="relative h-20 w-16 shrink-0 bg-cream">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-plum text-[0.62rem] font-bold text-white">{item.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="display-font truncate text-lg leading-tight">{item.name}</p>
                  {item.variant && <p className="mt-1 text-[0.65rem] tracking-wide text-plum/45 uppercase">{item.variant}</p>}
                  <p className="mt-1 text-xs text-plum/50">{formatPrice(item.price)} each</p>
                </div>
                <span className="text-xs font-bold text-wine">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-plum/65"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between text-plum/65"><dt>Shipping</dt><dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-plum/12 pt-4 text-base font-bold"><dt>Total</dt><dd className="text-wine">{formatPrice(total)}</dd></div>
          </dl>

          <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary mt-7 hidden w-full py-4 lg:inline-flex">
            {submitting ? "Placing order…" : "Place order"} <ArrowRight size={15} />
          </button>
          <p className="mt-4 text-center text-[0.65rem] leading-5 text-plum/45">Gift wrapped with care · 7-day easy returns · Secure demo checkout</p>
        </div>
      </aside>
    </div>
  );
}

function shippingForDisplay(subtotal: number, method: DeliveryMethod) {
  const amount = calculateShipping(subtotal, method);
  return amount === 0 ? "Free" : formatPrice(amount);
}
