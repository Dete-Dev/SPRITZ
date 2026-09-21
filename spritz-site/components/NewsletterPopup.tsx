"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import { Mark, Sticker, StripeBand } from "@/components/ui/vandal";

/**
 * Newsletter capture behind the sticky 20% badge.
 *
 * Paper world, same slip-pasted-on-the-page card as ReserveSection: bordered,
 * hard-shadowed, banded top and bottom in red, with the discount slapped on
 * as a sticker that breaks the top edge. Red stays on the CTA only.
 *
 * Overlay mechanics follow CartDrawer — backdrop click + Escape to close,
 * body scroll locked while open, CSS-only transition on `ease-spritz`.
 */

type Status = "idle" | "sending" | "done";

export default function NewsletterPopup({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations("newsletterPopup");
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");

  // Lock background scroll while the popup is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes; focus lands on the field so it is typeable straight away.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const email = inputRef.current?.value ?? "";
    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          body.error === "invalid_email" ? t("errorInvalid") : t("errorGeneric"),
        );
        setStatus("idle");
        return;
      }

      const body = (await res.json()) as { code?: string };
      setCode(body.code ?? "");
      setStatus("done");
      onSuccess();
    } catch {
      setError(t("errorGeneric"));
      setStatus("idle");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        inert={!open}
        className={`fixed inset-0 z-[60] bg-ink/55 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Card */}
      <div
        onClick={onClose}
        inert={!open}
        className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-4 py-10 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-popup-title"
          onClick={(e) => e.stopPropagation()}
          className={`relative my-auto w-full max-w-lg shrink-0 overflow-visible transition-transform duration-300 ease-spritz ${
            open ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
        >
          {/* Discount sticker breaks the top-left edge of the card. */}
          <div className="pointer-events-none absolute -left-2 -top-5 z-10 md:-left-6">
            <Sticker tilt={-8} variant="fill" fill="var(--sp-yellow)">
              {t("sticker")}
            </Sticker>
          </div>

          <div className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-lift">
            <StripeBand color="var(--sp-red)" height={14} />

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute right-4 top-9 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-xl font-bold leading-none text-muted transition-colors hover:bg-ink/10 hover:text-ink"
            >
              ×
            </button>

            <div className="px-6 py-9 md:px-10 md:py-11">
              {status === "done" ? (
                <>
                  <p className="sp-eyebrow">{t("successEyebrow")}</p>
                  <h2
                    id="newsletter-popup-title"
                    className="sp-display mt-4 text-d-xl md:text-d-2xl"
                  >
                    {t("successTitle")}
                  </h2>
                  <p className="mt-4 max-w-sm font-sans text-base text-muted">
                    {t("successBody")}
                  </p>

                  <div className="mt-7 flex flex-col items-start gap-3 rounded-card border-2 border-dashed border-ink px-5 py-4">
                    <span className="sp-eyebrow">{t("codeLabel")}</span>
                    <span className="font-sans text-2xl font-bold tracking-[0.18em] text-ink">
                      {code}
                    </span>
                  </div>

                  <div className="mt-7">
                    <Cta href="/bundle" variant="primary" onClick={onClose}>
                      {t("shopCta")}
                    </Cta>
                  </div>
                </>
              ) : (
                <>
                  <p className="sp-eyebrow">{t("eyebrow")}</p>
                  <h2
                    id="newsletter-popup-title"
                    className="sp-display mt-4 text-d-xl md:text-d-2xl"
                  >
                    {t("title")} <Mark color="var(--sp-yellow)">{t("titleEm")}</Mark>
                  </h2>
                  <p className="mt-4 max-w-sm font-sans text-base text-muted">
                    {t("body")}
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7" noValidate>
                    <label className="sr-only" htmlFor="newsletter-popup-email">
                      {t("emailLabel")}
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        ref={inputRef}
                        id="newsletter-popup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        aria-invalid={error ? true : undefined}
                        aria-describedby={
                          error ? "newsletter-popup-error" : undefined
                        }
                        placeholder={t("emailPlaceholder")}
                        className="flex-1 rounded-full border-2 border-ink bg-paper px-5 py-3 font-sans text-base placeholder:text-muted focus:outline-none focus-visible:outline-none"
                      />
                      <Cta
                        type="submit"
                        variant="primary"
                        aria-label={t("submit")}
                      >
                        {status === "sending" ? t("sending") : t("submit")}
                      </Cta>
                    </div>

                    {error && (
                      <p
                        id="newsletter-popup-error"
                        role="alert"
                        className="mt-3 font-sans text-sm font-bold text-red"
                      >
                        {error}
                      </p>
                    )}
                  </form>

                  <p className="sp-eyebrow mt-6">{t("footnote")}</p>
                </>
              )}
            </div>

            <StripeBand color="var(--sp-red)" height={14} />
          </div>
        </div>
      </div>
    </>
  );
}
