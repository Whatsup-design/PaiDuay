import { Router } from "express";

import { assistantChatController } from "../../controllers/user/assistant.js";
import { assistantRateLimit } from "../../middleware/assistant-rate-limit.js";

export const assistantRouter = Router();

assistantRouter.post("/chat", assistantRateLimit, assistantChatController);
