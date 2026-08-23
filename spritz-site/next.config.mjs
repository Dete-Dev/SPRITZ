import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo lives on the Desktop, which iCloud syncs. iCloud was evicting
  // freshly-written files inside `.next/` mid-run (ENOENT on manifests →
  // random 500s). Folders named `*.nosync` are never touched by iCloud.
  // Vercel has no iCloud and expects the default ".next", so local-only.
  distDir: process.env.VERCEL ? ".next" : ".next.nosync",
  images: {
    formats: ["image/avif", "image/webp"],
    // Cart line items render product images straight from the Shopify
    // Storefront API, which serves them off cdn.shopify.com. Without this,
    // next/image throws "hostname not configured" the first time a customer
    // adds to bag — invisible until Shopify is live, then a hard 500.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default withNextIntl(nextConfig);
