import { supabase } from "../../lib/supabase.js";
import { env } from "../../env.js";

export async function createGoogleOAuthUrl(nextPath = "/") {
  const { data, error } = await supabase.auth.signInWithOAuth({
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

export async function exchangeGoogleOAuthCode(code: string) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}
