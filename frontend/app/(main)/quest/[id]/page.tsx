import { QuestDetailContent } from "@/components/quest/quest-detail-loader";
import type { Quest } from "@/app/(main)/quest/data";
import { ApiError, type ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";
import { notFound } from "next/navigation";

type QuestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuestDetailPage({
  params
}: QuestDetailPageProps) {
  const { id } = await params;
  let quest: Quest;

  try {
    const response = await serverApi.get<ApiResponse<Quest>>(
      `/user/quest/items/${encodeURIComponent(id)}`
    );
    quest = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <QuestDetailContent quest={quest} />
      </div>
    </main>
  );
}
