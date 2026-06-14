"use client";

import {
  getStringFormValue,
  getTrimmedFormValue,
  isValidEmail,
  type FieldErrors
} from "@/components/auth/helpers/auth-validation";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type LoginField = "email" | "password";

export type LoginErrors = FieldErrors<LoginField>;

type LoginPayload = {
  email: string;
  password: string;
};

function validateLoginPayload(payload: LoginPayload) {
  const errors: LoginErrors = {};

  if (!isValidEmail(payload.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (payload.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

function getLoginPayload(formData: FormData): LoginPayload {
  return {
    email: getTrimmedFormValue(formData, "email"),
    password: getStringFormValue(formData, "password")
  };
}

export function useLoginForm() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const form = event.currentTarget;
    const payload = getLoginPayload(new FormData(form));
    const nextErrors = validateLoginPayload(payload);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await login(payload);

      setErrors({});
      form.reset();
      router.push("/mock");
    } catch (error) {
      setStatusMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to login. Please try again."
      );
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return {
    errors,
    handleLoginSubmit,
    isSubmitting,
    statusMessage
  };
}
