import { Search, ShoppingBag } from "lucide-react";

type MarketHeroProps = {
  searchValue: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
};

export function MarketHero({
  searchValue,
  isSearching,
  onSearchChange
}: MarketHeroProps) {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
            <ShoppingBag className="h-3.5 w-3.5" />
            Phuket local shop
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Discover Phuket stores, services, products, and markets.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            Browse local shop data from Phuket communities, stores, and service
            providers.
          </p>
        </div>

        <label className="flex h-12 w-full items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 shadow-sm lg:max-w-sm">
          <Search className="h-4 w-4 text-neutral-400" />
          <span className="sr-only">Search shop items</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search shop items"
            className="w-full bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
          {isSearching && (
            <span className="text-xs font-semibold text-sky-700">
              Searching
            </span>
          )}
        </label>
      </div>
    </section>
  );
}
