"use client";

import { ApiError } from "@/lib/api";
import { signUp } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  getStringFormValue,
  getTrimmedFormValue,
  isValidEmail,
  type FieldErrors
} from "@/components/auth/helpers/auth-validation";

type SignUpField = "username" | "email" | "password" | "confirmPassword";

export type SignUpErrors = FieldErrors<SignUpField>;

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

  if (!isValidEmail(payload.email)) {
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

function getSignUpPayload(formData: FormData): SignUpPayload {
  return {
    username: getTrimmedFormValue(formData, "username"),
    email: getTrimmedFormValue(formData, "email"),
    password: getStringFormValue(formData, "password"),
    confirmPassword: getStringFormValue(formData, "confirmPassword")
  };
}

export function useSignUpForm() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function redirectToVerifyEmail(email: string) {
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  async function handleSignUpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const form = event.currentTarget;
    const payload = getSignUpPayload(new FormData(form));
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
      redirectToVerifyEmail(payload.email);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({});
        setIsSuccessMessage(true);
        form.reset();
        router.push("/login?registered=1");
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

  return {
    errors,
    handleSignUpSubmit,
    isSubmitting,
    isSuccessMessage,
    statusMessage
  };
}
