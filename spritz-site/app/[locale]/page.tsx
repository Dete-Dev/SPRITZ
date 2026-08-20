import { getTranslations, setRequestLocale } from "next-intl/server";
import VideoHero from "@/components/VideoHero";
import CtaBand from "@/components/ui/CtaBand";
import BundleBuilder from "@/components/bundle/BundleBuilder";
import StorySection from "@/components/StorySection";
import MarqueeQuote from "@/components/MarqueeQuote";
import FragranceSection from "@/components/FragranceSection";
import ScentFinder from "@/components/finder/ScentFinder";
import CraftSection from "@/components/CraftSection";
import ReserveSection from "@/components/ReserveSection";
import SiteFooter from "@/components/SiteFooter";

/**
 * Landing page rhythm follows the design system: the video parallax lands in
 * a CTA, then every content block is followed by another ask, so the visitor
 * is never more than one screen from a buy button.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const b = await getTranslations("bands");

  return (
    <main id="top">
      <VideoHero />

      <section id="bundle" className="px-gutter pt-14 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <BundleBuilder />
        </div>
      </section>

      <StorySection />
      <MarqueeQuote text={t("marquee")} />

      <CtaBand
        eyebrow={b("dupes.eyebrow")}
        title={b("dupes.title")}
        titleMark={b("dupes.titleMark")}
        body={b("dupes.body")}
        primaryLabel={b("dupes.primary")}
        primaryHref="/shop"
        secondaryLabel={b("dupes.secondary")}
        secondaryHref="#bundle"
        stripe="var(--sp-blue)"
      />

      <FragranceSection />

      <CtaBand
        eyebrow={b("finder.eyebrow")}
        title={b("finder.title")}
        titleMark={b("finder.titleMark")}
        body={b("finder.body")}
        primaryLabel={b("finder.primary")}
        primaryHref="#finder"
        secondaryLabel={b("finder.secondary")}
        secondaryHref="/shop"
        stripe="var(--sp-pink)"
      />

      <ScentFinder />
      <CraftSection />

      <CtaBand
        eyebrow={b("closer.eyebrow")}
        title={b("closer.title")}
        titleMark={b("closer.titleMark")}
        body={b("closer.body")}
        primaryLabel={b("closer.primary")}
        primaryHref="/shop"
        secondaryLabel={b("closer.secondary")}
        secondaryHref="#bundle"
        stripe="var(--sp-yellow)"
        tone="ink"
      />

      <ReserveSection />
      <SiteFooter />
    </main>
  );
}
