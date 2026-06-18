export type QuestType = "Province" | "VillageMarket";

export type QuestDifficulty = "Easy" | "Medium" | "Hard";

export type Quest = {
  id: string;
  title: string;
  type: QuestType;
  location: string;
  duration: string;
  difficulty: QuestDifficulty;
  reward: string;
  description: string;
  steps: string[];
  gradient: string;
};

export const provinceQuests: Quest[] = [
  {
    id: "phuket-otop-passport",
    title: "Phuket OTOP Passport",
    type: "Province",
    location: "Phuket province",
    duration: "1-2 days",
    difficulty: "Hard",
    reward: "Passport badge + premium local reward",
    description:
      "A long-form provincial route that connects villages, markets, and local shops across Phuket.",
    steps: [
      "Visit Ban Bang Rong community",
      "Check in at Old Phuket Town market",
      "Discover one local OTOP shop",
      "Complete final QR scan to claim the passport badge"
    ],
    gradient: "from-sky-300 via-blue-200 to-cyan-100"
  },
  {
    id: "coastal-community-route",
    title: "Coastal Community Route",
    type: "Province",
    location: "Rawai, Chalong, Thalang",
    duration: "Full day",
    difficulty: "Medium",
    reward: "Marine friendly traveler badge",
    description:
      "A province-level journey focused on responsible tourism and coastal community services.",
    steps: [
      "Start at Rawai Sea Village",
      "Learn one marine-friendly activity",
      "Visit Chalong wellness partner",
      "End with a local product discovery"
    ],
    gradient: "from-cyan-300 via-sky-100 to-emerald-100"
  }
];

export const villageMarketQuests: Quest[] = [
  {
    id: "bang-rong-mangrove-mini",
    title: "Bang Rong Mangrove Mini Quest",
    type: "VillageMarket",
    location: "Ban Bang Rong",
    duration: "45-60 min",
    difficulty: "Easy",
    reward: "Local explorer points",
    description:
      "A compact village quest where visitors scan QR points, learn local stories, and support community services.",
    steps: [
      "Check in at the community welcome point",
      "Scan the mangrove story QR",
      "Visit one local food or service booth"
    ],
    gradient: "from-emerald-200 via-cyan-100 to-sky-50"
  },
  {
    id: "old-town-market-scan",
    title: "Old Town Market Scan",
    type: "VillageMarket",
    location: "Old Phuket Town",
    duration: "30-45 min",
    difficulty: "Easy",
    reward: "Market discovery coupon",
    description:
      "A short market quest for discovering local snacks, crafts, and community sellers in one walkable area.",
    steps: [
      "Find the first market QR",
      "Discover two local sellers",
      "Complete a mini review to unlock the coupon"
    ],
    gradient: "from-amber-200 via-orange-100 to-rose-50"
  },
  {
    id: "chalong-wellness-trail",
    title: "Chalong Wellness Trail",
    type: "VillageMarket",
    location: "Chalong",
    duration: "60 min",
    difficulty: "Medium",
    reward: "Wellness partner stamp",
    description:
      "A focused quest for visitors who want to learn about herbs, massage knowledge, and local wellness products.",
    steps: [
      "Check in at wellness partner",
      "Scan one herbal knowledge card",
      "Try or view one wellness product"
    ],
    gradient: "from-lime-200 via-emerald-100 to-teal-50"
  }
];

export const allQuests = [...provinceQuests, ...villageMarketQuests];

export function getQuestById(id: string) {
  return allQuests.find((quest) => quest.id === id);
}
