import { createStorefrontApiClient } from "@shopify/storefront-api-client";

/**
 * Shopify Storefront API client.
 *
 * Reads `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
 * from `.env.local`. These are public — the Storefront token is scoped to
 * read-only operations meant for client-side use (cart, products, etc.).
 *
 * Until the env vars are filled in (Shopify store doesn't exist yet),
 * `getClient()` returns null and cart/checkout operations are no-ops.
 * The UI renders normally; clicking "Add to bag" just opens an alert
 * advising that the store is being prepared.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

let cached: ReturnType<typeof createStorefrontApiClient> | null = null;

export function getClient() {
  if (!DOMAIN || !TOKEN || DOMAIN.includes("your-store")) return null;
  if (!cached) {
    cached = createStorefrontApiClient({
      storeDomain: DOMAIN,
      apiVersion: "2024-10",
      publicAccessToken: TOKEN,
    });
  }
  return cached;
}

export function isShopifyConfigured(): boolean {
  return getClient() !== null;
}
