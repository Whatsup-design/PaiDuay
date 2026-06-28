"use client";

import Link from "next/link";
import { PasswordInput } from "@/components/auth/helpers/password-input";
import { useLoginForm } from "./use-login-form";

type LoginFormProps = {
  registrationMessage?: string;
};

export function LoginForm({ registrationMessage }: LoginFormProps) {
  const { errors, handleLoginSubmit, isSubmitting, statusMessage } =
    useLoginForm();

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-sm">
        <p className="mb-28 text-3xl font-semibold tracking-tight text-neutral-950">
          PaiTiew
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

        <form className="space-y-8" onSubmit={handleLoginSubmit} noValidate>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />
          {errors.email ? (
            <p
              id="login-email-error"
              className="-mt-5 text-xs font-medium text-red-500"
            >
              {errors.email}
            </p>
          ) : null}

          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            hasError={Boolean(errors.password)}
            describedBy={errors.password ? "login-password-error" : undefined}
          />
          {errors.password ? (
            <p
              id="login-password-error"
              className="-mt-5 text-xs font-medium text-red-500"
            >
              {errors.password}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full cursor-pointer rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isSubmitting ? "Logging in..." : "Login Now"}
          </button>

          {registrationMessage ? (
            <p className="-mt-5 text-center text-sm font-semibold text-blue-600">
              {registrationMessage}
            </p>
          ) : null}

          {statusMessage ? (
            <p className="-mt-5 text-center text-xs font-medium text-red-500">
              {statusMessage}
            </p>
          ) : null}
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
