import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/queries";
import { deliveryLabel } from "@/lib/pricing";
import { formatPrice, formatReviewDate } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Baghel Cosmetics order confirmation.",
};

type SuccessPageProps = { searchParams: Promise<{ order?: string | string[] }> };

function paymentLabel(method: string) {
  if (method === "upi") return "UPI · pay at dispatch";
  if (method === "card") return "Card · demo checkout";
  return "Pay on delivery";
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = Array.isArray(params.order) ? params.order[0] : params.order;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-24 text-center">
        <p className="eyebrow text-gold">Order lookup</p>
        <h1 className="display-font mt-4 text-5xl">We couldn&apos;t find that order</h1>
        <p className="mt-4 text-sm leading-7 text-plum/60">The confirmation link may be incomplete. If you have just placed an order, please contact us and we will be happy to help.</p>
        <Link href="/shop" className="btn-primary mt-8">Return to the shop</Link>
      </div>
    );
  }

  const firstName = order.customerName.trim().split(" ")[0];

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-14 sm:px-8 lg:py-20">
      <div className="text-center fade-up">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/50 bg-cream text-3xl text-wine">✓</span>
        <p className="eyebrow mt-7 text-gold">Order confirmed</p>
        <h1 className="display-font mt-3 text-5xl leading-none sm:text-6xl">Thank you, {firstName}.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-plum/60">
          Your little luxuries are being hand wrapped as we speak. A confirmation has been prepared for <strong className="text-plum">{order.email}</strong>.
        </p>
        <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border border-plum/12 bg-white/60 px-6 py-4">
          <span className="text-xs text-plum/55">Order <strong className="text-plum">{order.orderNumber}</strong></span>
          <span className="hidden h-4 w-px bg-plum/15 sm:block" />
          <span className="text-xs text-plum/55">{formatReviewDate(order.createdAt)}</span>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-plum/12 bg-white/55 p-6 sm:p-8">
          <h2 className="display-font text-3xl">Your order</h2>
          <ul className="mt-6 divide-y divide-plum/10">
            {order.items.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex gap-4 py-4 first:pt-0">
                <div className="h-20 w-16 shrink-0 bg-cream">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="display-font truncate text-xl leading-tight">{item.name}</p>
                  <p className="mt-1 text-xs text-plum/50">Quantity {item.quantity} · {formatPrice(item.price)} each</p>
                </div>
                <span className="text-sm font-bold text-wine">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-plum/12 pt-5 text-sm">
            <div className="flex justify-between text-plum/65"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between text-plum/65"><dt>Shipping</dt><dd>{order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-plum/10 pt-4 text-base font-bold"><dt>Order total</dt><dd className="text-wine">{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <aside className="space-y-6">
          <div className="border border-plum/12 bg-cream/55 p-6">
            <p className="eyebrow text-gold">Delivery</p>
            <p className="mt-4 text-sm font-bold text-plum">{order.customerName}</p>
            <p className="mt-2 text-xs leading-6 text-plum/60">{order.addressLine}<br />{order.city}, {order.state} {order.postalCode}<br />{order.phone}</p>
            <div className="mt-5 border-t border-plum/10 pt-4 text-xs text-plum/65">
              <p>{deliveryLabel(order.deliveryMethod)}</p>
              <p className="mt-1">{paymentLabel(order.paymentMethod)}</p>
            </div>
          </div>
          <div className="border border-plum/12 bg-white/55 p-6">
            <p className="eyebrow text-gold">What happens next?</p>
            <ol className="mt-4 space-y-3 text-xs leading-6 text-plum/65">
              <li><span className="mr-2 font-bold text-gold">01</span> Your pieces are quality checked and hand wrapped.</li>
              <li><span className="mr-2 font-bold text-gold">02</span> We dispatch within 24 hours with tracking details.</li>
              <li><span className="mr-2 font-bold text-gold">03</span> Unbox, adorn, and make it yours.</li>
            </ol>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-primary">Continue shopping</Link>
        <Link href="/" className="btn-outline">Back to home</Link>
      </div>
    </div>
  );
}
