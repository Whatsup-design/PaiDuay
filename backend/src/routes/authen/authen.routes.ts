import { Router } from "express";

import {
  googleOAuthCallbackController,
  googleOAuthStartController,
  loginController,
  resendConfirmationController,
  signUpController
} from "../../controllers/authen/authen.controller.js";

export const authenRouter = Router();

authenRouter.post("/login", loginController);
authenRouter.post("/signup", signUpController);
authenRouter.post("/resend-confirmation", resendConfirmationController);
authenRouter.get("/google", googleOAuthStartController);
authenRouter.get("/google/callback", googleOAuthCallbackController);
