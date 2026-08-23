"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SCENTS } from "@/lib/scents";
import {
  estimateBundleTotal,
  nextTier,
  tierForQuantity,
  type BundleEstimate,
  type BundleTier,
} from "@/lib/bundle";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Shared bundle state — one source of truth for the slot builder and the
 * persistent bundle bar, so the in-progress set survives navigation between
 * the home page, /shop, and every scent page.
 *
 * `slots` is an ordered list of scent keys (one entry per bottle). It's
 * persisted to localStorage so a refresh doesn't drop the set. Adding the
 * whole set to the Shopify cart clears it.
 */

interface BundleContextValue {
  slots: string[];
  count: number;
  estimate: BundleEstimate;
  next: { tier: BundleTier; remaining: number } | null;
  unlocked: BundleTier | null;
  /** True if any selected scent has no Shopify variant id yet. */
  variantsMissing: boolean;
  addScent: (key: string) => void;
  removeAt: (index: number) => void;
  /** Replace the whole set at once — used to apply a preset gift set. */
  loadSet: (keys: string[]) => void;
  clear: () => void;
  addAllToCart: () => Promise<void>;
}

const BundleContext = createContext<BundleContextValue | null>(null);
const STORAGE_KEY = "spritz-bundle";

export function BundleProvider({ children }: { children: ReactNode }) {
  const { addItems } = useCart();
  const [slots, setSlots] = useState<string[]>([]);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.every((k) => SCENTS.some((s) => s.key === k))
      ) {
        setSlots(parsed as string[]);
      }
    } catch {
      // Ignore malformed storage.
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlots(next);
    if (typeof window === "undefined") return;
    if (next.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addScent = useCallback(
    (key: string) => persist([...slots, key]),
    [slots, persist],
  );
  const removeAt = useCallback(
    (index: number) => persist(slots.filter((_, i) => i !== index)),
    [slots, persist],
  );
  /* Replaces rather than appends: applying a preset should give exactly
     that set, not add it on top of whatever was already in progress. */
  const loadSet = useCallback(
    (keys: string[]) =>
      persist(keys.filter((k) => SCENTS.some((s) => s.key === k))),
    [persist],
  );
  const clear = useCallback(() => persist([]), [persist]);

  const groupedEntries = useMemo(() => {
    const byKey = new Map<string, number>();
    for (const key of slots) byKey.set(key, (byKey.get(key) ?? 0) + 1);
    return [...byKey.entries()];
  }, [slots]);

  const estimate = useMemo(
    () =>
      estimateBundleTotal(
        groupedEntries.map(([key, quantity]) => ({
          price: SCENTS.find((s) => s.key === key)?.price ?? 0,
          quantity,
        })),
      ),
    [groupedEntries],
  );

  const variantsMissing = slots.some(
    (key) => (SCENTS.find((s) => s.key === key)?.shopifyVariantId ?? "") === "",
  );

  const addAllToCart = useCallback(async () => {
    if (slots.length === 0) return;
    await addItems(
      groupedEntries.map(([key, quantity]) => ({
        merchandiseId:
          SCENTS.find((s) => s.key === key)?.shopifyVariantId ?? "",
        quantity,
      })),
    );
    persist([]);
  }, [slots.length, groupedEntries, addItems, persist]);

  const value: BundleContextValue = {
    slots,
    count: slots.length,
    estimate,
    next: nextTier(estimate.quantity),
    unlocked: tierForQuantity(estimate.quantity),
    variantsMissing,
    addScent,
    removeAt,
    loadSet,
    clear,
    addAllToCart,
  };

  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  );
}

export function useBundle(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) {
    throw new Error("useBundle must be used inside <BundleProvider>");
  }
  return ctx;
}
