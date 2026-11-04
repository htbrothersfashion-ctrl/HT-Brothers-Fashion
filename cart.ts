/** Shared cart math + types used by both the client (checkout UI) and the orders API. */

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  /** USD cents */
  price: number;
  image: string;
  size: string;
  qty: number;
}

export const FREE_SHIPPING_THRESHOLD = 7500; // $75.00
export const SHIPPING_FLAT = 795; // $7.95
export const TAX_RATE = 0.08;

export const PROMOS: Record<string, number> = {
  BROTHER10: 0.1,
};

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export function computeTotals(items: Pick<CartItem, "price" | "qty">[], promo?: string | null): Totals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const pct = promo ? PROMOS[promo.toUpperCase()] ?? 0 : 0;
  const discount = Math.round(subtotal * pct);
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(afterDiscount * TAX_RATE);
  const total = afterDiscount + shipping + tax;
  return { subtotal, discount, shipping, tax, total };
}

export function cartItemKey(productId: number, size: string): string {
  return `${productId}:${size}`;
}

/** Color name -> hex, used for swatches across the storefront. */
export const COLOR_HEX: Record<string, string> = {
  White: "#f4f2ec",
  Ivory: "#efe8d8",
  Cream: "#ece1cb",
  Sand: "#d3bf9c",
  Beige: "#c9b48f",
  Khaki: "#b39a6b",
  "Heather Grey": "#a3a39e",
  Grey: "#6f7276",
  "Charcoal": "#3c3c40",
  Black: "#1b1b1d",
  Navy: "#25304a",
  Indigo: "#31435f",
  Olive: "#5c6238",
  Sage: "#a9b49b",
  Rust: "#a4502e",
  "Washed Blue": "#7f97b0",
};
