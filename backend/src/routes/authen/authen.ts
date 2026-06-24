import { Router } from "express";

import {
  googleOAuthCallbackController,
  googleOAuthStartController,
  loginController,
  logoutController,
  sessionController,
  signUpController
} from "../../controllers/authen/authen.js";

export const authenRouter = Router();

authenRouter.post("/login", loginController);
authenRouter.post("/signup", signUpController);
authenRouter.post("/logout", logoutController);
authenRouter.get("/session", sessionController);
authenRouter.get("/google", googleOAuthStartController);
authenRouter.get("/google/callback", googleOAuthCallbackController);
