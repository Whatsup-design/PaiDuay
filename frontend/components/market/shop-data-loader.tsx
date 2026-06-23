"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { shopCategories, type ShopItem } from "@/app/(main)/market/data";
import { MarketDiscovery } from "@/components/market/market-discovery";
import { MarketHero } from "@/components/market/market-hero";

type ShopPageContentProps = {
  items: ShopItem[];
};

export function ShopPageContent({ items }: ShopPageContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearch = deferredSearchValue.trim();

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) {
      return items;
    }

    const search = normalizedSearch.toLowerCase();

    return items.filter((item) =>
      [
        item.name,
        item.seller,
        item.description,
        item.type,
        item.category,
        item.district,
        item.locationName
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search))
    );
  }, [items, normalizedSearch]);

  return (
    <div className="space-y-6 lg:space-y-7">
      <MarketHero
        searchValue={searchValue}
        isSearching={false}
        onSearchChange={setSearchValue}
      />
      <MarketDiscovery categories={shopCategories} items={filteredItems} />
    </div>
  );
}
