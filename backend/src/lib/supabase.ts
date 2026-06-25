import {
  createClient,
  type SupabaseClient
} from "@supabase/supabase-js";

import { env } from "../env.js";

const supabaseOptions = {
  auth: {
    autoRefreshToken: false,
    flowType: "pkce" as const,
    persistSession: false
  }
};

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  supabaseOptions
);

export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, supabaseOptions)
  : null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }

  return supabaseAdmin;
}
