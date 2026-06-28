import { getStoredAccessToken } from "@/lib/auth-session";

export const API_BASE_URL = "/api/backend";

const DEFAULT_API_TIMEOUT_MS = 10000;

export type ApiResponse<TData> = {
  message: string;
  data: TData;
};

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
};

type ApiErrorPayload = {
  message?: string;
  errors?: unknown;
  details?: unknown;
  redirectTo?: string;
};

export class ApiError extends Error {
  status: number;
  errors?: unknown;
  details?: unknown;
  redirectTo?: string;

  constructor(
    message: string,
    status: number,
    errors?: unknown,
    details?: unknown,
    redirectTo?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.details = details;
    this.redirectTo = redirectTo;
  }
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<TResponse> {
  const {
    body,
    signal,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
    ...fetchOptions
  } = options;
  const timeoutController = new AbortController();
  const timeoutId =
    timeoutMs > 0
      ? globalThis.setTimeout(() => timeoutController.abort(), timeoutMs)
      : undefined;

  if (signal) {
    if (signal.aborted) {
      timeoutController.abort();
    } else {
      signal.addEventListener("abort", () => timeoutController.abort(), {
        once: true
      });
    }
  }

  let response: Response;

  try {
    const accessToken = getStoredAccessToken();

    response = await fetch(buildApiUrl(path), {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...fetchOptions.headers
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      signal: timeoutController.signal
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }

    throw new ApiError("Network request failed. Please try again.", 0);
  } finally {
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId);
    }
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

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const api = {
  get<TResponse>(path: string, options: ApiFetchOptions = {}) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "GET"
    });
  },
  post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: ApiFetchOptions = {}
  ) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "POST",
      body
    });
  },
  put<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: ApiFetchOptions = {}
  ) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "PUT",
      body
    });
  },
  patch<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: ApiFetchOptions = {}
  ) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "PATCH",
      body
    });
  },
  delete<TResponse>(path: string, options: ApiFetchOptions = {}) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "DELETE"
    });
  }
};
