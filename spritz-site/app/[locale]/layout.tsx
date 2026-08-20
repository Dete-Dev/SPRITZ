import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import FloatingHeader from "@/components/FloatingHeader";
import HeaderThemeWatcher from "@/components/HeaderThemeWatcher";
import JumpingWordmark from "@/components/JumpingWordmark";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { BundleProvider } from "@/components/bundle/BundleProvider";
import BundleBar from "@/components/bundle/BundleBar";
import "../globals.css";

/** Static-render every supported locale at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Arimo + Alegreya are pulled in by app/tokens/fonts.css. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <CartProvider>
            <BundleProvider>
              <SmoothScroll />
              <HeaderThemeWatcher />
              <FloatingHeader />
              <JumpingWordmark />
              {children}
              <CartDrawer />
              <BundleBar />
            </BundleProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
