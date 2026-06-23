import type { RequestHandler } from "express";

import { env } from "../env.js";
import {
  extractAccessTokenFromCookies,
  getAuthCookieNames
} from "../lib/auth-token.js";
import { supabase } from "../lib/supabase.js";

function getBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function getRequestToken(req: Parameters<RequestHandler>[0]) {
  return (
    getBearerToken(req.headers.authorization) ??
    extractAccessTokenFromCookies(req.cookies) ??
    null
  );
}

function buildUnauthorizedDetails(req: Parameters<RequestHandler>[0]) {
  if (env.NODE_ENV === "production") {
    return undefined;
  }

  return {
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    authCookieNames: getAuthCookieNames(req.cookies),
    host: req.headers.host,
    origin: req.headers.origin ?? null
  };
}

export const requireSupabaseAuth: RequestHandler = async (req, res, next) => {
  const token = getRequestToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. Please login.",
      redirectTo: "/login",
      details: buildUnauthorizedDetails(req)
    });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        message: "Session expired or invalid. Please login again.",
        redirectTo: "/login",
        details: buildUnauthorizedDetails(req)
      });
    }

    req.auth = {
      user: data.user,
      accessToken: token
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unable to verify session. Please login again.",
      redirectTo: "/login",
      details: buildUnauthorizedDetails(req)
    });
  }
};
