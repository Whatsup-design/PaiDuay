import type { ShopItem } from "@/app/(main)/market/data";
import { ShopDataLoader } from "@/components/market/shop-data-loader";
import type { ApiResponse } from "@/lib/api";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const response =
    await serverApi.get<ApiResponse<ShopItem[]>>("/user/shop/items");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <ShopDataLoader initialItems={response.data} />
      </div>
    </main>
  );
}
