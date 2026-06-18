"use client";

import { useMemo, useState } from "react";
import type {
  OtopCategory,
  ProductService,
  Village
} from "../../app/(main)/otop/data";
import { CategoryFilter } from "@/components/otop/category-filter";
import { OtopCarousel } from "@/components/otop/otop-carousel";
import { ProductServiceCard } from "@/components/otop/product-service-card";
import { VillageCard } from "@/components/otop/village-card";

type OtopDiscoveryProps = {
  categories: readonly OtopCategory[];
  villages: Village[];
  productServices: ProductService[];
};

export function OtopDiscovery({
  categories,
  villages,
  productServices
}: OtopDiscoveryProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<OtopCategory>("All");

  const filteredVillages = useMemo(() => {
    if (selectedCategory === "All") {
      return villages;
    }

    return villages.filter((village) => village.category === selectedCategory);
  }, [selectedCategory, villages]);

  const filteredProductServices = useMemo(() => {
    if (selectedCategory === "All") {
      return productServices;
    }

    return productServices.filter((item) => item.category === selectedCategory);
  }, [productServices, selectedCategory]);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <OtopCarousel
        title="Village"
        description="Community places and local stories ready for visitor discovery."
        emptyMessage={
          filteredVillages.length === 0
            ? "This village category does not exist yet."
            : undefined
        }
      >
        {filteredVillages.map((village) => (
          <VillageCard key={village.name} village={village} />
        ))}
      </OtopCarousel>

      <OtopCarousel
        title="Product & Service"
        description="Mock OTOP products and community services for the first MVP catalog."
        emptyMessage={
          filteredProductServices.length === 0
            ? "This product or service category does not exist yet."
            : undefined
        }
      >
        {filteredProductServices.map((item) => (
          <ProductServiceCard key={item.name} item={item} />
        ))}
      </OtopCarousel>
    </>
  );
}
