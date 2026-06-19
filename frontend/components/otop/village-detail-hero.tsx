import { MapPin, Tag } from "lucide-react";
import type { Village } from "../../app/(main)/otop/data";

type VillageDetailHeroProps = {
  village: Village;
};

export function VillageDetailHero({ village }: VillageDetailHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgb(15_23_42_/_7%)]">
      <div className="relative h-56 overflow-hidden bg-neutral-50 sm:h-64">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${village.gradient} opacity-60 grayscale-[12%]`}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur">
          {village.category}
        </span>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {village.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500">
          {village.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <VillageMeta icon={MapPin} label="District" value={village.district} />
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
