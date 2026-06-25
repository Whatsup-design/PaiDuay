import { MapPin } from "lucide-react";
import type { ProductService } from "../../app/(main)/otop/data";

type ProductServiceCardProps = {
  item: ProductService;
};

export function ProductServiceCard({ item }: ProductServiceCardProps) {
  return (
<<<<<<< HEAD
    <article className="w-[13.5rem] shrink-0 snap-start overflow-hidden rounded-md border border-neutral-200/80 bg-neutral-50/70 shadow-[0_6px_18px_rgb(15_23_42_/_6%)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:w-[16rem]">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.imageAlt ?? item.name}
          className="h-28 w-full object-cover"
        />
      ) : (
        <div
          className={`h-28 bg-gradient-to-br opacity-35 grayscale ${item.gradient}`}
        />
      )}
=======
    <article className="min-w-[13.5rem] snap-start overflow-hidden rounded-md border border-neutral-200/80 bg-neutral-50/70 shadow-[0_6px_18px_rgb(15_23_42_/_6%)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:min-w-[16rem]">
      <div
        className={`h-28 bg-gradient-to-br opacity-35 grayscale ${item.gradient}`}
      />
>>>>>>> parent of 9279d83 (add:frontend_filter_fix:sparkleUi)
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
            {item.type}
          </span>
          <span className="text-xs font-semibold text-neutral-950">
            {item.price}
          </span>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-950">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{item.village}</p>
        {(item.openingNote || item.crowdDensity) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.openingNote && (
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-neutral-500 ring-1 ring-neutral-200">
                {item.openingNote}
              </span>
            )}
            {item.crowdDensity && (
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold capitalize text-neutral-500 ring-1 ring-neutral-200">
                {item.crowdDensity} crowd
              </span>
            )}
          </div>
        )}
        {item.googleMapsUrl && (
          <a
            href={item.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-semibold text-neutral-700 ring-1 ring-neutral-200 transition hover:bg-neutral-50 hover:text-neutral-950"
          >
            <MapPin className="h-3.5 w-3.5" />
            View map
          </a>
        )}
      </div>
    </article>
  );
}
