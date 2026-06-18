import { QuestHero } from "@/components/quest/quest-hero";
import { QuestSection } from "@/components/quest/quest-section";
import { provinceQuests, villageMarketQuests } from "@/app/(main)/quest/data";

export default function QuestPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-7">
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
    </main>
  );
}
