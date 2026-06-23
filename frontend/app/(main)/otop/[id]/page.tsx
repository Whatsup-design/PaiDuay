import { VillageDetailPageContent } from "@/components/otop/village-detail-loader";
import type { Village } from "@/app/(main)/otop/data";
import { ApiError, type ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";
import { notFound } from "next/navigation";

type OtopVillageDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OtopVillageDetailPage({
  params
}: OtopVillageDetailPageProps) {
  const { id } = await params;
  let village: Village;

  try {
    const response = await serverApi.get<ApiResponse<Village>>(
      `/user/otop/villages/${encodeURIComponent(id)}`
    );
    village = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <VillageDetailPageContent village={village} />
      </div>
    </main>
  );
}
