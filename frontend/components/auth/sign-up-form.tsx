"use client";

import { ApiError } from "@/lib/api";
import { signUp } from "@/lib/auth-api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type SignUpErrors = Partial<
  Record<"username" | "email" | "password" | "confirmPassword", string>
>;

type SignUpPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function validateSignUpPayload(payload: SignUpPayload) {
  const errors: SignUpErrors = {};

  if (payload.username.length < 2) {
    errors.username = "Username must be at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (payload.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (payload.confirmPassword !== payload.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function SignUpForm() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function redirectToLoginAfterSignUp() {
    router.push("/login?registered=1");
  }

  async function handleSignUpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: SignUpPayload = {
      username: String(formData.get("username") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? "")
    };
    const nextErrors = validateSignUpPayload(payload);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      setIsSuccessMessage(false);
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setStatusMessage("");
    setIsSuccessMessage(false);

    try {
      await signUp(payload);

      setErrors({});
      setIsSuccessMessage(true);
      form.reset();
      redirectToLoginAfterSignUp();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({});
        setIsSuccessMessage(true);
        form.reset();
        redirectToLoginAfterSignUp();
        return;
      }

      setStatusMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to create account. Please try again."
      );
      setIsSuccessMessage(false);
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

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

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
          />
          {errors.password ? (
            <p id="password-error" className="-mt-5 text-xs font-medium text-red-500">
              {errors.password}
            </p>
          ) : null}

          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
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
