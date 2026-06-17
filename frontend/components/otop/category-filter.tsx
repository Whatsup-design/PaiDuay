import type { OtopCategory } from "../../app/(main)/otop/data";

type CategoryFilterProps = {
  categories: readonly OtopCategory[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const isActive = category === "All";

        return (
          <button
            key={category}
            type="button"
            className={`h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs font-semibold transition ${
              isActive
                ? "border-neutral-300 bg-neutral-200 text-neutral-950"
                : "border-neutral-200 bg-neutral-50/70 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
