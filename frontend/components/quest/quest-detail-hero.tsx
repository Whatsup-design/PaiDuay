import { Clock, Gift, MapPin } from "lucide-react";
import type { Quest } from "../../app/(main)/quest/data";
import { QuestTypeBadge } from "@/components/quest/quest-type-badge";

type QuestDetailHeroProps = {
  quest: Quest;
};

export function QuestDetailHero({ quest }: QuestDetailHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgb(15_23_42_/_7%)]">
      <div className="relative h-56 overflow-hidden bg-neutral-50 sm:h-64">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${quest.gradient} opacity-60 grayscale-[10%]`}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <div className="absolute left-5 top-5">
          <QuestTypeBadge type={quest.type} difficulty={quest.difficulty} />
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          {quest.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500">
          {quest.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <QuestMeta icon={MapPin} label="Location" value={quest.location} />
          <QuestMeta icon={Clock} label="Duration" value={quest.duration} />
          <QuestMeta icon={Gift} label="Reward" value={quest.reward} />
        </div>
      </div>
    </section>
  );
}

function QuestMeta({
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
