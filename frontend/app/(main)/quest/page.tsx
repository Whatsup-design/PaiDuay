import type { Quest } from "@/app/(main)/quest/data";
import { QuestPageContent } from "@/components/quest/quest-data-loader";
import type { ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";

export default async function QuestPage() {
  const response = await serverApi.get<ApiResponse<Quest[]>>(
    "/user/quest/items"
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <QuestPageContent quests={response.data} />
      </div>
    </main>
  );
}
