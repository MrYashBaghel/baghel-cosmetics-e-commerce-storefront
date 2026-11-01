"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "baghel-cosmetics-cart-v1";

export type CartItem = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant: string | null;
};

type CartValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  addItem: (product: Product, quantity?: number, variant?: string | null) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function sanitizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const productId = Number(item.productId);
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    if (
      !Number.isInteger(productId) ||
      productId < 1 ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      typeof item.name !== "string" ||
      typeof item.slug !== "string" ||
      typeof item.image !== "string"
    ) {
      return [];
    }
    return [
      {
        key: typeof item.key === "string" ? item.key : `${item.slug}-default`,
        productId,
        slug: item.slug,
        name: item.name,
        price,
        image: item.image,
        quantity: Math.min(20, quantity),
        variant: typeof item.variant === "string" ? item.variant : null,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(sanitizeItems(JSON.parse(stored)));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The shop remains usable even if browser storage is unavailable.
    }
  }, [items, hydrated]);

  const value = useMemo<CartValue>(() => {
    const addItem: CartValue["addItem"] = (product, quantity = 1, variant = null) => {
      const safeQuantity = Math.max(1, Math.min(20, quantity));
      const key = `${product.slug}-${variant ?? "default"}`;
      setItems((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(20, item.quantity + safeQuantity) }
              : item,
          );
        }
        return [
          ...current,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] ?? "/images/gift-set.jpg",
            quantity: safeQuantity,
            variant,
          },
        ];
      });
      setIsOpen(true);
    };

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      isOpen,
      hydrated,
      addItem,
      updateQuantity: (key, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.key !== key)
            : current.map((item) =>
                item.key === key ? { ...item, quantity: Math.min(20, quantity) } : item,
              ),
        ),
      removeItem: (key) => setItems((current) => current.filter((item) => item.key !== key)),
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [items, isOpen, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
