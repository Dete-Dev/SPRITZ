import { getTranslations, setRequestLocale } from "next-intl/server";
import VideoHero from "@/components/VideoHero";
import BundleBuilder from "@/components/bundle/BundleBuilder";
import StorySection from "@/components/StorySection";
import MarqueeQuote from "@/components/MarqueeQuote";
import FragranceSection from "@/components/FragranceSection";
import ScentFinder from "@/components/finder/ScentFinder";
import CraftSection from "@/components/CraftSection";
import ReserveSection from "@/components/ReserveSection";
import SiteFooter from "@/components/SiteFooter";

/**
 * Page-wide gradient lives on `main#top` (see globals.css). Every section is
 * transparent so the gradient flows continuously underneath. The page opens
 * directly on the video hero.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="top">
      <VideoHero />
      <section className="px-4 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto max-w-5xl">
          <BundleBuilder />
        </div>
      </section>
      <StorySection />
      <MarqueeQuote text={t("marquee")} />
      <FragranceSection />
      <ScentFinder />
      <CraftSection />
      <ReserveSection />
      <SiteFooter />
    </main>
  );
}
