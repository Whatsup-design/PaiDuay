import type { Village } from "../../app/(main)/otop/data";

type VillageCardProps = {
  village: Village;
};

export function VillageCard({ village }: VillageCardProps) {
  return (
    <article className="min-w-[14.5rem] snap-start overflow-hidden rounded-md border border-neutral-200/80 bg-neutral-50/70 shadow-[0_6px_18px_rgb(15_23_42_/_6%)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:min-w-[17.5rem]">
      <div
        className={`h-32 bg-gradient-to-br opacity-35 grayscale ${village.gradient}`}
      />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
            {village.category}
          </span>
          <span className="text-[11px] font-semibold text-neutral-400">
            {village.district}
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-neutral-950">
          {village.name}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-neutral-500">
          {village.description}
        </p>
      </div>
    </article>
  );
}
