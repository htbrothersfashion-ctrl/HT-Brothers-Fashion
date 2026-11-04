import { NextResponse } from "next/server";
import { getProductBySlug, getReviewsForProduct } from "@/lib/data";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ slug: string }>;

export async function GET(_req: Request, { params }: { params: RouteParams }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }
    const productReviews = await getReviewsForProduct(product.id);
    return NextResponse.json({ ok: true, product, reviews: productReviews });
  } catch (err) {
    console.error("[product] error:", err);
    return NextResponse.json({ ok: false, error: "Failed to load product" }, { status: 500 });
  }
}
