import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./env.js";
import { supabase, supabaseAdmin } from "./lib/supabase.js";
import { authenRouter } from "./routes/authen/authen.js";
import { userRouter } from "./routes/user/user.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/authen", authenRouter);
app.use("/user", userRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "paiduay-backend",
    supabase: Boolean(supabase),
    supabaseAdmin: Boolean(supabaseAdmin)
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to Paiduay Backend!"
  });
});
