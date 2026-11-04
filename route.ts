import { NextResponse } from "next/server";
import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { FREE_SHIPPING_THRESHOLD, PROMOS, SHIPPING_FLAT, TAX_RATE } from "@/lib/cart";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return badRequest("Invalid request body");

    // ---- validate items ----
    const rawItems = body.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) return badRequest("Your cart is empty");
    const items: { productId: number; size: string; qty: number }[] = [];
    for (const it of rawItems) {
      const productId = Number(it?.productId);
      const size = String(it?.size ?? "");
      const qty = Number(it?.qty);
      if (!Number.isInteger(productId) || productId <= 0) return badRequest("Invalid product in cart");
      if (!size) return badRequest("Please choose a size for every item");
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) return badRequest("Invalid quantity");
      items.push({ productId, size, qty });
    }

    // ---- validate customer ----
    const c = body.customer ?? {};
    const email = String(c.email ?? "");
    const firstName = String(c.firstName ?? "").trim();
    const lastName = String(c.lastName ?? "").trim();
    const address = String(c.address ?? "").trim();
    const city = String(c.city ?? "").trim();
    const zip = String(c.zip ?? "").trim();
    const country = String(c.country ?? "").trim() || "Bangladesh";
    const phone = String(c.phone ?? "").trim() || null;
    const state = String(c.state ?? "").trim() || null;
    if (!EMAIL_RE.test(email)) return badRequest("Please provide a valid email address");
    if (!firstName || !lastName) return badRequest("Please provide your full name");
    if (!address || !city || !zip) return badRequest("Please complete the shipping address");

    const paymentMethod = body.paymentMethod === "cod" ? "cod" : "card";
    const promo = typeof body.promo === "string" && PROMOS[body.promo.toUpperCase()] ? body.promo.toUpperCase() : null;

    // ---- price everything server-side from the DB ----
    const ids = [...new Set(items.map((i) => i.productId))];
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    if (rows.length !== ids.length) return badRequest("Some items are no longer available");
    const byId = new Map(rows.map((p) => [p.id, p]));

    const orderItems: OrderItem[] = [];
    for (const it of items) {
      const p = byId.get(it.productId)!;
      if (!p.sizes.includes(it.size)) return badRequest(`${p.name} is not available in size ${it.size}`);
      if (p.stock < it.qty) return badRequest(`Only ${p.stock} left of ${p.name} in size ${it.size}`);
      orderItems.push({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.images[0] ?? "",
        size: it.size,
        qty: it.qty,
      });
    }

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const tax = Math.round(afterDiscount * TAX_RATE);
    const total = afterDiscount + shipping + tax;

    const orderNumber = `HTB-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        email,
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zip,
        country,
        items: orderItems,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        paymentMethod,
        status: "confirmed",
      })
      .returning();

    // decrement stock
    for (const it of items) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${it.qty}` })
        .where(inArray(products.id, [it.productId]));
    }

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, total });
  } catch (err) {
    console.error("[orders] error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong placing your order." }, { status: 500 });
  }
}
