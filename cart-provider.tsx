"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart";
import { cartItemKey } from "@/lib/cart";
import { CartDrawer } from "./cart-drawer";

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  isOpen: boolean;
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }, opts?: { openDrawer?: boolean }) => void;
  removeItem: (productId: number, size: string) => void;
  setQty: (productId: number, size: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toast: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const STORAGE_KEY = "htb_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once on the client (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.qty > 0));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / private mode */
    }
  }, [items, hydrated]);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2600);
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>((item, opts) => {
    const qtyToAdd = item.qty ?? 1;
    setItems((prev) => {
      const key = cartItemKey(item.productId, item.size);
      const existing = prev.find((p) => cartItemKey(p.productId, p.size) === key);
      if (existing) {
        return prev.map((p) =>
          cartItemKey(p.productId, p.size) === key ? { ...p, qty: Math.min(p.qty + qtyToAdd, 99) } : p,
        );
      }
      return [...prev, { ...item, qty: qtyToAdd }];
    });
    if (opts?.openDrawer !== false) setIsOpen(true);
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId, size) => {
    const key = cartItemKey(productId, size);
    setItems((prev) => prev.filter((p) => cartItemKey(p.productId, p.size) !== key));
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((productId, size, qty) => {
    const key = cartItemKey(productId, size);
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => cartItemKey(p.productId, p.size) !== key)
        : prev.map((p) => (cartItemKey(p.productId, p.size) === key ? { ...p, qty: Math.min(qty, 99) } : p)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items],
  );

  const value: CartContextValue = {
    items,
    hydrated,
    isOpen,
    count,
    subtotal,
    addItem,
    removeItem,
    setQty,
    clear,
    openCart,
    closeCart,
    toast,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      {toastMessage && (
        <div
          role="status"
          className="animate-pop fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-2xl"
        >
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
}
