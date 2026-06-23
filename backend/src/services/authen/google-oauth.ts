import type { Request, Response } from "express";

import { env } from "../../env.js";
import { createSupabaseOAuthClient } from "../../lib/supabase.js";

export async function createGoogleOAuthUrl(
  req: Request,
  res: Response,
  nextPath = "/"
) {
  const supabaseOAuth = createSupabaseOAuthClient(req, res);
  const { data, error } = await supabaseOAuth.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.AUTH_GOOGLE_REDIRECT_URL}?next=${encodeURIComponent(nextPath)}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google OAuth URL");
  }

  return data.url;
}

export async function exchangeGoogleOAuthCode(
  req: Request,
  res: Response,
  code: string
) {
  const supabaseOAuth = createSupabaseOAuthClient(req, res);
  const { data, error } = await supabaseOAuth.auth.exchangeCodeForSession(code);

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}
