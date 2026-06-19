import { Gift, QrCode, ShieldCheck } from "lucide-react";

const rewardHighlights = [
  {
    icon: Gift,
    title: "Multiple reward types",
    description: "Discounts, free items, badges, and cross-partner benefits."
  },
  {
    icon: QrCode,
    title: "Staff-facing redemption",
    description: "Show QR or short code in front of the partner staff."
  },
  {
    icon: ShieldCheck,
    title: "Clear status",
    description: "Available, used, and expired rewards are separated."
  }
];

export function RewardHero() {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 sm:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
            <Gift className="h-3.5 w-3.5" />
            Reward wallet
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Collect local rewards and redeem them with partner staff.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            The MVP reward wallet separates usable, used, and expired rewards
            while preparing a QR or short-code redemption flow for real stores.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {rewardHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-md border border-neutral-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-950">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
