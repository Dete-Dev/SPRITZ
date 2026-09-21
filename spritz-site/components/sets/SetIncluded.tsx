import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ResolvedDuoSet } from "@/lib/sets";

/**
 * "What is included" for a preset set — brief §15.2, copied from the
 * reference: a thumbnail, the bottle name with its size, and the designer
 * it answers to, one row per bottle.
 */
export default function SetIncluded({ set }: { set: ResolvedDuoSet }) {
  const tCommon = useTranslations("common");
  const rows = [
    { scent: set.anchor, size: set.anchor.size },
    { scent: set.companion, size: "15ml" },
  ];

  return (
    <ul className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {rows.map(({ scent, size }) => (
        <li key={scent.key} className="flex items-center gap-4 px-4 py-3">
          <span className="relative h-14 w-10 shrink-0">
            <Image src={scent.clean} alt="" fill sizes="40px" className="object-contain" />
          </span>
          <span className="min-w-0 font-sans">
            <Link
              href={`/scents/${scent.key}`}
              className="block truncate text-[13px] font-bold text-ink underline decoration-dotted underline-offset-2 hover:text-red"
            >
              {scent.name} ({size})
            </Link>
            <span className="block text-[12px] text-muted">
              {tCommon("inspiredBy", { name: scent.inspiredBy })}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
