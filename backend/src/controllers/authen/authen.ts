import type { Request, Response } from "express";
import { z } from "zod";

import { env } from "../../env.js";
import {
  createGoogleOAuthUrl,
  exchangeGoogleOAuthCode,
  getCurrentAuthSession
} from "../../services/authen/google-oauth.js";
import {
  getAuthRequestDebug,
  getOAuthQueryDebug,
  getSafeErrorDetails,
  logAuthDebug
} from "../../lib/auth-debug.js";
import { loginWithEmailPassword } from "../../services/authen/login.js";
import { signUpWithEmailPassword } from "../../services/authen/signup.js";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

const signUpSchema = z
  .object({
    username: z.string().trim().min(2).max(40),
    email: z.string().trim().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

const googleOAuthStartSchema = z.object({
  next: z.string().trim().startsWith("/").default("/")
});

const googleOAuthCallbackSchema = z.object({
  code: z.string().trim().min(1),
  next: z.string().trim().startsWith("/").default("/")
});

function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

function isExistingAccountSignUpError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists") ||
    normalizedMessage.includes("user already")
  );
}

function isTemporaryLoginError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many") ||
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("fetch failed")
  );
}

function buildFrontendRedirectUrl(baseUrl: string, nextPath: string) {
  return new URL(nextPath, baseUrl).toString();
}

function buildFrontendOAuthCallbackUrl(
  baseUrl: string,
  nextPath: string,
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  }
) {
  const callbackUrl = new URL("/auth/callback", baseUrl);
  const hashParams = new URLSearchParams({
    access_token: session.access_token,
    next: nextPath
  });

  if (session.refresh_token) {
    hashParams.set("refresh_token", session.refresh_token);
  }

  if (session.expires_at !== undefined) {
    hashParams.set("expires_at", String(session.expires_at));
  }

  callbackUrl.hash = hashParams.toString();

  return callbackUrl.toString();
}

function isSecureRequest(req: Request) {
  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

function logGoogleOAuthCallbackFailure(
  req: Request,
  reason: string,
  error?: unknown
) {
  logAuthDebug("error", "Google OAuth callback failed", {
    reason,
    request: getAuthRequestDebug(req),
    query: getOAuthQueryDebug(req),
    error: getSafeErrorDetails(error)
  });
}

function setAuthCookies(
  req: Request,
  res: Response,
  session: { access_token: string; expires_at?: number }
) {
  const maxAge =
    session.expires_at === undefined
      ? undefined
      : Math.max(session.expires_at * 1000 - Date.now(), 0);

  res.cookie("paiduay_access_token", session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(req),
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {})
  });
}

function clearAuthCookie(req: Request, res: Response, name: string) {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(req),
    path: "/"
  });
}

function clearAuthCookies(req: Request, res: Response) {
  clearAuthCookie(req, res, "paiduay_access_token");

  for (const cookieName of Object.keys(req.cookies ?? {})) {
    const isSupabaseAuthCookie =
      cookieName.startsWith("sb-") &&
      (cookieName.includes("auth-token") ||
        cookieName.includes("code-verifier"));

    if (isSupabaseAuthCookie) {
      clearAuthCookie(req, res, cookieName);
    }
  }
}

export async function loginController(req: Request, res: Response) {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid login payload",
      errors: formatZodError(parsedBody.error)
    });
  }

  try {
    const data = await loginWithEmailPassword(parsedBody.data);

    if (data.session?.access_token) {
      setAuthCookies(req, res, data.session);
    }

    return res.status(200).json({
      message: "Login successful",
      data
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";

    if (isTemporaryLoginError(message)) {
      return res.status(503).json({
        message: "Unable to login. Please wait."
      });
    }

    return res.status(401).json({
      message: "Email or password incorrect."
    });
  }
}

export async function signUpController(req: Request, res: Response) {
  const parsedBody = signUpSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid sign up payload",
      errors: formatZodError(parsedBody.error)
    });
  }

  try {
    const { confirmPassword: _confirmPassword, ...signUpInput } =
      parsedBody.data;
    const data = await signUpWithEmailPassword(signUpInput);

    return res.status(201).json({
      message: "Sign up successful",
      data
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed";

    if (isExistingAccountSignUpError(message)) {
      return res.status(200).json({
        message: "Account already exists. Please login.",
        data: {
          user: null,
          session: null,
          alreadyRegistered: true
        }
      });
    }

    return res.status(400).json({
      message
    });
  }
}

export async function googleOAuthStartController(req: Request, res: Response) {
  const parsedQuery = googleOAuthStartSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    logAuthDebug("warn", "Google OAuth start rejected invalid query", {
      request: getAuthRequestDebug(req),
      query: getOAuthQueryDebug(req),
      errors: formatZodError(parsedQuery.error)
    });

    return res.status(400).json({
      message: "Invalid Google OAuth query",
      errors: formatZodError(parsedQuery.error)
    });
  }

  try {
    logAuthDebug("info", "Google OAuth start received", {
      request: getAuthRequestDebug(req),
      next: parsedQuery.data.next,
      callbackUrl: env.AUTH_GOOGLE_REDIRECT_URL,
      successRedirectUrl: env.AUTH_SUCCESS_REDIRECT_URL,
      errorRedirectUrl: env.AUTH_ERROR_REDIRECT_URL
    });

    const oauthUrl = await createGoogleOAuthUrl(
      req,
      res,
      parsedQuery.data.next
    );

    const redirectUrl = new URL(oauthUrl);

    logAuthDebug("info", "Google OAuth start redirecting", {
      request: getAuthRequestDebug(req),
      next: parsedQuery.data.next,
      redirectHost: redirectUrl.host,
      redirectPath: redirectUrl.pathname,
      callbackUrl: env.AUTH_GOOGLE_REDIRECT_URL
    });

    return res.redirect(oauthUrl);
  } catch (error) {
    logAuthDebug("error", "Google OAuth start failed", {
      request: getAuthRequestDebug(req),
      next: parsedQuery.data.next,
      error: getSafeErrorDetails(error)
    });

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to start Google OAuth"
    });
  }
}

export async function googleOAuthCallbackController(
  req: Request,
  res: Response
) {
  logAuthDebug("info", "Google OAuth callback received", {
    request: getAuthRequestDebug(req),
    query: getOAuthQueryDebug(req)
  });

  const parsedQuery = googleOAuthCallbackSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    logGoogleOAuthCallbackFailure(req, "invalid_oauth_callback");

    return res.redirect(
      `${env.AUTH_ERROR_REDIRECT_URL}?reason=invalid_oauth_callback`
    );
  }

  try {
    const data = await exchangeGoogleOAuthCode(
      req,
      res,
      parsedQuery.data.code
    );

    logAuthDebug("info", "Google OAuth callback exchange finished", {
      request: getAuthRequestDebug(req),
      next: parsedQuery.data.next,
      hasSession: Boolean(data.session),
      hasAccessToken: Boolean(data.session?.access_token),
      hasRefreshToken: Boolean(data.session?.refresh_token),
      expiresAt: data.session?.expires_at ?? null
    });

    if (!data.session?.access_token) {
      logGoogleOAuthCallbackFailure(req, "oauth_no_session");

      return res.redirect(`${env.AUTH_ERROR_REDIRECT_URL}?reason=oauth_no_session`);
    }

    setAuthCookies(req, res, data.session);

    const callbackUrl = buildFrontendOAuthCallbackUrl(
      env.AUTH_SUCCESS_REDIRECT_URL,
      parsedQuery.data.next,
      data.session
    );

    logAuthDebug("info", "Google OAuth callback redirecting to frontend", {
      request: getAuthRequestDebug(req),
      next: parsedQuery.data.next,
      frontendCallbackPath: "/auth/callback",
      frontendHost: new URL(callbackUrl).host
    });

    return res.redirect(callbackUrl);
  } catch (error) {
    logGoogleOAuthCallbackFailure(req, "oauth_failed", error);

    return res.redirect(`${env.AUTH_ERROR_REDIRECT_URL}?reason=oauth_failed`);
  }
}

export async function sessionController(req: Request, res: Response) {
  try {
    const data = await getCurrentAuthSession(req, res);

    if (!data?.session?.access_token) {
      return res.status(401).json({
        message: "No active session"
      });
    }

    return res.status(200).json({
      message: "Session fetched successfully",
      data
    });
  } catch {
    return res.status(401).json({
      message: "No active session"
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  clearAuthCookies(req, res);

  return res.status(200).json({
    message: "Logout successful",
    data: null
  });
}
