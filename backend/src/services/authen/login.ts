import { supabase } from "../../lib/supabase.js";

export type LoginInput = {
  email: string;
  password: string;
};

export async function loginWithEmailPassword(input: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}
