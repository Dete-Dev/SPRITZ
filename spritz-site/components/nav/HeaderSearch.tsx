"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";

/** Diacritic-insensitive haystack prep ("âme" matches "ame"). */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * The search field inside the header toolbar.
 *
 * Answers both directions of the dupe question: type a designer name
 * ("Chanel", "Tom Ford") to find our answer to it, or type one of our bottle
 * names to jump straight to its page. Two characters minimum, six results.
 */
export default function HeaderSearch() {
  const t = useTranslations("heroBar");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const nq = norm(q.trim());
  const results =
    nq.length >= 2
      ? SCENTS.filter(
          (s) => norm(s.name).includes(nq) || norm(s.inspiredBy).includes(nq),
        ).slice(0, 6)
      : [];

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2 rounded-full border-2 border-line bg-paper-2 py-1.5 pl-4 pr-3 transition-colors focus-within:border-ink">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={t("shortPlaceholder")}
          aria-label={t("searchLabel")}
          className="w-16 min-w-0 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-muted sm:w-28 lg:w-40 [&::-webkit-search-cancel-button]:hidden"
        />
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>
      </div>

      {open && nq.length >= 2 ? (
        <div className="absolute right-0 top-full z-[60] mt-3 w-[min(24rem,80vw)] overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
          {results.length === 0 ? (
            <p className="px-5 py-4 font-sans text-sm text-muted">
              {t("noResults")}
            </p>
          ) : (
            <ul>
              {results.map((s) => (
                <li key={s.key}>
                  <Link
                    href={`/scents/${s.key}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-paper-2"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: s.accent }}
                      />
                      <span className="truncate font-sans text-sm font-semibold text-ink">
                        {s.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-sans text-xs text-muted">
                      {t("inspiredBy", { name: s.inspiredBy })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
