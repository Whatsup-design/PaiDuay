import { Router } from "express";

import {
  getRewardItemBySlugController,
  getRewardItemsController
} from "../../controllers/user/reward.js";

export const rewardRouter = Router();

rewardRouter.get("/items", getRewardItemsController);
rewardRouter.get("/items/:slug", getRewardItemBySlugController);
