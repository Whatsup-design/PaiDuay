import type { Request, RequestHandler } from "express";

import { supabase } from "../lib/supabase.js";

const ACCESS_TOKEN_COOKIE_NAME = "paitiew_access_token";
const LEGACY_ACCESS_TOKEN_COOKIE_NAMES = [
  "paikan_access_token",
  "paiduay_access_token"
];

function getBearerToken(req: Request) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function getCookieToken(req: Request) {
  const token =
    req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ??
    LEGACY_ACCESS_TOKEN_COOKIE_NAMES.map(
      (name) => req.cookies?.[name]
    ).find(Boolean);

  return typeof token === "string" && token.length > 0 ? token : null;
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const accessToken = getBearerToken(req) ?? getCookieToken(req);

  if (!accessToken) {
    res.status(401).json({
      message: "Unauthorized"
    });
    return;
  }

  const { error } = await supabase.auth.getUser(accessToken);

  if (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
    return;
  }

  next();
};
