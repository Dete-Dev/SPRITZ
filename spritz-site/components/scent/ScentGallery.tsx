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
  accent,
}: {
  images: string[];
  alt: string;
  accent: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="w-full">
      {/* Main image — the cutouts float on a soft radial halo of the label
          color (no hard box edge). */}
      <div
        className="relative w-full aspect-[1.339/1]"
        style={{
          background: `radial-gradient(closest-side at 50% 60%, ${accent}26 0%, transparent 80%)`,
        }}
      >
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
                  className="relative block h-20 w-24 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
                  style={{
                    opacity: isActive ? 1 : 0.5,
                    outline: isActive
                      ? "1px solid rgba(26,20,17,0.4)"
                      : "1px solid transparent",
                    outlineOffset: -1,
                  }}
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
