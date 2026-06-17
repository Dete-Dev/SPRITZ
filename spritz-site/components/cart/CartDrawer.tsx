"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

/**
 * Sliding right-side cart drawer. Lists line items with quantity controls
 * and a Checkout button that opens Shopify's hosted checkout in the same tab.
 *
 * UX:
 * - Closes on backdrop click + Escape key
 * - Locks body scroll while open
 * - Empty state nudges back to "/#five"
 * - Subtotal shown above the checkout button; full totals (with shipping +
 *   tax) appear on Shopify's checkout page after the redirect.
 */
export default function CartDrawer() {
  const t = useTranslations("cart");
  const {
    cart,
    isOpen,
    closeDrawer,
    updateQty,
    removeItem,
    checkoutUrl,
    loading,
  } = useCart();

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  const items = cart?.lines.nodes ?? [];
  const subtotal = cart?.cost.subtotalAmount;
  const total = cart?.cost.totalAmount;
  // Discount = subtotal − total. Positive once an automatic discount
  // (bundle Function) or discount code lands on the cart.
  const discountAmount =
    subtotal && total ? Number(subtotal.amount) - Number(total.amount) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-ink">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t("close")}
            className="text-[11px] uppercase tracking-[0.32em] text-ink/55 hover:text-ink"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-3xl text-ink mb-3">{t("empty")}</p>
            <p className="text-sm text-ink/65 max-w-xs leading-relaxed">
              {t("emptyHint")}
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
            {items.map((line) => {
              const image = line.merchandise.product.images.nodes[0];
              return (
                <li key={line.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-bone">
                    {image && (
                      <Image
                        src={image.url}
                        alt={image.altText ?? line.merchandise.product.title}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-display text-lg leading-tight">
                      {line.merchandise.product.title}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-ink/55 mt-1">
                      {line.merchandise.title}
                    </p>
                    {line.sellingPlanAllocation && (
                      <p className="text-[10px] uppercase tracking-[0.3em] text-ink/45 mt-1">
                        {t("subscriptionBadge")} ·{" "}
                        {line.sellingPlanAllocation.sellingPlan.name}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2 border border-ink/20 rounded-full px-3 py-1">
                        <button
                          type="button"
                          aria-label={t("decrease")}
                          onClick={() => updateQty(line.id, line.quantity - 1)}
                          disabled={loading}
                          className="text-ink/55 hover:text-ink disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="min-w-5 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t("increase")}
                          onClick={() => updateQty(line.id, line.quantity + 1)}
                          disabled={loading}
                          className="text-ink/55 hover:text-ink disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-ink">
                        {Number(line.cost.subtotalAmount.amount) >
                          Number(line.cost.totalAmount.amount) && (
                          <span className="mr-2 text-ink/40 line-through">
                            {Number(line.cost.subtotalAmount.amount).toFixed(
                              0,
                            )}
                          </span>
                        )}
                        {Number(line.cost.totalAmount.amount).toFixed(0)}{" "}
                        <span className="text-ink/55">
                          {line.cost.totalAmount.currencyCode}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                      className="mt-2 self-start text-[10px] uppercase tracking-[0.3em] text-ink/45 hover:text-ink"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && subtotal && total && (
          <footer className="border-t border-ink/10 px-6 py-5">
            {discountAmount > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.32em] text-ink/45">
                  {t("subtotal")}
                </span>
                <span className="text-sm text-ink/55 line-through">
                  {Number(subtotal.amount).toFixed(0)} {subtotal.currencyCode}
                </span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.32em] text-ink/45">
                  {t("discount")}
                </span>
                <span className="text-sm text-ink">
                  −{discountAmount.toFixed(0)} {total.currencyCode}
                </span>
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.4em] text-ink/55">
                {discountAmount > 0 ? t("total") : t("subtotal")}
              </span>
              <span className="font-display text-2xl text-ink">
                {Number(total.amount).toFixed(0)}{" "}
                <span className="text-base text-ink/55">
                  {total.currencyCode}
                </span>
              </span>
            </div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-ink/45">
              {t("shippingNote")}
            </p>
            <a
              href={checkoutUrl ?? "#"}
              className="block w-full rounded-full border border-ink/70 bg-ink px-6 py-3 text-center text-[11px] uppercase tracking-[0.32em] text-ivory transition-colors hover:bg-ivory hover:text-ink"
            >
              {t("checkout")}
            </a>
          </footer>
        )}
      </aside>
    </>
  );
}
