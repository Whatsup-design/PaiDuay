import type { Request, Response } from "express";

export function getCurrentUserController(req: Request, res: Response) {
  if (!req.auth?.user) {
    return res.status(401).json({
      message: "Authentication required. Please login.",
      redirectTo: "/login"
    });
  }

  return res.status(200).json({
    message: "Authenticated user",
    data: {
      user: req.auth.user
    }
  });
}
