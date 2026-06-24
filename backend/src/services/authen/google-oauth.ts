import type { Request, Response } from "express";

import { env } from "../../env.js";
import { createSupabaseOAuthClient, supabase } from "../../lib/supabase.js";

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

export async function getCurrentAuthSession(req: Request, res: Response) {
  const supabaseOAuth = createSupabaseOAuthClient(req, res);
  const sessionResult = await supabaseOAuth.auth.getSession();

  if (sessionResult.error) {
    throw new Error(sessionResult.error.message);
  }

  if (sessionResult.data.session) {
    return {
      user: sessionResult.data.session.user,
      session: sessionResult.data.session
    };
  }

  const accessToken = req.cookies?.paiduay_access_token;

  if (typeof accessToken !== "string") {
    return null;
  }

  const userResult = await supabase.auth.getUser(accessToken);

  if (userResult.error || !userResult.data.user) {
    return null;
  }

  return {
    user: userResult.data.user,
    session: {
      access_token: accessToken
    }
  };
}
