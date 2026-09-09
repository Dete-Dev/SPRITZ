"use client";

import { useState } from "react";
import Cta from "@/components/ui/Cta";
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
      <Cta
        variant="primary"
        block
        onClick={handleClick}
        className={!ready || loading ? "pointer-events-none opacity-40" : ""}
      >
        {!ready ? notReadyLabel : justAdded ? addedLabel : label}
      </Cta>
      {error && (
        <p className="sp-scrawl mt-2 text-xs text-red">{error}</p>
      )}
    </div>
  );
}
