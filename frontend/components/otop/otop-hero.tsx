import { MapPin, Navigation, Store } from "lucide-react";

import type { OtopLocation } from "../../app/(main)/otop/data";
import type {
  LocationPermissionStatus,
  StoredLocation
} from "@/lib/location/types";

type OtopHeroProps = {
  locations: OtopLocation[];
  location: StoredLocation | null;
  locationStatus: LocationPermissionStatus;
  locationMessage: string;
  onSetLocation: () => void;
};

function formatCoordinate(value: number) {
  return value.toFixed(4);
}

function getLocationHint(
  location: StoredLocation | null,
  status: LocationPermissionStatus,
  message: string
) {
  if (location) {
    return `Lat ${formatCoordinate(location.latitude)}, Lng ${formatCoordinate(
      location.longitude
    )}`;
  }

  if (status === "requesting") {
    return "Waiting for browser location permission...";
  }

  return message || "Choose where you are or where you want to explore.";
}

export function OtopHero({
  locations,
  location,
  locationStatus,
  locationMessage,
  onSetLocation
}: OtopHeroProps) {
  const isRequesting = locationStatus === "requesting";
  const hasLocationIssue = ["denied", "unavailable", "error"].includes(
    locationStatus
  );

  return (
    <section className="rounded-xl bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-5 py-8 md:px-8 md:py-10">
      <div>
        <div className="max-w-4xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-700 text-white shadow-[var(--shadow-sm)]">
            <Store className="h-5 w-5" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Phuket OTOP
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
            Explore OTOP near your place
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
            Set a location first so PaiKan can guide visitors to nearby
            villages, local products, and community services instead of making
            them search from zero.
          </p>

          <div className="mt-8 rounded-xl border border-sky-200 bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-lg bg-sky-50 px-4 py-3 text-left">
                <MapPin className="h-5 w-5 shrink-0 text-sky-700" />
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    {location ? location.label : "Current discovery area"}
                  </p>
                  <p
                    className={`text-sm ${
                      hasLocationIssue ? "text-rose-600" : "text-neutral-500"
                    }`}
                  >
                    {getLocationHint(
                      location,
                      locationStatus,
                      locationMessage
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isRequesting}
                onClick={onSetLocation}
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Navigation className="h-4 w-4" />
                {isRequesting ? "Setting..." : "Set location"}
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {locations.map((location, index) => (
                <button
                  key={location.name}
                  type="button"
                  className={`cursor-pointer rounded-lg border p-3 text-left transition ${
                    index === 0
                      ? "border-sky-700 bg-sky-700 text-white"
                      : "border-sky-100 bg-white text-neutral-950 hover:bg-sky-50"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {location.name}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      index === 0 ? "text-sky-100" : "text-neutral-500"
                    }`}
                  >
                    {location.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
