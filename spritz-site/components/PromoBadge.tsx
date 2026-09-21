"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import NewsletterPopup from "@/components/NewsletterPopup";

/**
 * Sticky promo badge — brief §1. Bottom-right, stays on screen through the
 * whole scroll, dismissible. Yellow sticker on ink so it reads as a slap
 * rather than a system toast, and it never borrows the red CTA colour.
 *
 * One pill, two targets: the label opens the newsletter popup (which hands
 * back the discount code and a route to the bundle builder) and the × rides
 * inside the same border rather than trailing it as a second sticker.
 *
 * Sits above the bundle bar on mobile (bottom-24) so the two never stack.
 */

const SIGNED_UP_KEY = "spritz-newsletter";

export default function PromoBadge() {
  const t = useTranslations("promoBadge");
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  // Starts hidden: someone who already signed up should never see the pill
  // flash before the check runs.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SIGNED_UP_KEY) !== "1") setReady(true);
    } catch {
      // Private mode / storage blocked — show the pill rather than lose it.
      setReady(true);
    }
  }, []);

  function handleSuccess(): void {
    try {
      window.localStorage.setItem(SIGNED_UP_KEY, "1");
    } catch {
      // Nothing to do — the popup still shows the code this session.
    }
  }

  if (!ready || dismissed) return null;

  return (
    <>
      <div className="sp-lift fixed bottom-24 right-4 z-40 inline-flex items-center rounded-full border-2 border-ink bg-yellow shadow-hard md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="py-2.5 pl-5 pr-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
        >
          {t("label")}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t("dismiss")}
          className="mr-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-base leading-none text-ink/55 transition-colors hover:bg-ink/10 hover:text-ink"
        >
          ×
        </button>
      </div>

      <NewsletterPopup
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
