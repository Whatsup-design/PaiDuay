import { Router } from "express";

import { otopRouter } from "./otop.js";
import { questRouter } from "./quest.js";
import { rewardRouter } from "./reward.js";


export const userRouter = Router();

userRouter.use("/otop", otopRouter);
userRouter.use("/quest", questRouter);
userRouter.use("/reward", rewardRouter);

