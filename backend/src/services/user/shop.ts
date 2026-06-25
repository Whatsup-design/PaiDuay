import { supabase } from "../../lib/supabase.js";

const itemTypes = ["store", "service", "product", "market"] as const;
const categories = [
  "market",
  "service",
  "wellness",
  "food",
  "craft",
  "marine"
] as const;

type ShopItemTypeValue = (typeof itemTypes)[number];
type ShopCategoryValue = (typeof categories)[number];

type ShopItemRow = {
  item_id: string;
  slug: string;
  name: string;
  seller_name: string;
  description: string;
  item_type: ShopItemTypeValue;
  category: ShopCategoryValue;
  province: string;
  district: string | null;
  location_name: string | null;
  price_amount: number | null;
  price_label: string;
  currency: string;
  rating: number | null;
  image_url: string;
  image_path: string;
  image_alt: string | null;
  google_maps_url: string | null;
  contact_phone: string | null;
  contact_line: string | null;
  is_featured: boolean;
};

export type ShopListFilters = {
  item_type?: unknown;
  category?: unknown;
  district?: unknown;
  featured?: unknown;
  search?: unknown;
};

const gradientByCategory: Record<ShopCategoryValue, string> = {
  market: "from-sky-200 via-indigo-100 to-rose-100",
  service: "from-cyan-200 via-sky-100 to-emerald-100",
  wellness: "from-emerald-200 via-teal-100 to-lime-100",
  food: "from-yellow-200 via-orange-100 to-amber-50",
  craft: "from-orange-200 via-stone-100 to-yellow-100",
  marine: "from-blue-200 via-cyan-100 to-slate-100"
};

const shopItemColumns = [
  "item_id",
  "slug",
  "name",
  "seller_name",
  "description",
  "item_type",
  "category",
  "province",
  "district",
  "location_name",
  "price_amount",
  "price_label",
  "currency",
  "rating",
  "image_url",
  "image_path",
  "image_alt",
  "google_maps_url",
  "contact_phone",
  "contact_line",
  "is_featured"
].join(",");

function firstQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeItemType(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && itemTypes.includes(candidate as ShopItemTypeValue)) {
    return candidate as ShopItemTypeValue;
  }

  return undefined;
}

function normalizeCategory(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && categories.includes(candidate as ShopCategoryValue)) {
    return candidate as ShopCategoryValue;
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

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeIlike(value: string) {
  return value.replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function mapShopItem(row: ShopItemRow) {
  return {
    id: row.item_id,
    slug: row.slug,
    name: row.name,
    seller: row.seller_name,
    description: row.description,
    itemType: row.item_type,
    type: titleCase(row.item_type),
    category: titleCase(row.category),
    province: row.province,
    district: row.district ?? "",
    location: row.location_name ?? row.district ?? "",
    locationName: row.location_name ?? "",
    priceAmount: row.price_amount,
    price: row.price_label,
    priceLabel: row.price_label,
    currency: row.currency,
    rating: row.rating === null ? "" : row.rating.toFixed(1),
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imageAlt: row.image_alt ?? row.name,
    googleMapsUrl: row.google_maps_url ?? "",
    contactPhone: row.contact_phone ?? "",
    contactLine: row.contact_line ?? "",
    isFeatured: row.is_featured,
    gradient: gradientByCategory[row.category]
  };
}

export async function getShopItems(filters: ShopListFilters = {}) {
  let query = supabase
    .from("shop_items")
    .select(shopItemColumns)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const itemType = normalizeItemType(filters.item_type);
  const category = normalizeCategory(filters.category);
  const district = firstQueryValue(filters.district);
  const featured = normalizeBoolean(filters.featured);
  const search = firstQueryValue(filters.search);

  if (itemType) {
    query = query.eq("item_type", itemType);
  }

  if (category) {
    query = query.eq("category", category);
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
      `name.ilike.${pattern},seller_name.ilike.${pattern},description.ilike.${pattern},location_name.ilike.${pattern},district.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as ShopItemRow[]).map(mapShopItem);
}

export async function getShopItemBySlug(slug: string) {
  const { data, error } = await supabase
    .from("shop_items")
    .select(shopItemColumns)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapShopItem(data as unknown as ShopItemRow) : null;
}
