import { api } from "@/lib/api";
import type { StoredLocation } from "@/lib/location/types";

export type AssistantRecommendation = {
  id: string;
  type: "village" | "product_service";
  title: string;
  source: "OTOP";
  href: string;
  reason: string;
  imageUrl: string;
  category: string;
  distanceKm?: number;
  estimatedTravelMinutes?: number;
};

export type AssistantAnalysis = {
  mood: string;
  intent: string;
  desiredExperience: string[];
  categories: string[];
  confidence: number;
  isCrisis: boolean;
};

export type AssistantChatResponse = {
  message: string;
  data: {
    reply: string;
    analysis: AssistantAnalysis;
    recommendations: AssistantRecommendation[];
  };
};

export function sendAssistantMessage(input: {
  message: string;
  location: StoredLocation | null;
}) {
  return api.post<AssistantChatResponse>(
    "/user/assistant/chat",
    {
      message: input.message,
      location: input.location
        ? {
            latitude: input.location.latitude,
            longitude: input.location.longitude
          }
        : null
    },
    {
      timeoutMs: 30_000
    }
  );
}
