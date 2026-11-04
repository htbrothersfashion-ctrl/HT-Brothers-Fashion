import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { BuyBox, Accordion } from "@/components/buy-box";
import { ProductCard } from "@/components/product-card";
import { ReviewForm } from "@/components/review-form";
import { Reveal } from "@/components/reveal";
import { Stars } from "@/components/stars";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { IconCheck } from "@/components/icons";

export const dynamic = "force-dynamic";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [productReviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product.id, product.category, 4),
  ]);

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.rating === star).length,
  }));
  const maxDist = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 md:px-6 md:pt-32">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
        <Link href="/" className="transition hover:text-clay">Home</Link>
        <span>/</span>
        <Link href="/shop" className="transition hover:text-clay">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="transition hover:text-clay capitalize">
          {product.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Gallery images={product.images} name={product.name} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay capitalize">
            {product.category.replace("-", " ")}
            {product.tags.includes("new") && (
              <span className="ml-3 rounded-full bg-moss px-2.5 py-1 text-[10px] tracking-widest text-cream">New</span>
            )}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <BuyBox product={product} />

          <div className="mt-8">
            <Accordion title="Description" defaultOpen>
              {product.description}
            </Accordion>
            <Accordion title="Fabric & care">
              Heavyweight, garment-dyed cloth with reinforced stitching. Machine wash cold with like
              colors, tumble dry low. The softer it gets, the better it looks.
            </Accordion>
            <Accordion title="Shipping & returns">
              Free tracked shipping on orders over $75 (otherwise $7.95 flat). Dispatched within 24 hours,
              delivered in 3–5 business days. 30-day free returns and exchanges.
            </Accordion>
          </div>
        </Reveal>
      </div>

      {/* ------------------------------ REVIEWS ------------------------------ */}
      <section id="reviews" className="mt-24 scroll-mt-32">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">Reviews</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">What the brothers say</h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* Summary */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-parchment p-7 lg:sticky lg:top-28">
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl font-semibold leading-none">{product.rating.toFixed(1)}</span>
                <div className="pb-1">
                  <Stars rating={product.rating} size={16} />
                  <p className="mt-1 text-sm text-ink-soft">{product.reviewCount} verified reviews</p>
                </div>
              </div>
              <div className="mt-6 space-y-2.5">
                {dist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 font-semibold">{star}</span>
                    <span className="text-gold">★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${(count / maxDist) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs text-ink-soft">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* List + form */}
          <div className="space-y-8">
            <Reveal>
              <div className="space-y-5">
                {productReviews.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">
                    No reviews yet — be the first to review this piece.
                  </p>
                )}
                {productReviews.map((r) => (
                  <article key={r.id} className="rounded-3xl border border-line bg-cream p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-cream">
                          {r.author.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{r.author}</p>
                          {r.verified && (
                            <p className="flex items-center gap-1 text-xs text-ink-soft">
                              <IconCheck width={11} height={11} className="text-green-600" /> Verified purchase
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-ink-soft">{formatDate(r.createdAt)}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Stars rating={r.rating} size={13} />
                      <span className="text-sm font-bold">{r.title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  </article>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <ReviewForm slug={product.slug} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------- RELATED ---------------------------- */}
      {related.length > 0 && (
        <section className="mt-24">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">Keep browsing</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                You may also like
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="hidden text-sm font-bold uppercase tracking-widest transition hover:text-clay sm:block"
            >
              View all →
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
