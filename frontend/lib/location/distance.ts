import { getDistance } from "geolib";

import type {
  Coordinates,
  DistanceInfo,
  DistanceRate,
  StoredLocation
} from "@/lib/location/types";

function hasCoordinates(value: Coordinates) {
  return (
    typeof value.latitude === "number" &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === "number" &&
    Number.isFinite(value.longitude)
  );
}

export function getDistanceRate(distanceKm: number): DistanceRate {
  if (distanceKm <= 3) {
    return "Near";
  }

  if (distanceKm <= 10) {
    return "Mid";
  }

  return "Far";
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }

  return `${distanceKm.toFixed(1)} km away`;
}

export function getDistanceInfo(
  origin: StoredLocation | null,
  destination: Coordinates
): DistanceInfo | null {
  if (!origin || !hasCoordinates(destination)) {
    return null;
  }

  const distanceMeters = getDistance(
    { latitude: origin.latitude, longitude: origin.longitude },
    {
      latitude: destination.latitude as number,
      longitude: destination.longitude as number
    }
  );
  const distanceKm = distanceMeters / 1000;

  return {
    distanceKm,
    distanceLabel: formatDistance(distanceKm),
    rate: getDistanceRate(distanceKm)
  };
}
