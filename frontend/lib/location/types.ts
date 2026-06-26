export type StoredLocation = {
  latitude: number;
  longitude: number;
  label: "Current location";
  updatedAt: string;
  permissionState: "granted";
};

export type LocationPermissionStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "error";

export type DistanceRate = "Near" | "Mid" | "Far";

export type DistanceInfo = {
  distanceKm: number;
  distanceLabel: string;
  rate: DistanceRate;
};

export type Coordinates = {
  latitude?: number | null;
  longitude?: number | null;
};
