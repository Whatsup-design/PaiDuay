export const otopCategories = [
  "All",
  "Food",
  "Craft",
  "Wellness",
  "Marine",
  "Culture",
  "Service"
] as const;

export type OtopCategory = (typeof otopCategories)[number];

export type Village = {
  name: string;
  district: string;
  description: string;
  category: Exclude<OtopCategory, "All">;
  gradient: string;
};

export type ProductService = {
  name: string;
  village: string;
  type: "Product" | "Service";
  price: string;
  category: Exclude<OtopCategory, "All">;
  gradient: string;
};

export type OtopLocation = {
  name: string;
  hint: string;
};

export const otopLocations: OtopLocation[] = [
  { name: "Old Phuket Town", hint: "Culture, food, craft" },
  { name: "Thalang", hint: "Villages, mangrove, local goods" },
  { name: "Rawai", hint: "Marine community services" },
  { name: "Kathu", hint: "Craft and maker routes" }
];

export const villages: Village[] = [
  {
    name: "Ban Bang Rong",
    district: "Thalang",
    description:
      "A mangrove community known for local food, coastal culture, and slow travel routes.",
    category: "Marine",
    gradient: "from-cyan-200 via-sky-100 to-emerald-100"
  },
  {
    name: "Ban Kathu Craft",
    district: "Kathu",
    description:
      "Small makers preserving Phuket craft stories through baskets, fabric, and home goods.",
    category: "Craft",
    gradient: "from-amber-200 via-orange-100 to-yellow-50"
  },
  {
    name: "Old Town Heritage",
    district: "Mueang Phuket",
    description:
      "A culture-led village route connecting local snacks, Sino-Portuguese stories, and shops.",
    category: "Culture",
    gradient: "from-rose-200 via-pink-100 to-sky-100"
  },
  {
    name: "Rawai Sea Village",
    district: "Mueang Phuket",
    description:
      "Community services and marine-inspired products connected to responsible coastal visits.",
    category: "Service",
    gradient: "from-blue-200 via-cyan-100 to-slate-100"
  },
  {
    name: "Chalong Wellness",
    district: "Mueang Phuket",
    description:
      "Local wellness makers offering herbs, massage knowledge, and mindful visitor experiences.",
    category: "Wellness",
    gradient: "from-emerald-200 via-teal-100 to-lime-100"
  }
];

export const productServices: ProductService[] = [
  {
    name: "Phuket Pineapple Jam",
    village: "Old Town Heritage",
    type: "Product",
    price: "฿120",
    category: "Food",
    gradient: "from-yellow-200 via-orange-100 to-amber-50"
  },
  {
    name: "Handwoven Basket Set",
    village: "Ban Kathu Craft",
    type: "Product",
    price: "฿450",
    category: "Craft",
    gradient: "from-orange-200 via-stone-100 to-yellow-100"
  },
  {
    name: "Mangrove Local Walk",
    village: "Ban Bang Rong",
    type: "Service",
    price: "฿350 / person",
    category: "Marine",
    gradient: "from-sky-200 via-cyan-100 to-emerald-100"
  },
  {
    name: "Herbal Compress Session",
    village: "Chalong Wellness",
    type: "Service",
    price: "฿590",
    category: "Wellness",
    gradient: "from-lime-200 via-emerald-100 to-teal-50"
  },
  {
    name: "Batik Memory Card",
    village: "Old Town Heritage",
    type: "Product",
    price: "฿180",
    category: "Culture",
    gradient: "from-fuchsia-200 via-rose-100 to-orange-50"
  },
  {
    name: "Local Cooking Mini Class",
    village: "Rawai Sea Village",
    type: "Service",
    price: "฿790 / person",
    category: "Food",
    gradient: "from-red-200 via-orange-100 to-yellow-50"
  }
];
