import type { Village } from "../../app/(main)/otop/data";
import Link from "next/link";

type VillageCardProps = {
  village: Village;
};

export function VillageCard({ village }: VillageCardProps) {
  return (
    <article className="w-[14.5rem] shrink-0 snap-start overflow-hidden rounded-md border border-neutral-200/80 bg-neutral-50/70 shadow-[0_6px_18px_rgb(15_23_42_/_6%)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:w-[17.5rem]">
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
        <Link
          href={`/otop/${village.id}`}
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md bg-neutral-950 px-3 text-xs font-semibold text-white transition hover:bg-neutral-800"
        >
          View
        </Link>
      </div>
    </article>
  );
}
