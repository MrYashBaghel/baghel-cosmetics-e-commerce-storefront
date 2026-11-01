import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const isRemoteOrProd =
  databaseUrl.includes("neon.tech") ||
  databaseUrl.includes("supabase.co") ||
  databaseUrl.includes("sslmode=require") ||
  (process.env.NODE_ENV === "production" && !databaseUrl.includes("127.0.0.1") && !databaseUrl.includes("localhost"));

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isRemoteOrProd ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
