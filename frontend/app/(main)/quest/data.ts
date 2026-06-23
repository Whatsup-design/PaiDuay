export type QuestType = "Province" | "VillageMarket";

export type QuestDifficulty = "Easy" | "Medium" | "Hard";

export type QuestStepDetail = {
  order?: number;
  title?: string;
  description?: string;
  place_name?: string;
  checkpoint_type?: string;
};

export type Quest = {
  id: string;
  questId?: string;
  slug?: string;
  title: string;
  type: QuestType;
  location: string;
  placeName?: string;
  province?: string;
  district?: string;
  duration: string;
  difficulty: QuestDifficulty;
  reward: string;
  description: string;
  steps: string[];
  stepDetails?: QuestStepDetail[];
  imageUrl?: string;
  imagePath?: string;
  imageAlt?: string;
  googleMapsUrl?: string;
  isFeatured?: boolean;
  gradient: string;
};
