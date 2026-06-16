"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <TopBar isSidebarCollapsed={isSidebarCollapsed} />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />
      <div
        className={`pt-16 transition-[padding] duration-200 ease-out ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-56"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
