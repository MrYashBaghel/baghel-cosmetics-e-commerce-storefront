export const FREE_SHIPPING_THRESHOLD = 2999;
export const STANDARD_SHIPPING = 99;
export const EXPRESS_SHIPPING = 249;

export type DeliveryMethod = "standard" | "express";

export function calculateShipping(subtotal: number, method: DeliveryMethod) {
  if (method === "express") return EXPRESS_SHIPPING;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

export function deliveryLabel(method: string) {
  return method === "express" ? "Express delivery · 1–2 days" : "Standard delivery · 3–5 days";
}
