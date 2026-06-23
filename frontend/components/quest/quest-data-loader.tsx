import type { Quest } from "@/app/(main)/quest/data";
import { QuestHero } from "@/components/quest/quest-hero";
import { QuestSection } from "@/components/quest/quest-section";

export function QuestPageContent({ quests }: { quests: Quest[] }) {
  const provinceQuests = quests.filter((quest) => quest.type === "Province");
  const villageMarketQuests = quests.filter(
    (quest) => quest.type === "VillageMarket"
  );

  return (
    <div className="space-y-6 lg:space-y-7">
      <QuestHero />

      <QuestSection
        title="Province Quest"
        description="Large campaign quests that connect multiple areas across Phuket."
        quests={provinceQuests}
        layout="featured"
      />

      <QuestSection
        title="Village & Market Quest"
        description="Short missions that can be completed in one community, village, or market."
        quests={villageMarketQuests}
      />
    </div>
  );
}
