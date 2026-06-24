import { cookies } from "next/headers";

import { ApiError } from "@/lib/api";

export const SERVER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3001";

type ApiErrorPayload = {
  message?: string;
  errors?: unknown;
  details?: unknown;
  redirectTo?: string;
};

type ServerApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function buildServerApiUrl(path: string) {
  return `${SERVER_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function getRequestCookieHeader() {
  const cookieStore = await cookies();
  const requestCookies = cookieStore.getAll();

  if (requestCookies.length === 0) {
    return "";
  }

  return requestCookies
    .map(
      (cookie) =>
        `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`
    )
    .join("; ");
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function serverApiFetch<TResponse>(
  path: string,
  options: ServerApiFetchOptions = {}
): Promise<TResponse> {
  const { body, ...fetchOptions } = options;
  const cookieHeader = await getRequestCookieHeader();

  let response: Response;

  try {
    response = await fetch(buildServerApiUrl(path), {
      ...fetchOptions,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...fetchOptions.headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new ApiError("Network request failed. Please try again.", 0);
  }

  const payload = (await parseJsonResponse(response)) as
    | ApiErrorPayload
    | TResponse
    | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;

    throw new ApiError(
      errorPayload?.message ?? "Request failed",
      response.status,
      errorPayload?.errors,
      errorPayload?.details,
      errorPayload?.redirectTo
    );
  }

  return payload as TResponse;
}

export const serverApi = {
  get<TResponse>(path: string, options: ServerApiFetchOptions = {}) {
    return serverApiFetch<TResponse>(path, {
      ...options,
      method: "GET"
    });
  }
};
