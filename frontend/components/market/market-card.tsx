import { MapPin, Star } from "lucide-react";
import type { MarketItem } from "../../app/(main)/market/data";

type MarketCardProps = {
  item: MarketItem;
};

export function MarketCard({ item }: MarketCardProps) {
  return (
    <article className="group flex h-[24rem] flex-col overflow-hidden rounded-md border border-neutral-200/80 bg-white shadow-[0_8px_24px_rgb(15_23_42_/_7%)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgb(15_23_42_/_10%)]">
      <div className="relative h-40 shrink-0 overflow-hidden bg-neutral-50">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-45 grayscale-[20%] transition duration-300 group-hover:opacity-60`}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/45 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-sm backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {item.type}
            </p>
            <h2 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-950">
              {item.name}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </div>
        </div>

        <p className="mt-2 text-sm font-medium text-neutral-600">
          {item.seller}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{item.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm font-semibold text-neutral-950">{item.price}</p>
          <button
            type="button"
            className="h-9 cursor-pointer rounded-md bg-neutral-950 px-4 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
