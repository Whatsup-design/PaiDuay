"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCurrentSession } from "@/lib/auth-api";
import { clearAuthSession, storeAuthSession } from "@/lib/auth-session";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath?.startsWith("/") || nextPath.startsWith("//")) {
    return "/home";
  }

  return nextPath;
}

export function OAuthSessionSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncStartedRef = useRef(false);
  const [message, setMessage] = useState("Syncing your Google session...");

  useEffect(() => {
    if (syncStartedRef.current) {
      return;
    }

    syncStartedRef.current = true;

    async function syncSession() {
      const nextPath = getSafeNextPath(searchParams.get("next"));

      try {
        const response = await getCurrentSession();

        if (!response.data.session?.access_token) {
          throw new Error("No session token returned");
        }

        const isStored = storeAuthSession(response.data.session);

        if (!isStored) {
          throw new Error("Unable to store session");
        }

        setMessage("Session synced. Redirecting...");
        router.replace(nextPath);
      } catch {
        clearAuthSession();
        router.replace("/login?reason=oauth_sync_failed");
      }
    }

    void syncSession();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm rounded-lg border border-neutral-100 bg-neutral-50/70 p-6 text-center shadow-[0_10px_30px_rgb(15_23_42_/_8%)]">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-200 border-t-sky-700" />
        <h1 className="mt-5 text-lg font-semibold text-neutral-950">
          Finishing Google sign in
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{message}</p>
      </section>
    </main>
  );
}
