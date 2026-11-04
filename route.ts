import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { categories, orders, products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

/** Idempotent: ensures schema exists and demo data is seeded. Safe to call anytime. */
export async function GET() {
  try {
    await ensureSeeded();
    const [p, c, r, o] = await Promise.all([
      db.select({ value: count() }).from(products),
      db.select({ value: count() }).from(categories),
      db.select({ value: count() }).from(reviews),
      db.select({ value: count() }).from(orders),
    ]);
    return NextResponse.json({
      ok: true,
      counts: { products: p[0].value, categories: c[0].value, reviews: r[0].value, orders: o[0].value },
    });
  } catch (err) {
    console.error("[seed] error:", err);
    return NextResponse.json({ ok: false, error: "Seed failed" }, { status: 500 });
  }
}
