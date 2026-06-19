import { Router } from "express";

import {
  getOtopProductServicesController,
  getOtopVillageByIdController,
  getOtopVillagesController
} from "../../controllers/user/otop.js";

export const otopRouter = Router();

otopRouter.get("/villages", getOtopVillagesController);
otopRouter.get("/villages/:id", getOtopVillageByIdController);
otopRouter.get("/products-services", getOtopProductServicesController);
