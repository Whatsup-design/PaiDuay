type QuestStepListProps = {
  steps: string[];
};

export function QuestStepList({ steps }: QuestStepListProps) {
  return (
    <ol className="mt-4 space-y-2">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-2 text-xs leading-5 text-neutral-500">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-600">
            {index + 1}
          </span>
          <span className="line-clamp-2">{step}</span>
        </li>
      ))}
    </ol>
  );
}
