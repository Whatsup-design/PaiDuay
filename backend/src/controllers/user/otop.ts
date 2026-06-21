import type { Request, Response } from "express";

import {
  getOtopProductServiceBySlug,
  getOtopProductServices,
  getOtopVillageById,
  getOtopVillages
} from "../../services/user/otop.js";

function sendOtopError(res: Response, error: unknown) {
  console.error("OTOP API error", error);

  return res.status(500).json({
    message: "Failed to fetch OTOP data"
  });
}

export async function getOtopVillagesController(req: Request, res: Response) {
  try {
    const villages = await getOtopVillages(req.query);

    return res.status(200).json({
      message: "OTOP villages fetched successfully",
      data: villages
    });
  } catch (error) {
    return sendOtopError(res, error);
  }
}

export async function getOtopVillageByIdController(
  req: Request,
  res: Response
) {
  try {
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
  } catch (error) {
    return sendOtopError(res, error);
  }
}

export async function getOtopProductServicesController(
  req: Request,
  res: Response
) {
  try {
    const productServices = await getOtopProductServices(req.query);

    return res.status(200).json({
      message: "OTOP product services fetched successfully",
      data: productServices
    });
  } catch (error) {
    return sendOtopError(res, error);
  }
}

export async function getOtopProductServiceBySlugController(
  req: Request,
  res: Response
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      return res.status(400).json({
        message: "Invalid OTOP item slug"
      });
    }

    const productService = await getOtopProductServiceBySlug(slug);

    if (!productService) {
      return res.status(404).json({
        message: "OTOP item not found"
      });
    }

    return res.status(200).json({
      message: "OTOP item fetched successfully",
      data: productService
    });
  } catch (error) {
    return sendOtopError(res, error);
  }
}
