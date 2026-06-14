import Link from "next/link";
import { ResendConfirmationForm } from "./resend-confirmation-form";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams
}: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ocean-bg)] px-6 font-sans text-[var(--ocean-ink)]">
      <section className="w-full max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Check your email
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
          Confirm your Paiduay account
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-500">
          We sent a confirmation link{email ? ` to ${email}` : ""}. Open your
          email, click the confirm button, and you will be redirected back to the
          app.
        </p>
        <ResendConfirmationForm initialEmail={email} />
        <Link
          href="/login"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
}
