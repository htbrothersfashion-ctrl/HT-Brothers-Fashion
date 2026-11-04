import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ShopFilters, SortBar, buildShopHref, type ShopParams } from "@/components/shop-filters";
import { getCategories, getCategoryCounts, getProducts, SORT_OPTIONS, type SortKey } from "@/lib/data";
import { IconSearch } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Menswear",
  description: "Browse HT Brothers Fashion — t-shirts, hoodies, pants, shirts, jackets and shorts. Filter by category, size and price.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const current: ShopParams = {
    category: first(sp.category),
    q: first(sp.q)?.trim() || undefined,
    size: first(sp.size),
    min: first(sp.min) ? Number(first(sp.min)) : undefined,
    max: first(sp.max) ? Number(first(sp.max)) : undefined,
    sort: (first(sp.sort) as SortKey) || "featured",
  };

  const [categories, counts, products] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getProducts(current),
  ]);

  const activeCategory = categories.find((c) => c.slug === current.category);
  const sortLabel = SORT_OPTIONS.find((s) => s.key === (current.sort ?? "featured"))?.label ?? "Featured";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 md:px-6 md:pt-32">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-clay">
            {activeCategory ? activeCategory.name : "The full lineup"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {current.q ? (
              <>Results for “{current.q}”</>
            ) : activeCategory ? (
              activeCategory.name
            ) : (
              "Shop all menswear"
            )}
          </h1>
        </div>
        <p className="text-sm text-ink-soft">
          {products.length} product{products.length === 1 ? "" : "s"} · sorted by {sortLabel.toLowerCase()}
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <form action="/shop" method="get" className="relative w-full sm:w-80">
          {current.category && <input type="hidden" name="category" value={current.category} />}
          {current.size && <input type="hidden" name="size" value={current.size} />}
          {current.min != null && <input type="hidden" name="min" value={current.min} />}
          {current.max != null && <input type="hidden" name="max" value={current.max} />}
          {current.sort && current.sort !== "featured" && <input type="hidden" name="sort" value={current.sort} />}
          <IconSearch
            width={16}
            height={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="Search tees, hoodies, denim…"
            className="w-full rounded-full border border-line bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-clay"
          />
        </form>
        <SortBar current={current} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <ShopFilters categories={categories} counts={counts} current={current} />
          </div>
        </aside>

        {/* Mobile filters */}
        <details className="group mb-6 rounded-2xl border border-line bg-parchment p-4 lg:hidden">
          <summary className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em]">
            Filter & sort
            <span className="chevron text-ink-soft">▾</span>
          </summary>
          <div className="mt-4">
            <ShopFilters categories={categories} counts={counts} current={current} />
          </div>
        </details>

        {/* Grid */}
        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-parchment px-6 py-24 text-center">
              <p className="font-display text-3xl font-semibold">Nothing matches those filters</p>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Try a different category, size or price range — or search for something else.
              </p>
              <Link
                href={current.q ? "/shop" : "/shop"}
                className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-clay"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info strip */}
      <div id="shipping" className="mt-20 grid gap-4 rounded-3xl bg-moss p-8 text-cream md:grid-cols-3 md:p-10">
        <div>
          <p className="font-display text-xl font-semibold">Free shipping over $75</p>
          <p className="mt-1 text-sm text-cream/70">Flat $7.95 under that. Tracked delivery in 3–5 business days, worldwide.</p>
        </div>
        <div id="returns">
          <p className="font-display text-xl font-semibold">30-day returns</p>
          <p className="mt-1 text-sm text-cream/70">Easy exchanges and full refunds — no questions, no restocking fees.</p>
        </div>
        <div id="size-guide">
          <p className="font-display text-xl font-semibold">True-to-size fits</p>
          <p className="mt-1 text-sm text-cream/70">Between sizes? Go up. Every product page has a full size guide.</p>
        </div>
      </div>
    </div>
  );
}

export function generateViewport() {
  return { themeColor: "#f7f3ea" };
}

void buildShopHref;
