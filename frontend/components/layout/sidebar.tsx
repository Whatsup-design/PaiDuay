"use client";

import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/components/layout/navigation-items";

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

function FourPointStar({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
    >
      <path d="M10 0C11.9 6.1 13.9 8.1 20 10C13.9 11.9 11.9 13.9 10 20C8.1 13.9 6.1 11.9 0 10C6.1 8.1 8.1 6.1 10 0Z" />
    </svg>
  );
}

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
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <linearGradient id="otop-sidebar-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="52%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
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
              const isFeatured = Boolean(item.isFeatured);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`relative flex h-10 items-center overflow-hidden rounded-md text-sm font-semibold transition-colors duration-200 ${
                    isFeatured
                      ? "text-sky-800 hover:bg-sky-50"
                      : isActive
                        ? "bg-sky-50 text-sky-950"
                        : "text-neutral-700 hover:bg-sky-50 hover:text-sky-950"
                  }`}
                >
                  {isFeatured ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0"
                    >
                      <FourPointStar className="absolute top-1 right-2 h-3 w-3 text-cyan-500/90" />
                    </span>
                  ) : null}
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                    <Icon
                      className="h-5 w-5"
                      stroke={
                        isFeatured
                          ? "url(#otop-sidebar-gradient)"
                          : "currentColor"
                      }
                      strokeWidth={2.1}
                    />
                  </span>
                  <span className={`relative z-10 ${labelClassName}`}>
                    <span
                      className={
                        isFeatured
                          ? "bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
                          : undefined
                      }
                    >
                      {item.label}
                    </span>
                  </span>
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
