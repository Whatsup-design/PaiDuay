import type { Quest } from "../../app/(main)/quest/data";
import { QuestCard } from "@/components/quest/quest-card";

type QuestSectionProps = {
  title: string;
  description: string;
  quests: Quest[];
  layout?: "featured" | "compact";
};

export function QuestSection({
  title,
  description,
  quests,
  layout = "compact"
}: QuestSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>

      <div
        className={
          layout === "featured"
            ? "grid gap-4 lg:grid-cols-2"
            : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </section>
  );
}
