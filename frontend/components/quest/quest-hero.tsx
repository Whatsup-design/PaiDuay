import { Compass, Flag, Map } from "lucide-react";

const questDirections = [
  {
    icon: Map,
    title: "Province Quest",
    description: "Large passport-style routes across Phuket."
  },
  {
    icon: Flag,
    title: "Village & Market Quest",
    description: "Short local missions designed for MVP completion."
  }
];

export function QuestHero() {
  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 sm:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
            <Compass className="h-3.5 w-3.5" />
            Quest board
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Choose a local mission and explore Phuket with purpose.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            Province quests work like long passport campaigns, while village and
            market quests are short missions that are easier to complete and
            better for the first MVP.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {questDirections.map((direction) => {
            const Icon = direction.icon;

            return (
              <article
                key={direction.title}
                className="rounded-md border border-neutral-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-950">
                      {direction.title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {direction.description}
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
