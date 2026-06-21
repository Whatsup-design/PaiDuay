import { Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <SearchX className="h-6 w-6" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/home"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </section>
    </main>
  );
}
