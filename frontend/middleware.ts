import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE_NAME = "paikan_access_token";
const LEGACY_ACCESS_TOKEN_COOKIE_NAME = "paiduay_access_token";
const PROTECTED_PATHS = [
  "/assistant",
  "/home",
  "/otop",
  "/market",
  "/quest",
  "/reward",
  "/settings"
];
const AUTH_PATHS = ["/login", "/sign-up"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.includes(pathname);
}

function decodeBase64Url(value: string) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;

  return atob(normalizedValue + "=".repeat(paddingLength));
}

function getJwtExpiry(accessToken: string) {
  const [, payload] = accessToken.split(".");

  if (!payload) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(decodeBase64Url(payload)) as {
      exp?: unknown;
    };

    return typeof parsedPayload.exp === "number" ? parsedPayload.exp : null;
  } catch {
    return null;
  }
}

function isTokenUsable(accessToken: string | undefined) {
  if (!accessToken) {
    return false;
  }

  const expiresAt = getJwtExpiry(accessToken);

  if (!expiresAt) {
    return false;
  }

  return expiresAt > Math.floor(Date.now() / 1000);
}

function redirectToRefresh(request: NextRequest) {
  const refreshUrl = new URL("/auth/refresh", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  refreshUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(refreshUrl);
  response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
  response.cookies.delete(LEGACY_ACCESS_TOKEN_COOKIE_NAME);

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken =
    request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ??
    request.cookies.get(LEGACY_ACCESS_TOKEN_COOKIE_NAME)?.value;
  const hasUsableToken = isTokenUsable(accessToken);

  if (isProtectedPath(pathname) && !hasUsableToken) {
    return redirectToRefresh(request);
  }

  if (isAuthPath(pathname) && hasUsableToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/assistant/:path*",
    "/otop/:path*",
    "/market/:path*",
    "/quest/:path*",
    "/reward/:path*",
    "/settings/:path*",
    "/login",
    "/sign-up"
  ]
};
