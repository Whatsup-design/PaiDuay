import type { ProductService } from "../../app/(main)/otop/data";

type ProductServiceCardProps = {
  item: ProductService;
};

export function ProductServiceCard({ item }: ProductServiceCardProps) {
  return (
    <article className="w-[13.5rem] shrink-0 snap-start overflow-hidden rounded-md border border-neutral-200/80 bg-neutral-50/70 shadow-[0_6px_18px_rgb(15_23_42_/_6%)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:w-[16rem]">
      <div
        className={`h-28 bg-gradient-to-br opacity-35 grayscale ${item.gradient}`}
      />
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
            {item.type}
          </span>
          <span className="text-xs font-semibold text-neutral-950">
            {item.price}
          </span>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-950">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{item.village}</p>
      </div>
    </article>
  );
}
