"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import { StripeBand } from "@/components/ui/vandal";
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
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper transition-transform duration-300 ease-spritz ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <StripeBand color="var(--sp-red)" height={12} />

        <header className="flex items-center justify-between border-b-2 border-ink px-6 py-5">
          <h2 className="sp-display text-d-xl">{t("title")}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t("close")}
            className="font-sans text-xl font-bold leading-none text-muted hover:text-ink"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="sp-display mb-3 text-d-xl">{t("empty")}</p>
            <p className="max-w-xs font-sans text-sm text-muted">
              {t("emptyHint")}
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y-2 divide-line overflow-y-auto px-6">
            {items.map((line) => {
              const image = line.merchandise.product.images.nodes[0];
              return (
                <li key={line.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-card border-2 border-ink bg-paper">
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
                    <p className="sp-label-name text-[15px] leading-tight">
                      {line.merchandise.product.title}
                    </p>
                    <p className="sp-eyebrow mt-1">
                      {line.merchandise.title}
                    </p>
                    {line.sellingPlanAllocation && (
                      <p className="sp-eyebrow mt-1">
                        {t("subscriptionBadge")} ·{" "}
                        {line.sellingPlanAllocation.sellingPlan.name}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1">
                        <button
                          type="button"
                          aria-label={t("decrease")}
                          onClick={() => updateQty(line.id, line.quantity - 1)}
                          disabled={loading}
                          className="font-bold text-ink hover:text-red disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-5 text-center font-sans text-sm font-bold">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t("increase")}
                          onClick={() => updateQty(line.id, line.quantity + 1)}
                          disabled={loading}
                          className="font-bold text-ink hover:text-red disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-sans text-sm font-bold">
                        {Number(line.cost.subtotalAmount.amount) >
                          Number(line.cost.totalAmount.amount) && (
                          <span className="sp-strike mr-2 font-normal text-muted">
                            {Number(line.cost.subtotalAmount.amount).toFixed(
                              0,
                            )}
                          </span>
                        )}
                        {Number(line.cost.totalAmount.amount).toFixed(0)}{" "}
                        <span className="font-normal text-muted">
                          {line.cost.totalAmount.currencyCode}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                      className="sp-eyebrow mt-2 self-start hover:text-red"
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
          <footer className="border-t-2 border-ink px-6 py-5">
            {discountAmount > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="sp-eyebrow">{t("subtotal")}</span>
                <span className="sp-strike font-sans text-sm text-muted">
                  {Number(subtotal.amount).toFixed(0)} {subtotal.currencyCode}
                </span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="sp-eyebrow">{t("discount")}</span>
                <span className="font-sans text-sm font-bold text-red">
                  −{discountAmount.toFixed(0)} {total.currencyCode}
                </span>
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <span className="sp-eyebrow">
                {discountAmount > 0 ? t("total") : t("subtotal")}
              </span>
              <span className="font-sans text-2xl font-bold">
                {Number(total.amount).toFixed(0)}{" "}
                <span className="text-base font-normal text-muted">
                  {total.currencyCode}
                </span>
              </span>
            </div>
            <p className="sp-eyebrow mb-4">{t("shippingNote")}</p>
            <Cta href={checkoutUrl ?? "#"} variant="primary" block>
              {t("checkout")}
            </Cta>
          </footer>
        )}
      </aside>
    </>
  );
}
