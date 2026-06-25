import { Router } from "express";

import {
  loginController,
  logoutController,
  signUpController
} from "../../controllers/authen/authen.js";

export const authenRouter = Router();

authenRouter.post("/login", loginController);
authenRouter.post("/signup", signUpController);
authenRouter.post("/logout", logoutController);
