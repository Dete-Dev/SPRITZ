"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  /** Shopify variant GID. Empty string short-circuits to "store launching". */
  variantId: string;
  /** Selling plan GID — adds the line as a subscription when set. */
  sellingPlanId?: string;
  /** Visible label, locale-aware. */
  label: string;
  /** Shown briefly after a successful add. */
  addedLabel?: string;
  /** Fallback message when Shopify isn't configured yet. */
  notReadyLabel?: string;
  className?: string;
}

/**
 * Primary product CTA. Adds one unit of the given variant to the cart and
 * opens the drawer. Disabled while a request is in flight.
 *
 * When Shopify isn't wired up yet (no env vars / variantId is empty), the
 * button shows a "store launching" hint instead of attempting an API call.
 */
export default function AddToCartButton({
  variantId,
  sellingPlanId,
  label,
  addedLabel = "Added",
  notReadyLabel = "Store launching soon",
  className,
}: AddToCartButtonProps) {
  const { addItem, isReady, loading } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = isReady && variantId.length > 0;

  async function handleClick(): Promise<void> {
    if (!ready) return;
    setError(null);
    try {
      await addItem(variantId, 1, sellingPlanId);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not add to cart";
      setError(message);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!ready || loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/70 bg-ink px-7 py-3 text-[11px] uppercase tracking-[0.32em] text-ivory transition-colors hover:bg-ivory hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!ready ? notReadyLabel : justAdded ? addedLabel : label}
      </button>
      {error && (
        <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
