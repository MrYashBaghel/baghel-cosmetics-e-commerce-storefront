import { db } from "@/db";
import { orderItems, orders, products, reviews, type ProductRow, type ReviewRow } from "@/db/schema";
import { ensureDatabase } from "@/lib/db-init";
import { seedProducts, seedReviews } from "@/lib/seed-data";
import { asc, desc, eq, inArray } from "drizzle-orm";
import type { CategoryKey, OrderSummary, Product, ProductReview } from "@/lib/types";

function reviewToDTO(row: ReviewRow): ProductReview {
  return {
    id: row.id,
    productId: row.productId,
    author: row.author,
    location: row.location,
    title: row.title,
    body: row.body,
    rating: row.rating,
    verified: row.verified,
    createdAt: row.createdAt.toISOString(),
  };
}

function productToDTO(row: ProductRow, allReviews: ReviewRow[]): Product {
  const productReviews = allReviews.filter((review) => review.productId === row.id);
  const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as CategoryKey,
    collection: row.collection,
    shortDescription: row.shortDescription,
    description: row.description,
    details: row.details ?? [],
    shades: row.shades ?? [],
    images: row.images ?? [],
    price: row.price,
    compareAt: row.compareAt,
    badge: row.badge,
    stock: row.stock,
    featured: row.featured,
    bestseller: row.bestseller,
    isNew: row.isNew,
    rating: productReviews.length ? Math.round((total / productReviews.length) * 10) / 10 : 5,
    reviewCount: productReviews.length,
  };
}

function getFallbackCatalog(): { products: Product[]; reviews: ProductReview[] } {
  const fallbackReviews: ProductReview[] = seedReviews.map((sr, index) => ({
    id: index + 1,
    productId: 0,
    author: sr.author,
    location: sr.location,
    title: sr.title,
    body: sr.body,
    rating: sr.rating,
    verified: true,
    createdAt: new Date(sr.date).toISOString(),
  }));

  const fallbackProducts: Product[] = seedProducts.map((p, index) => {
    const id = index + 1;
    const matchingReviews = seedReviews
      .filter((r) => r.productSlug === p.slug)
      .map((sr, rIdx) => ({
        id: rIdx + 1,
        productId: id,
        author: sr.author,
        location: sr.location,
        title: sr.title,
        body: sr.body,
        rating: sr.rating,
        verified: true,
        createdAt: new Date(sr.date).toISOString(),
      }));
    const total = matchingReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      id,
      slug: p.slug,
      name: p.name,
      category: p.category as CategoryKey,
      collection: p.collection,
      shortDescription: p.shortDescription,
      description: p.description,
      details: (p.details as string[]) ?? [],
      shades: (p.shades as string[]) ?? [],
      images: (p.images as string[]) ?? [],
      price: p.price,
      compareAt: p.compareAt ?? null,
      badge: p.badge ?? null,
      stock: p.stock ?? 24,
      featured: p.featured ?? false,
      bestseller: p.bestseller ?? false,
      isNew: p.isNew ?? false,
      rating: matchingReviews.length ? Math.round((total / matchingReviews.length) * 10) / 10 : 5,
      reviewCount: matchingReviews.length,
    };
  });

  return { products: fallbackProducts, reviews: fallbackReviews };
}

async function loadCatalog() {
  try {
    await ensureDatabase();
    const [productRows, reviewRows] = await Promise.all([
      db.select().from(products).orderBy(asc(products.id)),
      db.select().from(reviews).orderBy(desc(reviews.createdAt)),
    ]);
    if (productRows.length > 0) {
      return {
        products: productRows.map((row) => productToDTO(row, reviewRows)),
        reviews: reviewRows.map(reviewToDTO),
      };
    }
  } catch (err) {
    console.warn("Database connection unavailable or failed, using seed catalog:", err);
  }
  return getFallbackCatalog();
}

export async function getProducts(): Promise<Product[]> {
  return (await loadCatalog()).products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const catalog = await loadCatalog();
  return catalog.products.find((product) => product.slug === slug) ?? null;
}

export async function getReviewsForProduct(productId: number): Promise<ProductReview[]> {
  const catalog = await loadCatalog();
  return catalog.reviews.filter((review) => review.productId === productId);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const catalog = await loadCatalog();
  const sameCategory = catalog.products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const others = catalog.products.filter(
    (item) => item.id !== product.id && item.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    await ensureDatabase();
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    if (rows.length > 0) {
      return rows.map((row) => productToDTO(row, []));
    }
  } catch {
    // fallback
  }
  const fallback = getFallbackCatalog();
  return fallback.products.filter((p) => ids.includes(p.id));
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderSummary | null> {
  await ensureDatabase();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.id));

  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    addressLine: order.addressLine,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
  };
}
