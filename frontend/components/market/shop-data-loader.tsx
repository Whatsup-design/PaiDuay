"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { shopCategories, type ShopItem } from "@/app/(main)/market/data";
import { MarketDiscovery } from "@/components/market/market-discovery";
import { MarketHero } from "@/components/market/market-hero";
import { api, ApiError, type ApiResponse } from "@/lib/api";

const SHOP_FETCH_TIMEOUT_MS = 10000;

type ShopDataLoaderProps = {
  initialItems: ShopItem[];
};

export function ShopDataLoader({ initialItems }: ShopDataLoaderProps) {
  const [items, setItems] = useState<ShopItem[] | null>(initialItems);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadShopItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.get<ApiResponse<ShopItem[]>>(
        "/user/shop/items",
        {
          timeoutMs: SHOP_FETCH_TIMEOUT_MS
        }
      );

      setItems(response.data);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to load shop data. Please try again.";

      console.error("Failed to load shop data", error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialItems.length === 0) {
      void loadShopItems();
    }
  }, [initialItems.length, loadShopItems]);

  if (isLoading && !items) {
    return (
      <div className="space-y-6 lg:space-y-7">
        <ShopLoadingBlock heightClassName="h-56" />
        <ShopLoadingBlock heightClassName="h-64" />
        <ShopLoadingBlock heightClassName="h-64" />
      </div>
    );
  }

  if (errorMessage && !items) {
    return (
      <ShopErrorState
        message={errorMessage}
        isLoading={isLoading}
        onRefresh={loadShopItems}
      />
    );
  }

  if (!items) {
    return null;
  }

  return (
    <div className="space-y-6 lg:space-y-7">
      {errorMessage && (
        <ShopInlineError
          message={errorMessage}
          isLoading={isLoading}
          onRefresh={loadShopItems}
        />
      )}

      <MarketHero />
      <MarketDiscovery categories={shopCategories} items={items} />
    </div>
  );
}

function ShopLoadingBlock({ heightClassName }: { heightClassName: string }) {
  return (
    <div
      className={`${heightClassName} animate-pulse rounded-xl border border-neutral-100 bg-neutral-100`}
    />
  );
}

function ShopErrorState({
  message,
  isLoading,
  onRefresh
}: {
  message: string;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <section className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
        <TriangleAlert className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-neutral-950">
        Unable to load shop data
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">
        {message}
      </p>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </section>
  );
}

function ShopInlineError({
  message,
  isLoading,
  onRefresh
}: {
  message: string;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-semibold text-amber-950 ring-1 ring-amber-200 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
}
