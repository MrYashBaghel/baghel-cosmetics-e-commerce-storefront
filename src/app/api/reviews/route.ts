import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureDatabase } from "@/lib/db-init";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  const slug = clean(body.slug, 160);
  const author = clean(body.author, 100);
  const location = clean(body.location, 100) || "India";
  const title = clean(body.title, 160);
  const reviewBody = clean(body.body, 1200);
  const rating = Number(body.rating);

  if (
    !slug ||
    author.length < 2 ||
    title.length < 3 ||
    reviewBody.length < 10 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return Response.json({ error: "Please complete every field and choose a rating." }, { status: 400 });
  }

  await ensureDatabase();
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  await db
    .insert(reviews)
    .values({
      productId: product.id,
      author,
      location,
      title,
      body: reviewBody,
      rating,
      verified: false,
    })
    .onConflictDoNothing();

  revalidatePath(`/product/${slug}`);
  return Response.json({ ok: true });
}
