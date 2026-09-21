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
      className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-all hover:-translate-y-px hover:shadow-hard-sm"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" />
        <path
          d="M4.5 6.5h11l-.7 9.3a1.8 1.8 0 0 1-1.8 1.7H7a1.8 1.8 0 0 1-1.8-1.7L4.5 6.5Z"
          strokeLinejoin="round"
        />
      </svg>
      {cartCount > 0 && (
        <span
          aria-hidden
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-[10px] font-bold text-white"
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}
