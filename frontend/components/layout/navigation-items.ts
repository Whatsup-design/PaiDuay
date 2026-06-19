import { Home, Map, Medal, ShoppingBag, Store } from "lucide-react";

export const mainNavItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "OTOP", href: "/otop", icon: Store, isFeatured: true },
  { label: "Shop", href: "/market", icon: ShoppingBag },
  { label: "Quest", href: "/quest", icon: Map },
  { label: "Reward", href: "/reward", icon: Medal }
];
