import { redemptionSteps, type Reward } from "@/app/(main)/reward/data";
import { RedemptionFlow } from "@/components/reward/redemption-flow";
import { RewardDiscovery } from "@/components/reward/reward-discovery";
import { RewardHero } from "@/components/reward/reward-hero";

export function RewardPageContent({ rewards }: { rewards: Reward[] }) {
  return (
    <div className="space-y-6 lg:space-y-7">
      <RewardHero />
      <RedemptionFlow steps={redemptionSteps} />
      <RewardDiscovery rewards={rewards} />
    </div>
  );
}
