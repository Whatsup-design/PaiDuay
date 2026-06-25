"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileSidebarDrawer } from "@/components/layout/mobile-sidebar-drawer";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { useIsMobile } from "@/components/layout/hooks/use-media-query";

export function AppShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const shouldCollapseSidebar = isMobile || isSidebarCollapsed;

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <TopBar
        isSidebarCollapsed={shouldCollapseSidebar}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        isCollapsed={shouldCollapseSidebar}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />
      <MobileSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div
        className={`pb-24 pt-16 transition-[padding] duration-200 ease-out lg:pb-0 ${
          shouldCollapseSidebar ? "lg:pl-20" : "lg:pl-56"
        }`}
      >
        {children}
      </div>
      <MobileBottomNav />
    </div>
  );
}
