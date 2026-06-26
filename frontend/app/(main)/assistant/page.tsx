import { Suspense } from "react";

import { BhunMaChatPage } from "@/components/chatbot/bhunma-chat-page";

function BhunMaChatFallback() {
  return (
    <main className="h-[calc(100dvh-10rem)] bg-white px-3 py-3 sm:px-5 sm:py-5 lg:h-[calc(100vh-4rem)] lg:px-8 lg:py-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-sky-100 bg-sky-50 p-6 text-sm font-semibold text-sky-700">
        Loading บุญมา BhunMa...
      </div>
    </main>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<BhunMaChatFallback />}>
      <BhunMaChatPage />
    </Suspense>
  );
}
