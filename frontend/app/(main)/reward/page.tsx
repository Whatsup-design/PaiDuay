import type { Reward } from "@/app/(main)/reward/data";
import { RewardPageContent } from "@/components/reward/reward-data-loader";
import type { ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";

export default async function RewardPage() {
  const response = await serverApi.get<ApiResponse<Reward[]>>(
    "/user/reward/items"
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <RewardPageContent rewards={response.data} />
      </div>
    </main>
  );
}
