"use client";

import { useState } from "react";
import { IconChevronDown } from "./icons";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-1 md:w-20 md:flex-col md:overflow-visible no-scrollbar">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-24 md:w-20 ${
              active === i ? "border-clay" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-sand"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onClick={() => setZoom((z) => !z)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={name}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            zoom ? "scale-[1.35]" : "scale-100"
          }`}
        />
        {/* Prev / next */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setActive((active - 1 + images.length) % images.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2.5 shadow transition hover:bg-cream"
            >
              <IconChevronDown width={16} height={16} className="rotate-90" />
            </button>
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setActive((active + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2.5 shadow transition hover:bg-cream"
            >
              <IconChevronDown width={16} height={16} className="-rotate-90" />
            </button>
          </>
        )}
        <span className="absolute bottom-3 right-4 rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-cream">
          {active + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
