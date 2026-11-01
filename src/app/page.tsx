import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/queries";
import { seedReviews } from "@/lib/seed-data";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

const collections = [
  {
    label: "Bangles",
    category: "bangles",
    image: "/images/bangles-heritage.jpg",
    description: "Heirloom stacks, festive colour and everyday gold.",
  },
  {
    label: "Makeup",
    category: "makeup",
    image: "/images/eyeshadow.jpg",
    description: "Soft glam shades chosen for Indian skin tones.",
  },
  {
    label: "Skincare",
    category: "skincare",
    image: "/images/skincare.jpg",
    description: "Quiet, glow-giving rituals for morning and night.",
  },
  {
    label: "Gifting",
    category: "gifting",
    image: "/images/gift-set.jpg",
    description: "Keepsake boxes, wrapped and ready to give.",
  },
] as const;

const services = [
  { icon: "✦", title: "Gift wrapped", detail: "Every order, beautifully" },
  { icon: "◈", title: "Complimentary shipping", detail: "On orders over ₹2,999" },
  { icon: "❋", title: "Small batch quality", detail: "Thoughtfully hand finished" },
  { icon: "↺", title: "Easy 7-day returns", detail: "Shop with confidence" },
];

export default async function HomePage() {
  const products = await getProducts();
  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);
  const fresh = products.filter((product) => product.isNew).slice(0, 3);
  const totalReviews = products.reduce((sum, product) => sum + product.reviewCount, 0);
  const testimonials = [seedReviews[0], seedReviews[8], seedReviews[15], seedReviews[23]].filter(Boolean);

  return (
    <>
      <section className="relative isolate min-h-[640px] overflow-hidden bg-[#efd9d1] lg:min-h-[720px]">
        <img
          src="/images/hero.jpg"
          alt="South Asian woman wearing ornate gold bangles and soft glowing makeup"
          className="slow-zoom absolute inset-0 h-full w-full object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4ddd5]/98 via-[#f4ddd5]/82 to-[#f4ddd5]/5 sm:via-[#f4ddd5]/62 lg:via-[#f4ddd5]/42" />
        <div className="relative mx-auto flex min-h-[640px] max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:min-h-[720px] lg:px-12">
          <div className="max-w-[660px] fade-up">
            <p className="eyebrow flex items-center gap-3 text-wine">
              <span className="h-px w-9 bg-gold" /> The Heirloom Edit · 2026
            </p>
            <h1 className="display-font mt-7 text-[4.2rem] leading-[0.86] text-plum sm:text-[6rem] lg:text-[7.2rem]">
              Adorn every<br /><em className="text-wine">moment.</em>
            </h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-plum/70 sm:text-base">
              Hand-finished bangles, flattering colour and glow-giving rituals — thoughtfully made for women, girls and ladies who love a little beauty in the everyday.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">Shop the collection <span aria-hidden="true">→</span></Link>
              <Link href="/shop?category=bangles" className="btn-outline">Discover bangles</Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 border-t border-plum/15 pt-6 sm:gap-12">
              <div><p className="display-font text-3xl text-wine">{products.length}</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.14em] text-plum/50 uppercase">Curated pieces</p></div>
              <div><p className="display-font text-3xl text-wine">{totalReviews}+</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.14em] text-plum/50 uppercase">Lovely reviews</p></div>
              <div><p className="display-font text-3xl text-wine">4.9</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.14em] text-plum/50 uppercase">Average rating</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="service" className="border-y border-plum/10 bg-[#fffaf5]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-plum/10 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} className="bg-[#fffaf5] px-5 py-7 text-center sm:px-8">
              <span className="text-2xl text-gold">{service.icon}</span>
              <p className="mt-2 text-[0.66rem] font-bold tracking-[0.12em] text-plum uppercase">{service.title}</p>
              <p className="mt-1 text-[0.68rem] text-plum/50">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="fade-up">
            <p className="eyebrow text-gold">Featured collections</p>
            <h2 className="display-font mt-3 max-w-xl text-5xl leading-[0.95] sm:text-6xl">A world of little luxuries</h2>
          </div>
          <Link href="/shop" className="group shrink-0 border-b border-gold pb-2 text-[0.68rem] font-bold tracking-[0.16em] text-plum uppercase transition-colors hover:text-wine">
            View all pieces <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, index) => {
            const count = products.filter((product) => product.category === collection.category).length;
            return (
              <Link key={collection.label} href={`/shop?category=${collection.category}`} className="group relative aspect-[3/4] overflow-hidden bg-cream fade-up" style={{ animationDelay: `${index * 90}ms` }}>
                <img src={collection.image} alt={`${collection.label} collection`} loading="lazy" className="product-image h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-plum/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#fffaf5]">
                  <p className="text-[0.58rem] font-bold tracking-[0.2em] text-[#e6c99d] uppercase">0{index + 1} · {count} pieces</p>
                  <h3 className="display-font mt-2 text-4xl leading-none">{collection.label}</h3>
                  <p className="mt-3 max-w-[230px] text-xs leading-5 text-white/70">{collection.description}</p>
                  <span className="mt-5 inline-block border-b border-white/50 pb-1 text-[0.62rem] font-bold tracking-[0.16em] uppercase transition-all group-hover:border-gold group-hover:text-gold">Explore →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-cream/55 py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-gold">Loved by you</p>
              <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">The bestsellers</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-plum/60">Tried, reviewed and returned to again and again. These are the pieces our community reaches for most.</p>
            </div>
            <Link href="/shop?sort=rating" className="btn-outline hidden sm:inline-flex">Shop bestsellers</Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {bestsellers.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
          <Link href="/shop" className="btn-outline mt-10 w-full sm:hidden">Shop bestsellers</Link>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden bg-cream">
            <img
              src="https://images.pexels.com/photos/5856079/pexels-photo-5856079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800"
              alt="Indian woman in traditional attire wearing jewellery"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-6 hidden w-48 border border-gold/40 bg-ivory p-6 shadow-xl sm:block lg:-right-8">
            <p className="eyebrow text-gold">Est. Jaipur</p>
            <p className="display-font mt-2 text-3xl leading-tight">Beauty with a memory.</p>
          </div>
        </div>
        <div className="lg:pl-6">
          <p className="eyebrow text-gold">Our story</p>
          <h2 className="display-font mt-4 text-5xl leading-[0.95] sm:text-6xl">Rooted in ritual.<br /><em className="text-wine">Made for now.</em></h2>
          <p className="mt-7 text-sm leading-8 text-plum/65">
            Baghel Cosmetics began with a simple observation: the most cherished pieces are the ones woven into everyday life. The bangles borrowed from a mother&apos;s collection. The lipstick kept in every handbag. The quiet five minutes of skincare before the day begins.
          </p>
          <p className="mt-4 text-sm leading-8 text-plum/65">
            We bring those rituals together in one considered shop — hand-finished jewellery, comfortable colour and gentle formulas, made to feel special without waiting for an occasion.
          </p>
          <div className="mt-9 grid grid-cols-3 gap-4 border-t border-plum/12 pt-7">
            <div><p className="display-font text-4xl text-wine">14</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.12em] text-plum/50 uppercase">Curated pieces</p></div>
            <div><p className="display-font text-4xl text-wine">100%</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.12em] text-plum/50 uppercase">Cruelty-free beauty</p></div>
            <div><p className="display-font text-4xl text-wine">24h</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.12em] text-plum/50 uppercase">Dispatch promise</p></div>
          </div>
          <Link href="/shop?category=gifting" className="btn-primary mt-9">Explore gift boxes</Link>
        </div>
      </section>

      <section className="bg-plum py-20 text-[#fffaf5] lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-gold">Kind words</p>
              <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">From our community</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/55">Real notes from women who have made these pieces part of their stories.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((review) => (
              <article key={`${review.author}-${review.title}`} className="border border-white/12 bg-white/[0.04] p-6 transition-colors hover:border-gold/50">
                <div className="text-sm tracking-[0.15em] text-gold" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}<span className="text-white/20">{"★".repeat(5 - review.rating)}</span></div>
                <h3 className="display-font mt-5 text-2xl leading-tight">“{review.title}”</h3>
                <p className="mt-3 text-xs leading-6 text-white/65">{review.body}</p>
                <p className="mt-6 border-t border-white/10 pt-4 text-[0.65rem] font-bold tracking-[0.14em] text-gold uppercase">{review.author} · {review.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="eyebrow text-gold">Just arrived</p>
            <h2 className="display-font mt-3 text-5xl leading-[0.95] sm:text-6xl">Fresh from the atelier</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-plum/60">New stacks, new shades and new little rituals — each one reviewed by our community before it joins the collection.</p>
            <Link href="/shop?sort=newest" className="btn-primary mt-8">See new arrivals</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fresh.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-cream">
                  <img src={product.images[0]} alt={product.name} loading="lazy" className="product-image h-full w-full object-cover" />
                </div>
                <p className="display-font mt-3 text-xl leading-tight group-hover:text-wine">{product.name}</p>
                <p className="mt-1 text-xs font-semibold text-wine">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
