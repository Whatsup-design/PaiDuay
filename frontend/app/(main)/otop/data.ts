export const otopCategories = [
  "All",
  "Food",
  "Craft",
  "Wellness",
  "Marine",
  "Culture"
] as const;

export type OtopCategory = (typeof otopCategories)[number];

export type Village = {
  id: string;
  villageId?: string;
  slug?: string;
  name: string;
  province?: string;
  district: string;
  subdistrict?: string;
  placeName?: string;
  description: string;
  history: string;
  wisdom: string[];
  highlights: string[];
  category: Exclude<OtopCategory, "All">;
  gradient: string;
  googleMapsUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  coverImageUrl?: string;
  coverImagePath?: string;
  coverImageAlt?: string;
};

export type ProductService = {
  id?: string;
  slug?: string;
  villageId?: string;
  name: string;
  village: string;
  villageSlug?: string;
  type: "Product" | "Service";
  price: string;
  priceAmount?: number;
  priceLabel?: string;
  category: Exclude<OtopCategory, "All">;
  gradient: string;
  description?: string;
  detail?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  placeName?: string;
  currency?: string;
  imageUrl?: string;
  imagePath?: string;
  imageAlt?: string;
  googleMapsUrl?: string;
  openingHours?: {
    type?: string;
    note?: string;
    days?: Record<string, unknown>;
  };
  openingNote?: string;
  crowdDensity?: "low" | "medium" | "high";
  contactPhone?: string;
  contactLine?: string;
  isFeatured?: boolean;
};

export type OtopLocation = {
  name: string;
  hint: string;
};
