"use client";

import Image from "next/image";
import Link from "next/link";

export function LoginForm() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-sm">
        <p className="mb-28 text-3xl font-semibold tracking-tight text-neutral-950">
          PaiDuay
        </p>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Welcome Back!
          </h1>
          <p className="mt-3 text-sm leading-5 text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="cursor-pointer font-semibold text-neutral-900 underline underline-offset-2"
            >
              Create a new account now
            </Link>
            , it&apos;s FREE! Takes less than a minute.
          </p>
        </div>

        <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />

          <button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-neutral-800"
          >
            Login Now
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-sm font-normal text-neutral-400">or</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <button
            type="button"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 shadow-[var(--shadow-sm)] transition hover:bg-neutral-50"
          >
            <Image
              src="/google-provider-icon.webp"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            Login with Google
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-400">
          Forget password{" "}
          <a
            href="#"
            className="cursor-pointer font-semibold text-neutral-900 underline underline-offset-2"
          >
            Click here
          </a>
        </p>
      </div>
    </div>
  );
}
