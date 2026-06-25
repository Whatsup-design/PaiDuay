import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().trim().min(1).default("127.0.0.1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  SUPABASE_URL: z
    .string()
    .trim()
    .url("SUPABASE_URL must be a valid Supabase project URL"),
  SUPABASE_ANON_KEY: z
    .string()
    .trim()
    .min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1).optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid backend environment variables:\n${details}`);
}

export const env = parsedEnv.data;
export type Env = typeof env;
