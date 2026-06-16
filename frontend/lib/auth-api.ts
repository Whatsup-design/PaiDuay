import { apiFetch, buildApiUrl } from "@/lib/api";

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

export function getGoogleOAuthUrl(nextPath = "/home") {
  const params = new URLSearchParams({ next: nextPath });

  return buildApiUrl(`/authen/google?${params.toString()}`);
}
