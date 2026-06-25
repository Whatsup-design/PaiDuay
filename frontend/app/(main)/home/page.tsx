import { Search } from "lucide-react";

const marketCards = [
  {
    title: "Old Phuket Town",
    subtitle: "Local walking market",
    className: "from-sky-200 via-cyan-100 to-rose-100"
  },
  {
    title: "Handmade OTOP",
    subtitle: "Baskets, crafts, and community goods",
    className: "from-amber-200 via-orange-100 to-yellow-50"
  },
  {
    title: "Marine Friendly",
    subtitle: "Responsible tourism rewards",
    className: "from-slate-200 via-sky-100 to-cyan-50"
  }
];

function CouponTicket({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute hidden h-20 w-44 rotate-[-16deg] rounded-sm bg-red-600 p-2 text-white shadow-lg md:block ${className}`}
    >
      <div className="relative flex h-full items-center justify-center border border-white/60">
        <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white" />
        <span className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white" />
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/60">
            Gift coupon
          </p>
          <p className="text-xl font-semibold tracking-wide">SAVE 10%</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-5 py-10 lg:px-8">
      <section className="relative mx-auto flex min-h-[34rem] max-w-6xl flex-col items-center justify-center overflow-hidden">
        <CouponTicket className="left-4 top-40" />
        <CouponTicket className="right-24 top-20 rotate-[12deg]" />

        <div className="w-full max-w-3xl text-center">
          <h1 className="text-5xl font-medium leading-tight tracking-tight text-black drop-shadow-md md:text-6xl">
            Search Your
            <span className="block font-bold uppercase">Market</span>
          </h1>

          <label className="mt-12 flex min-h-24 w-full items-start gap-3 rounded-xl border border-sky-300 bg-sky-50 px-6 py-5 text-left shadow-[0_8px_18px_rgb(2_132_199_/_12%)]">
            <Search className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
            <span className="sr-only">Search market</span>
            <textarea
              rows={2}
              placeholder="Enter your place . . ."
              className="w-full resize-none bg-transparent text-base font-medium text-sky-950 outline-none placeholder:text-neutral-500"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl rounded-lg border border-neutral-100 bg-white p-3 shadow-[0_8px_30px_rgb(15_23_42_/_10%)]">
        <div className="grid gap-3 md:grid-cols-3">
          {marketCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-md border border-neutral-100 bg-white shadow-[var(--shadow-sm)]"
            >
              <div
                className={`h-48 bg-gradient-to-br ${card.className} transition duration-300 group-hover:scale-[1.02]`}
              />
              <div className="p-4">
                <h2 className="text-base font-semibold text-neutral-950">
                  {card.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {card.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
