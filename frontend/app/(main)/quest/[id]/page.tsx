import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestDetailHero } from "@/components/quest/quest-detail-hero";
import { QuestDetailPanel } from "@/components/quest/quest-detail-panel";
import { QuestDetailSteps } from "@/components/quest/quest-detail-steps";
import { allQuests, getQuestById } from "@/app/(main)/quest/data";

type QuestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return allQuests.map((quest) => ({
    id: quest.id
  }));
}

export default async function QuestDetailPage({
  params
}: QuestDetailPageProps) {
  const { id } = await params;
  const quest = getQuestById(id);

  if (!quest) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link
          href="/quest"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quests
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-6">
            <QuestDetailHero quest={quest} />
            <QuestDetailSteps quest={quest} />
          </div>
          <QuestDetailPanel quest={quest} />
        </div>
      </div>
    </main>
  );
}
