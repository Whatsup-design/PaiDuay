import {
  AlertTriangle,
  ArrowLeft,
  Home,
  Lock,
  ShieldAlert,
  SearchX
} from "lucide-react";
import Link from "next/link";

type ErrorCode = "401" | "403" | "404" | "500";

type StatusConfig = {
  title: string;
  description: string;
  icon: typeof Lock;
  toneClassName: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

const statusConfig: Record<ErrorCode, StatusConfig> = {
  "401": {
    title: "Login required",
    description:
      "Your session is missing or has expired. Login again to continue your PaiDuay journey.",
    icon: Lock,
    toneClassName: "bg-sky-50 text-sky-700 ring-sky-100",
    primaryLabel: "Go to login",
    primaryHref: "/login",
    secondaryLabel: "Back to home",
    secondaryHref: "/"
  },
  "403": {
    title: "Access denied",
    description:
      "You are signed in, but this area is not available for your account yet.",
    icon: ShieldAlert,
    toneClassName: "bg-amber-50 text-amber-700 ring-amber-100",
    primaryLabel: "Go home",
    primaryHref: "/home",
    secondaryLabel: "Back to login",
    secondaryHref: "/login"
  },
  "404": {
    title: "Page not found",
    description:
      "The page you are looking for does not exist or may have been moved.",
    icon: SearchX,
    toneClassName: "bg-sky-50 text-sky-700 ring-sky-100",
    primaryLabel: "Go home",
    primaryHref: "/home",
    secondaryLabel: "Back to login",
    secondaryHref: "/login"
  },
  "500": {
    title: "Something went wrong",
    description:
      "The app hit an unexpected problem. You can try again or return to the main page.",
    icon: AlertTriangle,
    toneClassName: "bg-red-50 text-red-700 ring-red-100",
    primaryLabel: "Go home",
    primaryHref: "/home",
    secondaryLabel: "Back to login",
    secondaryHref: "/login"
  }
};

type StatusErrorPageProps = {
  code: ErrorCode;
  nextPath?: string;
};

function getPrimaryHref(config: StatusConfig, nextPath?: string) {
  if (config.primaryHref !== "/login" || !nextPath) {
    return config.primaryHref;
  }

  const loginUrl = new URL("http://paiduay.local/login");
  loginUrl.searchParams.set("next", nextPath);

  return `${loginUrl.pathname}${loginUrl.search}`;
}

export function StatusErrorPage({ code, nextPath }: StatusErrorPageProps) {
  const config = statusConfig[code];
  const Icon = config.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-md text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${config.toneClassName}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          {code}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          {config.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {config.description}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={getPrimaryHref(config, nextPath)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Home className="h-4 w-4" />
            {config.primaryLabel}
          </Link>

          {config.secondaryHref ? (
            <Link
              href={config.secondaryHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
            >
              <ArrowLeft className="h-4 w-4" />
              {config.secondaryLabel}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export function isSupportedErrorCode(code: string): code is ErrorCode {
  return code === "401" || code === "403" || code === "404" || code === "500";
}
