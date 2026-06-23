import { Router } from "express";

import {
  getQuestItemBySlugController,
  getQuestItemsController
} from "../../controllers/user/quest.js";

export const questRouter = Router();

questRouter.get("/items", getQuestItemsController);
questRouter.get("/items/:slug", getQuestItemBySlugController);
