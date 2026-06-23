"use client";

import { useMemo } from "react";

import type {
  OtopCategory,
  ProductService,
  Village
} from "@/app/(main)/otop/data";
import { OtopDiscovery } from "@/components/otop/otop-discovery";
import { OtopHero } from "@/components/otop/otop-hero";

type OtopPageContentProps = {
  categories: readonly OtopCategory[];
  villages: Village[];
  productServices: ProductService[];
};

export function OtopPageContent({
  categories,
  villages,
  productServices
}: OtopPageContentProps) {
  const locations = useMemo(() => {
    return villages.slice(0, 4).map((village) => ({
      name: village.placeName || village.district || village.name,
      hint: [village.category, village.district, village.province]
        .filter(Boolean)
        .join(", ")
    }));
  }, [villages]);

  return (
    <div className="space-y-6 lg:space-y-7">
      <OtopHero locations={locations} />

      <OtopDiscovery
        categories={categories}
        villages={villages}
        productServices={productServices}
      />
    </div>
  );
}
