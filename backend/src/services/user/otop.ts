import { supabase } from "../../lib/supabase.js";

const categories = ["food", "craft", "wellness", "marine", "culture"] as const;
const itemTypes = ["product", "service"] as const;

type OtopCategoryValue = (typeof categories)[number];
type OtopItemTypeValue = (typeof itemTypes)[number];
type OtopCrowdDensityValue = "low" | "medium" | "high";

type OpeningHours = {
  type?: string;
  note?: string;
  days?: Record<string, unknown>;
};

type OtopVillageRow = {
  village_id: string;
  slug: string;
  name: string;
  province: string;
  district: string | null;
  subdistrict: string | null;
  place_name: string | null;
  description: string;
  history: string;
  wisdom: string[];
  highlights: string[];
  category: OtopCategoryValue;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image_url: string;
  cover_image_path: string;
  cover_image_alt: string | null;
};

type OtopProductServiceRow = {
  item_id: string;
  village_id: string;
  slug: string;
  name: string;
  item_type: OtopItemTypeValue;
  category: OtopCategoryValue;
  description: string;
  detail: string;
  province: string;
  district: string | null;
  subdistrict: string | null;
  place_name: string | null;
  price_amount: number;
  price_label: string;
  currency: string;
  image_url: string;
  image_path: string;
  image_alt: string | null;
  google_maps_url: string | null;
  opening_hours: OpeningHours;
  crowd_density: OtopCrowdDensityValue;
  contact_phone: string | null;
  contact_line: string | null;
  is_featured: boolean;
};

export type OtopListFilters = {
  category?: unknown;
  item_type?: unknown;
  village_id?: unknown;
  province?: unknown;
  featured?: unknown;
  search?: unknown;
};

const gradientByCategory: Record<OtopCategoryValue, string> = {
  food: "from-yellow-200 via-orange-100 to-amber-50",
  craft: "from-orange-200 via-stone-100 to-yellow-100",
  wellness: "from-emerald-200 via-teal-100 to-lime-100",
  marine: "from-cyan-200 via-sky-100 to-emerald-100",
  culture: "from-rose-200 via-pink-100 to-sky-100"
};

function firstQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeCategory(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && categories.includes(candidate as OtopCategoryValue)) {
    return candidate as OtopCategoryValue;
  }

  return undefined;
}

function normalizeItemType(value: unknown) {
  const candidate = firstQueryValue(value)?.toLowerCase();

  if (candidate && itemTypes.includes(candidate as OtopItemTypeValue)) {
    return candidate as OtopItemTypeValue;
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

function mapVillage(row: OtopVillageRow) {
  return {
    id: row.slug,
    villageId: row.village_id,
    slug: row.slug,
    name: row.name,
    province: row.province,
    district: row.district ?? "",
    subdistrict: row.subdistrict ?? "",
    placeName: row.place_name ?? "",
    description: row.description,
    history: row.history,
    wisdom: row.wisdom ?? [],
    highlights: row.highlights ?? [],
    category: titleCase(row.category),
    gradient: gradientByCategory[row.category],
    googleMapsUrl: row.google_maps_url ?? "",
    latitude: row.latitude,
    longitude: row.longitude,
    coverImageUrl: row.cover_image_url,
    coverImagePath: row.cover_image_path,
    coverImageAlt: row.cover_image_alt ?? row.name
  };
}

function mapProductService(
  row: OtopProductServiceRow,
  villagesById: Map<string, OtopVillageRow>
) {
  const village = villagesById.get(row.village_id);

  return {
    id: row.item_id,
    slug: row.slug,
    villageId: row.village_id,
    name: row.name,
    village: village?.name ?? "",
    villageSlug: village?.slug ?? "",
    type: titleCase(row.item_type),
    price: row.price_label,
    priceAmount: row.price_amount,
    priceLabel: row.price_label,
    category: titleCase(row.category),
    gradient: gradientByCategory[row.category],
    description: row.description,
    detail: row.detail,
    province: row.province,
    district: row.district ?? "",
    subdistrict: row.subdistrict ?? "",
    placeName: row.place_name ?? "",
    currency: row.currency,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imageAlt: row.image_alt ?? row.name,
    googleMapsUrl: row.google_maps_url ?? "",
    openingHours: row.opening_hours,
    openingNote: row.opening_hours?.note ?? "",
    crowdDensity: row.crowd_density,
    contactPhone: row.contact_phone ?? "",
    contactLine: row.contact_line ?? "",
    isFeatured: row.is_featured
  };
}

export async function getOtopVillages(filters: OtopListFilters = {}) {
  let query = supabase
    .from("otop_villages")
    .select(
      [
        "village_id",
        "slug",
        "name",
        "province",
        "district",
        "subdistrict",
        "place_name",
        "description",
        "history",
        "wisdom",
        "highlights",
        "category",
        "google_maps_url",
        "latitude",
        "longitude",
        "cover_image_url",
        "cover_image_path",
        "cover_image_alt"
      ].join(",")
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  const category = normalizeCategory(filters.category);
  const province = firstQueryValue(filters.province);
  const search = firstQueryValue(filters.search);

  if (category) {
    query = query.eq("category", category);
  }

  if (province) {
    query = query.ilike("province", province);
  }

  if (search) {
    const pattern = `%${escapeIlike(search)}%`;
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},district.ilike.${pattern},place_name.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as OtopVillageRow[]).map(mapVillage);
}

export async function getOtopVillageBySlug(slug: string) {
  const { data, error } = await supabase
    .from("otop_villages")
    .select(
      [
        "village_id",
        "slug",
        "name",
        "province",
        "district",
        "subdistrict",
        "place_name",
        "description",
        "history",
        "wisdom",
        "highlights",
        "category",
        "google_maps_url",
        "latitude",
        "longitude",
        "cover_image_url",
        "cover_image_path",
        "cover_image_alt"
      ].join(",")
    )
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapVillage(data as unknown as OtopVillageRow) : null;
}

export async function getOtopVillageById(id: string) {
  return getOtopVillageBySlug(id);
}

export async function getOtopProductServices(filters: OtopListFilters = {}) {
  let query = supabase
    .from("otop_product_services")
    .select(
      [
        "item_id",
        "village_id",
        "slug",
        "name",
        "item_type",
        "category",
        "description",
        "detail",
        "province",
        "district",
        "subdistrict",
        "place_name",
        "price_amount",
        "price_label",
        "currency",
        "image_url",
        "image_path",
        "image_alt",
        "google_maps_url",
        "opening_hours",
        "crowd_density",
        "contact_phone",
        "contact_line",
        "is_featured"
      ].join(",")
    )
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const category = normalizeCategory(filters.category);
  const itemType = normalizeItemType(filters.item_type);
  const villageId = firstQueryValue(filters.village_id);
  const province = firstQueryValue(filters.province);
  const featured = normalizeBoolean(filters.featured);
  const search = firstQueryValue(filters.search);

  if (category) {
    query = query.eq("category", category);
  }

  if (itemType) {
    query = query.eq("item_type", itemType);
  }

  if (villageId) {
    query = query.eq("village_id", villageId);
  }

  if (province) {
    query = query.ilike("province", province);
  }

  if (featured !== undefined) {
    query = query.eq("is_featured", featured);
  }

  if (search) {
    const pattern = `%${escapeIlike(search)}%`;
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},detail.ilike.${pattern},place_name.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as OtopProductServiceRow[];
  const villageIds = [...new Set(rows.map((row) => row.village_id))];
  const villagesById = new Map<string, OtopVillageRow>();

  if (villageIds.length > 0) {
    const { data: villages, error: villageError } = await supabase
      .from("otop_villages")
      .select("village_id,slug,name")
      .in("village_id", villageIds);

    if (villageError) {
      throw villageError;
    }

    for (const village of (villages ?? []) as unknown as OtopVillageRow[]) {
      villagesById.set(village.village_id, village);
    }
  }

  return rows.map((row) => mapProductService(row, villagesById));
}

export async function getOtopProductServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from("otop_product_services")
    .select(
      [
        "item_id",
        "village_id",
        "slug",
        "name",
        "item_type",
        "category",
        "description",
        "detail",
        "province",
        "district",
        "subdistrict",
        "place_name",
        "price_amount",
        "price_label",
        "currency",
        "image_url",
        "image_path",
        "image_alt",
        "google_maps_url",
        "opening_hours",
        "crowd_density",
        "contact_phone",
        "contact_line",
        "is_featured"
      ].join(",")
    )
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as OtopProductServiceRow;
  const { data: village, error: villageError } = await supabase
    .from("otop_villages")
    .select("village_id,slug,name")
    .eq("village_id", row.village_id)
    .maybeSingle();

  if (villageError) {
    throw villageError;
  }

  return mapProductService(
    row,
    new Map(
      village
        ? [[row.village_id, village as unknown as OtopVillageRow]]
        : []
    )
  );
}
