import type { Quest } from "../../app/(main)/quest/data";

type QuestDetailStepsProps = {
  quest: Quest;
};

export function QuestDetailSteps({ quest }: QuestDetailStepsProps) {
  return (
    <section className="rounded-xl border border-neutral-100 bg-white p-5 shadow-[0_8px_24px_rgb(15_23_42_/_6%)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Quest Steps
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Complete each checkpoint to finish this quest.
          </p>
        </div>
        <p className="text-xs font-semibold text-neutral-400">
          {quest.steps.length} checkpoints
        </p>
      </div>

      <ol className="mt-5 space-y-3">
        {quest.steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 rounded-md border border-neutral-100 bg-neutral-50/70 p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-neutral-950">
                Checkpoint {index + 1}
              </h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
