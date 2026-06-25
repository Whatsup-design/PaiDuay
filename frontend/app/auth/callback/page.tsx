"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getAuthSessionDebug,
  storeAuthSession,
  type AuthSession,
  type AuthSessionDebug
} from "@/lib/auth-session";

function getSafeNextPath(value: string | null) {
  if (!value?.startsWith("/")) {
    return "/home";
  }

  return value;
}

type CallbackDebug = {
  href: string;
  hashKeys: string[];
  queryKeys: string[];
  hasHashAccessToken: boolean;
  hasQueryAccessToken: boolean;
  beforeStore?: AuthSessionDebug;
  afterStore?: AuthSessionDebug;
};

function getCallbackParams() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);

  return {
    hashParams,
    queryParams
  };
}

function getSessionFromCallback(): { session: AuthSession; nextPath: string } {
  const { hashParams, queryParams } = getCallbackParams();
  const accessToken = hashParams.get("access_token");
  const queryAccessToken = queryParams.get("access_token");
  const refreshToken =
    hashParams.get("refresh_token") ?? queryParams.get("refresh_token") ?? undefined;
  const expiresAtRaw = hashParams.get("expires_at") ?? queryParams.get("expires_at");
  const expiresAt =
    expiresAtRaw === null ? undefined : Number.parseInt(expiresAtRaw, 10);

  return {
    session: accessToken || queryAccessToken
      ? {
          access_token: accessToken ?? queryAccessToken ?? "",
          refresh_token: refreshToken,
          expires_at: Number.isFinite(expiresAt) ? expiresAt : undefined
        }
      : null,
    nextPath: getSafeNextPath(hashParams.get("next") ?? queryParams.get("next"))
  };
}

function getSafeCallbackDebug(): CallbackDebug {
  const { hashParams, queryParams } = getCallbackParams();

  return {
    href: `${window.location.origin}${window.location.pathname}`,
    hashKeys: Array.from(hashParams.keys()),
    queryKeys: Array.from(queryParams.keys()),
    hasHashAccessToken: Boolean(hashParams.get("access_token")),
    hasQueryAccessToken: Boolean(queryParams.get("access_token"))
  };
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing Google login...");
  const [canGoLogin, setCanGoLogin] = useState(false);
  const [debug, setDebug] = useState<CallbackDebug | null>(null);

  useEffect(() => {
    const callbackDebug = getSafeCallbackDebug();
    const beforeStore = getAuthSessionDebug();
    const { session, nextPath } = getSessionFromCallback();

    globalThis.setTimeout(() => {
      setDebug({
        ...callbackDebug,
        beforeStore
      });
    }, 0);

    if (!session?.access_token) {
      globalThis.setTimeout(() => {
        setMessage("Google login did not return a session token.");
        setCanGoLogin(true);
      }, 0);
      return;
    }

    const isStored = storeAuthSession(session);
    const afterStore = getAuthSessionDebug();

    globalThis.setTimeout(() => {
      setDebug({
        ...callbackDebug,
        beforeStore,
        afterStore
      });
    }, 0);

    if (!isStored) {
      globalThis.setTimeout(() => {
        setMessage("The browser could not store your Google login session.");
        setCanGoLogin(true);
      }, 0);
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

        {debug ? (
          <pre className="mt-6 max-h-64 overflow-auto rounded-md bg-neutral-950 p-4 text-left text-xs leading-5 text-neutral-100">
            {JSON.stringify(debug, null, 2)}
          </pre>
        ) : null}
      </section>
    </main>
  );
}
