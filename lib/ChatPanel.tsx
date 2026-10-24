"use client";

import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import type { ProfileType } from "./server/limits";
import { CHAT_LIMITS } from "./chatLimits";
import ChatBlocks from "./chat/ChatBlocks";
import { messagesToText, parseChatResponse, toHistory, type ChatMessage } from "./chat/chatClient";

const CHAT_URL = "/api/chat";
const STATUS_RATE_LIMITED = 429;
const SMALL_SCREEN_QUERY = "(max-width: 768px)";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SUGGESTIONS = [
  "What projects has Vandit built?",
  "What are Vandit's main skills?",
  "Tell me about Vandit's experience",
  "How can I contact Vandit?",
];
const COPIED_RESET_MS = 2000;
const MSG_GENERIC_ERROR = "Something went wrong, please try again.";
const MSG_RATE_LIMITED = "Too many questions, try again in a minute";
const CHIP_CLASS =
  "min-h-11 rounded-full border border-prime/40 bg-prime/10 px-4 py-2 text-left text-sm text-white hover:bg-white hover:text-secondary-900 transition focus-visible:ring-2 focus-visible:ring-prime outline-none";
const HEADER_BTN_CLASS =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-prime outline-none";

const Suggestions = ({ onPick }: { onPick: (text: string) => void }) => (
  <>
    {SUGGESTIONS.map((suggestion) => (
      <button key={suggestion} type="button" onClick={() => onPick(suggestion)} className={CHIP_CLASS}>
        {suggestion}
      </button>
    ))}
  </>
);

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: ProfileType;
  contactHref: string;
}

const ChatPanel = ({ isOpen, onClose, type, contactHref }: ChatPanelProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const copiedTimerRef = useRef<number>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const onCloseRef = useRef(onClose);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (window.matchMedia(SMALL_SCREEN_QUERY).matches) document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      const panel = panelRef.current;
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      abortRef.current?.abort();
      setIsSending(false);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      window.clearTimeout(copiedTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isSending, errorText]);

  const send = async (raw: string) => {
    const message = raw.trim();
    if (!message || isSending) return;
    const history = toHistory(messages);
    const controller = new AbortController();
    abortRef.current = controller;
    setMessages((current) => [...current, { role: "user", text: message }]);
    setDraft("");
    setErrorText("");
    setIsSending(true);
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, profile: type }),
        signal: controller.signal,
      });
      if (response.status === STATUS_RATE_LIMITED) {
        setErrorText(MSG_RATE_LIMITED);
        return;
      }
      const body = await response.json().catch(() => null);
      const reply = response.ok ? parseChatResponse(body) : undefined;
      if (!reply) {
        setErrorText(typeof body?.error === "string" ? body.error : MSG_GENERIC_ERROR);
        return;
      }
      setMessages((current) => [...current, { role: "model", text: reply.reply, blocks: reply.blocks }]);
    } catch {
      if (controller.signal.aborted) return;
      setErrorText(MSG_GENERIC_ERROR);
    } finally {
      if (!controller.signal.aborted) setIsSending(false);
    }
  };

  const copyChat = async () => {
    try {
      await navigator.clipboard.writeText(messagesToText(messages));
      setCopied(true);
      window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    window.clearTimeout(copiedTimerRef.current);
    setCopied(false);
    setMessages([]);
    setErrorText("");
    setDraft("");
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(draft);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(draft);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[1090] bg-black/50 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="chat-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[1100] flex h-dvh w-[min(100vw,420px)] flex-col chat-grad-panel shadow-lg transition-transform duration-300 motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="chat-grad-header flex items-center justify-between gap-2 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="chat-grad-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            >
              V
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-bold leading-tight">
                Ask about Vandit
              </h2>
              <p className="text-xs text-white/70 xs:hidden">Answers come from Vandit&apos;s site content</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            {messages.length > 0 && (
              <>
                <button type="button" onClick={() => void copyChat()} className={HEADER_BTN_CLASS}>
                  {copied ? "Copied" : "Copy chat"}
                </button>
                <button type="button" onClick={clearChat} className={HEADER_BTN_CLASS}>
                  Clear chat
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-2xl hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-prime outline-none"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>

        <div
          role="log"
          aria-live="polite"
          aria-busy={isSending}
          className="flex-1 space-y-3 overflow-y-auto p-4"
        >
          {messages.length === 0 && !isSending && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-secondary-400">Ask me anything about Vandit&apos;s work.</p>
              <Suggestions onPick={(text) => void send(text)} />
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
              <p
                data-chat-bubble="text"
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${
                  message.role === "user" ? "chat-grad-user" : "chat-grad-bot"
                }`}
              >
                {message.text}
              </p>
              {message.role === "model" && message.blocks && message.blocks.length > 0 && (
                <ChatBlocks blocks={message.blocks} type={type} onNavigate={onClose} />
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div role="status" className="chat-grad-bot flex items-center gap-1 rounded-2xl px-4 py-3">
                <span className="sr-only">Vandit&apos;s assistant is typing</span>
                <span aria-hidden="true" className="chat-typing-dot" />
                <span aria-hidden="true" className="chat-typing-dot" />
                <span aria-hidden="true" className="chat-typing-dot" />
              </div>
            </div>
          )}
          {!isSending && messages.length > 0 && messages[messages.length - 1].role === "model" && (
            <div className="flex flex-col items-start gap-2">
              <Suggestions onPick={(text) => void send(text)} />
            </div>
          )}
          {errorText && (
            <p role="alert" className="text-alert-error text-sm">
              {errorText}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/20 p-4">
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={2}
              maxLength={CHAT_LIMITS.message}
              value={draft}
              disabled={isSending}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question"
              className="w-full resize-none rounded-lg border border-white/20 bg-white/5 p-2 outline-0 focus-visible:ring-2 focus-visible:ring-prime disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !draft.trim()}
              className="min-h-11 chat-grad-btn rounded-lg px-4 font-semibold transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <Link
            href={contactHref}
            onClick={onClose}
            className="mt-3 inline-flex min-h-11 items-center text-sm text-white/70 underline hover:text-white focus-visible:ring-2 focus-visible:ring-prime outline-none"
          >
            Message Vandit directly
          </Link>
        </form>
      </div>
    </>
  );
};

export default ChatPanel;
