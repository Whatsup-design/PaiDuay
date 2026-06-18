import { Clock, Gift, MapPin } from "lucide-react";
import Link from "next/link";
import type { Quest } from "../../app/(main)/quest/data";
import { QuestStepList } from "@/components/quest/quest-step-list";
import { QuestTypeBadge } from "@/components/quest/quest-type-badge";

type QuestCardProps = {
  quest: Quest;
};

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <article className="group flex h-full min-h-[29rem] flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-[0_8px_24px_rgb(15_23_42_/_7%)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgb(15_23_42_/_10%)]">
      <div className="relative h-36 shrink-0 overflow-hidden bg-neutral-50">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${quest.gradient} opacity-55 grayscale-[12%] transition duration-300 group-hover:opacity-70`}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/55 to-transparent" />
        <div className="absolute left-4 top-4">
          <QuestTypeBadge type={quest.type} difficulty={quest.difficulty} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-neutral-950">
          {quest.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">
          {quest.description}
        </p>

        <div className="mt-4 grid gap-2 text-xs font-medium text-neutral-500">
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            <span className="truncate">{quest.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-neutral-400" />
            {quest.duration}
          </p>
          <p className="flex items-center gap-2">
            <Gift className="h-3.5 w-3.5 text-neutral-400" />
            <span className="truncate">{quest.reward}</span>
          </p>
        </div>

        <QuestStepList steps={quest.steps} />

        <div className="mt-auto pt-5">
          <Link
            href={`/quest/${quest.id}`}
            className="flex h-10 w-full items-center justify-center rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
