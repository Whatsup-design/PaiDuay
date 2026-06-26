"use client";

import { useMemo } from "react";

import type {
  OtopCategory,
  ProductService,
  Village
} from "@/app/(main)/otop/data";
import { OtopDiscovery } from "@/components/otop/otop-discovery";
import { OtopHero } from "@/components/otop/otop-hero";
import { getDistanceInfo } from "@/lib/location/distance";
import { useDeviceLocation } from "@/lib/location/use-device-location";

type OtopPageContentProps = {
  categories: readonly OtopCategory[];
  villages: Village[];
  productServices: ProductService[];
};

export function OtopPageContent({
  categories,
  villages,
  productServices
}: OtopPageContentProps) {
  const {
    location,
    status: locationStatus,
    message: locationMessage,
    requestLocation
  } = useDeviceLocation();

  const locations = useMemo(() => {
    return villages.slice(0, 4).map((village) => ({
      name: village.placeName || village.district || village.name,
      hint: [village.category, village.district, village.province]
        .filter(Boolean)
        .join(", ")
    }));
  }, [villages]);

  return (
    <div className="space-y-6 lg:space-y-7">
      <OtopHero
        locations={locations}
        location={location}
        locationStatus={locationStatus}
        locationMessage={locationMessage}
        onSetLocation={requestLocation}
      />

      <OtopDiscovery
        categories={categories}
        villages={villages.map((village) => ({
          ...village,
          distanceInfo: getDistanceInfo(location, village)
        }))}
        productServices={productServices.map((item) => {
          const village = villages.find(
            (candidate) => candidate.villageId === item.villageId
          );

          return {
            ...item,
            distanceInfo: village
              ? getDistanceInfo(location, village)
              : null
          };
        })}
      />
    </div>
  );
}
