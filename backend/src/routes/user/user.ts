import { Router } from "express";

import { otopRouter } from "./otop.js";

export const userRouter = Router();

userRouter.use("/otop", otopRouter);
