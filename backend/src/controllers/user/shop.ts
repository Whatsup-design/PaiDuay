import type { Request, Response } from "express";

import {
  getShopItemBySlug,
  getShopItems
} from "../../services/user/shop.js";

function sendShopError(res: Response, error: unknown) {
  console.error("Shop API error", error);

  return res.status(500).json({
    message: "Failed to fetch shop data"
  });
}

export async function getShopItemsController(req: Request, res: Response) {
  try {
    const items = await getShopItems(req.query);

    return res.status(200).json({
      message: "Shop items fetched successfully",
      data: items
    });
  } catch (error) {
    return sendShopError(res, error);
  }
}

export async function getShopItemBySlugController(
  req: Request,
  res: Response
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      return res.status(400).json({
        message: "Invalid shop item slug"
      });
    }

    const item = await getShopItemBySlug(slug);

    if (!item) {
      return res.status(404).json({
        message: "Shop item not found"
      });
    }

    return res.status(200).json({
      message: "Shop item fetched successfully",
      data: item
    });
  } catch (error) {
    return sendShopError(res, error);
  }
}
