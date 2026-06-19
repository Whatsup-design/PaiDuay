export const rewardStatuses = ["Available", "Used", "Expired"] as const;

export type RewardStatus = (typeof rewardStatuses)[number];

export type RewardType =
  | "Percentage Discount"
  | "Fixed Discount"
  | "Free Item"
  | "Digital Badge"
  | "Cross-Partner Reward";

export type Reward = {
  id: string;
  title: string;
  partner: string;
  type: RewardType;
  status: RewardStatus;
  value: string;
  minimumSpend: string;
  validUntil: string;
  location: string;
  condition: string;
  redemptionCode: string;
  gradient: string;
};

export const redemptionSteps = [
  "Open reward detail",
  "Tap Use Reward",
  "Show dynamic QR or short code to staff",
  "Staff verifies and confirms",
  "Reward status changes to Used"
];

export const rewards: Reward[] = [
  {
    id: "old-town-10-percent",
    title: "Save 10% at Old Town Heritage",
    partner: "Old Town Heritage",
    type: "Percentage Discount",
    status: "Available",
    value: "10% off",
    minimumSpend: "Minimum spend ฿300",
    validUntil: "30 Jun 2026",
    location: "Old Phuket Town",
    condition: "Valid for local snacks, craft cards, and selected souvenirs.",
    redemptionCode: "PD-OTOP10",
    gradient: "from-sky-200 via-cyan-100 to-rose-100"
  },
  {
    id: "bang-rong-50-baht",
    title: "฿50 Bang Rong Community Credit",
    partner: "Ban Bang Rong",
    type: "Fixed Discount",
    status: "Available",
    value: "฿50 off",
    minimumSpend: "Minimum spend ฿250",
    validUntil: "15 Jul 2026",
    location: "Thalang",
    condition: "Can be used with participating local food or service booths.",
    redemptionCode: "PD-BR50",
    gradient: "from-emerald-200 via-cyan-100 to-sky-50"
  },
  {
    id: "chalong-herbal-trial",
    title: "Free Herbal Trial Pack",
    partner: "Chalong Wellness",
    type: "Free Item",
    status: "Available",
    value: "Free sample",
    minimumSpend: "No minimum spend",
    validUntil: "10 Jul 2026",
    location: "Chalong",
    condition: "One free trial pack per user while supplies last.",
    redemptionCode: "PD-HERB",
    gradient: "from-lime-200 via-emerald-100 to-teal-50"
  },
  {
    id: "marine-explorer-badge",
    title: "Marine Friendly Explorer Badge",
    partner: "Rawai Sea Village",
    type: "Digital Badge",
    status: "Used",
    value: "Digital badge",
    minimumSpend: "Quest completion required",
    validUntil: "Claimed on 12 Jun 2026",
    location: "Rawai",
    condition: "Awarded after completing a marine community quest.",
    redemptionCode: "PD-MARINE",
    gradient: "from-blue-200 via-cyan-100 to-slate-100"
  },
  {
    id: "partner-market-pass",
    title: "Cross-Partner Market Pass",
    partner: "PaiDuay Partners",
    type: "Cross-Partner Reward",
    status: "Expired",
    value: "Partner bundle",
    minimumSpend: "Quest passport required",
    validUntil: "Expired 01 Jun 2026",
    location: "Phuket province",
    condition: "Valid across selected village and market partners.",
    redemptionCode: "PD-PASS",
    gradient: "from-amber-200 via-orange-100 to-yellow-50"
  }
];
