import { supabase } from "../../lib/supabase.js";

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
      data: {
        username: input.username
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}
