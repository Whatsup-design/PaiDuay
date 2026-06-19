type RedemptionFlowProps = {
  steps: string[];
};

export function RedemptionFlow({ steps }: RedemptionFlowProps) {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          Redemption Flow
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          UI-only flow for redeeming rewards in front of partner staff.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <article
            key={step}
            className="relative rounded-md border border-neutral-200/80 bg-white p-4 shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <p className="mt-3 text-sm font-semibold leading-6 text-neutral-950">
              {step}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
