import type { Request, Response } from "express";
import { z } from "zod";

import { env } from "../../env.js";
import {
  createGoogleOAuthUrl,
  exchangeGoogleOAuthCode
} from "../../services/authen/google-oauth.js";
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
    return res.status(400).json({
      message: "Invalid Google OAuth query",
      errors: formatZodError(parsedQuery.error)
    });
  }

  try {
    const oauthUrl = await createGoogleOAuthUrl(
      req,
      res,
      parsedQuery.data.next
    );

    return res.redirect(oauthUrl);
  } catch (error) {
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
  const parsedQuery = googleOAuthCallbackSchema.safeParse(req.query);

  if (!parsedQuery.success) {
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

    if (!data.session?.access_token) {
      return res.redirect(`${env.AUTH_ERROR_REDIRECT_URL}?reason=oauth_no_session`);
    }

    setAuthCookies(req, res, data.session);

    return res.redirect(
      buildFrontendOAuthCallbackUrl(
        env.AUTH_SUCCESS_REDIRECT_URL,
        parsedQuery.data.next,
        data.session
      )
    );
  } catch (error) {
    return res.redirect(`${env.AUTH_ERROR_REDIRECT_URL}?reason=oauth_failed`);
  }
}
