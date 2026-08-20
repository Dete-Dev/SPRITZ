"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Product image gallery — big main shot + clickable thumb strip.
 *
 * Single source of truth: the parent passes an ordered array of webp paths.
 * Thumbnail clicks swap the main image with a soft crossfade.
 *
 * Aspect ratio of each image is 1.339:1 (1600x1195) — locked so the layout
 * doesn't jump when swapping.
 */
export default function ScentGallery({
  images,
  alt,
  stripe,
}: {
  images: string[];
  alt: string;
  /** The scent's stripe colourway — banded under the main shot. */
  stripe: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="w-full">
      {/* Bottles sit on plain paper white — no gradient behind product
          (design system rule 5). The frame is a pasted-on card instead. */}
      <div className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
      <div className="relative aspect-[1.339/1] w-full">
        {/* Crossfade: render every image stacked, vary opacity. */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain transition-opacity duration-500 ease-out"
            style={{ opacity: src === active ? 1 : 0 }}
          />
        ))}
      </div>
        <div
          aria-hidden
          className="sp-stripe h-3.5"
          style={{ ["--stripe" as string]: stripe }}
        />
      </div>

      {/* Thumb strip. Hidden if only one image. */}
      {images.length > 1 && (
        <ul
          role="tablist"
          aria-label="Product images"
          className="mt-4 flex gap-3 overflow-x-auto pb-1"
        >
          {images.map((src, i) => {
            const isActive = i === activeIdx;
            return (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActiveIdx(i)}
                  className={`relative block h-20 w-24 rounded-card border-2 bg-paper transition-all duration-150 ease-spritz ${
                    isActive
                      ? "border-ink shadow-hard-sm"
                      : "border-line opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
