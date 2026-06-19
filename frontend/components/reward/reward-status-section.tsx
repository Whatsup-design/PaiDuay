import type { Reward, RewardStatus } from "../../app/(main)/reward/data";
import { RewardCard } from "@/components/reward/reward-card";

type RewardStatusSectionProps = {
  status: RewardStatus;
  rewards: Reward[];
};

const statusDescription: Record<RewardStatus, string> = {
  Available: "Rewards that can be used with partner staff now.",
  Used: "Rewards that have already been redeemed.",
  Expired: "Rewards that are no longer valid."
};

export function RewardStatusSection({
  status,
  rewards
}: RewardStatusSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            {status}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {statusDescription[status]}
          </p>
        </div>
        <p className="text-xs font-semibold text-neutral-400">
          {rewards.length} rewards
        </p>
      </div>

      {rewards.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-color:rgb(229_231_235_/_15%)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200/15 [&::-webkit-scrollbar-track]:bg-neutral-50/15">
          {rewards.map((reward) => (
            <div key={reward.id} className="w-72 shrink-0">
              <RewardCard reward={reward} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-neutral-400">
          No {status.toLowerCase()} rewards yet.
        </p>
      )}
    </section>
  );
}
