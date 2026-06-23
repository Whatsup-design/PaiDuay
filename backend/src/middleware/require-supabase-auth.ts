import type { RequestHandler } from "express";

import {
  extractAccessTokenFromCookies,
} from "../lib/auth-token.js";
import {
  buildUnauthorizedDetails,
  getAuthRequestDebug,
  getSafeErrorDetails,
  logAuthDebug
} from "../lib/auth-debug.js";
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

export const requireSupabaseAuth: RequestHandler = async (req, res, next) => {
  const token = getRequestToken(req);

  if (!token) {
    logAuthDebug("warn", "Protected route rejected missing auth token", {
      request: getAuthRequestDebug(req)
    });

    return res.status(401).json({
      message: "Authentication required. Please login.",
      redirectTo: "/login",
      details: buildUnauthorizedDetails(req)
    });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logAuthDebug("warn", "Protected route rejected invalid auth token", {
        request: getAuthRequestDebug(req),
        error: getSafeErrorDetails(error)
      });

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
    logAuthDebug("error", "Protected route auth verification failed", {
      request: getAuthRequestDebug(req),
      error: getSafeErrorDetails(error)
    });

    return res.status(401).json({
      message: "Unable to verify session. Please login again.",
      redirectTo: "/login",
      details: buildUnauthorizedDetails(req)
    });
  }
};
