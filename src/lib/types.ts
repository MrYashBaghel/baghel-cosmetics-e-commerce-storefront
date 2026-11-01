export const CATEGORIES = [
  { key: "bangles", label: "Bangles", description: "Hand-finished stacks for every celebration" },
  { key: "makeup", label: "Makeup", description: "Soft glam, made for Indian skin tones" },
  { key: "skincare", label: "Skincare", description: "Gentle rituals with a luminous finish" },
  { key: "fragrance", label: "Fragrance", description: "Modern scents with a floral soul" },
  { key: "gifting", label: "Gifting", description: "Beautiful keepsakes, ready to give" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: CategoryKey;
  collection: string;
  shortDescription: string;
  description: string;
  details: string[];
  shades: string[];
  images: string[];
  price: number;
  compareAt: number | null;
  badge: string | null;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
};

export type ProductReview = {
  id: number;
  productId: number;
  author: string;
  location: string;
  title: string;
  body: string;
  rating: number;
  verified: boolean;
  createdAt: string;
};

export type OrderSummary = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryMethod: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
};

export function formatPrice(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
