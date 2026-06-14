"use client";

import { isValidEmail } from "@/components/auth/helpers/auth-validation";
import { ApiError } from "@/lib/api";
import { resendConfirmation } from "@/lib/auth-api";
import { useState } from "react";

type ResendConfirmationFormProps = {
  initialEmail?: string;
};

export function ResendConfirmationForm({
  initialEmail = ""
}: ResendConfirmationFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResendSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      setMessage("Please enter a valid email.");
      setIsSuccessMessage(false);
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setIsSuccessMessage(false);

    try {
      const response = await resendConfirmation({ email: trimmedEmail });

      setMessage(response.message);
      setIsSuccessMessage(true);
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to resend confirmation email."
      );
      setIsSuccessMessage(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleResendSubmit} noValidate>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-center text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full cursor-pointer rounded-md border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 shadow-[var(--shadow-sm)] transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
      >
        {isSubmitting ? "Sending..." : "Resend confirmation email"}
      </button>
      {message ? (
        <p
          className={`text-xs font-medium ${
            isSuccessMessage ? "text-blue-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
