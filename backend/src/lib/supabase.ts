import {
  createClient,
  type SupabaseClient
} from "@supabase/supabase-js";
import type { Request, Response } from "express";

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

export function createSupabaseOAuthClient(req: Request, res: Response) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      flowType: "pkce",
      persistSession: true,
      storage: {
        isServer: true,
        getItem(key: string) {
          return req.cookies?.[key] ?? null;
        },
        setItem(key: string, value: string) {
          res.cookie(key, value, {
            httpOnly: true,
            sameSite: "lax",
            secure: req.secure || req.headers["x-forwarded-proto"] === "https",
            path: "/",
            maxAge: 10 * 60 * 1000
          });
        },
        removeItem(key: string) {
          res.clearCookie(key, {
            httpOnly: true,
            sameSite: "lax",
            secure: req.secure || req.headers["x-forwarded-proto"] === "https",
            path: "/"
          });
        }
      }
    }
  });
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }

  return supabaseAdmin;
}
