"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Send } from "lucide-react";

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
  return (
    <motion.div
      className="mb-16 md:mb-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
      }}
    >
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-3xl md:text-5xl lg:text-6xl text-center"
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
          hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-base md:text-lg tracking-wider text-center mt-4"
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
   Click Ripple
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
      <div className="w-8 h-8" style={{ border: "1px solid rgba(184,162,124,0.3)" }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Music Toggle — minimal floating control
   ══════════════════════════════════════════ */
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

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
      className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center"
      style={{
        background: "rgba(8,8,8,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(184,162,124,0.1)",
      }}
      whileHover={{ scale: 1.08, borderColor: "rgba(184,162,124,0.25)" }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setPlaying(!playing)}
    >
      <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 4, repeat: playing ? Infinity : 0, ease: "linear" }}>
        <Music className="w-4 h-4" style={{ color: "var(--c-gold-dim)" }} />
      </motion.div>
      {playing && (
        <div className="absolute -bottom-1.5 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "var(--c-gold-dim)" }}
              animate={{ height: [2, 6, 2] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
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

  const add = async () => {
    if (!text.trim()) return;
    if (onAddMessage) {
      await onAddMessage({ name: name.trim() || "匿名", text });
    }
    setText("");
    setName("");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--c-divider)",
    color: "var(--c-warm)",
    padding: "12px 16px",
    fontSize: 14,
    fontFamily: "var(--font-cn)",
    outline: "none",
    transition: "border-color 0.3s",
  };

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
        {/* Input row */}
        <div className="flex gap-3 mb-10 pt-10">
          <input
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ ...inputStyle, maxWidth: 130 }}
          />
          <input
            placeholder="写下你想说的话..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            style={{ ...inputStyle, flex: 1 }}
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
          >
            <Send className="w-4 h-4" style={{ color: "var(--c-gold)" }} />
          </motion.button>
        </div>

        {/* Messages */}
        <div className="space-y-0 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.time}-${i}`}
                className="py-5"
                style={{ borderBottom: "1px solid rgba(184,162,124,0.06)" }}
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
