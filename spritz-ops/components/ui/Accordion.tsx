/* VENDORED from spritz-site/components/ui/Accordion.tsx by scripts/sync-ds.mjs — do not edit here. */
/**
 * Disclosure rows on the vandal card language — brief §14.
 *
 * Native <details>/<summary>, so keyboard, find-in-page and screen-reader
 * behaviour come for free and nothing ships to the client. The +/− marker is
 * CSS: the summary's span rotates 45° on `group-open`.
 *
 * Extracted from FaqSection so the product page and the FAQ share one row
 * treatment instead of drifting apart.
 */
export interface AccordionItem {
  /** Stable key, also used as the React key. */
  id: string;
  title: string;
  /** Optional line under the title, visible while closed (brief §14). */
  hint?: string;
  body: React.ReactNode;
  /** Open on first paint — the brief opens Scent Notes by default. */
  defaultOpen?: boolean;
}

export default function Accordion({
  items,
  className = "",
}: {
  items: AccordionItem[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard ${className}`}
    >
      {items.map((item, idx) => (
        <details
          key={item.id}
          open={item.defaultOpen}
          className={`group ${idx > 0 ? "border-t-2 border-ink" : ""}`}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper-2 [&::-webkit-details-marker]:hidden">
            <span className="flex flex-col gap-1">
              <span className="font-sans text-sm font-bold uppercase tracking-[0.06em]">
                {item.title}
              </span>
              {item.hint ? (
                <span className="font-sans text-[13px] font-normal normal-case tracking-normal text-muted">
                  {item.hint}
                </span>
              ) : null}
            </span>
            <span
              aria-hidden
              className="mt-0.5 text-xl leading-none text-red transition-transform duration-300 ease-spritz group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="px-5 pb-6 pt-1">{item.body}</div>
        </details>
      ))}
    </div>
  );
}
