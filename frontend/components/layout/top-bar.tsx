import { Bell, LogOut, Menu, Search } from "lucide-react";

type TopBarProps = {
  isSidebarCollapsed: boolean;
  onOpenMobileSidebar: () => void;
};

export function TopBar({
  isSidebarCollapsed,
  onOpenMobileSidebar
}: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center border-b border-sky-800 bg-sky-950 px-4 text-white lg:px-5">
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={onOpenMobileSidebar}
        className="mr-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sky-100 transition hover:bg-sky-900 hover:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`flex shrink-0 items-center transition-[width] duration-200 ease-out ${
          isSidebarCollapsed ? "w-auto lg:w-20" : "w-56"
        }`}
      >
        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-white/70">
          <img
            src="/Paiduay_app-removebg-preview.png"
            alt="PaiDuay"
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className={`ml-3 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out ${
            isSidebarCollapsed
              ? "max-w-40 translate-x-0 opacity-100 lg:max-w-0 lg:translate-x-1 lg:opacity-0"
              : "max-w-40 translate-x-0 opacity-100"
          }`}
        >
          <p className="text-base font-semibold leading-none">PaiDuay</p>
          <p className="mt-1 text-xs text-sky-200">Phuket local journey</p>
        </div>
      </div>

      <div className="hidden flex-1 justify-center lg:flex">
        <label className="flex h-10 w-full max-w-xl items-center gap-3 rounded-md border border-sky-700 bg-sky-900 px-3 text-sky-100">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search local quests, markets, rewards"
            className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-sky-300"
          />
        </label>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sky-100 transition hover:bg-sky-900 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white" />
        </button>

        <button
          type="button"
          aria-label="Logout"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sky-100 transition hover:bg-sky-900 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
