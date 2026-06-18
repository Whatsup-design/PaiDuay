import { CheckCircle2 } from "lucide-react";
import type { Quest } from "../../app/(main)/quest/data";

type QuestDetailPanelProps = {
  quest: Quest;
};

export function QuestDetailPanel({ quest }: QuestDetailPanelProps) {
  return (
    <aside className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 shadow-[0_8px_24px_rgb(15_23_42_/_5%)]">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Quest Type
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-950">
            {quest.type === "Province"
              ? "Province Quest"
              : "Village & Market Quest"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            MVP Fit
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {quest.type === "Province"
              ? "Best for long campaign and passport-style tourism."
              : "Best for short local missions with clear completion."}
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Ready to start
              </p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                This is UI-only for now. Later this button can create user quest
                progress in the backend.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="h-11 w-full cursor-pointer rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Start Quest
        </button>
      </div>
    </aside>
  );
}
