import { RedemptionFlow } from "@/components/reward/redemption-flow";
import { RewardDiscovery } from "@/components/reward/reward-discovery";
import { RewardHero } from "@/components/reward/reward-hero";
import { redemptionSteps, rewards } from "@/app/(main)/reward/data";

export default function RewardPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-7">
        <RewardHero />
        <RedemptionFlow steps={redemptionSteps} />
        <RewardDiscovery rewards={rewards} />
      </div>
    </main>
  );
}
