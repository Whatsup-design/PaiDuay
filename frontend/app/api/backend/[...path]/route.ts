import type { NextRequest } from "next/server";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "");

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function createUpstreamHeaders(request: NextRequest) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (cookie) {
    headers.set("cookie", cookie);
  }

  return headers;
}

function createResponseHeaders(upstream: Response) {
  const headers = new Headers();
  const forwardedHeaders = [
    "content-type",
    "cache-control",
    "retry-after",
    "ratelimit-limit",
    "ratelimit-policy",
    "ratelimit-remaining",
    "ratelimit-reset",
    "set-cookie"
  ];

  forwardedHeaders.forEach((name) => {
    const value = upstream.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  });

  return headers;
}

async function proxyToBackend(request: NextRequest, context: RouteContext) {
  if (!BACKEND_API_URL) {
    return Response.json(
      { message: "Backend API is not configured." },
      { status: 503 }
    );
  }

  const { path } = await context.params;
  const upstreamUrl = new URL(`/${path.join("/")}`, BACKEND_API_URL);

  upstreamUrl.search = request.nextUrl.search;

  try {
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: createUpstreamHeaders(request),
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual"
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: createResponseHeaders(upstream)
    });
  } catch {
    return Response.json(
      { message: "Backend service is unavailable." },
      { status: 502 }
    );
  }
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
