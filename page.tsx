import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Stars } from "@/components/stars";
import { NewsletterForm } from "@/components/newsletter-form";
import { getCategories, getCategoryCounts, getFeaturedProducts, getHomeReviews } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { IconArrowRight, IconArrowUpRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HT Brothers Fashion — Premium Menswear",
  description:
    "Heavyweight tees, fleece hoodies, selvedge denim and tailored shirts for men. Free shipping over $75. Shop the new season drop at HT Brothers Fashion.",
};

const MARQUEE_ITEMS = [
  "Free shipping over $75",
  "New drop — Season 04",
  "30-day easy returns",
  "Code BROTHER10 for 10% off",
  "2-year stitch warranty",
];

export default async function HomePage() {
  const [categories, counts, featured, homeReviews] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(8),
    getHomeReviews(6),
  ]);

  return (
    <div>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-ink text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="HT Brothers editorial — man in a dark tailored look"
          className="animate-ken-burns absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 md:pb-28">
          <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.35em] text-gold md:text-sm" style={{ animationDelay: "150ms" }}>
            HT Brothers Fashion · Est. 2016
          </p>
          <h1
            className="animate-fade-up mt-5 font-display text-[clamp(3.2rem,9.5vw,8rem)] font-semibold leading-[0.92] tracking-tight"
            style={{ animationDelay: "300ms" }}
          >
            Dress like
            <br />
            <em className="font-light italic text-gold">you mean it.</em>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg"
            style={{ animationDelay: "450ms" }}
          >
            Heavyweight tees, cloud-soft hoodies, selvedge denim and shirts cut to last. Premium menswear
            without the premium markup — made for the brothers, by the brothers.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "600ms" }}>
            <Link
              href="/shop"
              className="group flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-cream hover:text-ink"
            >
              Shop the collection
              <IconArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?sort=newest"
              className="rounded-full border border-cream/40 px-8 py-4 text-sm font-bold uppercase tracking-widest text-cream backdrop-blur transition hover:border-cream hover:bg-cream hover:text-ink"
            >
              New arrivals
            </Link>
          </div>

          <div
            className="animate-fade-up mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream/15 pt-6"
            style={{ animationDelay: "750ms" }}
          >
            {[
              ["18k+", "happy customers"],
              ["4.9 / 5", "average rating"],
              ["60+", "styles in stock"],
              ["24h", "dispatch time"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-semibold text-gold md:text-3xl">{value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-cream/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 right-8 z-10 hidden flex-col items-center gap-2 text-cream/60 md:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-cream/50" />
        </div>
      </section>

      {/* ---------------------------- MARQUEE ----------------------------- */}
      <div className="overflow-hidden border-y border-ink/10 bg-clay py-3.5 text-cream">
        <div className="animate-marquee flex w-max items-center gap-8">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center gap-8" aria-hidden={half === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.25em]">
                  {item} <span className="text-cream/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------- FEATURED COLLECTIONS ------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">Collections</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink transition hover:text-clay"
          >
            View everything
            <IconArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 80}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-sand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image ?? "/images/col-tshirts.jpg"}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div className="text-cream">
                    <h3 className="font-display text-2xl font-semibold md:text-3xl">{cat.name}</h3>
                    <p className="mt-1 text-sm text-cream/70">
                      {counts.get(cat.slug) ?? 0} styles · {cat.description?.split(".")[0]}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-ink transition-all duration-300 group-hover:bg-clay group-hover:text-cream">
                    <IconArrowUpRight width={18} height={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------- BESTSELLERS ---------------------------- */}
      <section className="border-y border-line bg-parchment py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">The Edit</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Bestsellers, loved to bits
              </h2>
            </div>
            <Link
              href="/shop?sort=rating"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition hover:text-clay"
            >
              Shop top rated
              <IconArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal className="mt-10">
            <div className="no-scrollbar -mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-4">
              {featured.map((p) => (
                <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[280px]">
                  <ProductCard product={p} />
                </div>
              ))}
              <Link
                href="/shop"
                className="group flex w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-cream/50 text-center transition hover:border-clay hover:text-clay sm:w-[280px]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream transition group-hover:bg-clay">
                  <IconArrowRight width={20} height={20} />
                </span>
                <span className="px-6 font-display text-xl font-semibold">See the full shop</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- EDITORIAL ---------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-moss text-cream lg:grid-cols-2">
          <Reveal className="relative h-72 lg:h-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial.jpg"
              alt="Inside the HT Brothers atelier — garments on a rack"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={150} className="px-8 pb-12 lg:px-14 lg:py-16 lg:pr-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">The HT Standard</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Built to be worn.
              <br />
              <em className="font-light italic text-gold">Made to last.</em>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-cream/75">
              Every HT Brothers piece starts with the fabric — heavyweight organic cotton, brushed fleece,
              Japanese selvedge. We cut for real bodies, stitch to survive real life, and back every seam
              with a 2-year warranty.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {[
                ["240–420gsm", "fabric weights, no thin stuff"],
                ["100%", "traceable cotton & denim mills"],
                ["2 years", "stitch warranty on everything"],
                ["Carbon-neutral", "shipping on every order"],
              ].map(([v, l]) => (
                <div key={l} className="border-l-2 border-clay pl-4">
                  <p className="font-display text-2xl font-semibold text-gold">{v}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">{l}</p>
                </div>
              ))}
            </div>
            <Link
              href="/shop?category=jackets"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-ink transition hover:bg-clay hover:text-cream"
            >
              Explore outerwear <IconArrowRight width={15} height={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- TESTIMONIALS ---------------------------- */}
      <section className="border-y border-line bg-parchment py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">Word on the street</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Loved by the brothers
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {homeReviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-3xl border border-line bg-cream p-7">
                  <Stars rating={r.rating} size={15} />
                  <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed">
                    “{r.body}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <div>
                      <p className="text-sm font-bold">{r.author}</p>
                      <p className="text-xs text-ink-soft">
                        {formatDate(r.createdAt)} · Verified buyer
                      </p>
                    </div>
                    <Link
                      href={`/product/${r.productSlug}`}
                      className="text-xs font-semibold text-clay underline-offset-4 hover:underline"
                    >
                      {r.productName}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- NEWSLETTER ---------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="flex flex-col items-center rounded-[2rem] border border-line bg-sand px-6 py-16 text-center md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">Join the brotherhood</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Get 10% off your first order
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft md:text-base">
            Early access to drops, restock alerts and members-only deals. No spam — just good clothes.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
