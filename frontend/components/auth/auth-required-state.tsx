import Link from "next/link";

type AuthRequiredStateProps = {
  title?: string;
  message?: string;
  details?: string | null;
  fullScreen?: boolean;
};

export function AuthRequiredState({
  title = "Please login to continue",
  message = "Authentication required. Please login.",
  details = null,
  fullScreen = false
}: AuthRequiredStateProps) {
  const content = (
    <section className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-[var(--shadow-sm)]">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-500">{message}</p>

      {details ? (
        <pre className="mt-4 max-h-48 overflow-auto rounded-md bg-neutral-950 p-3 text-left text-xs leading-5 text-white">
          {details}
        </pre>
      ) : null}

      <Link
        href="/login"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Go to login
      </Link>
    </section>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      {content}
    </main>
  );
}
