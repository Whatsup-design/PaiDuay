"use client";

import { useMemo } from "react";

import { DistanceBadge } from "@/components/location/distance-badge";
import { getDistanceInfo } from "@/lib/location/distance";
import type { Coordinates } from "@/lib/location/types";
import { useDeviceLocation } from "@/lib/location/use-device-location";

type LocationDistanceBadgeProps = {
  destination: Coordinates;
  className?: string;
};

export function LocationDistanceBadge({
  destination,
  className
}: LocationDistanceBadgeProps) {
  const { location } = useDeviceLocation();
  const distanceInfo = useMemo(
    () => getDistanceInfo(location, destination),
    [destination, location]
  );

  return <DistanceBadge distanceInfo={distanceInfo} className={className} />;
}
