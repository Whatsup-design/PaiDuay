"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { storeAuthSession, type AuthSession } from "@/lib/auth-session";

function getSafeNextPath(value: string | null) {
  if (!value?.startsWith("/")) {
    return "/home";
  }

  return value;
}

function getSessionFromHash(): { session: AuthSession; nextPath: string } {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token") ?? undefined;
  const expiresAtRaw = hashParams.get("expires_at");
  const expiresAt =
    expiresAtRaw === null ? undefined : Number.parseInt(expiresAtRaw, 10);

  return {
    session: accessToken
      ? {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Number.isFinite(expiresAt) ? expiresAt : undefined
        }
      : null,
    nextPath: getSafeNextPath(hashParams.get("next"))
  };
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing Google login...");
  const [canGoLogin, setCanGoLogin] = useState(false);

  useEffect(() => {
    const { session, nextPath } = getSessionFromHash();

    if (!session?.access_token) {
      setMessage("Google login did not return a session token.");
      setCanGoLogin(true);
      return;
    }

    const isStored = storeAuthSession(session);

    if (!isStored) {
      setMessage("The browser could not store your Google login session.");
      setCanGoLogin(true);
      return;
    }

    window.history.replaceState(null, "", "/auth/callback");
    window.location.assign(nextPath);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-[var(--shadow-sm)]">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          Google login
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">{message}</p>

        {canGoLogin ? (
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Go to login
          </Link>
        ) : null}
      </section>
    </main>
  );
}
