import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureDatabase } from "@/lib/db-init";
import { calculateShipping, type DeliveryMethod } from "@/lib/pricing";
import { eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

type RequestedItem = { productId: number; quantity: number };

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  const customerName = cleanString(body.customerName, 160);
  const email = cleanString(body.email, 180);
  const phone = cleanString(body.phone, 30);
  const addressLine = cleanString(body.addressLine, 500);
  const city = cleanString(body.city, 100);
  const state = cleanString(body.state, 100);
  const postalCode = cleanString(body.postalCode, 20);
  const deliveryMethod: DeliveryMethod = body.deliveryMethod === "express" ? "express" : "standard";
  const paymentMethod = ["upi", "card", "cod"].includes(String(body.paymentMethod))
    ? String(body.paymentMethod)
    : "upi";

  if (
    customerName.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.replace(/\D/g, "").length < 10 ||
    addressLine.length < 5 ||
    city.length < 2 ||
    state.length < 2 ||
    postalCode.length < 4
  ) {
    return Response.json({ error: "Please complete all delivery details." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const quantities = new Map<number, number>();
  for (const raw of body.items) {
    const item = raw as Record<string, unknown>;
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return Response.json({ error: "One of the bag items is invalid." }, { status: 400 });
    }
    quantities.set(productId, Math.min(20, (quantities.get(productId) ?? 0) + quantity));
  }

  await ensureDatabase();
  const ids = [...quantities.keys()];
  const foundProducts = await db.select().from(products).where(inArray(products.id, ids));
  if (foundProducts.length !== ids.length) {
    return Response.json({ error: "A product in your bag is no longer available." }, { status: 409 });
  }

  const productMap = new Map(foundProducts.map((product) => [product.id, product]));
  const lines = ids.map((id) => {
    const product = productMap.get(id)!;
    const quantity = quantities.get(id)!;
    return {
      productId: product.id,
      name: product.name,
      image: (product.images ?? [])[0] ?? "/images/gift-set.jpg",
      price: product.price,
      quantity,
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = calculateShipping(subtotal, deliveryMethod);
  const total = subtotal + shipping;
  const orderNumber = `BC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase()}`;

  try {
    lines.forEach((line) => {
      const product = productMap.get(line.productId)!;
      if (line.quantity > product.stock) {
        throw new Error(`Only ${product.stock} of ${product.name} are available.`);
      }
    });

    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerName,
          email,
          phone,
          addressLine,
          city,
          state,
          postalCode,
          deliveryMethod,
          paymentMethod,
          subtotal,
          shipping,
          total,
          status: "confirmed",
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          name: line.name,
          image: line.image,
          price: line.price,
          quantity: line.quantity,
        })),
      );

      for (const line of lines) {
        const product = productMap.get(line.productId)!;
        await tx
          .update(products)
          .set({ stock: Math.max(0, product.stock - line.quantity) })
          .where(eq(products.id, line.productId));
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not place your order.";
    return Response.json({ error: message }, { status: 409 });
  }

  return Response.json({ ok: true, orderNumber, total });
}
