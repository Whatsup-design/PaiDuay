import { CheckCircle2, MapPin } from "lucide-react";
import type { Village } from "../../app/(main)/otop/data";

type VillageDetailContentProps = {
  village: Village;
};

export function VillageDetailContent({ village }: VillageDetailContentProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-xl border border-neutral-100 bg-white p-5 shadow-[0_8px_24px_rgb(15_23_42_/_6%)] sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          Full History
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          {village.history}
        </p>
      </section>

      <aside className="space-y-4">
        {village.googleMapsUrl && (
          <a
            href={village.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 text-sm font-semibold text-neutral-950 shadow-[0_8px_24px_rgb(15_23_42_/_5%)] transition hover:bg-white"
          >
            <MapPin className="h-4 w-4 text-sky-600" />
            Open in Google Maps
          </a>
        )}
        <InfoList title="ภูมิปัญญา" items={village.wisdom} />
        <InfoList title="Highlights" items={village.highlights} />
      </aside>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 shadow-[0_8px_24px_rgb(15_23_42_/_5%)]">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-500">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
