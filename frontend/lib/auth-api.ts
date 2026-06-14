import { apiFetch } from "@/lib/api";

export type SignUpRequest = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ResendConfirmationRequest = {
  email: string;
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
};

export type SignUpResponse = {
  message: string;
  data: {
    user: SupabaseAuthUser | null;
    session: SupabaseSession | null;
    alreadyRegistered?: boolean;
    warning?: string;
  };
};

export type LoginResponse = {
  message: string;
  data: {
    user: SupabaseAuthUser | null;
    session: SupabaseSession | null;
  };
};

export type ResendConfirmationResponse = {
  message: string;
};

export function login(input: LoginRequest) {
  return apiFetch<LoginResponse>("/authen/login", {
    method: "POST",
    body: input
  });
}

export function signUp(input: SignUpRequest) {
  return apiFetch<SignUpResponse>("/authen/signup", {
    method: "POST",
    body: input
  });
}

export function resendConfirmation(input: ResendConfirmationRequest) {
  return apiFetch<ResendConfirmationResponse>("/authen/resend-confirmation", {
    method: "POST",
    body: input
  });
}
