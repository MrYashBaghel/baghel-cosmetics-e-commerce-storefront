import { db } from "@/db";
import { products, reviews, type NewReview } from "@/db/schema";
import { seedProducts, seedReviews } from "@/lib/seed-data";
import { sql } from "drizzle-orm";

let initialization: Promise<void> | null = null;

export function ensureDatabase() {
  if (!initialization) {
    initialization = initialize().catch((error) => {
      initialization = null;
      throw error;
    });
  }
  return initialization;
}

async function initialize() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY,
      slug varchar(160) NOT NULL UNIQUE,
      name varchar(200) NOT NULL,
      category varchar(60) NOT NULL,
      collection varchar(100) NOT NULL,
      short_description text NOT NULL,
      description text NOT NULL,
      details jsonb NOT NULL DEFAULT '[]'::jsonb,
      shades jsonb NOT NULL DEFAULT '[]'::jsonb,
      images jsonb NOT NULL DEFAULT '[]'::jsonb,
      price integer NOT NULL,
      compare_at integer,
      badge varchar(60),
      stock integer NOT NULL DEFAULT 24,
      featured boolean NOT NULL DEFAULT false,
      bestseller boolean NOT NULL DEFAULT false,
      is_new boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id serial PRIMARY KEY,
      product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      author varchar(100) NOT NULL,
      location varchar(100) NOT NULL DEFAULT 'India',
      title varchar(160) NOT NULL,
      body text NOT NULL,
      rating integer NOT NULL,
      verified boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS reviews_unique_idx
    ON reviews (product_id, author, title)
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id serial PRIMARY KEY,
      order_number varchar(40) NOT NULL UNIQUE,
      customer_name varchar(160) NOT NULL,
      email varchar(180) NOT NULL,
      phone varchar(30) NOT NULL,
      address_line text NOT NULL,
      city varchar(100) NOT NULL,
      state varchar(100) NOT NULL,
      postal_code varchar(20) NOT NULL,
      delivery_method varchar(30) NOT NULL,
      payment_method varchar(30) NOT NULL,
      subtotal integer NOT NULL,
      shipping integer NOT NULL,
      total integer NOT NULL,
      status varchar(30) NOT NULL DEFAULT 'confirmed',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id serial PRIMARY KEY,
      order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id integer NOT NULL REFERENCES products(id),
      name varchar(200) NOT NULL,
      image text NOT NULL,
      price integer NOT NULL,
      quantity integer NOT NULL
    )
  `);

  const [productCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(products);

  if (!productCount || productCount.value === 0) {
    await db.insert(products).values(seedProducts).onConflictDoNothing();
  }

  const [reviewCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(reviews);

  if (!reviewCount || reviewCount.value === 0) {
    const productRows = await db
      .select({ id: products.id, slug: products.slug })
      .from(products);
    const idsBySlug = new Map(productRows.map((row) => [row.slug, row.id]));

    const reviewValues: NewReview[] = seedReviews.flatMap((review) => {
      const productId = idsBySlug.get(review.productSlug);
      if (!productId) return [];
      return [
        {
          productId,
          author: review.author,
          location: review.location,
          title: review.title,
          body: review.body,
          rating: review.rating,
          verified: true,
          createdAt: new Date(review.date),
        },
      ];
    });

    if (reviewValues.length > 0) {
      await db.insert(reviews).values(reviewValues).onConflictDoNothing();
    }
  }
}
