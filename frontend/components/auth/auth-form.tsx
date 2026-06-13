import { LoginForm } from "@/components/auth/login-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

type AuthFormMode = "login" | "sign-up";

type AuthFormProps = {
  mode: AuthFormMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <main className="min-h-screen bg-[var(--ocean-surface)] font-sans text-[var(--ocean-ink)]">
      <div className="grid min-h-screen w-full lg:grid-cols-[2.5fr_1.5fr]">
        <section
          aria-hidden="true"
          className="relative hidden min-h-screen overflow-hidden bg-[var(--ocean-secondary)] lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.24),transparent_32%),linear-gradient(135deg,rgba(14,165,198,0.34),transparent_48%)]" />
        </section>

        <section className="min-h-screen bg-[var(--ocean-bg)]">
          {mode === "login" ? <LoginForm /> : <SignUpForm />}
        </section>
      </div>
    </main>
  );
}
