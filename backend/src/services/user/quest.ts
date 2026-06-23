import { supabase } from "../../lib/supabase.js";

const questTypes = ["province", "village_market"] as const;
const difficulties = ["easy", "medium", "hard"] as const;

type QuestTypeValue = (typeof questTypes)[number];
type QuestDifficultyValue = (typeof difficulties)[number];

type QuestStep = {
  order?: number;
  title?: string;
  description?: string;
  place_name?: string;
  checkpoint_type?: string;
};

type QuestRow = {
  quest_id: string;
  slug: string;
  name: string;
  description: string;
  quest_type: QuestTypeValue;
  difficulty: QuestDifficultyValue;
  place_name: string | null;
  province: string;
  district: string | null;
  avg_duration: string;
  reward: string;
  steps: QuestStep[];
  image_url: string;
  image_path: string;
  image_alt: string | null;
  google_maps_url: string | null;
  is_featured: boolean;
};

export type QuestListFilters = {
  quest_type?: unknown;
  difficulty?: unknown;
  district?: unknown;
  featured?: unknown;
  search?: unknown;
};

const gradientByType: Record<QuestTypeValue, string> = {
  province: "from-sky-300 via-blue-200 to-cyan-100",
  village_market: "from-emerald-200 via-cyan-100 to-sky-50"
};

const questColumns = [
  "quest_id",
  "slug",
  "name",
  "description",
  "quest_type",
  "difficulty",
  "place_name",
  "province",
  "district",
  "avg_duration",
  "reward",
  "steps",
  "image_url",
  "image_path",
  "image_alt",
  "google_maps_url",
  "is_featured"
].join(",");

function firstQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeQuestType(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && questTypes.includes(candidate as QuestTypeValue)) {
    return candidate as QuestTypeValue;
  }

  return undefined;
}

function normalizeDifficulty(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && difficulties.includes(candidate as QuestDifficultyValue)) {
    return candidate as QuestDifficultyValue;
  }

  return undefined;
}

function normalizeBoolean(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate === "true" || candidate === "1") {
    return true;
  }

  if (candidate === "false" || candidate === "0") {
    return false;
  }

  return undefined;
}

function escapeIlike(value: string) {
  return value.replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function mapQuestType(value: QuestTypeValue) {
  return value === "province" ? "Province" : "VillageMarket";
}

function mapDifficulty(value: QuestDifficultyValue) {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as
    | "Easy"
    | "Medium"
    | "Hard";
}

function mapQuest(row: QuestRow) {
  return {
    id: row.slug,
    questId: row.quest_id,
    slug: row.slug,
    title: row.name,
    type: mapQuestType(row.quest_type),
    location: row.place_name ?? row.district ?? row.province,
    placeName: row.place_name ?? "",
    province: row.province,
    district: row.district ?? "",
    duration: row.avg_duration,
    difficulty: mapDifficulty(row.difficulty),
    reward: row.reward,
    description: row.description,
    steps: (row.steps ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((step) => step.title ?? "")
      .filter(Boolean),
    stepDetails: row.steps ?? [],
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imageAlt: row.image_alt ?? row.name,
    googleMapsUrl: row.google_maps_url ?? "",
    isFeatured: row.is_featured,
    gradient: gradientByType[row.quest_type]
  };
}

export async function getQuestItems(filters: QuestListFilters = {}) {
  let query = supabase
    .from("quest_items")
    .select(questColumns)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const questType = normalizeQuestType(filters.quest_type);
  const difficulty = normalizeDifficulty(filters.difficulty);
  const district = firstQueryValue(filters.district);
  const featured = normalizeBoolean(filters.featured);
  const search = firstQueryValue(filters.search);

  if (questType) {
    query = query.eq("quest_type", questType);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (district) {
    query = query.ilike("district", district);
  }

  if (featured !== undefined) {
    query = query.eq("is_featured", featured);
  }

  if (search) {
    const pattern = `%${escapeIlike(search)}%`;
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},place_name.ilike.${pattern},district.ilike.${pattern},reward.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as QuestRow[]).map(mapQuest);
}

export async function getQuestItemBySlug(slug: string) {
  const { data, error } = await supabase
    .from("quest_items")
    .select(questColumns)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapQuest(data as unknown as QuestRow) : null;
}
