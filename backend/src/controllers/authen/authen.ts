import type { Request, Response } from "express";
import { z } from "zod";

import { loginWithEmailPassword } from "../../services/authen/login.js";
import { signUpWithEmailPassword } from "../../services/authen/signup.js";
import { supabase } from "../../lib/supabase.js";

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

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
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

  res.cookie("paikan_access_token", session.access_token, {
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
  clearAuthCookie(req, res, "paikan_access_token");
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

export async function logoutController(req: Request, res: Response) {
  clearAuthCookies(req, res);

  return res.status(200).json({
    message: "Logout successful",
    data: null
  });
}

export async function refreshController(req: Request, res: Response) {
  const parsedBody = refreshSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid refresh payload",
      errors: formatZodError(parsedBody.error)
    });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: parsedBody.data.refreshToken
    });

    if (error || !data.session?.access_token) {
      return res.status(401).json({
        message: "Session expired. Please login again."
      });
    }

    setAuthCookies(req, res, data.session);

    return res.status(200).json({
      message: "Session refreshed successfully",
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch {
    return res.status(401).json({
      message: "Session expired. Please login again."
    });
  }
}
