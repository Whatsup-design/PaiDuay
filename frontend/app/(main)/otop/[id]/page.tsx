import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VillageDetailContent } from "@/components/otop/village-detail-content";
import { VillageDetailHero } from "@/components/otop/village-detail-hero";
import { getVillageById, villages } from "@/app/(main)/otop/data";

type OtopVillageDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return villages.map((village) => ({
    id: village.id
  }));
}

export default async function OtopVillageDetailPage({
  params
}: OtopVillageDetailPageProps) {
  const { id } = await params;
  const village = getVillageById(id);

  if (!village) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link
          href="/otop"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to OTOP
        </Link>

        <div className="space-y-6">
          <VillageDetailHero village={village} />
          <VillageDetailContent village={village} />
        </div>
      </div>
    </main>
  );
}
