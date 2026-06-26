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

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
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

export type LogoutResponse = {
  message: string;
  data: null;
};

export type RefreshResponse = LoginResponse;

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

export function logout() {
  return apiFetch<LogoutResponse>("/authen/logout", {
    method: "POST"
  });
}

export function refreshSession(refreshToken: string) {
  return apiFetch<RefreshResponse>("/authen/refresh", {
    method: "POST",
    body: {
      refreshToken
    }
  });
}
