import Link from "next/link";
import type { Category } from "@/db/schema";
import { PRICE_RANGES, SORT_OPTIONS, type SortKey } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { IconX } from "./icons";

export type ShopParams = {
  category?: string;
  q?: string;
  size?: string;
  min?: number;
  max?: number;
  sort?: SortKey;
};

/** Build a /shop href preserving current params while applying a patch. */
export function buildShopHref(current: ShopParams, patch: Partial<ShopParams>): string {
  const next: Record<string, string> = {};
  const c = { ...current, ...patch };
  if (c.category) next.category = c.category;
  if (c.q) next.q = c.q;
  if (c.size) next.size = c.size;
  if (c.min != null) next.min = String(c.min);
  if (c.max != null && c.max < 999999) next.max = String(c.max);
  if (c.sort && c.sort !== "featured") next.sort = c.sort;
  const qs = new URLSearchParams(next).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

const SIZE_FILTERS = ["XS", "S", "M", "L", "XL", "XXL", "30", "32", "34", "36"];

export function ShopFilters({
  categories,
  counts,
  current,
}: {
  categories: Category[];
  counts: Map<string, number>;
  current: ShopParams;
}) {
  const hasFilters = Boolean(current.category || current.q || current.size || current.min != null || (current.sort && current.sort !== "featured"));

  const linkCls = (active: boolean) =>
    `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      active ? "bg-ink text-cream" : "text-ink-soft hover:bg-sand hover:text-ink"
    }`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-ink-soft">Filters</h2>
        {hasFilters && (
          <Link
            href={current.q ? `/shop?q=${encodeURIComponent(current.q)}` : "/shop"}
            className="flex items-center gap-1 text-xs font-semibold text-clay hover:underline"
          >
            <IconX width={12} height={12} /> Clear all
          </Link>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold">Category</h3>
        <ul className="mt-3 space-y-1">
          <li>
            <Link href={buildShopHref(current, { category: undefined })} className={linkCls(!current.category)}>
              All products
              <span className="text-xs opacity-70">{[...counts.values()].reduce((a, b) => a + b, 0)}</span>
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={buildShopHref(current, { category: cat.slug })}
                className={linkCls(current.category === cat.slug)}
              >
                {cat.name}
                <span className="text-xs opacity-70">{counts.get(cat.slug) ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold">Price</h3>
        <ul className="mt-3 space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = current.min === range.min && (current.max ?? 0) === range.max;
            return (
              <li key={range.label}>
                <Link
                  href={buildShopHref(current, { min: range.min, max: range.max })}
                  className={linkCls(active)}
                >
                  {range.label}
                  {range.max < 999999 && <span className="text-xs opacity-70">{formatPrice(range.max)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-sm font-bold">Size</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZE_FILTERS.map((s) => (
            <Link
              key={s}
              href={buildShopHref(current, { size: current.size === s ? undefined : s })}
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-2.5 text-xs font-bold transition ${
                current.size === s
                  ? "border-ink bg-ink text-cream"
                  : "border-line hover:border-ink"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Sort (also surfaced on mobile) */}
      <div className="lg:hidden">
        <h3 className="text-sm font-bold">Sort by</h3>
        <ul className="mt-3 space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.key}>
              <Link
                href={buildShopHref(current, { sort: opt.key === "featured" ? undefined : opt.key })}
                className={linkCls((current.sort ?? "featured") === opt.key)}
              >
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SortBar({ current }: { current: ShopParams }) {
  return (
    <div className="hidden flex-wrap items-center gap-2 lg:flex">
      <span className="mr-1 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Sort</span>
      {SORT_OPTIONS.map((opt) => {
        const active = (current.sort ?? "featured") === opt.key;
        return (
          <Link
            key={opt.key}
            href={buildShopHref(current, { sort: opt.key === "featured" ? undefined : opt.key })}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              active
                ? "border-ink bg-ink text-cream"
                : "border-line hover:border-ink"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
