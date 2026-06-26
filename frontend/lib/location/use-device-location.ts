"use client";

import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import type {
  LocationPermissionStatus,
  StoredLocation
} from "@/lib/location/types";

const LOCATION_STORAGE_KEY = "paiduay_location";
const LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 60_000,
  timeout: 12_000
};

function getLocationErrorMessage(status: LocationPermissionStatus) {
  switch (status) {
    case "denied":
      return "Location access denied. Enable permission in browser settings.";
    case "unavailable":
      return "Location is unavailable on this browser or device.";
    case "error":
      return "Unable to get your location. Please try again.";
    default:
      return "";
  }
}

function mapGeolocationError(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "denied";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "unavailable";
  }

  return "error";
}

export function useDeviceLocation() {
  const [location, setLocation, clearLocation] =
    useLocalStorage<StoredLocation | null>(LOCATION_STORAGE_KEY, null, {
      initializeWithValue: false
    });
  const [status, setStatus] = useState<LocationPermissionStatus>(
    location ? "granted" : "idle"
  );

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation: StoredLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "Current location",
          updatedAt: new Date().toISOString(),
          permissionState: "granted"
        };

        setLocation(nextLocation);
        setStatus("granted");
      },
      (error) => {
        setStatus(mapGeolocationError(error));
      },
      LOCATION_OPTIONS
    );
  }, [setLocation]);

  return {
    location,
    status: location && status === "idle" ? "granted" : status,
    message: getLocationErrorMessage(status),
    requestLocation,
    clearLocation
  };
}
