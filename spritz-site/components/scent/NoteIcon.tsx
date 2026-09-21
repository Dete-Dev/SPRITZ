/**
 * Monoline note glyphs for the scent-notes block — brief §13 asks for icons
 * next to the main notes and the Top / Middle / Base rows. No icon library:
 * a dozen 24×24 strokes, picked by keyword (EN + RO) with a leaf fallback.
 */
type Glyph =
  | "floral"
  | "citrus"
  | "fruit"
  | "wood"
  | "spice"
  | "sweet"
  | "musk"
  | "aquatic"
  | "herb"
  | "resin"
  | "leaf"
  | "top"
  | "middle"
  | "base";

const KEYWORDS: [Glyph, string[]][] = [
  ["citrus", ["bergamot", "lemon", "lamai", "citron", "orange", "portocal", "mandarin", "grapefruit", "grepfrut", "lime", "yuzu", "neroli"]],
  ["fruit", ["pear", "para", "cherry", "cirese", "cerise", "pineapple", "ananas", "blackcurrant", "coacaze", "apple", "mar", "fig", "smochin", "plum", "prun", "raspberry", "zmeur", "peach", "piersic", "berry", "fructe"]],
  ["floral", ["rose", "trandafir", "jasmin", "iasomie", "ylang", "gardenia", "iris", "orchid", "orhidee", "tuberose", "tuberoza", "lavender", "lavanda", "violet", "peony", "bujor", "lily", "crin", "flower", "floare", "flori", "blossom", "magnolia", "geranium", "muscata", "lotus"]],
  ["wood", ["cedar", "cedru", "sandalwood", "santal", "oud", "birch", "mesteacan", "vetiver", "wood", "lemn", "patchouli", "paciuli", "cashmeran", "guaiac", "cypress", "chiparos", "leather", "piele"]],
  ["spice", ["pepper", "piper", "saffron", "sofran", "cinnamon", "scortisoara", "cardamom", "cardamon", "nutmeg", "nucsoara", "ginger", "ghimbir", "clove", "cuisoare", "spice", "condiment", "tobacco", "tutun"]],
  ["sweet", ["vanilla", "vanilie", "tonka", "caramel", "praline", "pralina", "chocolate", "ciocolata", "cacao", "coffee", "cafea", "honey", "miere", "almond", "migdal", "licorice", "lemn dulce", "sugar", "zahar", "cognac", "rum", "truffle", "trufa"]],
  ["musk", ["musk", "mosc", "amber", "ambra", "ambrat", "ambergris"]],
  ["aquatic", ["marine", "sea", "mare", "salt", "sare", "water", "apa", "aquatic", "acvatic", "ozon"]],
  ["herb", ["mint", "menta", "sage", "salvie", "rosemary", "rozmarin", "basil", "busuioc", "tea", "ceai", "green", "verde", "thyme", "cimbru"]],
  ["resin", ["incense", "tamaie", "benzoin", "myrrh", "smirna", "labdanum", "resin", "rasina", "smoke", "fum"]],
];

const strip = (s: string): string =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Picks a glyph for a note word ("pink pepper", "lemn de santal", …). */
export function glyphFor(note: string): Glyph {
  const n = strip(note);
  for (const [glyph, words] of KEYWORDS) {
    if (words.some((w) => n.includes(w))) return glyph;
  }
  return "leaf";
}

/* Each path set is drawn on a 24×24 grid, stroke only. */
const PATHS: Record<Glyph, string> = {
  floral: "M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M12 9.5V4.5a2 2 0 1 1 0 0M12 14.5v5a2 2 0 1 0 0 0M9.5 12h-5a2 2 0 1 1 0 0M14.5 12h5a2 2 0 1 0 0 0",
  citrus: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7",
  fruit: "M12 8c-4 0-6 3.5-6 7s2.5 5 4 5c1 0 1.5-.5 2-.5s1 .5 2 .5c1.5 0 4-2 4-5s-2-7-6-7ZM12 8V5M12 5c1.5-1 3-1 4 0",
  wood: "M4 8h16v10H4zM4 8l2-3h12l2 3M8 8v10M12 8v10M16 8v10",
  spice: "M12 3l2.5 5.5L20 9l-4 4 1 5.5L12 16l-5 2.5L8 13 4 9l5.5-.5z",
  sweet: "M6 10c0-3 2.5-5 6-5s6 2 6 5c0 2-1 3-1 3H7s-1-1-1-3ZM7 13v6h10v-6M12 5V3",
  musk: "M12 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10ZM12 20v-6",
  aquatic: "M3 9c3-2 6-2 9 0s6 2 9 0M3 14c3-2 6-2 9 0s6 2 9 0M3 19c3-2 6-2 9 0s6 2 9 0",
  herb: "M12 21V9M12 9c-4 0-7-3-7-7 4 0 7 3 7 7ZM12 13c4 0 7-3 7-7-4 0-7 3-7 7Z",
  resin: "M12 3c2 3 5 6 5 10a5 5 0 0 1-10 0c0-4 3-7 5-10ZM12 21v-3",
  leaf: "M5 19C5 9 11 5 19 5c0 8-4 14-14 14ZM5 19l9-9",
  top: "M12 19V5M6 11l6-6 6 6",
  middle: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
  base: "M12 5v14M6 13l6 6 6-6",
};

export default function NoteIcon({
  note,
  glyph,
  className = "h-10 w-10",
}: {
  /** A note word; the glyph is picked by keyword. */
  note?: string;
  /** Or a fixed glyph, e.g. the three layer markers. */
  glyph?: Glyph;
  className?: string;
}) {
  const g = glyph ?? glyphFor(note ?? "");
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={PATHS[g]} />
    </svg>
  );
}
