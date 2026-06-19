import type { Request, Response } from "express";

import {
  getOtopProductServices,
  getOtopVillageById,
  getOtopVillages
} from "../../services/user/otop.js";

export async function getOtopVillagesController(
  _req: Request,
  res: Response
) {
  const villages = await getOtopVillages();

  return res.status(200).json({
    message: "OTOP villages fetched successfully",
    data: villages
  });
}

export async function getOtopVillageByIdController(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid OTOP village id"
    });
  }

  const village = await getOtopVillageById(id);

  if (!village) {
    return res.status(404).json({
      message: "OTOP village not found"
    });
  }

  return res.status(200).json({
    message: "OTOP village fetched successfully",
    data: village
  });
}

export async function getOtopProductServicesController(
  _req: Request,
  res: Response
) {
  const productServices = await getOtopProductServices();

  return res.status(200).json({
    message: "OTOP product services fetched successfully",
    data: productServices
  });
}
