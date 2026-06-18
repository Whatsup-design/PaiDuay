import type { OtopCategory } from "../../app/(main)/otop/data";

type CategoryFilterProps = {
  categories: readonly OtopCategory[];
  selectedCategory: OtopCategory;
  onCategoryChange: (category: OtopCategory) => void;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-color:rgb(229_231_235_/_15%)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200/15 [&::-webkit-scrollbar-track]:bg-neutral-50/15">
      {categories.map((category) => {
        const isActive = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
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
