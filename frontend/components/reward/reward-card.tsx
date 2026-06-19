import { CalendarDays, MapPin, TicketPercent } from "lucide-react";
import type { Reward } from "../../app/(main)/reward/data";

type RewardCardProps = {
  reward: Reward;
};

const statusClassName: Record<Reward["status"], string> = {
  Available: "bg-emerald-50 text-emerald-700",
  Used: "bg-neutral-100 text-neutral-500",
  Expired: "bg-rose-50 text-rose-700"
};

function getRewardPreview(text: string, wordLimit = 15) {
  const words = text.trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return text;
  }

  return `${words.slice(0, wordLimit).join(" ")}...`;
}

export function RewardCard({ reward }: RewardCardProps) {
  const isUsable = reward.status === "Available";
  const conditionPreview = getRewardPreview(reward.condition);

  return (
    <article className="group grid h-[25rem] grid-rows-[8rem_minmax(0,1fr)_4rem] overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-[0_8px_24px_rgb(15_23_42_/_7%)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgb(15_23_42_/_10%)]">
      <div className="relative overflow-hidden bg-neutral-50">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${reward.gradient} opacity-55 grayscale-[12%] transition duration-300 group-hover:opacity-70`}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/55 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName[reward.status]}`}
        >
          {reward.status}
        </span>
      </div>

      <div className="min-h-0 overflow-hidden p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {reward.type}
            </p>
            <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-950">
              {reward.title}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-white">
            {reward.value}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-neutral-600">
          {reward.partner}
        </p>

        <div className="mt-3 grid gap-1.5 text-xs font-medium text-neutral-500">
          <p className="flex items-center gap-2">
            <TicketPercent className="h-3.5 w-3.5 text-neutral-400" />
            <span className="truncate">{reward.minimumSpend}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
            <span className="truncate">{reward.validUntil}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            <span className="truncate">{reward.location}</span>
          </p>
        </div>

        <div className="relative mt-2 h-9 overflow-hidden">
          <p className="text-xs leading-5 text-neutral-500">
            {conditionPreview}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white to-white/0" />
        </div>
      </div>
      <div className="border-t border-neutral-100 bg-white p-3">
        <button
          type="button"
          disabled={!isUsable}
          className={`h-10 w-full rounded-md px-4 text-sm font-semibold transition ${
            isUsable
              ? "cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
              : "cursor-not-allowed bg-neutral-100 text-neutral-400"
          }`}
        >
          {isUsable ? "Use Reward" : reward.status}
        </button>
      </div>
    </article>
  );
}
