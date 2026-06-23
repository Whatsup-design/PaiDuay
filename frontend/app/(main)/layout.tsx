import type { ReactNode } from "react";
import { AuthRequiredState } from "@/components/auth/auth-required-state";
import { AppShell } from "@/components/layout/app-shell";
import { ApiError, type ApiResponse } from "@/lib/api";
import { getPageAuthDetails, serverApi } from "@/lib/server-api";

type CurrentUserResponse = {
  user: {
    id: string;
    email?: string;
  };
};

export const dynamic = "force-dynamic";

async function verifyPageAuth() {
  try {
    await serverApi.get<ApiResponse<CurrentUserResponse>>("/user/me");

    return {
      ok: true as const,
      message: ""
    };
  } catch (error) {
    return {
      ok: false as const,
      message:
        error instanceof ApiError
          ? error.message
          : "Unable to verify your session. Please try again.",
      details: getPageAuthDetails(error)
    };
  }
}

export default async function MainLayout({ children }: { children: ReactNode }) {
  const auth = await verifyPageAuth();

  if (!auth.ok) {
    return (
      <AuthRequiredState
        message={auth.message}
        details={auth.details}
        fullScreen
      />
    );
  }

  return (
    <AppShell>{children}</AppShell>
  );
}
