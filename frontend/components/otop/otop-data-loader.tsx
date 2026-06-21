"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  OtopCategory,
  ProductService,
  Village
} from "@/app/(main)/otop/data";
import { OtopDiscovery } from "@/components/otop/otop-discovery";
import { OtopHero } from "@/components/otop/otop-hero";
import { api, ApiError, type ApiResponse } from "@/lib/api";

type OtopDataLoaderProps = {
  categories: readonly OtopCategory[];
};

type OtopData = {
  villages: Village[];
  productServices: ProductService[];
};

const OTOP_FETCH_TIMEOUT_MS = 10000;

export function OtopDataLoader({ categories }: OtopDataLoaderProps) {
  const [data, setData] = useState<OtopData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOtopData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [villagesResponse, productServicesResponse] = await Promise.all([
        api.get<ApiResponse<Village[]>>("/user/otop/villages", {
          timeoutMs: OTOP_FETCH_TIMEOUT_MS
        }),
        api.get<ApiResponse<ProductService[]>>("/user/otop/items", {
          timeoutMs: OTOP_FETCH_TIMEOUT_MS
        })
      ]);

      setData({
        villages: villagesResponse.data,
        productServices: productServicesResponse.data
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to load OTOP data. Please try again.";

      console.error("Failed to load OTOP data", error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOtopData();
  }, [loadOtopData]);

  const locations = useMemo(() => {
    return (data?.villages ?? []).slice(0, 4).map((village) => ({
      name: village.placeName || village.district || village.name,
      hint: [village.category, village.district, village.province]
        .filter(Boolean)
        .join(", ")
    }));
  }, [data?.villages]);

  if (isLoading && !data) {
    return (
      <div className="space-y-6 lg:space-y-7">
        <OtopLoadingBlock heightClassName="h-72" />
        <OtopLoadingBlock heightClassName="h-48" />
        <OtopLoadingBlock heightClassName="h-56" />
      </div>
    );
  }

  if (errorMessage && !data) {
    return (
      <OtopErrorState
        message={errorMessage}
        isLoading={isLoading}
        onRefresh={loadOtopData}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 lg:space-y-7">
      {errorMessage && (
        <OtopInlineError
          message={errorMessage}
          isLoading={isLoading}
          onRefresh={loadOtopData}
        />
      )}

      <OtopHero locations={locations} />

      <OtopDiscovery
        categories={categories}
        villages={data.villages}
        productServices={data.productServices}
      />
    </div>
  );
}

function OtopLoadingBlock({ heightClassName }: { heightClassName: string }) {
  return (
    <div
      className={`${heightClassName} animate-pulse rounded-xl border border-neutral-100 bg-neutral-100`}
    />
  );
}

function OtopErrorState({
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
        Unable to load OTOP data
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

function OtopInlineError({
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
