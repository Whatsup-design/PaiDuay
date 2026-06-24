import { Suspense } from "react";
import { OAuthSessionSync } from "@/components/auth/oauth-session-sync";

export default function OAuthSessionSyncPage() {
  return (
    <Suspense fallback={<OAuthSyncFallback />}>
      <OAuthSessionSync />
    </Suspense>
  );
}

function OAuthSyncFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm rounded-lg border border-neutral-100 bg-neutral-50/70 p-6 text-center shadow-[0_10px_30px_rgb(15_23_42_/_8%)]">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-200 border-t-sky-700" />
        <h1 className="mt-5 text-lg font-semibold text-neutral-950">
          Finishing Google sign in
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Preparing your session...
        </p>
      </section>
    </main>
  );
}
