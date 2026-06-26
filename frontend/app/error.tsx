"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          500
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          The app hit an unexpected problem. Try again or return home.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/home"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
