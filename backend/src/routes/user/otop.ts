import { Router } from "express";

import {
  getOtopProductServiceBySlugController,
  getOtopProductServicesController,
  getOtopVillageByIdController,
  getOtopVillagesController
} from "../../controllers/user/otop.js";

export const otopRouter = Router();

otopRouter.get("/villages", getOtopVillagesController);
otopRouter.get("/villages/:id", getOtopVillageByIdController);
otopRouter.get("/items", getOtopProductServicesController);
otopRouter.get("/items/:slug", getOtopProductServiceBySlugController);
otopRouter.get("/products-services", getOtopProductServicesController);
