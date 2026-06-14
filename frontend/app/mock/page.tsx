type MockPageProps = {
  searchParams: Promise<{
    verified?: string;
  }>;
};

export default async function MockPage({ searchParams }: MockPageProps) {
  const { verified } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ocean-bg)] px-6 font-sans text-[var(--ocean-ink)]">
      <section className="w-full max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Mock Main Page
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950">
          Login redirect works.
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-500">
          This page is a temporary placeholder for the authenticated Paiduay
          experience.
        </p>
        {verified === "1" ? (
          <p className="mt-6 text-sm font-semibold text-blue-600">
            Email confirmed successfully.
          </p>
        ) : null}
      </section>
    </main>
  );
}
