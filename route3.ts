import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { avg, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const slug = String(body.slug ?? "");
    const author = String(body.author ?? "").trim().slice(0, 60);
    const title = String(body.title ?? "").trim().slice(0, 80);
    const text = String(body.body ?? "").trim().slice(0, 600);
    const rating = Number(body.rating);

    if (!slug) return NextResponse.json({ ok: false, error: "Missing product" }, { status: 400 });
    if (!author || !title || !text) {
      return NextResponse.json({ ok: false, error: "Name, title and review text are required" }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

    const [inserted] = await db
      .insert(reviews)
      .values({ productId: product.id, author, rating, title, body: text, verified: false })
      .returning();

    // Recompute aggregate rating on the product
    const [{ value: avgRating }] = await db
      .select({ value: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.productId, product.id));
    const [{ value: reviewCount }] = await db
      .select({ value: count() })
      .from(reviews)
      .where(eq(reviews.productId, product.id));

    await db
      .update(products)
      .set({ rating: Math.round(Number(avgRating ?? 0) * 10) / 10, reviewCount })
      .where(eq(products.id, product.id));

    revalidatePath(`/product/${slug}`);
    revalidatePath("/");
    revalidatePath("/shop");

    return NextResponse.json({ ok: true, review: inserted });
  } catch (err) {
    console.error("[reviews] error:", err);
    return NextResponse.json({ ok: false, error: "Could not save your review." }, { status: 500 });
  }
}
