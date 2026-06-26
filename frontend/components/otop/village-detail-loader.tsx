import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import type { ProductService, Village } from "@/app/(main)/otop/data";
import { VillageDetailContent } from "@/components/otop/village-detail-content";
import { VillageDetailHero } from "@/components/otop/village-detail-hero";
import { VillageProductServiceCarousel } from "@/components/otop/village-product-service-carousel";

type VillageDetailPageContentProps = {
  village: Village;
  productServices: ProductService[];
};

export function VillageDetailPageContent({
  village,
  productServices
}: VillageDetailPageContentProps) {
  return (
    <div className="space-y-4">
      <BackToOtopLink />

      <div className="space-y-6">
        <VillageDetailHero village={village} />
        <VillageDetailContent village={village} />
        <VillageProductServiceCarousel
          items={productServices}
          villageName={village.name}
        />
      </div>
    </div>
  );
}

function BackToOtopLink() {
  return (
    <Link
      href="/otop"
      className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to OTOP
    </Link>
  );
}
