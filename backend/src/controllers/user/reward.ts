import type { Request, Response } from "express";

import {
  getRewardItemBySlug,
  getRewardItems
} from "../../services/user/reward.js";

function sendRewardError(res: Response, error: unknown) {
  console.error("Reward API error", error);

  return res.status(500).json({
    message: "Failed to fetch reward data"
  });
}

export async function getRewardItemsController(req: Request, res: Response) {
  try {
    const rewards = await getRewardItems(req.query);

    return res.status(200).json({
      message: "Reward items fetched successfully",
      data: rewards
    });
  } catch (error) {
    return sendRewardError(res, error);
  }
}

export async function getRewardItemBySlugController(
  req: Request,
  res: Response
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      return res.status(400).json({
        message: "Invalid reward item slug"
      });
    }

    const reward = await getRewardItemBySlug(slug);

    if (!reward) {
      return res.status(404).json({
        message: "Reward item not found"
      });
    }

    return res.status(200).json({
      message: "Reward item fetched successfully",
      data: reward
    });
  } catch (error) {
    return sendRewardError(res, error);
  }
}
