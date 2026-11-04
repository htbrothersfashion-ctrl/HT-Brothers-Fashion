"use client";

import Link from "next/link";
import type { Product } from "@/db/schema";
import { useCart } from "./cart-provider";
import { COLOR_HEX } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/lib/format";
import { Stars } from "./stars";
import { IconArrowUpRight, IconPlus } from "./icons";

function defaultSizeFor(category: string): string {
  return category === "pants" || category === "shorts" ? "32" : "M";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, toast } = useCart();
  const discount = discountPercent(product.price, product.compareAtPrice);
  const isNew = product.tags.includes("new");
  const isBestseller = product.tags.includes("bestseller");
  const isSale = product.tags.includes("sale") || discount > 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size: defaultSizeFor(product.category),
    });
    toast(`${product.name} added to cart`);
  };

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          {/* Second image cross-fade on hover */}
          {product.images[1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="rounded-full bg-moss px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cream">
                New
              </span>
            )}
            {isBestseller && (
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                Bestseller
              </span>
            )}
            {isSale && discount > 0 && (
              <span className="rounded-full bg-clay px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cream">
                -{discount}%
              </span>
            )}
          </div>
          <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <IconArrowUpRight width={16} height={16} />
          </span>
          <button
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-ink/90 py-3 text-xs font-bold uppercase tracking-widest text-cream opacity-0 backdrop-blur transition-all duration-300 hover:bg-clay group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
          >
            <IconPlus width={14} height={14} /> Quick add
          </button>
        </div>
      </Link>
      <div className="mt-3.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {product.category.replace("-", " ")}
          </p>
          <span className="flex items-center gap-1">
            <Stars rating={product.rating} size={11} />
            <span className="text-[11px] text-ink-soft">({product.reviewCount})</span>
          </span>
        </div>
        <Link href={`/product/${product.slug}`} className="mt-1 block">
          <h3 className="font-display text-lg font-semibold leading-snug transition group-hover:text-clay">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="flex items-baseline gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-ink-soft line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </p>
          <span className="flex gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full border border-ink/10"
                style={{ backgroundColor: COLOR_HEX[c] ?? "#ccc" }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
