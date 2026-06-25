<<<<<<< HEAD
=======
import { CategoryFilter } from "@/components/otop/category-filter";
import { OtopCarousel } from "@/components/otop/otop-carousel";
import { OtopHero } from "@/components/otop/otop-hero";
import { ProductServiceCard } from "@/components/otop/product-service-card";
import { VillageCard } from "@/components/otop/village-card";
>>>>>>> parent of 9279d83 (add:frontend_filter_fix:sparkleUi)
import {
  otopCategories,
  type ProductService,
  type Village
} from "@/app/(main)/otop/data";
import { OtopPageContent } from "@/components/otop/otop-data-loader";
import type { ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function OtopPage() {
  const [villagesResponse, productServicesResponse] = await Promise.all([
    serverApi.get<ApiResponse<Village[]>>("/user/otop/villages"),
    serverApi.get<ApiResponse<ProductService[]>>("/user/otop/items")
  ]);

  return (
<<<<<<< HEAD
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <OtopPageContent
          categories={otopCategories}
          villages={villagesResponse.data}
          productServices={productServicesResponse.data}
        />
=======
    <main className="min-h-[calc(100vh-4rem)] bg-white px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <OtopHero locations={otopLocations} />

        <CategoryFilter categories={otopCategories} />

        <OtopCarousel
          title="Village"
          description="Community places and local stories ready for visitor discovery."
        >
          {villages.map((village) => (
            <VillageCard key={village.name} village={village} />
          ))}
        </OtopCarousel>

        <OtopCarousel
          title="Product & Service"
          description="Mock OTOP products and community services for the first MVP catalog."
        >
          {productServices.map((item) => (
            <ProductServiceCard key={item.name} item={item} />
          ))}
        </OtopCarousel>
>>>>>>> parent of 9279d83 (add:frontend_filter_fix:sparkleUi)
      </div>
    </main>
  );
}
