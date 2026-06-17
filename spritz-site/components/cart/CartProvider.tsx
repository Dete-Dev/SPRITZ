"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from "@/lib/shopify/cart";
import { isShopifyConfigured } from "@/lib/shopify/client";
import type { Cart, CartLineInput } from "@/lib/shopify/types";

/**
 * Cart context — single source of truth for the Shopify cart on the client.
 *
 * - `cartId` is persisted in `localStorage` so the cart survives reloads.
 * - On mount, we either re-hydrate the existing cart from Shopify or wait
 *   for the first add to create one.
 * - `addItem` returns a promise so callers can await success / show errors.
 * - `isReady` tells the UI whether Shopify is configured at all — when it's
 *   not (no env vars yet), the AddToCart button shows a "store launching"
 *   message instead of attempting a request.
 *
 * Lives at the client root (mounted in [locale]/layout.tsx). Every cart
 * surface — drawer, header badge, AddToCart button — consumes via
 * `useCart()`.
 */

interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  isOpen: boolean;
  isReady: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (
    variantId: string,
    quantity?: number,
    sellingPlanId?: string,
  ) => Promise<void>;
  addItems: (lines: CartLineInput[]) => Promise<void>;
  updateQty: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "spritz-cart-id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isReady = isShopifyConfigured();

  // Hydrate cart from localStorage on mount.
  useEffect(() => {
    if (!isReady) return;
    const cartId = window.localStorage.getItem(STORAGE_KEY);
    if (!cartId) return;
    let cancelled = false;
    (async () => {
      try {
        const existing = await cartGet(cartId);
        if (!cancelled && existing) {
          setCart(existing);
        } else if (!cancelled) {
          // Cart was deleted on Shopify side — drop the stale id.
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        if (!cancelled) {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady]);

  const persistCart = useCallback((next: Cart | null) => {
    setCart(next);
    if (typeof window === "undefined") return;
    if (next?.id) {
      window.localStorage.setItem(STORAGE_KEY, next.id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Batch add — one cartLinesAdd/cartCreate call for N lines (bundle CTA).
  const addItems = useCallback(
    async (lines: CartLineInput[]) => {
      if (!isReady) {
        throw new Error("Shopify is not configured yet.");
      }
      if (lines.length === 0) return;
      setLoading(true);
      try {
        const next = cart
          ? await cartLinesAdd(cart.id, lines)
          : await cartCreate(lines);
        if (next) persistCart(next);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [cart, persistCart, isReady],
  );

  const addItem = useCallback(
    async (variantId: string, quantity = 1, sellingPlanId?: string) => {
      await addItems([
        {
          merchandiseId: variantId,
          quantity,
          ...(sellingPlanId ? { sellingPlanId } : {}),
        },
      ]);
    },
    [addItems],
  );

  const updateQty = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setLoading(true);
      try {
        const next =
          quantity <= 0
            ? await cartLinesRemove(cart.id, [lineId])
            : await cartLinesUpdate(cart.id, [{ id: lineId, quantity }]);
        if (next) persistCart(next);
      } finally {
        setLoading(false);
      }
    },
    [cart, persistCart],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        const next = await cartLinesRemove(cart.id, [lineId]);
        if (next) persistCart(next);
      } finally {
        setLoading(false);
      }
    },
    [cart, persistCart],
  );

  const value: CartContextValue = {
    cart,
    cartCount: cart?.totalQuantity ?? 0,
    loading,
    isOpen,
    isReady,
    openDrawer: () => setIsOpen(true),
    closeDrawer: () => setIsOpen(false),
    addItem,
    addItems,
    updateQty,
    removeItem,
    checkoutUrl: cart?.checkoutUrl ?? null,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
