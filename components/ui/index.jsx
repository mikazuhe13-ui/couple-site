"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Music, Sun, Moon, Send, Sparkles } from "lucide-react";

/* ══════════════════════════════════════════
   Ambient Orbs — floating background blobs
   ══════════════════════════════════════════ */
export function AmbientOrbs({ dark, count = 4 }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 200 + Math.random() * 400,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    color: dark
      ? `rgba(${140 + i * 20}, ${80 + i * 15}, ${100 + i * 10}, 0.06)`
      : `rgba(${220 + i * 10}, ${180 + i * 15}, ${170 + i * 10}, ${0.12 + i * 0.03})`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((o) => (
        <motion.div
          key={o.id}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: `${o.x}%`,
            top: `${o.y}%`,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -50, 30, -20, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
          }}
          transition={{
            duration: o.duration,
            delay: o.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   Falling Petals — organic petal animation
   ══════════════════════════════════════════ */
export function Petals({ dark, count = 20 }) {
  const petals = Array.from({ length: count }, (_, i) => {
    const size = 6 + Math.random() * 14;
    return {
      id: i,
      left: Math.random() * 100,
      size,
      duration: 10 + Math.random() * 18,
      delay: Math.random() * 20,
      opacity: dark ? 0.05 + Math.random() * 0.1 : 0.12 + Math.random() * 0.2,
      sway: 30 + Math.random() * 100,
      spin: 360 + Math.random() * 720,
      hue: dark ? 0 : Math.random() * 20 - 10,
    };
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.65,
            background: dark
              ? `rgba(194,146,138,${p.opacity})`
              : `hsla(${350 + p.hue}, ${60 + p.hue}%, ${82 + p.hue * 0.3}%, ${p.opacity})`,
            borderRadius: "60% 10% 60% 10%",
            ["--sway"]: `${p.sway}px`,
            ["--spin"]: `${p.spin}deg`,
            animation: `petalFall ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   Click Ripple — subtle heart ripple
   ══════════════════════════════════════════ */
export function Ripple({ x, y, onDone }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x - 16, top: y - 16 }}
      initial={{ scale: 0, opacity: 0.4 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <div className="w-8 h-8 rounded-full" style={{ border: "1.5px solid rgba(194,146,138,0.5)" }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Flip Countdown Card — premium glass card
   ══════════════════════════════════════════ */
export function FlipCard({ value, label, dark }) {
  const prev = useRef(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true);
      prev.current = value;
      const t = setTimeout(() => setFlipping(false), 400);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      className="rounded-3xl py-6 md:py-10 px-3 relative overflow-hidden"
      style={{
        background: dark
          ? "linear-gradient(145deg, rgba(30,22,28,0.8), rgba(25,18,24,0.6))"
          : "linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,250,245,0.5))",
        backdropFilter: "blur(24px) saturate(1.4)",
        border: `1px solid ${dark ? "rgba(194,146,138,0.12)" : "rgba(255,255,255,0.6)"}`,
        boxShadow: dark
          ? "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "0 8px 40px rgba(194,146,138,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
      whileHover={{ y: -6, boxShadow: dark ? "0 16px 50px rgba(0,0,0,0.4)" : "0 16px 50px rgba(194,146,138,0.15)" }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {/* shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)",
      }} />
      <motion.div
        animate={flipping ? { rotateX: [0, -90, 0], scale: [1, 0.92, 1] } : {}}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="text-4xl md:text-6xl mb-2 tabular-nums text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: dark ? "#E8D5C4" : "#2D2424",
            textShadow: dark ? "0 0 30px rgba(194,146,138,0.15)" : "none",
          }}
        >
          {String(value).padStart(2, "0")}
        </div>
      </motion.div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-center" style={{
        fontFamily: "'Inter', sans-serif",
        color: dark ? "#8B7878" : "#B09E96",
        fontWeight: 500,
      }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   3D Tilt Card — refined parallax tilt
   ══════════════════════════════════════════ */
export function TiltCard({ children, className, style, dark, ...props }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 25 });
  const glareBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
  );

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
      className={`relative overflow-hidden ${className || ""}`}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      {...props}
    >
      {children}
      {/* glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ background: glareBg }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Section Divider — elegant gradient line
   ══════════════════════════════════════════ */
export function SectionDivider({ dark }) {
  return (
    <div className="w-full flex items-center justify-center py-2" style={{ background: "transparent" }}>
      <motion.div
        className="h-px w-full max-w-md mx-auto"
        style={{
          background: dark
            ? "linear-gradient(90deg, transparent, rgba(194,146,138,0.15), rgba(201,169,110,0.1), rgba(194,146,138,0.15), transparent)"
            : "linear-gradient(90deg, transparent, rgba(194,146,138,0.2), rgba(201,169,110,0.15), rgba(194,146,138,0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   Section Header — animated title block
   ══════════════════════════════════════════ */
export function SectionHeader({ icon: Icon, enTitle, cnTitle, dark }) {
  return (
    <motion.div
      className="text-center mb-16 md:mb-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
      }}
    >
      <motion.div variants={{ hidden: { opacity: 0, scale: 0.5, rotate: -10 }, visible: { opacity: 1, scale: 1, rotate: 0 } }} transition={{ type: "spring", stiffness: 200 }}>
        {Icon && <Icon className="w-5 h-5 mx-auto mb-5" style={{ color: "var(--c-gold)" }} />}
      </motion.div>
      <motion.div className="flex items-center justify-center gap-4 mb-4" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <div className="h-px w-10" style={{ background: "linear-gradient(to right, transparent, var(--c-rose-light))" }} />
        <motion.h3
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="text-3xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: dark ? "#E8D5C4" : "var(--c-text)",
            letterSpacing: "0.02em",
          }}
        >
          {enTitle}
        </motion.h3>
        <div className="h-px w-10" style={{ background: "linear-gradient(to left, transparent, var(--c-rose-light))" }} />
      </motion.div>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="text-lg md:text-xl tracking-wider"
        style={{
          fontFamily: "var(--font-cn)",
          color: dark ? "#8B7878" : "var(--c-text-secondary)",
          fontWeight: 300,
        }}
      >
        {cnTitle}
      </motion.p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Music Toggle — floating control
   ══════════════════════════════════════════ */
export function MusicToggle({ dark }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: dark ? "rgba(30,22,28,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${dark ? "rgba(194,146,138,0.15)" : "rgba(194,146,138,0.1)"}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setPlaying(!playing)}
    >
      <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 4, repeat: playing ? Infinity : 0, ease: "linear" }}>
        <Music className="w-4.5 h-4.5" style={{ color: "var(--c-rose)" }} />
      </motion.div>
      {playing && (
        <div className="absolute -bottom-1.5 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "var(--c-rose)" }}
              animate={{ height: [3, 8, 3] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   Dark Mode Toggle
   ══════════════════════════════════════════ */
export function DarkToggle({ dark, setDark }) {
  return (
    <motion.button
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(194,146,138,0.06)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(194,146,138,0.08)"}`,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85, rotate: 180 }}
      onClick={() => setDark(!dark)}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div key="sun" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
            <Sun className="w-4 h-4" style={{ color: "var(--c-gold-light)" }} />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.3 }}>
            <Moon className="w-4 h-4" style={{ color: "var(--c-text-secondary)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   Message Board — elegant guestbook
   ══════════════════════════════════════════ */
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

  const inputStyle = {
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
    border: `1px solid ${dark ? "rgba(194,146,138,0.1)" : "rgba(194,146,138,0.1)"}`,
    color: dark ? "#E8D5C4" : "var(--c-text)",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="rounded-3xl p-6 md:p-10 relative overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(145deg, rgba(30,22,28,0.6), rgba(25,18,24,0.4))"
            : "linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,250,245,0.4))",
          backdropFilter: "blur(20px) saturate(1.3)",
          border: `1px solid ${dark ? "rgba(194,146,138,0.08)" : "rgba(255,255,255,0.5)"}`,
          boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.2)" : "0 8px 40px rgba(194,146,138,0.06)",
        }}
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
      >
        {/* decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24" style={{
          background: "radial-gradient(circle at 100% 0%, rgba(201,169,110,0.06) 0%, transparent 60%)",
        }} />

        <div className="flex gap-3 mb-8 relative z-10">
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
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center self-center"
            style={{
              background: "linear-gradient(135deg, var(--c-rose), var(--c-rose-dark))",
              boxShadow: "0 4px 16px rgba(194,146,138,0.25)",
            }}
            whileHover={{ scale: 1.08, boxShadow: "0 6px 24px rgba(194,146,138,0.35)" }}
            whileTap={{ scale: 0.9 }}
            onClick={add}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 relative z-10">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.time}-${i}`}
                className="rounded-2xl p-4"
                style={{
                  background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${dark ? "rgba(194,146,138,0.05)" : "rgba(194,146,138,0.06)"}`,
                }}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "var(--c-rose)", fontFamily: "var(--font-cn)" }}>{m.name}</span>
                  <span className="text-xs" style={{ color: "var(--c-text-muted)" }}>{m.time || (m.created_at ? new Date(m.created_at).toLocaleString("zh-CN") : "刚刚")}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: dark ? "#B0A0A0" : "var(--c-text-secondary)", fontFamily: "var(--font-cn)" }}>{m.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
