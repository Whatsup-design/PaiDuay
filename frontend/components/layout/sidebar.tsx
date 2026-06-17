"use client";

import {
  ChevronLeft,
  ChevronRight,
  Home,
  Map,
  Medal,
  ShoppingBag,
  Settings,
  Store
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNavItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "OTOP", href: "/otop", icon: Store },
  { label: "Market", href: "/market", icon: ShoppingBag },
  { label: "Quest", href: "/quest", icon: Map },
  { label: "Reward", href: "/reward", icon: Medal }
];

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const labelClassName = `overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out ${
    isCollapsed
      ? "max-w-0 translate-x-1 opacity-0"
      : "max-w-32 translate-x-0 opacity-100"
  }`;

  return (
    <aside
      className={`hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden border-r border-sky-100 bg-white px-3 py-4 transition-[width] duration-200 ease-out lg:fixed lg:top-16 lg:left-0 lg:block ${
        isCollapsed ? "w-20" : "w-56"
      }`}
    >
      <nav className="flex h-full flex-col justify-between">
        <div className="space-y-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
            className="flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-md text-neutral-600 transition-colors duration-200 hover:bg-sky-50 hover:text-sky-950"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
              ) : (
                <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
              )}
            </span>
          </button>

          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex h-10 items-center overflow-hidden rounded-md text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-sky-50 text-sky-950"
                      : "text-neutral-700 hover:bg-sky-50 hover:text-sky-950"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" strokeWidth={2.1} />
                  </span>
                  <span className={labelClassName}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <Link
            href="/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={`flex h-10 items-center overflow-hidden rounded-md text-sm font-semibold transition-colors duration-200 ${
              pathname === "/settings"
                ? "bg-sky-50 text-sky-950"
                : "text-neutral-700 hover:bg-sky-50 hover:text-sky-950"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <Settings className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className={labelClassName}>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
