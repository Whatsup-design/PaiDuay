"use client";

import Image from "next/image";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/helpers/password-input";
import { useSignUpForm } from "./use-sign-up-form";

export function SignUpForm() {
  const {
    errors,
    handleSignUpSubmit,
    isSubmitting,
    isSuccessMessage,
    statusMessage
  } = useSignUpForm();

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-sm">
        <p className="mb-16 text-3xl font-semibold tracking-tight text-neutral-950">
          PaiDuay
        </p>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Create Account
          </h1>
          <p className="mt-3 text-sm leading-5 text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="cursor-pointer font-semibold text-neutral-900 underline underline-offset-2"
            >
              Login now
            </Link>
            .
          </p>
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
          Register with Google
        </button>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-sm font-normal text-neutral-400">
            or
          </span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <form className="space-y-7" onSubmit={handleSignUpSubmit} noValidate>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />
          {errors.username ? (
            <p id="username-error" className="-mt-5 text-xs font-medium text-red-500">
              {errors.username}
            </p>
          ) : null}

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />
          {errors.email ? (
            <p id="email-error" className="-mt-5 text-xs font-medium text-red-500">
              {errors.email}
            </p>
          ) : null}

          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            hasError={Boolean(errors.password)}
            describedBy={errors.password ? "password-error" : undefined}
          />
          {errors.password ? (
            <p id="password-error" className="-mt-5 text-xs font-medium text-red-500">
              {errors.password}
            </p>
          ) : null}

          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            placeholder="Confirm password"
            hasError={Boolean(errors.confirmPassword)}
            describedBy={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword ? (
            <p
              id="confirm-password-error"
              className="-mt-5 text-xs font-medium text-red-500"
            >
              {errors.confirmPassword}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full cursor-pointer rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          {statusMessage ? (
            <p
              className={`text-center text-xs font-medium ${
                isSuccessMessage ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {statusMessage}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
