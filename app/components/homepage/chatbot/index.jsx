"use client";

import { chatbotData } from "@/utils/data/chatbot-data";
import { personalData } from "@/utils/data/personal-data";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiSend,
} from "react-icons/fi";

const initialMessages = [
  {
    id: "welcome-message",
    role: "assistant",
    content: chatbotData.welcomeMessage,
    animate: false,
  },
];

function TypingText({ text, animate, onComplete }) {
  const [visibleText, setVisibleText] = useState(animate ? "" : text);
  const handleComplete = useEffectEvent(() => {
    onComplete?.();
  });

  useEffect(() => {
    if (!animate) {
      setVisibleText(text);
      return undefined;
    }

    setVisibleText("");
    let index = 0;

    const intervalId = window.setInterval(() => {
      index = Math.min(index + 2, text.length);
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
        handleComplete();
      }
    }, 16);

    return () => window.clearInterval(intervalId);
  }, [animate, text]);

  return (
    <>
      {visibleText}
      {animate && visibleText.length < text.length ? (
        <span className="ml-0.5 inline-block animate-pulse text-[#16f2b3]">|</span>
      ) : null}
    </>
  );
}

function ChatbotSection() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const finalizeAnimatedMessage = (messageId) => {
    startTransition(() => {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId ? { ...message, animate: false } : message
        )
      );
    });
  };

  async function sendMessage(nextMessage) {
    const trimmedMessage = nextMessage.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      animate: false,
    };

    const nextConversation = [...messages, userMessage];

    setError("");
    setInput("");
    setMessages(nextConversation);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages: nextConversation.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Something went wrong while contacting the chatbot.");
      }

      startTransition(() => {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.message,
            animate: true,
          },
        ]);
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while contacting the chatbot."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleSuggestionClick(question) {
    setInput(question);
    sendMessage(question);
  }

  return (
    <section id="chatbot" className="relative z-50 my-12 lg:my-24">
      <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-56 w-56 rounded-full bg-[#16f2b3]/10 blur-3xl" />

      <div className="mb-8 flex justify-center">
        <div className="flex items-center">
          <span className="h-[2px] w-16 bg-[#1a1443] sm:w-24" />
          <span className="rounded-md bg-[#1a1443] px-5 py-2 text-xl text-white">
            AI Chatbot
          </span>
          <span className="h-[2px] w-16 bg-[#1a1443] sm:w-24" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.18fr]">
        <div className="overflow-hidden rounded-3xl border border-[#1b2c68a0] bg-[radial-gradient(circle_at_top_left,_rgba(22,242,179,0.18),_transparent_38%),linear-gradient(135deg,_rgba(16,22,48,0.98),_rgba(10,13,55,0.92))] p-6 shadow-[0_0_40px_rgba(7,10,30,0.45)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#16f2b3]">
            <FiMessageSquare />
            Portfolio Assistant
          </div>

          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Ask Aman directly
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#cbd5e1] md:text-base">
            This chatbot answers as {personalData.name} and stays focused on skills,
            projects, contact details, and work availability.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[#dbe4ff]">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <FiBriefcase className="text-[#16f2b3]" />
              <span>{chatbotData.availability}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <FiMail className="text-[#16f2b3]" />
              <span className="truncate">{personalData.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <FiPhone className="text-[#16f2b3]" />
              <span>{personalData.phone}</span>
            </div>
            <a
              href={personalData.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors duration-300 hover:border-[#16f2b3]/40 hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <FiGithub className="text-[#16f2b3]" />
                GitHub
              </span>
              <FiArrowUpRight />
            </a>
            <a
              href={personalData.linkedIn}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors duration-300 hover:border-[#16f2b3]/40 hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <FiLinkedin className="text-[#16f2b3]" />
                LinkedIn
              </span>
              <FiArrowUpRight />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#1b2c68a0] bg-gradient-to-br from-[#11182f] via-[#0d1224] to-[#0a0d37] shadow-[0_0_40px_rgba(7,10,30,0.45)]">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#16f2b3]">
                  Live Portfolio Chat
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Chat with {personalData.name}
                </h3>
              </div>
              <span className="rounded-full border border-[#16f2b3]/30 bg-[#16f2b3]/10 px-3 py-1 text-xs font-medium text-[#16f2b3]">
                {chatbotData.availability}
              </span>
            </div>
          </div>

          <div className="flex h-[620px] flex-col">
            <div ref={messagesContainerRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="flex flex-wrap gap-3">
                {chatbotData.suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleSuggestionClick(question)}
                    disabled={isLoading}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#dbe4ff] transition-all duration-300 hover:border-[#16f2b3]/40 hover:bg-[#16f2b3]/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-lg sm:text-[15px] ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-r from-violet-600 to-pink-500 text-white"
                        : "rounded-bl-md border border-white/10 bg-white/5 text-[#dbe4ff]"
                    }`}
                  >
                    <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/55">
                      {message.role === "user" ? "You" : personalData.name}
                    </p>
                    <p className="whitespace-pre-wrap break-words">
                      <TypingText
                        text={message.content}
                        animate={message.animate}
                        onComplete={() => finalizeAnimatedMessage(message.id)}
                      />
                    </p>
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-[#dbe4ff]">
                    <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/55">
                      {personalData.name}
                    </p>
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#16f2b3] [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#16f2b3] [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#16f2b3]" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-5 py-4 sm:px-6">
              {error ? (
                <div className="mb-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-2">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    rows={2}
                    placeholder="Ask about Aman's skills, projects, or availability..."
                    className="min-h-[64px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#8b98a5]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatbotSection;
