import { apiFetch } from "@/lib/api";

export type SignUpRequest = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export function signUp(input: SignUpRequest) {
  return apiFetch<SignUpResponse>("/authen/signup", {
    method: "POST",
    body: input
  });
}
