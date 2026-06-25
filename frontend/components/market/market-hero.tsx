import { Search, ShoppingBag } from "lucide-react";

export function MarketHero() {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
            <ShoppingBag className="h-3.5 w-3.5" />
            Phuket local marketplace
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Discover local markets, services, and wellness experiences.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            Browse mock products and services from Phuket communities before the
            real marketplace data is connected.
          </p>
        </div>

        <label className="flex h-12 w-full items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 shadow-sm lg:max-w-sm">
          <Search className="h-4 w-4 text-neutral-400" />
          <span className="sr-only">Search market items</span>
          <input
            type="search"
            placeholder="Search local items"
            className="w-full bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </label>
      </div>
    </section>
  );
}
