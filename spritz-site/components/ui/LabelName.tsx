/**
 * A scent name in the label voice — exactly as printed on the bottle:
 * lowercase French, note words bold. Never translated, never capitalised
 * (design system rule 7).
 */
export default function LabelName({
  name,
  noteWords,
  className = "",
}: {
  name: string;
  noteWords: string[];
  className?: string;
}) {
  // Split on the note words, keeping them, so each can be emboldened in place.
  const parts = name.split(new RegExp(`(${noteWords.join("|")})`, "g"));

  return (
    <span className={`sp-label-name ${className}`}>
      {parts.map((part, i) =>
        noteWords.includes(part) ? <strong key={i}>{part}</strong> : part,
      )}
    </span>
  );
}
