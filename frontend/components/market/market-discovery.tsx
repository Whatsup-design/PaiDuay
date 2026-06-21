"use client";

import { useMemo, useState } from "react";
import type { ShopCategory, ShopItem } from "../../app/(main)/market/data";
import { MarketCard } from "@/components/market/market-card";

type MarketDiscoveryProps = {
  categories: readonly ShopCategory[];
  items: ShopItem[];
};

const marketSections = [
  {
    title: "Store",
    description: "Local Phuket stores and community sellers.",
    getItems: (items: ShopItem[]) =>
      items.filter((item) => item.itemType === "store")
  },
  {
    title: "Service",
    description: "Community services and local experiences.",
    getItems: (items: ShopItem[]) =>
      items.filter((item) => item.itemType === "service")
  },
  {
    title: "Product",
    description: "Local goods, food, wellness products, and crafts.",
    getItems: (items: ShopItem[]) =>
      items.filter((item) => item.itemType === "product")
  },
  {
    title: "Market",
    description: "Local market routes and community shopping spots.",
    getItems: (items: ShopItem[]) =>
      items.filter((item) => item.itemType === "market")
  }
];

export function MarketDiscovery({ categories, items }: MarketDiscoveryProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>("All");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }

    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <section className="space-y-7">
      <ShopCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {marketSections.map((section) => {
        const sectionItems = section.getItems(filteredItems);

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

function ShopCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: {
  categories: readonly ShopCategory[];
  selectedCategory: ShopCategory;
  onCategoryChange: (category: ShopCategory) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-color:rgb(229_231_235_/_15%)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200/15 [&::-webkit-scrollbar-track]:bg-neutral-50/15">
      {categories.map((category) => {
        const isActive = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs font-semibold transition ${
              isActive
                ? "border-neutral-300 bg-neutral-200 text-neutral-950"
                : "border-neutral-200 bg-neutral-50/70 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function MarketSection({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: ShopItem[];
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
