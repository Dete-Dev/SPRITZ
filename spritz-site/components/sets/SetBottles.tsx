import Image from "next/image";
import type { ResolvedDuoSet } from "@/lib/sets";

/**
 * The two bottles of a curated set side by side — the 15ml companion drawn
 * smaller so the size difference reads before the list does. Shared by the
 * set card and the set product page.
 */
export default function SetBottles({
  set,
  size = "card",
}: {
  set: ResolvedDuoSet;
  size?: "card" | "hero";
}) {
  const hero = size === "hero";
  return (
    <div
      className={`relative flex items-end justify-center bg-paper-2 ${
        hero ? "gap-4 px-8 pt-16 pb-10" : "gap-1.5 px-4 pt-6"
      }`}
    >
      {set.scents.map((scent, i) => (
        <span
          key={scent.key}
          className={
            i === 0
              ? `relative block ${hero ? "w-1/2 max-w-[16rem]" : "w-1/3 max-w-[5rem]"}`
              : `relative block ${hero ? "w-1/3 max-w-[10rem]" : "w-1/4 max-w-[3.4rem]"}`
          }
          style={{ aspectRatio: "1 / 1.6" }}
        >
          <Image
            src={scent.clean}
            alt={hero ? scent.name : ""}
            fill
            sizes={hero ? "(min-width: 768px) 30vw, 60vw" : "80px"}
            priority={hero}
            className="object-contain"
          />
        </span>
      ))}
    </div>
  );
}
