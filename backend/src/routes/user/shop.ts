import { Router } from "express";

import {
  getShopItemBySlugController,
  getShopItemsController
} from "../../controllers/user/shop.js";

export const shopRouter = Router();

shopRouter.get("/items", getShopItemsController);
shopRouter.get("/items/:slug", getShopItemBySlugController);
