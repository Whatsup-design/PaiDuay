import type { Reward, RewardStatus } from "../../app/(main)/reward/data";
import { rewardStatuses } from "../../app/(main)/reward/data";
import { RewardStatusSection } from "@/components/reward/reward-status-section";

type RewardDiscoveryProps = {
  rewards: Reward[];
};

export function RewardDiscovery({ rewards }: RewardDiscoveryProps) {
  return (
    <section className="space-y-7">
      {rewardStatuses.map((status) => (
        <RewardStatusSection
          key={status}
          status={status}
          rewards={getRewardsByStatus(rewards, status)}
        />
      ))}
    </section>
  );
}

function getRewardsByStatus(rewards: Reward[], status: RewardStatus) {
  return rewards.filter((reward) => reward.status === status);
}
