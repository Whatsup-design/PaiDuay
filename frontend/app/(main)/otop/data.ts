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
  name: string;
  district: string;
  description: string;
  history: string;
  wisdom: string[];
  highlights: string[];
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
    id: "ban-bang-rong",
    name: "Ban Bang Rong",
    district: "Thalang",
    description:
      "A mangrove community known for local food, coastal culture, and slow travel routes.",
    history:
      "Ban Bang Rong grew around mangrove livelihoods, small coastal food networks, and community-led conservation. The village is known for connecting local tourism with marine ecosystem care, where visitors can learn how daily life, food, and nature support one another.",
    wisdom: [
      "Mangrove conservation knowledge",
      "Local seafood preparation",
      "Community-based tourism operation"
    ],
    highlights: [
      "Mangrove learning route",
      "Local food and service booths",
      "Marine-friendly community activities"
    ],
    category: "Marine",
    gradient: "from-cyan-200 via-sky-100 to-emerald-100"
  },
  {
    id: "ban-kathu-craft",
    name: "Ban Kathu Craft",
    district: "Kathu",
    description:
      "Small makers preserving Phuket craft stories through baskets, fabric, and home goods.",
    history:
      "Ban Kathu Craft represents a maker community that keeps local handcraft stories alive through everyday objects. Its products connect household skills, local material knowledge, and tourism demand in a way that helps small makers earn from cultural value.",
    wisdom: [
      "Basketry and weaving techniques",
      "Local material selection",
      "Handmade product finishing"
    ],
    highlights: [
      "Craft maker route",
      "Handwoven basket products",
      "Small workshop-style experience"
    ],
    category: "Craft",
    gradient: "from-amber-200 via-orange-100 to-yellow-50"
  },
  {
    id: "old-town-heritage",
    name: "Old Town Heritage",
    district: "Mueang Phuket",
    description:
      "A culture-led village route connecting local snacks, Sino-Portuguese stories, and shops.",
    history:
      "Old Town Heritage is shaped by Phuket's trading history, architecture, and food culture. The area brings together small shops, local snacks, and cultural routes that help visitors understand how the city grew through community, trade, and craft.",
    wisdom: [
      "Local snack recipes",
      "Sino-Portuguese heritage storytelling",
      "Community shop curation"
    ],
    highlights: [
      "Old town walking route",
      "Local snack discovery",
      "Heritage shop experience"
    ],
    category: "Culture",
    gradient: "from-rose-200 via-pink-100 to-sky-100"
  },
  {
    id: "rawai-sea-village",
    name: "Rawai Sea Village",
    district: "Mueang Phuket",
    description:
      "Community services and marine-inspired products connected to responsible coastal visits.",
    history:
      "Rawai Sea Village connects coastal livelihoods with visitor services and marine-inspired products. The community experience is built around local knowledge of the sea, food, and responsible visits that respect the rhythm of coastal life.",
    wisdom: [
      "Coastal livelihood knowledge",
      "Marine food culture",
      "Responsible visitor hosting"
    ],
    highlights: [
      "Coastal community services",
      "Cooking and food experiences",
      "Marine-inspired local products"
    ],
    category: "Marine",
    gradient: "from-blue-200 via-cyan-100 to-slate-100"
  },
  {
    id: "chalong-wellness",
    name: "Chalong Wellness",
    district: "Mueang Phuket",
    description:
      "Local wellness makers offering herbs, massage knowledge, and mindful visitor experiences.",
    history:
      "Chalong Wellness focuses on local health knowledge, herbs, and mindful services. The community route is designed for visitors who want to understand wellness as local wisdom rather than only a tourism product.",
    wisdom: [
      "Herbal compress knowledge",
      "Local wellness product making",
      "Massage and relaxation practices"
    ],
    highlights: [
      "Herbal product discovery",
      "Wellness partner visit",
      "Mindful service experience"
    ],
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

export function getVillageById(id: string) {
  return villages.find((village) => village.id === id);
}
