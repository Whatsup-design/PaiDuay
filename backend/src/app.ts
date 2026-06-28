import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./env.js";
import { supabase, supabaseAdmin } from "./lib/supabase.js";
import { requireAuth } from "./middleware/require-auth.js";
import { authenRouter } from "./routes/authen/authen.js";
import { userRouter } from "./routes/user/user.js";

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

const logErrorResponses: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const shouldLog =
      res.statusCode === 401 ||
      res.statusCode === 403 ||
      res.statusCode === 404 ||
      res.statusCode >= 500;

    if (!shouldLog) {
      return;
    }

    console.warn("HTTP error response", {
      status: res.statusCode,
      method: req.method,
      path: req.originalUrl,
      durationMs: Date.now() - startedAt
    });
  });

  next();
};

app.use(logErrorResponses);

app.use("/authen", authenRouter);
app.use("/user", requireAuth, userRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "paitiew-backend",
    supabase: Boolean(supabase),
    supabaseAdmin: Boolean(supabaseAdmin)
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to PaiTiew Backend!"
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error("Unhandled backend error", {
    method: req.method,
    path: req.originalUrl,
    error
  });

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "Internal server error"
  });
};

app.use(errorHandler);
