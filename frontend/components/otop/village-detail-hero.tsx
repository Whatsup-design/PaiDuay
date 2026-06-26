import { MapPin, Tag } from "lucide-react";
import type { Village } from "../../app/(main)/otop/data";

type VillageDetailHeroProps = {
  village: Village;
};

export function VillageDetailHero({ village }: VillageDetailHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgb(15_23_42_/_7%)]">
      <div className="aspect-[4/3] overflow-hidden bg-neutral-50 sm:aspect-[16/7]">
        {village.coverImageUrl ? (
          <img
            src={village.coverImageUrl}
            alt={village.coverImageAlt ?? village.name}
            className="h-full w-full object-contain sm:object-cover"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${village.gradient}`}
          />
        )}
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
          {village.category}
        </span>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {village.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500">
          {village.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <VillageMeta
            icon={MapPin}
            label="Place"
            value={
              village.placeName ||
              [village.district, village.province].filter(Boolean).join(", ")
            }
          />
          <VillageMeta icon={Tag} label="Category" value={village.category} />
        </div>
      </div>
    </section>
  );
}

function VillageMeta({
  icon: Icon,
  label,
  value
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-neutral-100 bg-neutral-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-neutral-950">{value}</p>
    </div>
  );
}
