import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  collection: varchar("collection", { length: 100 }).notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  details: jsonb("details").$type<string[]>().notNull().default([]),
  shades: jsonb("shades").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  price: integer("price").notNull(),
  compareAt: integer("compare_at"),
  badge: varchar("badge", { length: 60 }),
  stock: integer("stock").notNull().default(24),
  featured: boolean("featured").notNull().default(false),
  bestseller: boolean("bestseller").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 100 }).notNull(),
    location: varchar("location", { length: 100 }).notNull().default("India"),
    title: varchar("title", { length: 160 }).notNull(),
    body: text("body").notNull(),
    rating: integer("rating").notNull(),
    verified: boolean("verified").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("reviews_unique_idx").on(table.productId, table.author, table.title),
  ],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  addressLine: text("address_line").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  deliveryMethod: varchar("delivery_method", { length: 30 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  name: varchar("name", { length: 200 }).notNull(),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export type ProductRow = typeof products.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type NewReview = typeof reviews.$inferInsert;
