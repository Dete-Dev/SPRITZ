"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import ScentCard from "@/components/ui/ScentCard";
import { Mark } from "@/components/ui/vandal";
import { enterStagger } from "@/lib/motion";
import { SCENTS } from "@/lib/scents";

/**
 * Horizontal product rail — brief §3 (Best Sellers) and §7 (Featured).
 *
 * Both sections are the same object: a swipeable row of 4-6 bottles with a
 * message top-left and round arrow buttons top-right. One component, two
 * call sites with different scent keys, so the two rows can never drift
 * apart visually.
 *
 * Scrolling is native (scroll-snap + overflow-x), so touch swipe works for
 * free; the arrows just nudge scrollLeft by one card. Nothing here ever writes
 * scrollLeft from a scroll handler: that would fight the swipe, the arrows'
 * smooth scroll, the snap points and `scrollIntoView` on keyboard focus.
 *
 * The two call sites are the same object, so they are given different
 * behaviour rather than different colours, or the page reads the same section
 * twice. §3 performs (`pan`: the heading travels as the section crosses, the
 * shelf stays still). §7 waits (`stagger` + `tilt`: the cards assemble on
 * entry, then answer the pointer).
 */
export default function ScentRail({
  scentKeys,
  title,
  titleMark,
  markColor,
  badges = {},
  surface = "paper",
  id,
  pan = false,
  stagger = false,
  tilt = false,
}: {
  /** Scent keys, in display order. */
  scentKeys: readonly string[];
  title: string;
  /** Trailing words that get the highlighter treatment. */
  titleMark?: string;
  markColor?: string;
  /** Optional corner sticker per scent key. */
  badges?: Record<string, string>;
  surface?: "paper" | "paper-2";
  id?: string;
  /** Heading travels laterally across the section's crossing. */
  pan?: boolean;
  /** Cards assemble one after another the first time the rail scrolls in. */
  stagger?: boolean;
  /** Cards answer the pointer. Fine-pointer devices only, by CSS. */
  tilt?: boolean;
}) {
  const tFive = useTranslations("five");
  const tCommon = useTranslations("common");
  const tRail = useTranslations("rail");

  const railRef = useRef<HTMLUListElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const reduce = useReducedMotion();

  // Lateral travel for the heading only. The rail underneath keeps its native
  // horizontal scroll; driving that from the wheel would break swipe, snap and
  // the arrows at once.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingX = useTransform(scrollYProgress, [0, 0.5, 1], ["5vw", "0vw", "-5vw"]);

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  // Same one-shot entrance the drops grid uses. enterStagger carries its own
  // reduced-motion guard and strips `.sp-pre-enter` either way.
  useEffect(() => {
    if (!stagger) return;
    const list = railRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        enterStagger(list.querySelectorAll(":scope > li"));
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(list);
    return () => io.disconnect();
  }, [stagger]);

  function nudge(direction: 1 | -1) {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(":scope > li");
    const step = card ? card.clientWidth + 12 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  const scents = scentKeys
    .map((key) => SCENTS.find((s) => s.key === key))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  /** Writes the angles straight onto the element. Routing a pointermove
   *  through React state would re-render the whole rail on every frame. */
  function tiltMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const dx = (event.clientX - box.left) / box.width - 0.5;
    const dy = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--sp-tilt-x", `${(-dy * 6).toFixed(2)}deg`);
    el.style.setProperty("--sp-tilt-y", `${(dx * 6).toFixed(2)}deg`);
  }

  function tiltReset(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty("--sp-tilt-x");
    event.currentTarget.style.removeProperty("--sp-tilt-y");
  }

  const arrow =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-lg leading-none text-ink shadow-hard-sm transition-all duration-150 ease-spritz enabled:hover:-translate-y-px disabled:opacity-30";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${surface === "paper" ? "bg-paper" : "bg-paper-2"} pb-6 pt-10`}
    >
      <div className="mx-auto max-w-6xl px-gutter">
        {/* Brief §3 — the message sits top-left, arrows top-right. The sm
            padding reserves the arrows' width so a long title never runs
            underneath them. */}
        <div className="relative">
          {/* `overflow-x-clip`, not `overflow-hidden`: the highlighter swash
              under a marked word sits below the text box and `hidden` would
              shear it off. Clipping only the travelling axis keeps it. */}
          <div className="overflow-x-clip">
            <motion.h2
              className="sp-display text-left text-d-2xl sm:pr-28"
              style={pan && !reduce ? { x: headingX } : undefined}
            >
              {title}
              {titleMark ? (
                <>
                  {" "}
                  <Mark color={markColor ?? "var(--sp-yellow)"}>{titleMark}</Mark>
                </>
              ) : null}
            </motion.h2>
          </div>

          <div className="absolute right-0 top-1/2 hidden shrink-0 -translate-y-1/2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={tRail("previous")}
              className={arrow}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={tRail("next")}
              className={arrow}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed track so cards run to the screen edge as they scroll. */}
      <ul
        ref={railRef}
        onScroll={syncEdges}
        className="sp-rail mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-gutter pb-2"
      >
        {scents.map((scent, idx) => (
          <li
            key={scent.key}
            className={`w-[15rem] shrink-0 snap-start sm:w-[16rem] lg:w-[17.5rem]${
              stagger ? " sp-pre-enter" : ""
            }`}
          >
            <TiltShell
              on={tilt}
              onPointerMove={tiltMove}
              onPointerLeave={tiltReset}
            >
            <ScentCard
              scent={scent}
              priceLabel={tCommon("price", { price: scent.price })}
              inspiredByLabel={tCommon("inspiredBy", { name: scent.inspiredBy })}
              /* Below €20 the flex reads as an anti-flex — skip the banner. */
              savingsLabel={
                scent.retailPrice - scent.price >= 20
                  ? tCommon("cheaperThan", {
                      amount: scent.retailPrice - scent.price,
                    })
                  : undefined
              }
              note={tFive(`shortNotes.${scent.key}`)}
              badge={badges[scent.key]}
              priority={idx < 2}
            />
            </TiltShell>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The tilt lives on a wrapper inside the <li>, never on the <li> itself:
 * enterStagger leaves an inline `transform` on whatever it animates, and an
 * inline transform beats the class, so the two would cancel each other out on
 * the one rail that uses both.
 */
function TiltShell({
  on,
  children,
  onPointerMove,
  onPointerLeave,
}: {
  on: boolean;
  children: React.ReactNode;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  if (!on) return <>{children}</>;
  return (
    <div
      className="sp-tilt"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
