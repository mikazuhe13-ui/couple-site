"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Music, Send } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

/* ══════════════════════════════════════════
   Section Divider — thin gold line
   ══════════════════════════════════════════ */
export function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <motion.div
        className="h-px w-full max-w-xs mx-auto"
        style={{ background: "var(--c-divider)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   Section Header — editorial typography
   ══════════════════════════════════════════ */
export function SectionHeader({ enTitle, cnTitle }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      className={`${isMobile ? "mb-10 px-5" : "mb-16 md:mb-24"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: isMobile ? "-30px" : "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: isMobile ? 0.05 : 0.1,
          },
        },
      }}
    >
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 20, filter: isMobile ? "blur(4px)" : "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: isMobile ? 0.5 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`${
          isMobile ? "text-2xl" : "text-3xl md:text-5xl lg:text-6xl"
        } text-center`}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          color: "var(--c-warm)",
          letterSpacing: "0.02em",
        }}
      >
        {enTitle}
      </motion.h3>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10, filter: isMobile ? "blur(2px)" : "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.1 }}
        className={`${
          isMobile ? "text-sm mt-2" : "text-base md:text-lg mt-4"
        } tracking-wider text-center`}
        style={{
          fontFamily: "var(--font-cn)",
          color: "var(--c-text-secondary)",
          fontWeight: 300,
        }}
      >
        {cnTitle}
      </motion.p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Click Ripple (desktop only)
   ══════════════════════════════════════════ */
export function Ripple({ x, y, onDone }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x - 16, top: y - 16 }}
      initial={{ scale: 0, opacity: 0.3 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <div className="w-8 h-8" style={{ border: "1px solid rgba(201,169,110,0.3)" }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Music Toggle — minimal floating control
   ══════════════════════════════════════════ */
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/bgm.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    const audio = audioRef.current;

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <motion.button
      className={`fixed z-50 flex items-center justify-center ${
        isMobile
          ? "bottom-4 right-4 w-11 h-11"
          : "bottom-6 right-6 w-11 h-11"
      }`}
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: isMobile ? "none" : "blur(12px)",
        border: "1px solid rgba(201,169,110,0.15)",
      }}
      whileHover={{ scale: 1.08, borderColor: "rgba(201,169,110,0.3)" }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setPlaying(!playing)}
      aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
      aria-pressed={playing}
    >
      <motion.div
        animate={{ rotate: playing && !shouldReduceMotion ? 360 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 4,
          repeat: playing && !shouldReduceMotion ? Infinity : 0,
          ease: "linear",
        }}
      >
        <Music className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} style={{ color: "var(--c-gold-dim)" }} />
      </motion.div>
      {playing && (
        <div className={`absolute ${isMobile ? "-bottom-1" : "-bottom-1.5"} flex gap-0.5`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "var(--c-gold-dim)" }}
              animate={{
                height: shouldReduceMotion ? 2 : [2, 6, 2],
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                repeat: shouldReduceMotion ? 0 : Infinity,
                delay: shouldReduceMotion ? 0 : i * 0.15,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   Message Board — clean editorial style
   ══════════════════════════════════════════ */
export function MessageBoard({ messages, onAddMessage }) {
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
