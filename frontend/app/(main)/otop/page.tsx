import { CategoryFilter } from "@/components/otop/category-filter";
import { OtopCarousel } from "@/components/otop/otop-carousel";
import { OtopHero } from "@/components/otop/otop-hero";
import { ProductServiceCard } from "@/components/otop/product-service-card";
import { VillageCard } from "@/components/otop/village-card";
import {
  otopCategories,
  otopLocations,
  productServices,
  villages
} from "@/app/(main)/otop/data";

export default function OtopPage() {
  return (
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
      </div>
    </main>
  );
}
