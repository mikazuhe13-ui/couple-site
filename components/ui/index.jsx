"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Music, Sun, Moon, Send } from "lucide-react";

/* ── Falling Petals ── */
export function Petals({ dark, count = 18 }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 16,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 15,
    opacity: dark ? 0.08 + Math.random() * 0.12 : 0.15 + Math.random() * 0.25,
    sway: 40 + Math.random() * 80,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: dark
              ? `rgba(196,129,129,${p.opacity})`
              : `rgba(255,182,193,${p.opacity})`,
            borderRadius: "50% 0 50% 0",
          }}
          initial={{ y: "-5%", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "105vh",
            x: [0, p.sway, -p.sway * 0.5, p.sway * 0.3, 0],
            rotate: [0, 180, 360, 540, 720],
            opacity: [0, p.opacity, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ── Click Ripple ── */
export function Ripple({ x, y, onDone }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x - 20, top: y - 20 }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <Heart className="w-10 h-10 fill-current" style={{ color: "#C48181" }} />
    </motion.div>
  );
}

/* ── Flip Countdown Card ── */
export function FlipCard({ value, label, dark }) {
  const prev = useRef(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true);
      prev.current = value;
      const t = setTimeout(() => setFlipping(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <motion.div
      className="rounded-2xl py-6 md:py-8 px-2 relative overflow-hidden"
      style={{
        background: dark ? "rgba(30,25,35,0.7)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${dark ? "rgba(196,129,129,0.15)" : "rgba(196,129,129,0.1)"}`,
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(196,129,129,0.06)",
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        animate={flipping ? { rotateX: [0, -90, 0], scale: [1, 0.95, 1] } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="text-3xl md:text-5xl mb-1 tabular-nums text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: dark ? "#E8D5C4" : "#3D2B2B" }}
        >
          {value}
        </div>
      </motion.div>
      <div className="text-xs tracking-widest text-center" style={{ color: dark ? "#9B8080" : "#9B7070" }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── 3D Tilt Card ── */
export function TiltCard({ children, className, style, dark, ...props }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Wave Divider ── */
export function WaveDivider({ flip, dark }) {
  const fill = dark ? "#13101A" : "#FFF5F0";
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} style={{ height: 60 }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z"
          fill={fill}
          initial={{ d: "M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z" }}
          animate={{ d: "M0,30 C240,5 480,55 720,30 C960,5 1200,55 1440,30 L1440,60 L0,60 Z" }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ── Music Toggle ── */
export function MusicToggle({ dark }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: dark ? "rgba(30,25,35,0.8)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${dark ? "rgba(196,129,129,0.2)" : "rgba(196,129,129,0.15)"}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setPlaying(!playing)}
    >
      <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }}>
        <Music className="w-5 h-5" style={{ color: "#C48181" }} />
      </motion.div>
      {playing && (
        <div className="absolute -bottom-1 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "#C48181" }}
              animate={{ height: [3, 8, 3] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

/* ── Dark Mode Toggle ── */
export function DarkToggle({ dark, setDark }) {
  return (
    <motion.button
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(196,129,129,0.08)" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85, rotate: 180 }}
      onClick={() => setDark(!dark)}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
            <Sun className="w-4 h-4" style={{ color: "#D4A38B" }} />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
            <Moon className="w-4 h-4" style={{ color: "#9B7070" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Message Board ── */
export function MessageBoard({ dark, messages, onAddMessage }) {
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

  const inputBase = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors`;
  const inputStyle = dark
    ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(196,129,129,0.15)", color: "#E8D5C4" }
    : { background: "rgba(255,255,255,0.5)", border: "1px solid rgba(196,129,129,0.1)", color: "#3D2B2B" };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: dark ? "rgba(30,25,35,0.5)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${dark ? "rgba(196,129,129,0.12)" : "rgba(196,129,129,0.08)"}`,
        }}
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      >
        <div className="flex gap-3 mb-6">
          <input placeholder="你的名字" value={name} onChange={(e) => setName(e.target.value)} className={inputBase} style={{ ...inputStyle, maxWidth: 120 }} />
          <input placeholder="写下你想说的话..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} className={inputBase} style={inputStyle} />
          <motion.button
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center self-center"
            style={{ background: "#C48181" }}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
            onClick={add}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.time}-${i}`}
                className="rounded-xl p-4"
                style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "#C48181" }}>{m.name}</span>
                  <span className="text-xs" style={{ color: dark ? "#706060" : "#BFA0A0" }}>{m.time || (m.created_at ? new Date(m.created_at).toLocaleString("zh-CN") : "刚刚")}</span>
                </div>
                <p className="text-sm" style={{ color: dark ? "#B0A0A0" : "#7A6060" }}>{m.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
