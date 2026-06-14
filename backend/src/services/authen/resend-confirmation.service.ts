import { env } from "../../env.js";
import { supabase } from "../../lib/supabase.js";

export type ResendConfirmationInput = {
  email: string;
};

export async function resendSignUpConfirmation(input: ResendConfirmationInput) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email: input.email,
    options: {
      emailRedirectTo: env.AUTH_EMAIL_CONFIRM_REDIRECT_URL
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
