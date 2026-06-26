"use client";

import { BotMessageSquare, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type BhunMaChatbotTriggerProps = {
  className?: string;
};

const baseLabel = "Open บุญมา BhunMa assistant";

export function BhunMaChatbotTrigger({
  className = ""
}: BhunMaChatbotTriggerProps) {
  const router = useRouter();

  function handleOpenAssistant() {
    const fromPath = `${window.location.pathname}${window.location.search}`;
    router.push(`/assistant?from=${encodeURIComponent(fromPath)}`);
  }

  return (
    <button
      type="button"
      aria-label={baseLabel}
      title="บุญมา BhunMa"
      onClick={handleOpenAssistant}
      className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-sky-900 text-sky-100 ring-1 ring-sky-700 transition hover:bg-sky-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      <Sparkles className="absolute top-1.5 right-1.5 h-2.5 w-2.5 text-cyan-200" />
      <BotMessageSquare className="h-5 w-5" />
      <span className="sr-only">บุญมา BhunMa</span>
    </button>
  );
}
