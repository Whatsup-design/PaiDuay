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
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <OtopPageContent
          categories={otopCategories}
          villages={villagesResponse.data}
          productServices={productServicesResponse.data}
        />
      </div>
    </main>
  );
}
