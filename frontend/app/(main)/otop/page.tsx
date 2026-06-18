import { OtopDiscovery } from "@/components/otop/otop-discovery";
import { OtopHero } from "@/components/otop/otop-hero";
import {
  otopCategories,
  otopLocations,
  productServices,
  villages
} from "@/app/(main)/otop/data";

export default function OtopPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-7">
        <OtopHero locations={otopLocations} />

        <OtopDiscovery
          categories={otopCategories}
          villages={villages}
          productServices={productServices}
        />
      </div>
    </main>
  );
}
