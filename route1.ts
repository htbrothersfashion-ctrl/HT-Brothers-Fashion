import { NextResponse } from "next/server";
import { getProducts, type SortKey } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const products = await getProducts({
      category: sp.get("category") ?? undefined,
      q: sp.get("q") ?? undefined,
      size: sp.get("size") ?? undefined,
      min: sp.get("min") ? Number(sp.get("min")) : undefined,
      max: sp.get("max") ? Number(sp.get("max")) : undefined,
      sort: (sp.get("sort") as SortKey) || "featured",
    });
    return NextResponse.json({ ok: true, count: products.length, products });
  } catch (err) {
    console.error("[products] error:", err);
    return NextResponse.json({ ok: false, error: "Failed to load products" }, { status: 500 });
  }
}
