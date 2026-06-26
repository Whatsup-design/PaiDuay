"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { refreshSession } from "@/lib/auth-api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  storeAuthSession
} from "@/lib/auth-session";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/home";
  }

  if (nextPath.startsWith("/auth/refresh")) {
    return "/home";
  }

  return nextPath;
}

export function SessionRefreshBridge() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isActive = true;

    async function refreshAuthSession() {
      const nextPath = getSafeNextPath(searchParams.get("next"));
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        clearAuthSession();
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      try {
        const response = await refreshSession(refreshToken);

        if (!response.data.session?.access_token) {
          throw new Error("No refreshed session returned");
        }

        const isStored = storeAuthSession(response.data.session);

        if (!isStored) {
          throw new Error("Unable to store refreshed session");
        }

        if (isActive) {
          router.replace(nextPath);
        }
      } catch {
        clearAuthSession();

        if (isActive) {
          router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
        }
      }
    }

    refreshAuthSession();

    return () => {
      isActive = false;
    };
  }, [router, searchParams]);

  return <SessionRefreshLoading />;
}

export function SessionRefreshLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <section className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-neutral-950">
          Restoring your session
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Please wait while PaiDuay checks your login.
        </p>
      </section>
    </main>
  );
}
