"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Send } from "lucide-react";
import { useAgent } from "@/context/AgentContext";
import { experiences } from "@/data/experiences";
import { Button } from "@/components/ui/Button";

const quickTags = [
  { emoji: "😫", label: "快撑不住了" },
  { emoji: "😶", label: "说不上来，就是没劲" },
  { emoji: "😔", label: "心里有点沉" },
  { emoji: "😌", label: "想好好松一下" },
  { emoji: "🔥", label: "想换种活法" },
];

type ChatMessage = { role: "agent" | "user"; text: string };

const welcomeScript: ChatMessage[] = [
  {
    role: "agent",
    text: "嘿，我是小走 👋\n不问你想去哪，\n先问问你——\n最近怎么样？",
  },
];

const tagResponses: Record<string, string> = {
  快撑不住了:
    "那你还在等什么。手机放下，人先走——半日森林深呼吸，够你喘口气。",
  "说不上来，就是没劲":
    "没劲往往比累更磨人。即兴舞一场，或者调一瓶自己的味道，身体比脑子先醒过来。",
  心里有点沉:
    "沉的东西得找个出口。写掉放下，或者黑胶之夜——不煽情，但接得住你。",
  想好好松一下:
    "松一下不必远行。城市里的两小时，就够你把弦松开。",
  想换种活法:
    "换活法不是辞职去旅行，是先把自己找回来。深度目的地，或者森林浴一日，都行。",
};

const spring = { type: "spring" as const, stiffness: 380, damping: 28 };

export function AgentFloat() {
  const { isOpen, toggleAgent } = useAgent();

  return (
    <>
      <motion.button
        type="button"
        onClick={toggleAgent}
        className="fixed bottom-20 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-vital text-xl text-white shadow-card-hover lg:bottom-8"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          default: spring,
        }}
        aria-label="打开小走对话"
      >
        💬
      </motion.button>
      <AgentChatWindow isOpen={isOpen} onClose={toggleAgent} />
    </>
  );
}

function AgentChatWindow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(welcomeScript);
  const [input, setInput] = useState("");
  const [showRecommend, setShowRecommend] = useState(false);

  const handleTag = (label: string) => {
    const reply =
      tagResponses[label] ||
      "我懂。要不你先说说，最近最累的是哪一块？";
    setMessages((m) => [
      ...m,
      { role: "user" as const, text: label },
      { role: "agent" as const, text: reply },
    ]);
    setShowRecommend(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user" as const, text: input },
      {
        role: "agent" as const,
        text: "收到了。MVP 阶段我还在长本事——你点上面的状态标签，我能更快懂你；或者去日常充电站逛逛。",
      },
    ]);
    setInput("");
    setShowRecommend(true);
  };

  const recommended = experiences.slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl lg:bottom-8 lg:right-5 lg:h-[500px] lg:w-[380px] lg:rounded-2xl bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl"
            initial={{ y: "100%", opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.92 }}
            transition={spring}
          >
            <div className="flex items-center justify-between border-b border-divider px-4 py-3">
              <span className="font-medium text-secondary">小走</span>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} aria-label="最小化">
                  <Minus className="h-5 w-5 text-text-muted" />
                </button>
                <button type="button" onClick={onClose} aria-label="关闭">
                  <X className="h-5 w-5 text-text-muted" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-vital px-4 py-2 text-sm text-white whitespace-pre-line"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-bg-light px-4 py-2 text-sm text-text-main whitespace-pre-line"
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {showRecommend && (
                <div className="space-y-2">
                  <p className="text-xs text-text-muted">你可能需要这个——</p>
                  {recommended.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex gap-3 rounded-xl border border-divider p-2"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={exp.coverImage}
                          alt={exp.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{exp.name}</p>
                        <p className="text-xs text-vital">{exp.priceText}</p>
                        <Link
                          href={`/explore/${exp.id}`}
                          className="mt-1 inline-block text-xs text-base font-medium hover:text-vital"
                          onClick={onClose}
                        >
                          看看 →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-divider p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {quickTags.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => handleTag(t.label)}
                    className="rounded-full bg-bg-light px-3 py-1 text-xs hover:bg-vital/10 hover:text-vital transition-colors"
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="说说你最近的状态..."
                  className="flex-1 rounded-full border border-divider px-4 py-2 text-sm outline-none focus:border-vital"
                />
                <Button size="sm" onClick={handleSend} aria-label="发送">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
