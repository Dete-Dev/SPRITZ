"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Disclosure shell for the header menus — brief §10 and §16.
 *
 * Opens on click, and on hover for pointer devices; closes on Escape, on an
 * outside pointerdown, and whenever a sibling menu opens. That last rule is
 * held by a tiny module-level register rather than by listener ordering,
 * because a keyboard activation fires `click` with no pointer event and the
 * two menus would otherwise both sit open.
 *
 * The panel floats above the pill bar and the travelling wordmark (both z-50),
 * hence z-[60]. It is a floating panel, never a bar — the header keeps its
 * locked no-banner layout.
 */

/** id of the menu currently open, and everyone who wants to know. */
let openMenuId: string | null = null;
const subscribers = new Set<(id: string | null) => void>();

function claimOpen(id: string | null): void {
  openMenuId = id;
  subscribers.forEach((fn) => fn(id));
}

export default function NavMenu({
  label,
  children,
  align = "left",
  panelClassName = "",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClaim = (id: string | null) => setOpen(id === panelId);
    subscribers.add(onClaim);

    function onPointerDown(e: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        if (openMenuId === panelId) claimOpen(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && openMenuId === panelId) claimOpen(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      subscribers.delete(onClaim);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelId]);

  const hoverable = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  return (
    <div
      ref={boxRef}
      className="pointer-events-auto relative flex"
      onMouseEnter={() => hoverable() && claimOpen(panelId)}
      onMouseLeave={() => hoverable() && claimOpen(null)}
    >
      <button
        type="button"
        onClick={() => claimOpen(open ? null : panelId)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-red"
      >
        {label}
        <span
          aria-hidden
          className={`text-[8px] transition-transform duration-200 ease-spritz ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            /* Any link inside navigates — close so the panel is not still
               hanging open on the next page. */
            onClick={() => claimOpen(null)}
            className={`absolute top-full z-[60] mt-3 overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard ${
              align === "right" ? "right-0" : "left-0"
            } ${panelClassName}`}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
