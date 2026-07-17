"use client";

import { motion } from "framer-motion";

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
