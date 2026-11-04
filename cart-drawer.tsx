"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./cart-provider";
import { FREE_SHIPPING_THRESHOLD, cartItemKey } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { IconMinus, IconPlus, IconTrash, IconX, IconTruck, IconArrowRight } from "./icons";

export function CartDrawer() {
  const { isOpen, closeCart, items, setQty, removeItem, subtotal, count } = useCart();

  // Lock body scroll + ESC to close.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl font-semibold">
            Your Cart {count > 0 && <span className="text-ink-soft">({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 transition hover:bg-sand"
          >
            <IconX />
          </button>
        </div>

        {/* Free shipping meter */}
        <div className="border-b border-line px-6 py-4">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <IconTruck className="text-clay" />
            {remaining > 0 ? (
              <>
                You're <strong className="text-ink">{formatPrice(remaining)}</strong> away from free shipping
              </>
            ) : (
              <strong className="text-ink">You've unlocked free shipping</strong>
            )}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-clay transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl">Your cart is empty</p>
              <p className="mt-2 text-sm text-ink-soft">Fill it with something good.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay"
              >
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => {
                const key = cartItemKey(item.productId, item.size);
                return (
                  <li key={key} className="flex gap-4 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="font-medium leading-snug hover:text-clay"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-soft">Size {item.size}</p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                            className="p-2 transition hover:text-clay"
                          >
                            <IconMinus width={14} height={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                            className="p-2 transition hover:text-clay"
                          >
                            <IconPlus width={14} height={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1.5 text-ink-soft transition hover:text-clay"
                        >
                          <IconTrash width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="font-display text-xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Shipping & taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-clay"
            >
              Checkout <IconArrowRight width={16} height={16} />
            </Link>
            <button
              onClick={closeCart}
              className="mt-3 w-full text-center text-sm text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
