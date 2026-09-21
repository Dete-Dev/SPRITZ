/**
 * The SPRITZ catalogue — 22 inspired-by ("dupe") eau de parfum.
 *
 * Source of truth for names, note words, label colourways and the designer
 * fragrance each one answers to: the label artwork in `brand/labels/`. Accents
 * are sampled straight from each label's printed stripe, so a card always
 * matches its bottle. Product shots come from `brand/bottle-photos.zip`.
 *
 * - `name` / `noteWords` are NOT translated — they are printed on the glass.
 * - `inspiredBy` names the designer fragrance the scent answers to. This is the
 *   "best of the dupes" positioning; see README note on comparative advertising.
 * - `price` is the line price from Financiar/perfume_sku_calculator.xlsx.
 * - `hasStory` marks the five with hand-written editorial in messages/*.json.
 *   The rest render from label facts only until that copy is written.
 * - `retailPrice` is the designer original's approximate EUR street price,
 *   hand-estimated from EU retailer listings (not live data). It only feeds
 *   the "€X cheaper than the original" sticker — round numbers on purpose.
 */

export type ScentFamily = "fresh" | "floral" | "warm" | "sweet";
export type ScentGender = "her" | "him" | "unisex";

export interface Scent {
  key: string;
  /** Big studio shot for the product page. */
  hero: string;
  /** Same shot, card size. */
  clean: string;
  /** Ordered images for the gallery. */
  gallery: string[];
  /** Label name, exactly as printed on the bottle. */
  name: string;
  /** The note words inside `name` that print bold on the label. */
  noteWords: string[];
  /** The designer fragrance this one answers to. */
  inspiredBy: string;
  /** Scent family, used by the shop filter chips. */
  family: ScentFamily;
  /** Who the designer original is marketed to; "unisex" when both. */
  gender: ScentGender;
  /** Approx. EUR retail of the original (see header note). */
  retailPrice: number;
  /** Colour sampled from the printed label stripe. */
  accent: string;
  /** Same colour, used for stripes, sprays and card bands. */
  stripe: string;
  /** Price in EUR. */
  price: number;
  size: string;
  /** True when messages/*.json carries a story and a full note pyramid. */
  hasStory: boolean;
  /**
   * Shopify product variant ID (GID) used by AddToCartButton.
   *
   * Empty until the products exist in Shopify admin — the cart UI then
   * short-circuits to a "store launching soon" notice instead of calling the
   * Storefront API. Format once filled in:
   * `gid://shopify/ProductVariant/1234567890`
   */
  shopifyVariantId: string;
  /**
   * Variant ID for the 50ml + 15ml Travel Set (catalog spec §1).
   *
   * Same story as `shopifyVariantId`: undefined until the variant exists in
   * Shopify admin, at which point the Travel Set option goes live on its own.
   * Priced by `travelSetPrice()` in ./sizes — the admin price must match.
   */
  travelVariantId?: string;
  /**
   * Variant ID for the loose 15ml, used only inside the build-your-own sets
   * (catalog spec products 34 and 35). Not offered on the product page —
   * a 15ml is never sold on its own, only as part of a set.
   */
  ml15VariantId?: string;
}

export const SCENTS: Scent[] = [
  {
    key: "mer-bergamote",
    hero: "/images/scents/mer-bergamote/hero.webp",
    clean: "/images/scents/mer-bergamote/clean.webp",
    gallery: ["/images/scents/mer-bergamote/hero.webp", "/images/scents/mer-bergamote/clean.webp"],
    name: "âme de mer et bergamote",
    noteWords: ["mer", "bergamote"],
    inspiredBy: "Armani Acqua di Gio Parfum",
    family: "fresh",
    gender: "him",
    retailPrice: 130,
    accent: "#3bc7f9",
    stripe: "#3bc7f9",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "citron-cardamome",
    hero: "/images/scents/citron-cardamome/hero.webp",
    clean: "/images/scents/citron-cardamome/clean.webp",
    gallery: ["/images/scents/citron-cardamome/hero.webp", "/images/scents/citron-cardamome/clean.webp"],
    name: "éclat de citron et cardamome",
    noteWords: ["citron", "cardamome"],
    inspiredBy: "Azzaro Wanted",
    family: "fresh",
    gender: "him",
    retailPrice: 105,
    accent: "#c8d32b",
    stripe: "#c8d32b",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "cognac-bergamote",
    hero: "/images/scents/cognac-bergamote/hero.webp",
    clean: "/images/scents/cognac-bergamote/clean.webp",
    gallery: ["/images/scents/cognac-bergamote/hero.webp", "/images/scents/cognac-bergamote/clean.webp"],
    name: "essence de cognac et bergamote",
    noteWords: ["cognac", "bergamote"],
    inspiredBy: "Kilian Angels' Share On The Rocks",
    family: "warm",
    gender: "unisex",
    retailPrice: 230,
    accent: "#d58335",
    stripe: "#d58335",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "amande-tonka",
    hero: "/images/scents/amande-tonka/hero.webp",
    clean: "/images/scents/amande-tonka/clean.webp",
    gallery: ["/images/scents/amande-tonka/hero.webp", "/images/scents/amande-tonka/clean.webp"],
    name: "âme de amande et tonka",
    noteWords: ["amande", "tonka"],
    inspiredBy: "Carolina Herrera Good Girl Velvet Fatale",
    family: "sweet",
    gender: "her",
    retailPrice: 120,
    accent: "#7c1a3a",
    stripe: "#7c1a3a",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "cedre-menthe",
    hero: "/images/scents/cedre-menthe/hero.webp",
    clean: "/images/scents/cedre-menthe/clean.webp",
    gallery: ["/images/scents/cedre-menthe/hero.webp", "/images/scents/cedre-menthe/clean.webp"],
    name: "bois de cèdre et menthe",
    noteWords: ["cèdre", "menthe"],
    inspiredBy: "Chanel Bleu de Chanel",
    family: "fresh",
    gender: "him",
    retailPrice: 145,
    accent: "#35b68d",
    stripe: "#35b68d",
    price: 100,
    size: "50ml",
    hasStory: true,
    shopifyVariantId: "",
  },
  {
    key: "ylang-jasmin",
    hero: "/images/scents/ylang-jasmin/hero.webp",
    clean: "/images/scents/ylang-jasmin/clean.webp",
    gallery: ["/images/scents/ylang-jasmin/hero.webp", "/images/scents/ylang-jasmin/clean.webp"],
    name: "voile de ylang et jasmin",
    noteWords: ["ylang", "jasmin"],
    inspiredBy: "Chanel No. 5",
    family: "floral",
    gender: "her",
    retailPrice: 160,
    accent: "#c99b2d",
    stripe: "#c99b2d",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "ananas-bouleau",
    hero: "/images/scents/ananas-bouleau/hero.webp",
    clean: "/images/scents/ananas-bouleau/clean.webp",
    gallery: ["/images/scents/ananas-bouleau/hero.webp", "/images/scents/ananas-bouleau/clean.webp"],
    name: "voile d'ananas et bouleau",
    noteWords: ["ananas", "bouleau"],
    inspiredBy: "Creed Absolu Aventus",
    family: "fresh",
    gender: "him",
    retailPrice: 330,
    accent: "#dac249",
    stripe: "#dac249",
    price: 100,
    size: "50ml",
    hasStory: true,
    shopifyVariantId: "",
  },
  {
    key: "oud-safran",
    hero: "/images/scents/oud-safran/hero.webp",
    clean: "/images/scents/oud-safran/clean.webp",
    gallery: ["/images/scents/oud-safran/hero.webp", "/images/scents/oud-safran/clean.webp"],
    name: "bois de oud et safran",
    noteWords: ["oud", "safran"],
    inspiredBy: "Creed Oud Zarian",
    family: "warm",
    gender: "unisex",
    retailPrice: 350,
    accent: "#c97d2b",
    stripe: "#c97d2b",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "gardenia-mandarin",
    hero: "/images/scents/gardenia-mandarin/hero.webp",
    clean: "/images/scents/gardenia-mandarin/clean.webp",
    gallery: ["/images/scents/gardenia-mandarin/hero.webp", "/images/scents/gardenia-mandarin/clean.webp"],
    name: "bouquet de gardénia et mandarin",
    noteWords: ["gardénia", "mandarin"],
    inspiredBy: "Gucci Flora Gorgeous Gardenia Intense",
    family: "floral",
    gender: "her",
    retailPrice: 140,
    accent: "#fda654",
    stripe: "#fda654",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "cerise-rose",
    hero: "/images/scents/cerise-rose/hero.webp",
    clean: "/images/scents/cerise-rose/clean.webp",
    gallery: ["/images/scents/cerise-rose/hero.webp", "/images/scents/cerise-rose/clean.webp"],
    name: "voile de cerise et rose",
    noteWords: ["cerise", "rose"],
    inspiredBy: "Kayali Lovefest Burning Cherry",
    family: "sweet",
    gender: "her",
    retailPrice: 120,
    accent: "#fa7db3",
    stripe: "#fa7db3",
    price: 100,
    size: "50ml",
    hasStory: true,
    shopifyVariantId: "",
  },
  {
    key: "iris-bergamote",
    hero: "/images/scents/iris-bergamote/hero.webp",
    clean: "/images/scents/iris-bergamote/clean.webp",
    gallery: ["/images/scents/iris-bergamote/hero.webp", "/images/scents/iris-bergamote/clean.webp"],
    name: "âme de iris et bergamote",
    noteWords: ["iris", "bergamote"],
    inspiredBy: "Lancôme La Vie Est Belle",
    family: "sweet",
    gender: "her",
    retailPrice: 130,
    accent: "#c66a8b",
    stripe: "#c66a8b",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "safran-ambre",
    hero: "/images/scents/safran-ambre/hero.webp",
    clean: "/images/scents/safran-ambre/clean.webp",
    gallery: ["/images/scents/safran-ambre/hero.webp", "/images/scents/safran-ambre/clean.webp"],
    name: "essence de safran et ambre",
    noteWords: ["safran", "ambre"],
    inspiredBy: "MFK Baccarat Rouge 540",
    family: "warm",
    gender: "unisex",
    retailPrice: 250,
    accent: "#951929",
    stripe: "#951929",
    price: 100,
    size: "50ml",
    hasStory: true,
    shopifyVariantId: "",
  },
  {
    key: "jasmin-cashmeran",
    hero: "/images/scents/jasmin-cashmeran/hero.webp",
    clean: "/images/scents/jasmin-cashmeran/clean.webp",
    gallery: ["/images/scents/jasmin-cashmeran/hero.webp", "/images/scents/jasmin-cashmeran/clean.webp"],
    name: "essence de jasmin et cashmeran",
    noteWords: ["jasmin", "cashmeran"],
    inspiredBy: "Mugler Alien Extraintense",
    family: "floral",
    gender: "her",
    retailPrice: 130,
    accent: "#8b54a5",
    stripe: "#8b54a5",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "cuir-menthe",
    hero: "/images/scents/cuir-menthe/hero.webp",
    clean: "/images/scents/cuir-menthe/clean.webp",
    gallery: ["/images/scents/cuir-menthe/hero.webp", "/images/scents/cuir-menthe/clean.webp"],
    name: "voile de cuir et menthe",
    noteWords: ["cuir", "menthe"],
    inspiredBy: "Paco Rabanne 1 Million Gold for Him",
    family: "warm",
    gender: "him",
    retailPrice: 125,
    accent: "#6b492e",
    stripe: "#6b492e",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "poivre-ambre",
    hero: "/images/scents/poivre-ambre/hero.webp",
    clean: "/images/scents/poivre-ambre/clean.webp",
    gallery: ["/images/scents/poivre-ambre/hero.webp", "/images/scents/poivre-ambre/clean.webp"],
    name: "voile de poivre noir et ambre",
    noteWords: ["poivre noir", "ambre"],
    inspiredBy: "Paco Rabanne Invictus Victory",
    family: "warm",
    gender: "him",
    retailPrice: 115,
    accent: "#136a39",
    stripe: "#136a39",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "oud-santal",
    hero: "/images/scents/oud-santal/hero.webp",
    clean: "/images/scents/oud-santal/clean.webp",
    gallery: ["/images/scents/oud-santal/hero.webp", "/images/scents/oud-santal/clean.webp"],
    name: "bois de oud et santal",
    noteWords: ["oud", "santal"],
    inspiredBy: "Tom Ford Oud Wood",
    family: "warm",
    gender: "unisex",
    retailPrice: 280,
    accent: "#c97d5a",
    stripe: "#c97d5a",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "menthe-tonka",
    hero: "/images/scents/menthe-tonka/hero.webp",
    clean: "/images/scents/menthe-tonka/clean.webp",
    gallery: ["/images/scents/menthe-tonka/hero.webp", "/images/scents/menthe-tonka/clean.webp"],
    name: "éclat de menthe et tonka",
    noteWords: ["menthe", "tonka"],
    inspiredBy: "Versace Eros",
    family: "fresh",
    gender: "him",
    retailPrice: 115,
    accent: "#69c788",
    stripe: "#69c788",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "rose-jasmin",
    hero: "/images/scents/rose-jasmin/hero.webp",
    clean: "/images/scents/rose-jasmin/clean.webp",
    gallery: ["/images/scents/rose-jasmin/hero.webp", "/images/scents/rose-jasmin/clean.webp"],
    name: "essence de rose et jasmin",
    noteWords: ["rose", "jasmin"],
    inspiredBy: "Xerjoff Alexandria II",
    family: "floral",
    gender: "unisex",
    retailPrice: 380,
    accent: "#b5268c",
    stripe: "#b5268c",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "lavande-vanille",
    hero: "/images/scents/lavande-vanille/hero.webp",
    clean: "/images/scents/lavande-vanille/clean.webp",
    gallery: ["/images/scents/lavande-vanille/hero.webp", "/images/scents/lavande-vanille/clean.webp"],
    name: "fleur de lavande et vanille",
    noteWords: ["lavande", "vanille"],
    inspiredBy: "YSL Libre",
    family: "floral",
    gender: "her",
    retailPrice: 150,
    accent: "#8f7fc4",
    stripe: "#8f7fc4",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "truffe-chocolat",
    hero: "/images/scents/truffe-chocolat/hero.webp",
    clean: "/images/scents/truffe-chocolat/clean.webp",
    gallery: ["/images/scents/truffe-chocolat/hero.webp", "/images/scents/truffe-chocolat/clean.webp"],
    name: "nuit de truffe et chocolat",
    noteWords: ["truffe", "chocolat"],
    inspiredBy: "Tom Ford Black Orchid",
    family: "sweet",
    gender: "unisex",
    retailPrice: 175,
    accent: "#6c4225",
    stripe: "#6c4225",
    price: 100,
    size: "50ml",
    hasStory: true,
    shopifyVariantId: "",
  },
  {
    key: "cuir-tabac",
    hero: "/images/scents/cuir-tabac/hero.webp",
    clean: "/images/scents/cuir-tabac/clean.webp",
    gallery: ["/images/scents/cuir-tabac/hero.webp", "/images/scents/cuir-tabac/clean.webp"],
    name: "feu de cuir et tabac",
    noteWords: ["cuir", "tabac"],
    inspiredBy: "Viktor & Rolf Spicebomb Dark Leather",
    family: "warm",
    gender: "him",
    retailPrice: 130,
    accent: "#8a4a22",
    stripe: "#8a4a22",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
  {
    key: "vanille-cafe",
    hero: "/images/scents/vanille-cafe/hero.webp",
    clean: "/images/scents/vanille-cafe/clean.webp",
    gallery: ["/images/scents/vanille-cafe/hero.webp", "/images/scents/vanille-cafe/clean.webp"],
    name: "noir de vanille et café",
    noteWords: ["vanille", "café"],
    inspiredBy: "YSL Black Opium",
    family: "sweet",
    gender: "her",
    retailPrice: 140,
    accent: "#caa42b",
    stripe: "#caa42b",
    price: 100,
    size: "50ml",
    hasStory: false,
    shopifyVariantId: "",
  },
];


/**
 * Editorial selections used by the shop sub-menu and the homepage rails.
 * These are curation, not computed metrics — the shop has no order history
 * to rank by yet, so the house picks the shelf.
 */
export const BESTSELLER_KEYS: readonly string[] = [
  "safran-ambre",
  "truffe-chocolat",
  "cerise-rose",
  "oud-santal",
  "mer-bergamote",
  "vanille-cafe",
];

/** Most recent additions to the catalogue, newest first. */
export const NEW_ARRIVAL_KEYS: readonly string[] = [
  "truffe-chocolat",
  "safran-ambre",
  "cerise-rose",
  "ananas-bouleau",
];

/**
 * Fragrantica lookup for the designer original a scent answers to.
 *
 * Built as a search URL rather than a stored per-product id: there is no
 * Fragrantica id in the catalogue, and a search on the exact designer name
 * always resolves, where a hand-copied id would rot.
 */
export function fragranticaUrl(inspiredBy: string): string {
  return `https://www.fragrantica.com/search/?query=${encodeURIComponent(inspiredBy)}`;
}

/** Percent saved against the designer original, rounded. */
export function savingPercent(scent: Scent): number {
  if (scent.retailPrice <= 0) return 0;
  return Math.round(((scent.retailPrice - scent.price) / scent.retailPrice) * 100);
}

export const SCENT_KEYS = SCENTS.map((s) => s.key);

export const NOTE_LAYERS = ["top", "heart", "base"] as const;
export type NoteLayer = (typeof NOTE_LAYERS)[number];
