"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

export default function MessageBoard({ messages, onAddMessage }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const isMobile = useIsMobile();
  const statusId = "message-submit-status";

  const add = async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("正在发送留言…");
    try {
      const result = onAddMessage
        ? await onAddMessage({ name: name.trim() || "匿名", text })
        : { ok: false };

      if (!result?.ok) {
        setSubmitStatus("留言暂时未发送，请稍后重试。");
        return;
      }

      setText("");
      setName("");
      setSubmitStatus("留言已发送。");
    } catch {
      setSubmitStatus("留言暂时未发送，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,240,230,0.5)",
    border: "1px solid var(--c-divider)",
    color: "var(--c-warm)",
    fontSize: isMobile ? 13 : 14,
    fontFamily: "var(--font-cn)",
    minHeight: 44,
    outline: "none",
    transition: "border-color 0.3s",
  };

  if (isMobile) {
    return (
      <div className="mx-auto">
        <motion.div
          style={{ borderTop: "1px solid var(--c-divider)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile stacked input */}
          <div className="flex flex-col gap-2.5 pt-8 mb-8">
            <label className="sr-only" htmlFor="message-name-mobile">
              你的名字
            </label>
            <input
              id="message-name-mobile"
              placeholder="你的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-describedby={statusId}
              style={{ ...inputStyle, padding: "10px 14px", width: "100%" }}
            />
            <label className="sr-only" htmlFor="message-text-mobile">
              留言内容
            </label>
            <textarea
              id="message-text-mobile"
              placeholder="写下你想说的话..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={statusId}
              rows={3}
              style={{
                ...inputStyle,
                padding: "10px 14px",
                width: "100%",
                resize: "none",
                lineHeight: 1.6,
              }}
            />
            <motion.button
              className="flex min-h-11 w-full items-center justify-center gap-2 py-3"
              style={{
                background: "transparent",
                border: "1px solid var(--c-gold-dim)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={add}
              disabled={isSubmitting}
            >
              <Send className="w-3.5 h-3.5" style={{ color: "var(--c-gold)" }} />
              <span
                className="text-xs tracking-wider"
                style={{ color: "var(--c-gold)", fontFamily: "var(--font-cn)" }}
              >
                {isSubmitting ? "正在发送…" : "发送留言"}
              </span>
            </motion.button>
            <p id={statusId} role="status" aria-live="polite" className="sr-only">
              {submitStatus}
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-0 max-h-72 overflow-y-auto">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={`${m.time}-${i}`}
                  className="py-4"
                  style={{ borderBottom: "1px solid rgba(180,150,120,0.12)" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ color: "var(--c-rose)", fontFamily: "var(--font-cn)" }}>{m.name}</span>
                    <span className="text-[10px]" style={{ color: "var(--c-text-muted)" }}>{m.time || (m.created_at ? new Date(m.created_at).toLocaleString("zh-CN") : "刚刚")}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--c-text-secondary)", fontFamily: "var(--font-cn)" }}>{m.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="relative"
        style={{
          borderTop: "1px solid var(--c-divider)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Desktop inline input row */}
        <div className="flex gap-3 mb-10 pt-10">
          <label className="sr-only" htmlFor="message-name-desktop">
            你的名字
          </label>
          <input
            id="message-name-desktop"
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby={statusId}
            style={{ ...inputStyle, padding: "12px 16px", maxWidth: 130 }}
          />
          <label className="sr-only" htmlFor="message-text-desktop">
            留言内容
          </label>
          <input
            id="message-text-desktop"
            placeholder="写下你想说的话..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            aria-describedby={statusId}
            style={{ ...inputStyle, padding: "12px 16px", flex: 1 }}
          />
          <motion.button
            className="shrink-0 w-11 h-11 flex items-center justify-center self-center"
            style={{
              background: "transparent",
              border: "1px solid var(--c-gold-dim)",
            }}
            whileHover={{ borderColor: "var(--c-gold)", scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={add}
            disabled={isSubmitting}
            aria-label={isSubmitting ? "正在发送留言" : "发送留言"}
          >
            <Send className="w-4 h-4" style={{ color: "var(--c-gold)" }} />
          </motion.button>
          <p id={statusId} role="status" aria-live="polite" className="sr-only">
            {submitStatus}
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-0 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.time}-${i}`}
                className="py-5"
                style={{ borderBottom: "1px solid rgba(180,150,120,0.12)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: "var(--c-rose)", fontFamily: "var(--font-cn)" }}>{m.name}</span>
                  <span className="text-[11px]" style={{ color: "var(--c-text-muted)" }}>{m.time || (m.created_at ? new Date(m.created_at).toLocaleString("zh-CN") : "刚刚")}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--c-text-secondary)", fontFamily: "var(--font-cn)" }}>{m.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
