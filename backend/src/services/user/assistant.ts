import { z } from "zod";

import { env } from "../../env.js";
import {
  getOtopProductServices,
  getOtopVillages
} from "./otop.js";

const otopCategories = ["food", "craft", "wellness", "marine", "culture"] as const;
const crowdDensities = ["low", "medium", "high"] as const;

const classificationSchema = z.object({
  mood: z.string().min(1).default("curious"),
  intent: z.string().min(1).default("local_recommendation"),
  desiredExperience: z.array(z.string()).default([]),
  preferredCategories: z.array(z.enum(otopCategories)).default([]),
  energyLevel: z.enum(["low", "medium", "high"]).default("medium"),
  socialPreference: z.enum(["quiet", "balanced", "social"]).default("balanced"),
  confidence: z.number().min(0).max(1).default(0.5),
  isCrisis: z.boolean().default(false)
});

const composedReplySchema = z.object({
  reply: z.string().min(1),
  recommendationReasons: z
    .array(
      z.object({
        id: z.string(),
        reason: z.string()
      })
    )
    .default([])
});

type AssistantClassification = z.infer<typeof classificationSchema>;
type ComposedReply = z.infer<typeof composedReplySchema>;
type OtopCategory = (typeof otopCategories)[number];
type OtopCrowdDensity = (typeof crowdDensities)[number];

type Coordinates = {
  latitude: number;
  longitude: number;
};

type AssistantChatInput = {
  message: string;
  location?: Coordinates | null | undefined;
};

type OtopVillage = Awaited<ReturnType<typeof getOtopVillages>>[number];
type OtopProductService = Awaited<ReturnType<typeof getOtopProductServices>>[number];

type Candidate = {
  id: string;
  type: "village" | "product_service";
  title: string;
  source: "OTOP";
  href: string;
  reason: string;
  imageUrl: string;
  category: string;
  description: string;
  isFeatured: boolean;
  crowdDensity?: OtopCrowdDensity | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  distanceKm?: number | undefined;
  estimatedTravelMinutes?: number | undefined;
  score: number;
};

const moodCategoryFallback: Record<string, OtopCategory[]> = {
  uneasy: ["wellness", "marine", "culture"],
  anxious: ["wellness", "marine", "culture"],
  stressed: ["wellness", "marine", "culture"],
  tired: ["wellness", "food"],
  hungry: ["food"],
  bored: ["craft", "culture", "marine"],
  adventurous: ["marine", "culture", "craft"],
  curious: ["culture", "craft", "marine"]
};

const crisisKeywords = [
  "kill myself",
  "suicide",
  "self harm",
  "hurt myself",
  "end my life",
  "อยากตาย",
  "ฆ่าตัวตาย",
  "ทำร้ายตัวเอง",
  "ไม่อยากมีชีวิต"
];

function hasCrisisKeyword(message: string) {
  const normalizedMessage = message.toLowerCase();

  return crisisKeywords.some((keyword) => normalizedMessage.includes(keyword));
}

function normalizeCategory(value: string): OtopCategory | null {
  const candidate = value.toLowerCase();

  return otopCategories.includes(candidate as OtopCategory)
    ? (candidate as OtopCategory)
    : null;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMappedCategories(classification: AssistantClassification) {
  const preferredCategories = classification.preferredCategories
    .map(normalizeCategory)
    .filter((category): category is OtopCategory => Boolean(category));

  if (preferredCategories.length > 0) {
    return [...new Set(preferredCategories)];
  }

  return moodCategoryFallback[classification.mood.toLowerCase()] ?? [
    "culture",
    "marine",
    "wellness"
  ];
}

function getDistanceKm(origin: Coordinates, destination: Coordinates) {
  const earthRadiusKm = 6371;
  const latDelta = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const lonDelta = ((destination.longitude - origin.longitude) * Math.PI) / 180;
  const originLat = (origin.latitude * Math.PI) / 180;
  const destinationLat = (destination.latitude * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDistanceScore(distanceKm?: number) {
  if (distanceKm === undefined) {
    return 0;
  }

  if (distanceKm <= 3) {
    return 25;
  }

  if (distanceKm <= 10) {
    return 16;
  }

  if (distanceKm <= 25) {
    return 8;
  }

  return 2;
}

function getCrowdScore(
  classification: AssistantClassification,
  crowdDensity?: OtopCrowdDensity
) {
  if (!crowdDensity) {
    return 0;
  }

  if (classification.socialPreference === "quiet") {
    return crowdDensity === "low" ? 15 : crowdDensity === "medium" ? 8 : 0;
  }

  return crowdDensity === "high" ? 2 : 8;
}

function getContentScore(candidate: {
  imageUrl: string;
  description: string;
}) {
  return (candidate.imageUrl ? 6 : 0) + (candidate.description ? 4 : 0);
}

function getCandidateScore(
  candidate: Candidate,
  classification: AssistantClassification,
  categories: OtopCategory[]
) {
  const category = normalizeCategory(candidate.category);
  const categoryScore = category && categories.includes(category) ? 45 : 12;

  return (
    categoryScore +
    getDistanceScore(candidate.distanceKm) +
    getCrowdScore(classification, candidate.crowdDensity) +
    getContentScore(candidate) +
    (candidate.isFeatured ? 5 : 0)
  );
}

function getCoordinates(value: {
  latitude?: number | null;
  longitude?: number | null;
}) {
  if (
    typeof value.latitude === "number" &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === "number" &&
    Number.isFinite(value.longitude)
  ) {
    return {
      latitude: value.latitude,
      longitude: value.longitude
    };
  }

  return null;
}

function mapVillageCandidate(village: OtopVillage, location?: Coordinates | null) {
  const coordinates = getCoordinates(village);
  const distanceKm =
    location && coordinates ? getDistanceKm(location, coordinates) : undefined;

  return {
    id: village.villageId ?? village.id,
    type: "village" as const,
    title: village.name,
    source: "OTOP" as const,
    href: `/otop/${village.slug ?? village.id}`,
    reason: `${village.category} village for local discovery.`,
    imageUrl: village.coverImageUrl ?? "",
    category: village.category,
    description: village.description,
    isFeatured: false,
    latitude: village.latitude,
    longitude: village.longitude,
    distanceKm,
    estimatedTravelMinutes:
      distanceKm === undefined ? undefined : Math.max(Math.round(distanceKm * 3), 5),
    score: 0
  };
}

function mapProductCandidate(
  item: OtopProductService,
  villageLookup: Map<string, OtopVillage>,
  location?: Coordinates | null
) {
  const village = item.villageId ? villageLookup.get(item.villageId) : undefined;
  const coordinates = village ? getCoordinates(village) : null;
  const distanceKm =
    location && coordinates ? getDistanceKm(location, coordinates) : undefined;

  return {
    id: item.id ?? item.slug ?? item.name,
    type: "product_service" as const,
    title: item.name,
    source: "OTOP" as const,
    href: item.villageSlug ? `/otop/${item.villageSlug}` : "/otop",
    reason: `${item.type} from ${item.village || "a local OTOP community"}.`,
    imageUrl: item.imageUrl ?? "",
    category: item.category,
    description: item.description ?? item.detail ?? "",
    isFeatured: Boolean(item.isFeatured),
    crowdDensity: item.crowdDensity,
    latitude: village?.latitude,
    longitude: village?.longitude,
    distanceKm,
    estimatedTravelMinutes:
      distanceKm === undefined ? undefined : Math.max(Math.round(distanceKm * 3), 5),
    score: 0
  };
}

function toRecommendation(candidate: Candidate, reason?: string) {
  return {
    id: candidate.id,
    type: candidate.type,
    title: candidate.title,
    source: candidate.source,
    href: candidate.href,
    reason: reason || candidate.reason,
    imageUrl: candidate.imageUrl,
    category: titleCase(candidate.category),
    distanceKm:
      candidate.distanceKm === undefined
        ? undefined
        : Number(candidate.distanceKm.toFixed(1)),
    estimatedTravelMinutes: candidate.estimatedTravelMinutes
  };
}

function getSupportiveCrisisResponse() {
  return {
    reply:
      "I am really sorry you are feeling this way. Please reach out to someone you trust right now, or contact local emergency support if you might be in danger. I will stay gentle here, but I do not want to push products or trips when your safety matters most.",
    analysis: {
      mood: "crisis",
      intent: "safety_support",
      desiredExperience: [],
      categories: [],
      confidence: 1,
      isCrisis: true
    },
    recommendations: []
  };
}

async function callGroqJson<T>(
  schemaName: string,
  schema: Record<string, unknown>,
  messages: Array<{ role: "system" | "user"; content: string }>,
  parser: z.ZodSchema<T>
): Promise<T> {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq response did not include content");
  }

  return parser.parse(JSON.parse(content));
}

async function classifyMessage(message: string) {
  const schema = {
    type: "object",
    additionalProperties: false,
    required: [
      "mood",
      "intent",
      "desiredExperience",
      "preferredCategories",
      "energyLevel",
      "socialPreference",
      "confidence",
      "isCrisis"
    ],
    properties: {
      mood: { type: "string" },
      intent: { type: "string" },
      desiredExperience: {
        type: "array",
        items: { type: "string" }
      },
      preferredCategories: {
        type: "array",
        items: { type: "string", enum: otopCategories }
      },
      energyLevel: { type: "string", enum: ["low", "medium", "high"] },
      socialPreference: {
        type: "string",
        enum: ["quiet", "balanced", "social"]
      },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      isCrisis: { type: "boolean" }
    }
  };

  return callGroqJson(
    "bhunma_mood_classification",
    schema,
    [
      {
        role: "system",
        content:
          "You classify a PaiDuay user's mood and local travel intent. Return JSON only. Prefer OTOP categories that match the user's mood. If the user implies self-harm or immediate danger, set isCrisis true."
      },
      {
        role: "user",
        content: message
      }
    ],
    classificationSchema
  );
}

async function composeReply(
  message: string,
  classification: AssistantClassification,
  candidates: Candidate[]
) {
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["reply", "recommendationReasons"],
    properties: {
      reply: { type: "string" },
      recommendationReasons: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "reason"],
          properties: {
            id: { type: "string" },
            reason: { type: "string" }
          }
        }
      }
    }
  };
  const context = candidates.map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    type: candidate.type,
    category: candidate.category,
    description: candidate.description,
    distanceKm:
      candidate.distanceKm === undefined
        ? null
        : Number(candidate.distanceKm.toFixed(1))
  }));

  return callGroqJson(
    "bhunma_grounded_reply",
    schema,
    [
      {
        role: "system",
        content:
          "You are บุญมา BhunMa, a warm PaiDuay local assistant. Write a concise supportive answer. Only mention recommendation records provided in context. Do not invent places, products, prices, or claims. Return JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          userMessage: message,
          classification,
          recommendations: context
        })
      }
    ],
    composedReplySchema
  );
}

async function getRankedCandidates(
  classification: AssistantClassification,
  location?: Coordinates | null
) {
  const categories = getMappedCategories(classification);
  const [villages, productServices] = await Promise.all([
    getOtopVillages(),
    getOtopProductServices()
  ]);
  const villageLookup = new Map(
    villages
      .filter((village) => village.villageId)
      .map((village) => [village.villageId as string, village])
  );

  let candidates: Candidate[] = [
    ...villages.map((village) => mapVillageCandidate(village, location)),
    ...productServices.map((item) =>
      mapProductCandidate(item, villageLookup, location)
    )
  ];

  const categoryFilteredCandidates = candidates.filter((candidate) => {
    const category = normalizeCategory(candidate.category);
    return category ? categories.includes(category) : false;
  });

  if (categoryFilteredCandidates.length > 0) {
    candidates = categoryFilteredCandidates;
  }

  return candidates
    .map((candidate) => ({
      ...candidate,
      score: getCandidateScore(candidate, classification, categories)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export async function generateAssistantChatResponse(input: AssistantChatInput) {
  if (hasCrisisKeyword(input.message)) {
    return getSupportiveCrisisResponse();
  }

  const classification = await classifyMessage(input.message);

  if (classification.isCrisis) {
    return getSupportiveCrisisResponse();
  }

  const candidates = await getRankedCandidates(classification, input.location);
  const composedReply =
    candidates.length > 0
      ? await composeReply(input.message, classification, candidates)
      : ({
          reply:
            "I understand. I could not find a strong OTOP match yet, but you can still explore calm local villages and services from the OTOP page.",
          recommendationReasons: []
        } satisfies ComposedReply);
  const reasonLookup = new Map(
    composedReply.recommendationReasons.map((item) => [item.id, item.reason])
  );

  return {
    reply: composedReply.reply,
    analysis: {
      mood: classification.mood,
      intent: classification.intent,
      desiredExperience: classification.desiredExperience,
      categories: getMappedCategories(classification),
      confidence: classification.confidence,
      isCrisis: false
    },
    recommendations: candidates.map((candidate) =>
      toRecommendation(candidate, reasonLookup.get(candidate.id))
    )
  };
}
