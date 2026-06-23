import type { Request, Response } from "express";

import {
  getQuestItemBySlug,
  getQuestItems
} from "../../services/user/quest.js";

function sendQuestError(res: Response, error: unknown) {
  console.error("Quest API error", error);

  return res.status(500).json({
    message: "Failed to fetch quest data"
  });
}

export async function getQuestItemsController(req: Request, res: Response) {
  try {
    const quests = await getQuestItems(req.query);

    return res.status(200).json({
      message: "Quest items fetched successfully",
      data: quests
    });
  } catch (error) {
    return sendQuestError(res, error);
  }
}

export async function getQuestItemBySlugController(
  req: Request,
  res: Response
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      return res.status(400).json({
        message: "Invalid quest item slug"
      });
    }

    const quest = await getQuestItemBySlug(slug);

    if (!quest) {
      return res.status(404).json({
        message: "Quest item not found"
      });
    }

    return res.status(200).json({
      message: "Quest item fetched successfully",
      data: quest
    });
  } catch (error) {
    return sendQuestError(res, error);
  }
}
