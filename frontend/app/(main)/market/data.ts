export const marketCategories = [
  "Market",
  "Service",
  "Wellness",
  "Food",
  "Craft",
  "Marine"
] as const;

export type MarketCategory = (typeof marketCategories)[number];

export type MarketItem = {
  name: string;
  seller: string;
  location: string;
  category: MarketCategory;
  type: "Product" | "Service" | "Experience";
  price: string;
  rating: string;
  gradient: string;
};

export const marketItems: MarketItem[] = [
  {
    name: "Old Town Weekend Basket",
    seller: "Ban Kathu Craft",
    location: "Kathu",
    category: "Market",
    type: "Product",
    price: "฿450",
    rating: "4.8",
    gradient: "from-amber-200 via-orange-100 to-yellow-50"
  },
  {
    name: "Mangrove Local Walk",
    seller: "Ban Bang Rong",
    location: "Thalang",
    category: "Service",
    type: "Experience",
    price: "฿350 / person",
    rating: "4.9",
    gradient: "from-cyan-200 via-sky-100 to-emerald-100"
  },
  {
    name: "Herbal Compress Session",
    seller: "Chalong Wellness",
    location: "Chalong",
    category: "Wellness",
    type: "Service",
    price: "฿590",
    rating: "4.7",
    gradient: "from-emerald-200 via-teal-100 to-lime-100"
  },
  {
    name: "Phuket Pineapple Jam",
    seller: "Old Town Heritage",
    location: "Mueang Phuket",
    category: "Food",
    type: "Product",
    price: "฿120",
    rating: "4.6",
    gradient: "from-yellow-200 via-orange-100 to-amber-50"
  },
  {
    name: "Batik Memory Card",
    seller: "Old Town Heritage",
    location: "Mueang Phuket",
    category: "Craft",
    type: "Product",
    price: "฿180",
    rating: "4.8",
    gradient: "from-fuchsia-200 via-rose-100 to-orange-50"
  },
  {
    name: "Rawai Cooking Mini Class",
    seller: "Rawai Sea Village",
    location: "Rawai",
    category: "Marine",
    type: "Experience",
    price: "฿790 / person",
    rating: "4.9",
    gradient: "from-blue-200 via-cyan-100 to-slate-100"
  },
  {
    name: "Sunday Walking Market Pass",
    seller: "Old Town Heritage",
    location: "Old Phuket Town",
    category: "Market",
    type: "Experience",
    price: "Free entry",
    rating: "4.7",
    gradient: "from-sky-200 via-indigo-100 to-rose-100"
  },
  {
    name: "Local Wellness Tea Set",
    seller: "Chalong Wellness",
    location: "Chalong",
    category: "Wellness",
    type: "Product",
    price: "฿260",
    rating: "4.6",
    gradient: "from-lime-200 via-green-100 to-teal-50"
  },
  {
    name: "Island Transfer Helper",
    seller: "Rawai Sea Village",
    location: "Rawai",
    category: "Service",
    type: "Service",
    price: "฿300+",
    rating: "4.5",
    gradient: "from-slate-200 via-sky-100 to-cyan-50"
  }
];
