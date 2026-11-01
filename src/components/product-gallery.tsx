"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length > 0 ? images : ["/images/gift-set.jpg"];
  const [active, setActive] = useState(0);

  const go = (direction: number) => {
    setActive((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[86px_1fr]">
      <div className="no-scrollbar order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {gallery.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1} of ${name}`}
            aria-pressed={active === index}
            className={`h-20 w-[70px] shrink-0 overflow-hidden border-2 bg-cream transition-all duration-300 lg:h-[86px] lg:w-full ${active === index ? "border-gold" : "border-transparent opacity-65 hover:opacity-100"}`}
          >
            <img src={image} alt={`${name} view ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="group relative order-1 aspect-square overflow-hidden bg-cream lg:order-2">
        <img
          key={`${gallery[active]}-${active}`}
          src={gallery[active]}
          alt={`${name} — main view`}
          className="fade-up h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <span className="absolute bottom-4 left-4 bg-[#fffaf5]/90 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.14em] text-plum uppercase backdrop-blur-sm">
          {active + 1} / {gallery.length}
        </span>
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#fffaf5]/90 text-xl text-plum transition-colors hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#fffaf5]/90 text-xl text-plum transition-colors hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
