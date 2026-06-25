"use client";

import { Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/components/layout/navigation-items";

type MobileSidebarDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
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

export function MobileSidebarDrawer({
  isOpen,
  onClose
}: MobileSidebarDrawerProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-neutral-950/35 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`relative h-full w-72 max-w-[82vw] border-r border-sky-100 bg-white px-4 py-4 shadow-2xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <defs>
            <linearGradient id="otop-mobile-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="52%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-neutral-950">PaiDuay</p>
            <p className="mt-1 text-xs text-neutral-500">
              Phuket local journey
            </p>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex h-[calc(100%-5rem)] flex-col justify-between">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isFeatured = Boolean(item.isFeatured);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex h-11 items-center gap-3 overflow-hidden rounded-md px-3 text-sm font-semibold transition ${
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
                      <FourPointStar className="absolute top-1.5 right-3 h-3 w-3 text-cyan-500/90" />
                    </span>
                  ) : null}
                  <Icon
                    className="relative z-10 h-5 w-5"
                    stroke={
                      isFeatured ? "url(#otop-mobile-gradient)" : "currentColor"
                    }
                    strokeWidth={2.1}
                  />
                  <span className="relative z-10">
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

          <Link
            href="/settings"
            onClick={onClose}
            className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
              pathname === "/settings"
                ? "bg-sky-50 text-sky-950"
                : "text-neutral-700 hover:bg-sky-50 hover:text-sky-950"
            }`}
          >
            <Settings className="h-5 w-5" strokeWidth={2.2} />
            Settings
          </Link>
        </nav>
      </aside>
    </div>
  );
}
