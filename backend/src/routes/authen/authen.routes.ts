import { Router } from "express";

import {
  googleOAuthCallbackController,
  googleOAuthStartController,
  loginController,
  signUpController
} from "../../controllers/authen/authen.controller.js";

export const authenRouter = Router();

authenRouter.post("/login", loginController);
authenRouter.post("/signup", signUpController);
authenRouter.get("/google", googleOAuthStartController);
authenRouter.get("/google/callback", googleOAuthCallbackController);
