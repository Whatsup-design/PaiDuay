import { notFound } from "next/navigation";
import {
  isSupportedErrorCode,
  StatusErrorPage
} from "@/components/error/status-error-page";

type ErrorStatusPageProps = {
  params: Promise<{
    code: string;
  }>;
  searchParams: Promise<{
    next?: string;
  }>;
};

function getSafeNextPath(nextPath: string | undefined) {
  if (!nextPath?.startsWith("/") || nextPath.startsWith("//")) {
    return undefined;
  }

  return nextPath;
}

export default async function ErrorStatusPage({
  params,
  searchParams
}: ErrorStatusPageProps) {
  const [{ code }, { next }] = await Promise.all([params, searchParams]);

  if (!isSupportedErrorCode(code)) {
    notFound();
  }

  return <StatusErrorPage code={code} nextPath={getSafeNextPath(next)} />;
}
