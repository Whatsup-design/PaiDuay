import type { DistanceInfo, DistanceRate } from "@/lib/location/types";

type DistanceBadgeProps = {
  distanceInfo?: DistanceInfo | null;
  className?: string;
};

const rateClassName: Record<DistanceRate, string> = {
  Near: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Mid: "bg-amber-50 text-amber-700 ring-amber-100",
  Far: "bg-slate-50 text-slate-600 ring-slate-200"
};

export function DistanceBadge({
  distanceInfo,
  className = ""
}: DistanceBadgeProps) {
  if (!distanceInfo) {
    return null;
  }

  return (
    <span
      className={`flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${rateClassName[distanceInfo.rate]} ${className}`}
    >
      {distanceInfo.distanceLabel} · {distanceInfo.rate}
    </span>
  );
}
