import { supabase } from "../../lib/supabase.js";
import { env } from "../../env.js";

export type SignUpInput = {
  email: string;
  password: string;
  username: string;
};

export async function signUpWithEmailPassword(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: env.AUTH_EMAIL_CONFIRM_REDIRECT_URL,
      data: {
        username: input.username
      }
    }
  });

  if (error && !data.user) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session,
    warning: error?.message
  };
}
