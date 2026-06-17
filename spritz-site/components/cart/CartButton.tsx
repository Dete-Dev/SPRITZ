"use client";

import { useCart } from "./CartProvider";

/**
 * Header cart button — a small pill matching the Shop button style.
 * Shows the line-item count when > 0. Clicking opens the drawer.
 */
export default function CartButton({ label }: { label: string }) {
  const { cartCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`${label} (${cartCount})`}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-ivory/40 px-5 py-2 text-[11px] uppercase tracking-[0.32em] text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-ivory"
      style={{ borderColor: "rgba(26,20,17,0.25)" }}
    >
      <span>{label}</span>
      {cartCount > 0 && (
        <span
          aria-hidden
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-medium text-ivory"
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}
