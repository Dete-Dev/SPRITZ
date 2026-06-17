/**
 * Structural data for SPRITZ's five scents.
 *
 * - Translatable strings (eyebrow, notes, story paragraphs, ingredient names)
 *   live in messages/{locale}.json.
 * - Product names (`name`, `nameDisplay`) are NOT translated — they're printed
 *   on the physical bottles.
 * - `price` is a placeholder; replace once pricing is final.
 */

export interface Scent {
  key: string;
  /** Image used for the dramatic hero shot (dewy, with props). */
  hero: string;
  /** 2x retina version. */
  heroRetina: string;
  /** Clean isolated studio shot. */
  clean: string;
  /** Ordered list of every image we have of this scent — drives the gallery. */
  gallery: string[];
  /** Label name (printed on bottle). */
  name: string;
  /** Same name line-broken for big display headlines. */
  nameDisplay: string;
  /** Label color — drives accent tints. */
  accent: string;
  /** Price in RON. Placeholder until pricing finalised. */
  price: number;
  /** Size descriptor key for translation, e.g. "50ml". */
  size: string;
  /**
   * Shopify product variant ID (GID) used by AddToCartButton.
   *
   * Until you create the products in Shopify admin this stays empty —
   * the cart UI then short-circuits to a "store launching soon" notice
   * instead of attempting a Storefront API call.
   *
   * Format once filled in: `gid://shopify/ProductVariant/1234567890`
   * (copy from Shopify admin → Products → variant URL or REST API id).
   */
  shopifyVariantId: string;
}

export const SCENTS: Scent[] = [
  {
    key: "ananas",
    hero: "/images/scents/ananas/hero.webp",
    heroRetina: "/images/scents/ananas/hero@2x.webp",
    clean: "/images/scents/ananas/clean.webp",
    gallery: [
      "/images/scents/ananas/hero.webp",
      "/images/scents/ananas/clean.webp",
      "/images/scents/ananas/dewy-alt.webp",
    ],
    name: "voile d'ananas et bouleau",
    nameDisplay: "voile\nd'ananas\net bouleau",
    accent: "#d9b675",
    price: 420,
    size: "50ml",
    shopifyVariantId: "",
  },
  {
    key: "cerise",
    hero: "/images/scents/cerise/hero.webp",
    heroRetina: "/images/scents/cerise/hero@2x.webp",
    clean: "/images/scents/cerise/clean.webp",
    gallery: [
      "/images/scents/cerise/hero.webp",
      "/images/scents/cerise/clean.webp",
    ],
    name: "voile de cerise et rose",
    nameDisplay: "voile\nde cerise\net rose",
    accent: "#e89bb4",
    price: 420,
    size: "50ml",
    shopifyVariantId: "",
  },
  {
    key: "menthe",
    hero: "/images/scents/menthe/hero.webp",
    heroRetina: "/images/scents/menthe/hero@2x.webp",
    clean: "/images/scents/menthe/clean.webp",
    gallery: [
      "/images/scents/menthe/hero.webp",
      "/images/scents/menthe/clean-props.webp",
      "/images/scents/menthe/clean.webp",
    ],
    name: "bois de cèdre et menthe",
    nameDisplay: "bois\nde cèdre\net menthe",
    accent: "#7ec4b7",
    price: 420,
    size: "50ml",
    shopifyVariantId: "",
  },
  {
    key: "safran",
    hero: "/images/scents/safran/hero.webp",
    heroRetina: "/images/scents/safran/hero@2x.webp",
    clean: "/images/scents/safran/clean.webp",
    gallery: [
      "/images/scents/safran/hero.webp",
      "/images/scents/safran/clean-props.webp",
      "/images/scents/safran/clean-props-alt.webp",
      "/images/scents/safran/clean.webp",
    ],
    name: "essence de safran et ambre",
    nameDisplay: "essence\nde safran\net ambre",
    accent: "#c45a4f",
    price: 460,
    size: "50ml",
    shopifyVariantId: "",
  },
  {
    key: "truffe",
    hero: "/images/scents/truffe/hero.webp",
    heroRetina: "/images/scents/truffe/hero@2x.webp",
    clean: "/images/scents/truffe/clean.webp",
    gallery: [
      "/images/scents/truffe/hero.webp",
      "/images/scents/truffe/dewy-alt.webp",
      "/images/scents/truffe/clean.webp",
    ],
    name: "nuit de truffe et chocolat",
    nameDisplay: "nuit\nde truffe\net chocolat",
    accent: "#8a6238",
    price: 480,
    size: "50ml",
    shopifyVariantId: "",
  },
];

export const SCENT_KEYS = SCENTS.map((s) => s.key);

export const NOTE_LAYERS = ["top", "heart", "base"] as const;
export type NoteLayer = (typeof NOTE_LAYERS)[number];
