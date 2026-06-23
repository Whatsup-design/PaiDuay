export const rewardStatuses = ["Available", "Used", "Expired"] as const;

export type RewardStatus = (typeof rewardStatuses)[number];

export type RewardType =
  | "Percentage Discount"
  | "Fixed Discount"
  | "Free Item"
  | "Voucher"
  | "Digital Badge"
  | "Cross-Partner Reward";

export type Reward = {
  id: string;
  rewardId?: string;
  slug?: string;
  title: string;
  description: string;
  partner: string;
  rewardType:
    | "percent_discount"
    | "money_discount"
    | "gift"
    | "voucher"
    | "badge"
    | "partner_bundle";
  type: RewardType;
  status: RewardStatus;
  discountPercent: number | null;
  discountAmount: number | null;
  voucherValue: string;
  value: string;
  minimumSpendAmount: number | null;
  minimumSpend: string;
  validUntilDate: string | null;
  validUntil: string;
  location: string;
  condition: string;
  redemptionCode: string;
  limitedQuantity: boolean;
  quantityLimit: number | null;
  quantityRemaining: number | null;
  imageUrl: string;
  imagePath: string;
  imageAlt: string;
  googleMapsUrl: string;
  isFeatured: boolean;
  gradient: string;
};

export const redemptionSteps = [
  "Open reward detail",
  "Tap Use Reward",
  "Show dynamic QR or short code to staff",
  "Staff verifies and confirms",
  "Reward status changes to Used"
];
