import { AuthForm } from "@/components/auth/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;

  return (
    <AuthForm
      mode="login"
      registrationMessage={
        registered === "1" ? "Register success. You can login now." : undefined
      }
    />
  );
}
