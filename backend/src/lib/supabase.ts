import {
  createClient,
  type SupabaseClient
} from "@supabase/supabase-js";
import type { Request, Response } from "express";

import { env } from "../env.js";
import { getAuthRequestDebug, logAuthDebug } from "./auth-debug.js";

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
  const secureCookie =
    req.secure || req.headers["x-forwarded-proto"] === "https";

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      flowType: "pkce",
      persistSession: true,
      storage: {
        isServer: true,
        getItem(key: string) {
          const value = req.cookies?.[key] ?? null;

          logAuthDebug("info", "Supabase OAuth storage read", {
            request: getAuthRequestDebug(req),
            key,
            found: Boolean(value),
            valueLength: value?.length ?? 0
          });

          return value;
        },
        setItem(key: string, value: string) {
          logAuthDebug("info", "Supabase OAuth storage write", {
            request: getAuthRequestDebug(req),
            key,
            valueLength: value.length,
            secure: secureCookie,
            sameSite: "lax"
          });

          res.cookie(key, value, {
            httpOnly: true,
            sameSite: "lax",
            secure: secureCookie,
            path: "/",
            maxAge: 10 * 60 * 1000
          });
        },
        removeItem(key: string) {
          logAuthDebug("info", "Supabase OAuth storage remove", {
            request: getAuthRequestDebug(req),
            key,
            secure: secureCookie,
            sameSite: "lax"
          });

          res.clearCookie(key, {
            httpOnly: true,
            sameSite: "lax",
            secure: secureCookie,
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
