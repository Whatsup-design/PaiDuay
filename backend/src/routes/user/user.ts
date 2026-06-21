import { Router } from "express";

import { otopRouter } from "./otop.js";
import { shopRouter } from "./shop.js";

export const userRouter = Router();

userRouter.use("/otop", otopRouter);
userRouter.use("/shop", shopRouter);
