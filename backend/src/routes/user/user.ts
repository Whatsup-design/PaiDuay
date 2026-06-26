import { Router } from "express";

import { assistantRouter } from "./assistant.js";
import { otopRouter } from "./otop.js";
import { questRouter } from "./quest.js";
import { rewardRouter } from "./reward.js";
import { shopRouter } from "./shop.js";

export const userRouter = Router();

userRouter.use("/assistant", assistantRouter);
userRouter.use("/otop", otopRouter);
userRouter.use("/quest", questRouter);
userRouter.use("/reward", rewardRouter);
userRouter.use("/shop", shopRouter);
