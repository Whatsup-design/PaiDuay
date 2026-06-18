import type { MarketItem } from "../../app/(main)/market/data";
import { MarketCard } from "@/components/market/market-card";

type MarketDiscoveryProps = {
  items: MarketItem[];
};

const marketSections = [
  {
    title: "Service",
    description: "Community services and local experiences.",
    getItems: (items: MarketItem[]) =>
      items.filter(
        (item) => item.category === "Service" || item.type === "Experience"
      )
  },
  {
    title: "Product",
    description: "Local goods, food, wellness products, and crafts.",
    getItems: (items: MarketItem[]) =>
      items.filter((item) => item.type === "Product")
  },
  {
    title: "Market",
    description: "Local market routes and community shopping spots.",
    getItems: (items: MarketItem[]) =>
      items.filter((item) => item.category === "Market")
  }
];

export function MarketDiscovery({ items }: MarketDiscoveryProps) {
  return (
    <section className="space-y-7">
      {marketSections.map((section) => {
        const sectionItems = section.getItems(items);

        return (
          <MarketSection
            key={section.title}
            title={section.title}
            description={section.description}
            items={sectionItems}
          />
        );
      })}
    </section>
  );
}

function MarketSection({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: MarketItem[];
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-color:rgb(229_231_235_/_15%)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200/15 [&::-webkit-scrollbar-track]:bg-neutral-50/15">
          {items.map((item) => (
            <div key={`${title}-${item.name}`} className="w-64 shrink-0">
              <MarketCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-neutral-400">
          This section does not have items yet.
        </p>
      )}
    </section>
  );
}
