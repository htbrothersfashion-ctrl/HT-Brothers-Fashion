"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "./cart-provider";
import { COLOR_HEX } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/lib/format";
import { Stars } from "./stars";
import { IconCheck, IconMinus, IconPlus, IconRefresh, IconShield, IconTruck, IconChevronDown } from "./icons";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, toast } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "M");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const lowStock = product.stock > 0 && product.stock <= 10;

  const addToBag = () => {
    if (product.stock <= 0) return;
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size,
      qty,
    });
    toast(`${product.name} (${size}) added to your cart`);
  };

  const buyNow = () => {
    if (product.stock <= 0) return;
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        size,
        qty,
      },
      { openDrawer: false },
    );
    router.push("/checkout");
  };

  return (
    <div>
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Stars rating={product.rating} />
        <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
        <a href="#reviews" className="text-sm text-ink-soft underline-offset-4 hover:underline">
          {product.reviewCount} reviews
        </a>
      </div>

      {/* Price */}
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-3xl font-semibold">{formatPrice(product.price)}</span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-xl text-ink-soft line-through">{formatPrice(product.compareAtPrice)}</span>
            <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-bold text-clay">Save {discount}%</span>
          </>
        )}
      </div>

      {/* Stock */}
      <p className="mt-3 flex items-center gap-1.5 text-sm">
        {product.stock <= 0 ? (
          <span className="font-semibold text-clay">Sold out — join the waitlist</span>
        ) : lowStock ? (
          <>
            <span className="h-2 w-2 rounded-full bg-clay" /> Only {product.stock} left in stock
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-green-600" /> In stock, ready to ship in 24h
          </>
        )}
      </p>

      {/* Colors */}
      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
            Color — <span className="text-ink">{color}</span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                aria-label={`Color ${c}`}
                className={`h-9 w-9 rounded-full border transition ${
                  color === c ? "ring-2 ring-clay ring-offset-2 ring-offset-cream border-transparent" : "border-ink/15 hover:scale-110"
                }`}
                style={{ backgroundColor: COLOR_HEX[c] ?? "#ccc" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
            Size — <span className="text-ink">{size || "Select"}</span>
          </p>
          <details className="relative">
            <summary className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-clay">
              Size guide <IconChevronDown width={12} height={12} className="chevron" />
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-line bg-cream p-4 text-xs shadow-xl">
              <p className="font-bold">How to measure</p>
              <ul className="mt-2 space-y-1.5 text-ink-soft">
                <li>• Chest: measure across the fullest part, arms relaxed.</li>
                <li>• Waist: measure where you wear your belt, keep it natural.</li>
                <li>• Between sizes? Size up for a relaxed fit.</li>
              </ul>
              <p className="mt-2 text-ink-soft">Model is 6'1" wearing size L.</p>
            </div>
          </details>
        </div>
        <div className="mt-2.5 grid grid-cols-6 gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError(null);
              }}
              className={`rounded-xl border py-3 text-sm font-semibold transition ${
                size === s
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-transparent hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm font-medium text-clay">{error}</p>}
      </div>

      {/* Qty + CTAs */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center justify-center rounded-full border border-line sm:w-32">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-3 transition hover:text-clay"
          >
            <IconMinus width={15} height={15} />
          </button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            className="p-3 transition hover:text-clay"
          >
            <IconPlus width={15} height={15} />
          </button>
        </div>
        <button
          onClick={addToBag}
          disabled={product.stock <= 0}
          className="flex-1 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock <= 0 ? "Sold out" : "Add to cart"}
        </button>
        <button
          onClick={buyNow}
          disabled={product.stock <= 0}
          className="flex-1 rounded-full border-2 border-ink py-4 text-sm font-bold uppercase tracking-widest transition hover:border-clay hover:bg-clay hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy it now
        </button>
      </div>

      {/* Perks */}
      <ul className="mt-7 space-y-3 border-t border-line pt-6 text-sm text-ink-soft">
        <li className="flex items-center gap-3">
          <IconTruck className="shrink-0 text-clay" width={18} height={18} />
          Free shipping on orders over $75 · arrives in 3–5 business days
        </li>
        <li className="flex items-center gap-3">
          <IconRefresh className="shrink-0 text-clay" width={18} height={18} />
          30-day free returns & exchanges, no questions asked
        </li>
        <li className="flex items-center gap-3">
          <IconShield className="shrink-0 text-clay" width={18} height={18} />
          2-year stitch warranty on every HT Brothers piece
        </li>
        <li className="flex items-center gap-3">
          <IconCheck className="shrink-0 text-clay" width={18} height={18} />
          Secure checkout — all major cards & cash on delivery accepted
        </li>
      </ul>
    </div>
  );
}

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details
      className="group border-b border-line py-4"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.15em]">
        {title}
        <IconChevronDown width={16} height={16} className="chevron text-ink-soft" />
      </summary>
      <div className="pt-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
