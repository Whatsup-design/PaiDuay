export const shopCategories = [
  "All",
  "Market",
  "Service",
  "Wellness",
  "Food",
  "Craft",
  "Marine"
] as const;

export type ShopCategory = (typeof shopCategories)[number];

export type ShopItem = {
  id: string;
  slug: string;
  name: string;
  seller: string;
  description: string;
  itemType: "store" | "service" | "product" | "market";
  type: "Store" | "Service" | "Product" | "Market";
  category: Exclude<ShopCategory, "All">;
  province: string;
  district: string;
  location: string;
  locationName: string;
  priceAmount: number | null;
  price: string;
  priceLabel: string;
  currency: string;
  rating: string;
  imageUrl: string;
  imagePath: string;
  imageAlt: string;
  googleMapsUrl: string;
  contactPhone: string;
  contactLine: string;
  isFeatured: boolean;
  gradient: string;
};
