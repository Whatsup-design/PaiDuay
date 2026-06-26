import { rateLimit } from "express-rate-limit";

export const assistantRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 2,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many assistant requests. Please wait a minute and try again."
  }
});
