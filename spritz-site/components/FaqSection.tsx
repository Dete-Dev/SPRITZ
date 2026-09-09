import { useTranslations } from "next-intl";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { Mark } from "@/components/ui/vandal";

/** Question keys, in display order. Copy lives in messages/*.json → faq. */
const QUESTIONS = ["dupe", "lasting", "size", "bundle", "shipping", "returns"] as const;

/**
 * The FAQ, on the shared <Accordion/> rows so it and the product page keep
 * the same disclosure treatment. `limit` trims the list — the homepage shows
 * three per the brief, the rest of the site can show all six.
 */
export default function FaqSection({ limit }: { limit?: number } = {}) {
  const t = useTranslations("faq");
  const questions = limit ? QUESTIONS.slice(0, limit) : QUESTIONS;

  const items: AccordionItem[] = questions.map((q) => ({
    id: q,
    title: t(`items.${q}.q`),
    body: (
      <p className="font-sans text-base text-muted">{t(`items.${q}.a`)}</p>
    ),
  }));

  return (
    <section className="bg-paper px-gutter py-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="sp-display text-center text-d-2xl">
          {t("headline")} <Mark color="var(--sp-blue)">{t("headlineEm")}</Mark>
        </h2>

        <Accordion items={items} className="mt-10" />
      </div>
    </section>
  );
}
