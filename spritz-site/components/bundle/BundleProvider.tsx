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
import { SCENTS, type Scent } from "@/lib/scents";
import {
  estimateBundleTotal,
  nextTier,
  tierForQuantity,
  type BundleEstimate,
  type BundleTier,
} from "@/lib/bundle";
import {
  bottlePrice,
  setShape,
  type BottleSize,
  type SetShape,
  type SetShapeKey,
} from "@/lib/sizes";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Shared bundle state — one source of truth for the slot builder and the
 * persistent bundle bar, so the in-progress set survives navigation between
 * the home page, /shop, and every scent page.
 *
 * `slots` is an ordered list of bottles, each with its size: a 50ml, or the
 * 15ml that only exists inside a set. It is persisted to localStorage so a
 * refresh doesn't drop the set. Adding the whole thing to the cart clears it.
 *
 * Two ways to build:
 *
 * - Free (`shape === null`): any number of bottles, priced by the cart-wide
 *   tiers in lib/bundle.
 * - Shaped: catalog spec products 34 and 35 — a fixed composition (1×50 +
 *   1×15, or 3×15) at that set's own percentage. A shaped set carries its
 *   discount itself and never also collects the tiers.
 */

export interface BundleSlot {
  key: string;
  size: BottleSize;
}

interface BundleContextValue {
  slots: BundleSlot[];
  count: number;
  estimate: BundleEstimate;
  next: { tier: BundleTier; remaining: number } | null;
  unlocked: BundleTier | null;
  /** The set being built to a fixed composition, or null when free-building. */
  shape: SetShape | null;
  /** Sizes still owed on a shaped set, in order. Empty when free or complete. */
  remainingSizes: BottleSize[];
  /** True if any selected bottle has no Shopify variant id yet. */
  variantsMissing: boolean;
  addScent: (key: string, size?: BottleSize) => void;
  removeAt: (index: number) => void;
  /** Replace the whole set at once — used to apply a curated gift set. */
  loadSet: (keys: string[]) => void;
  /** Start a build-your-own set of a fixed shape, discarding what was there. */
  startShape: (key: SetShapeKey) => void;
  clear: () => void;
  addAllToCart: () => Promise<void>;
}

const BundleContext = createContext<BundleContextValue | null>(null);
/* v2: slots gained a size. Old v1 entries are plain strings and would
   hydrate into a set with no sizes, so the key is bumped rather than
   migrated — an in-progress bundle is cheap to lose, a wrong price is not. */
const STORAGE_KEY = "spritz-bundle-v2";
const SHAPE_KEY = "spritz-bundle-shape";

function variantIdFor(scent: Scent | undefined, size: BottleSize): string {
  if (!scent) return "";
  return (size === "15ml" ? scent.ml15VariantId : scent.shopifyVariantId) ?? "";
}

function isSlot(v: unknown): v is BundleSlot {
  if (typeof v !== "object" || v === null) return false;
  const slot = v as Partial<BundleSlot>;
  return (
    typeof slot.key === "string" &&
    (slot.size === "50ml" || slot.size === "15ml") &&
    SCENTS.some((s) => s.key === slot.key)
  );
}

export function BundleProvider({ children }: { children: ReactNode }) {
  const { addItems } = useCart();
  const [slots, setSlots] = useState<BundleSlot[]>([]);
  const [shape, setShapeState] = useState<SetShape | null>(null);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(isSlot)) {
          setSlots(parsed as BundleSlot[]);
        }
      }
      const rawShape = window.localStorage.getItem(SHAPE_KEY);
      if (rawShape === "duo" || rawShape === "trio") {
        setShapeState(setShape(rawShape));
      }
    } catch {
      // Ignore malformed storage.
    }
  }, []);

  const persist = useCallback((next: BundleSlot[]) => {
    setSlots(next);
    if (typeof window === "undefined") return;
    if (next.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persistShape = useCallback((next: SetShape | null) => {
    setShapeState(next);
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(SHAPE_KEY, next.key);
    else window.localStorage.removeItem(SHAPE_KEY);
  }, []);

  /* Sizes the shape still owes, so the builder can add the right bottle
     without asking. Free-building always adds a 50ml. */
  const remainingSizes = useMemo<BottleSize[]>(() => {
    if (!shape) return [];
    return shape.slots.slice(slots.length);
  }, [shape, slots.length]);

  const addScent = useCallback(
    (key: string, size?: BottleSize) => {
      const next = size ?? remainingSizes[0] ?? "50ml";
      /* A shaped set is full at its composition — ignore extra bottles
         rather than silently selling a trio of four. */
      if (shape && slots.length >= shape.slots.length) return;
      persist([...slots, { key, size: next }]);
    },
    [slots, persist, shape, remainingSizes],
  );

  const removeAt = useCallback(
    (index: number) => persist(slots.filter((_, i) => i !== index)),
    [slots, persist],
  );

  /* Replaces rather than appends: applying a curated set should give exactly
     that set, not add it on top of whatever was already in progress. */
  const loadSet = useCallback(
    (keys: string[]) => {
      persistShape(null);
      persist(
        keys
          .filter((k) => SCENTS.some((s) => s.key === k))
          .map((k) => ({ key: k, size: "50ml" as const })),
      );
    },
    [persist, persistShape],
  );

  const startShape = useCallback(
    (key: SetShapeKey) => {
      persistShape(setShape(key));
      persist([]);
    },
    [persist, persistShape],
  );

  const clear = useCallback(() => {
    persistShape(null);
    persist([]);
  }, [persist, persistShape]);

  const groupedEntries = useMemo(() => {
    const byVariant = new Map<string, { slot: BundleSlot; quantity: number }>();
    for (const slot of slots) {
      const id = `${slot.key}::${slot.size}`;
      const seen = byVariant.get(id);
      if (seen) seen.quantity += 1;
      else byVariant.set(id, { slot, quantity: 1 });
    }
    return [...byVariant.values()];
  }, [slots]);

  const priced = useMemo(
    () =>
      groupedEntries.map(({ slot, quantity }) => ({
        price: bottlePrice(
          SCENTS.find((s) => s.key === slot.key)?.price ?? 0,
          slot.size,
        ),
        quantity,
      })),
    [groupedEntries],
  );

  const estimate = useMemo<BundleEstimate>(() => {
    const tiered = estimateBundleTotal(priced);
    if (!shape) return tiered;
    /* A shaped set is priced by its own percentage, and only once it is
       actually complete — a half-built trio has no set price yet. */
    const complete = slots.length === shape.slots.length;
    const percentOff = complete ? shape.percentOff : 0;
    const discount = Math.round((tiered.subtotal * percentOff) / 100);
    return {
      quantity: tiered.quantity,
      subtotal: tiered.subtotal,
      percentOff,
      discount,
      total: tiered.subtotal - discount,
    };
  }, [priced, shape, slots.length]);

  const variantsMissing = slots.some(
    (slot) =>
      variantIdFor(
        SCENTS.find((s) => s.key === slot.key),
        slot.size,
      ) === "",
  );

  const addAllToCart = useCallback(async () => {
    if (slots.length === 0) return;
    await addItems(
      groupedEntries.map(({ slot, quantity }) => ({
        merchandiseId: variantIdFor(
          SCENTS.find((s) => s.key === slot.key),
          slot.size,
        ),
        quantity,
      })),
    );
    persistShape(null);
    persist([]);
  }, [slots.length, groupedEntries, addItems, persist, persistShape]);

  const value: BundleContextValue = {
    slots,
    count: slots.length,
    estimate,
    /* Tier progress is a free-build idea; a shaped set has its own price. */
    next: shape ? null : nextTier(estimate.quantity),
    unlocked: shape ? null : tierForQuantity(estimate.quantity),
    shape,
    remainingSizes,
    variantsMissing,
    addScent,
    removeAt,
    loadSet,
    startShape,
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
