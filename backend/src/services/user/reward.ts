import { supabase } from "../../lib/supabase.js";

const rewardTypes = [
  "percent_discount",
  "money_discount",
  "gift",
  "voucher",
  "badge",
  "partner_bundle"
] as const;
const rewardStatuses = ["available", "used", "expired"] as const;

type RewardTypeValue = (typeof rewardTypes)[number];
type RewardStatusValue = (typeof rewardStatuses)[number];

type RewardRow = {
  reward_id: string;
  slug: string;
  name: string;
  description: string;
  partner_name: string;
  reward_type: RewardTypeValue;
  status: RewardStatusValue;
  discount_percent: number | null;
  discount_amount: number | null;
  voucher_value: string | null;
  display_value: string;
  minimum_spend_amount: number | null;
  minimum_spend_label: string;
  valid_until: string | null;
  valid_until_label: string;
  location_name: string | null;
  condition: string;
  redemption_code: string;
  limited_quantity: boolean;
  quantity_limit: number | null;
  quantity_remaining: number | null;
  image_url: string;
  image_path: string;
  image_alt: string | null;
  google_maps_url: string | null;
  is_featured: boolean;
};

export type RewardListFilters = {
  reward_type?: unknown;
  status?: unknown;
  featured?: unknown;
  search?: unknown;
};

const gradientByRewardType: Record<RewardTypeValue, string> = {
  percent_discount: "from-sky-200 via-cyan-100 to-rose-100",
  money_discount: "from-emerald-200 via-cyan-100 to-sky-50",
  gift: "from-lime-200 via-emerald-100 to-teal-50",
  voucher: "from-amber-200 via-orange-100 to-yellow-50",
  badge: "from-blue-200 via-cyan-100 to-slate-100",
  partner_bundle: "from-amber-200 via-orange-100 to-yellow-50"
};

const rewardTypeLabel: Record<RewardTypeValue, string> = {
  percent_discount: "Percentage Discount",
  money_discount: "Fixed Discount",
  gift: "Free Item",
  voucher: "Voucher",
  badge: "Digital Badge",
  partner_bundle: "Cross-Partner Reward"
};

const rewardStatusLabel: Record<RewardStatusValue, string> = {
  available: "Available",
  used: "Used",
  expired: "Expired"
};

const rewardColumns = [
  "reward_id",
  "slug",
  "name",
  "description",
  "partner_name",
  "reward_type",
  "status",
  "discount_percent",
  "discount_amount",
  "voucher_value",
  "display_value",
  "minimum_spend_amount",
  "minimum_spend_label",
  "valid_until",
  "valid_until_label",
  "location_name",
  "condition",
  "redemption_code",
  "limited_quantity",
  "quantity_limit",
  "quantity_remaining",
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

function normalizeRewardType(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && rewardTypes.includes(candidate as RewardTypeValue)) {
    return candidate as RewardTypeValue;
  }

  return undefined;
}

function normalizeRewardStatus(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && rewardStatuses.includes(candidate as RewardStatusValue)) {
    return candidate as RewardStatusValue;
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

function mapReward(row: RewardRow) {
  return {
    id: row.slug,
    rewardId: row.reward_id,
    slug: row.slug,
    title: row.name,
    description: row.description,
    partner: row.partner_name,
    rewardType: row.reward_type,
    type: rewardTypeLabel[row.reward_type],
    status: rewardStatusLabel[row.status],
    discountPercent: row.discount_percent,
    discountAmount: row.discount_amount,
    voucherValue: row.voucher_value ?? "",
    value: row.display_value,
    minimumSpendAmount: row.minimum_spend_amount,
    minimumSpend: row.minimum_spend_label,
    validUntilDate: row.valid_until,
    validUntil: row.valid_until_label,
    location: row.location_name ?? "",
    condition: row.condition,
    redemptionCode: row.redemption_code,
    limitedQuantity: row.limited_quantity,
    quantityLimit: row.quantity_limit,
    quantityRemaining: row.quantity_remaining,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imageAlt: row.image_alt ?? row.name,
    googleMapsUrl: row.google_maps_url ?? "",
    isFeatured: row.is_featured,
    gradient: gradientByRewardType[row.reward_type]
  };
}

export async function getRewardItems(filters: RewardListFilters = {}) {
  let query = supabase
    .from("reward_items")
    .select(rewardColumns)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const rewardType = normalizeRewardType(filters.reward_type);
  const status = normalizeRewardStatus(filters.status);
  const featured = normalizeBoolean(filters.featured);
  const search = firstQueryValue(filters.search);

  if (rewardType) {
    query = query.eq("reward_type", rewardType);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (featured !== undefined) {
    query = query.eq("is_featured", featured);
  }

  if (search) {
    const pattern = `%${escapeIlike(search)}%`;
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},partner_name.ilike.${pattern},location_name.ilike.${pattern},condition.ilike.${pattern},display_value.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as RewardRow[]).map(mapReward);
}

export async function getRewardItemBySlug(slug: string) {
  const { data, error } = await supabase
    .from("reward_items")
    .select(rewardColumns)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapReward(data as unknown as RewardRow) : null;
}
