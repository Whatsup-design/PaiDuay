import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import type { Quest } from "@/app/(main)/quest/data";
import { QuestDetailHero } from "@/components/quest/quest-detail-hero";
import { QuestDetailPanel } from "@/components/quest/quest-detail-panel";
import { QuestDetailSteps } from "@/components/quest/quest-detail-steps";

export function QuestDetailContent({ quest }: { quest: Quest }) {
  return (
    <div className="space-y-4">
      <BackToQuestsLink />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-6">
          <QuestDetailHero quest={quest} />
          <QuestDetailSteps quest={quest} />
        </div>
        <QuestDetailPanel quest={quest} />
      </div>
    </div>
  );
}

function BackToQuestsLink() {
  return (
    <Link
      href="/quest"
      className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to quests
    </Link>
  );
}
