"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

type OtopCarouselProps = {
  title: string;
  description: string;
  children: ReactNode;
  emptyMessage?: string;
};

export function OtopCarousel({
  title,
  description,
  children,
  emptyMessage
}: OtopCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollCarousel(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth"
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollCarousel("left")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-neutral-50/70 text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollCarousel("right")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-neutral-50/70 text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-color:rgb(229_231_235_/_15%)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200/15 [&::-webkit-scrollbar-track]:bg-neutral-50/15"
      >
        {children}
      </div>
      {emptyMessage ? (
        <p className="mt-2 text-xs font-medium text-neutral-400">
          {emptyMessage}
        </p>
      ) : null}
    </section>
  );
}
