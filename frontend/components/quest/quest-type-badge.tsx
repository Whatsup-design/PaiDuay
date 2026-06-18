import type { QuestDifficulty, QuestType } from "../../app/(main)/quest/data";

type QuestTypeBadgeProps = {
  type: QuestType;
  difficulty: QuestDifficulty;
};

const questTypeLabel: Record<QuestType, string> = {
  Province: "Province Quest",
  VillageMarket: "Village & Market Quest"
};

const difficultyClassName: Record<QuestDifficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700"
};

export function QuestTypeBadge({ type, difficulty }: QuestTypeBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[11px] font-semibold text-white">
        {questTypeLabel[type]}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyClassName[difficulty]}`}
      >
        {difficulty}
      </span>
    </div>
  );
}
