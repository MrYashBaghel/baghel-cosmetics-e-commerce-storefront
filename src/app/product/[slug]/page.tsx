import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { RatingStars } from "@/components/rating-stars";
import { ReviewForm } from "@/components/review-form";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/queries";
import { formatReviewDate } from "@/lib/types";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: [product.images[0] ?? "/images/hero.jpg"] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product, 4),
  ]);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
    percent: reviews.length ? Math.round((reviews.filter((review) => review.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-12">
        <nav className="flex flex-wrap items-center gap-2 text-[0.62rem] font-bold tracking-[0.14em] text-plum/45 uppercase" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-wine">Home</Link><span>/</span>
          <Link href="/shop" className="hover:text-wine">Shop</Link><span>/</span>
          <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-wine">{product.category}</Link><span>/</span>
          <span className="max-w-[220px] truncate text-wine">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-28">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchase product={product} />
      </section>

      <section className="border-y border-plum/10 bg-cream/50">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            { title: "The feeling", body: product.description.slice(0, 220) + (product.description.length > 220 ? "…" : "") },
            { title: "Considered details", body: "Each piece is reviewed for finish, comfort and everyday wear before it joins the collection." },
            { title: "Beautifully delivered", body: "Gift wrapped in our signature box, with a cotton pouch for jewellery and a note card on request." },
          ].map((item) => (
            <div key={item.title} className="border-l border-gold/50 pl-6">
              <h2 className="display-font text-3xl">{item.title}</h2>
              <p className="mt-3 text-xs leading-6 text-plum/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-[1440px] scroll-mt-28 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold">Real reviews</p>
            <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">What you&apos;re saying</h2>
          </div>
          <p className="text-sm text-plum/55">{reviews.length} verified notes for {product.name}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
          <aside className="h-fit border border-plum/12 bg-white/55 p-7 lg:sticky lg:top-32">
            <div className="flex items-end gap-4">
              <span className="display-font text-6xl leading-none text-wine">{product.rating.toFixed(1)}</span>
              <div className="pb-1">
                <RatingStars rating={product.rating} showValue={false} />
                <p className="mt-2 text-xs text-plum/55">Based on {reviews.length} reviews</p>
              </div>
            </div>
            <div className="mt-7 space-y-2.5">
              {distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-[0.68rem] text-plum/60">
                  <span className="w-8">{row.star} ★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-plum/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${row.percent}%` }} />
                  </div>
                  <span className="w-5 text-right">{row.count}</span>
                </div>
              ))}
            </div>
            <p className="mt-7 border-t border-plum/10 pt-5 text-xs leading-6 text-plum/55">
              Most customers describe the finish as delicate, comfortable and even lovelier in person.
            </p>
          </aside>

          <div>
            <div className="grid gap-5 md:grid-cols-2">
              {reviews.map((review) => (
                <article key={review.id} className="border border-plum/12 bg-white/45 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <RatingStars rating={review.rating} showValue={false} />
                    {review.verified && <span className="text-[0.58rem] font-bold tracking-[0.12em] text-[#6d8c61] uppercase">Verified buyer</span>}
                  </div>
                  <h3 className="display-font mt-4 text-2xl leading-tight">{review.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-plum/65">{review.body}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-plum/10 pt-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-xs font-bold text-wine">
                      {review.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-plum">{review.author}</p>
                      <p className="mt-0.5 text-[0.65rem] text-plum/45">{review.location} · {formatReviewDate(review.createdAt)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <ReviewForm slug={product.slug} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-plum/10 bg-cream/45 py-20 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-gold">Complete the ritual</p>
                <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">You may also love</h2>
              </div>
              <Link href="/shop" className="text-[0.68rem] font-bold tracking-[0.16em] text-wine uppercase hover:underline">Shop everything →</Link>
            </div>
            <div className="mt-11 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        </section>
      )}

    </>
  );
}
