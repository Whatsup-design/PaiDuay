import type { Request, Response } from "express";
import { z } from "zod";

import { generateAssistantChatResponse } from "../../services/user/assistant.js";

const assistantChatSchema = z.object({
  message: z.string().trim().min(1).max(1200),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number()
    })
    .nullable()
    .optional()
});

function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export async function assistantChatController(req: Request, res: Response) {
  const parsedBody = assistantChatSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid assistant chat payload",
      errors: formatZodError(parsedBody.error)
    });
  }

  try {
    const data = await generateAssistantChatResponse(parsedBody.data);

    return res.status(200).json({
      message: "Assistant response generated successfully",
      data
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Assistant request failed";

    if (message.includes("GROQ_API_KEY")) {
      return res.status(503).json({
        message: "Assistant is not configured yet."
      });
    }

    if (
      message.includes("Groq request failed") ||
      message.includes("Groq response")
    ) {
      return res.status(503).json({
        message: "BhunMa is busy. Please try again soon."
      });
    }

    return res.status(500).json({
      message: "Failed to generate assistant response"
    });
  }
}
