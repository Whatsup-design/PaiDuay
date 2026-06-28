"use client";

import { ArrowLeft, BotMessageSquare, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import {
  sendAssistantMessage,
  type AssistantRecommendation
} from "@/lib/assistant-api";
import { useDeviceLocation } from "@/lib/location/use-device-location";

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      recommendations?: AssistantRecommendation[];
      isLoading?: boolean;
      isError?: boolean;
    };

function getSafeFromPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home";
  }

  if (value.startsWith("/assistant")) {
    return "/home";
  }

  return value;
}

export function BhunMaChatPage() {
  const searchParams = useSearchParams();
  const fromPath = getSafeFromPath(searchParams.get("from"));
  const { location } = useDeviceLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Sawasdee, I am บุญมา BhunMa. Tell me how you feel or what kind of local experience you want today."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = inputValue.trim();

    if (!message || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message
    };
    const loadingMessageId = crypto.randomUUID();

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      {
        id: loadingMessageId,
        role: "assistant",
        content: "BhunMa is thinking...",
        isLoading: true
      }
    ]);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await sendAssistantMessage({
        message,
        location
      });

      setMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content: response.data.reply,
                recommendations: response.data.recommendations
              }
            : chatMessage
        )
      );
    } catch {
      setMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content:
                  "BhunMa could not answer right now. Please try again in a moment.",
                isError: true
              }
            : chatMessage
        )
      );
    } finally {
      setIsSending(false);
      formRef.current?.querySelector("input")?.focus();
    }
  }

  return (
    <main className="h-[calc(100dvh-10rem)] bg-white px-3 py-3 sm:px-5 sm:py-5 lg:h-[calc(100vh-4rem)] lg:px-8 lg:py-6">
      <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 sm:mb-5">
          <Link
            href={fromPath}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950 sm:h-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-[0_10px_32px_rgb(15_23_42_/_7%)]">
          <header className="shrink-0 border-b border-sky-100 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-sky-900 text-white shadow-[0_12px_28px_rgb(2_132_199_/_24%)] sm:h-12 sm:w-12">
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-cyan-100" />
                <BotMessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  PaiTiew Assistant
                </p>
                <h1 className="truncate text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
                  บุญมา BhunMa
                </h1>
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-6">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="shrink-0 rounded-xl border border-sky-100 bg-white p-3 shadow-[0_8px_24px_rgb(15_23_42_/_6%)]"
            >
              <label htmlFor="bhunma-message" className="sr-only">
                Message บุญมา BhunMa
              </label>
              <div className="flex gap-2 sm:gap-3">
                <input
                  id="bhunma-message"
                  type="text"
                  value={inputValue}
                  disabled={isSending}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask BhunMa..."
                  className="h-11 min-w-0 flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-sky-300 focus:bg-white disabled:cursor-not-allowed disabled:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isSending || inputValue.trim().length === 0}
                  aria-label="Send message"
                  className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-sky-700 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 sm:w-auto sm:px-4"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isSending ? "Sending..." : "Send"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(100%,42rem)] break-words rounded-2xl p-3 text-sm leading-6 shadow-[0_8px_24px_rgb(15_23_42_/_6%)] sm:p-4 ${
          isUser
            ? "rounded-tr-md bg-sky-700 text-white"
            : isAssistant && message.isError
              ? "rounded-tl-md bg-rose-50 text-rose-700 ring-1 ring-rose-100"
              : "rounded-tl-md bg-white text-neutral-600 ring-1 ring-sky-100"
        }`}
      >
        <p className={isAssistant && message.isLoading ? "animate-pulse" : ""}>
          {message.content}
        </p>
        {isAssistant && message.recommendations?.length ? (
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
            {message.recommendations.map((recommendation) => (
              <RecommendationCard
                key={`${recommendation.type}-${recommendation.id}`}
                recommendation={recommendation}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation
}: {
  recommendation: AssistantRecommendation;
}) {
  return (
    <Link
      href={recommendation.href}
      className="block min-w-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50 text-left transition hover:bg-white hover:shadow-sm"
    >
      {recommendation.imageUrl ? (
        <img
          src={recommendation.imageUrl}
          alt={recommendation.title}
          className="h-24 w-full object-cover"
        />
      ) : (
        <div className="h-24 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-50" />
      )}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">
            {recommendation.category}
          </span>
          {recommendation.distanceKm !== undefined ? (
            <span className="text-[10px] font-semibold text-neutral-400">
              {recommendation.distanceKm} km
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-950">
          {recommendation.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
          {recommendation.reason}
        </p>
      </div>
    </Link>
  );
}
