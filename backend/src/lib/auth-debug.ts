import type { Request } from "express";

import { env } from "../env.js";
import { getAuthCookieNames, getOAuthCookieNames } from "./auth-token.js";

type LogLevel = "info" | "warn" | "error";

function shouldIncludeDebugDetails() {
  return env.NODE_ENV !== "production" || process.env.AUTH_DEBUG_DETAILS === "true";
}

function getHeaderValue(req: Request, headerName: string) {
  const value = req.headers[headerName.toLowerCase()];

  return Array.isArray(value) ? value.join(",") : value ?? null;
}

function sanitizeUrlForLog(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split("?")[0];
  }
}

export function getSafeErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      message: error instanceof Error ? error.message : undefined
    };
  }

  const maybeError = error as {
    code?: unknown;
    name?: unknown;
    status?: unknown;
    message?: unknown;
  };

  return {
    name: typeof maybeError.name === "string" ? maybeError.name : undefined,
    message:
      typeof maybeError.message === "string" ? maybeError.message : undefined,
    code: maybeError.code,
    status: maybeError.status
  };
}

export function getAuthRequestDebug(req: Request) {
  return {
    method: req.method,
    path: req.path,
    baseUrl: req.baseUrl,
    host: req.headers.host ?? null,
    origin: req.headers.origin ?? null,
    referer: sanitizeUrlForLog(req.headers.referer),
    forwardedHost: getHeaderValue(req, "x-forwarded-host"),
    forwardedProto: getHeaderValue(req, "x-forwarded-proto"),
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    sessionCookieNames: getAuthCookieNames(req.cookies),
    oauthCookieNames: getOAuthCookieNames(req.cookies)
  };
}

export function getOAuthQueryDebug(req: Request) {
  const errorValue = req.query.error;
  const nextValue = req.query.next;

  return {
    queryKeys: Object.keys(req.query),
    hasCode: typeof req.query.code === "string" && req.query.code.length > 0,
    hasError: typeof errorValue === "string" && errorValue.length > 0,
    error:
      typeof errorValue === "string" && errorValue.length > 0
        ? errorValue
        : null,
    hasNext: typeof nextValue === "string" && nextValue.length > 0,
    next:
      typeof nextValue === "string" && nextValue.startsWith("/")
        ? nextValue
        : null
  };
}

export function buildUnauthorizedDetails(req: Request) {
  if (!shouldIncludeDebugDetails()) {
    return undefined;
  }

  return getAuthRequestDebug(req);
}

export function logAuthDebug(
  level: LogLevel,
  message: string,
  details: Record<string, unknown>
) {
  const payload = {
    authDebug: true,
    ...details
  };

  if (level === "error") {
    console.error(message, payload);
    return;
  }

  if (level === "warn") {
    console.warn(message, payload);
    return;
  }

  console.info(message, payload);
}
