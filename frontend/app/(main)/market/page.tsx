import { marketItems } from "@/app/(main)/market/data";
import { MarketDiscovery } from "@/components/market/market-discovery";
import { MarketHero } from "@/components/market/market-hero";

export default function MarketPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <MarketHero />
        <MarketDiscovery items={marketItems} />
      </div>
    </main>
  );
}
