"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui";

export default function LettersSection({ loveLetters }) {
  const [activeLetter, setActiveLetter] = useState(0);

  return (
    <section id="letters" className="relative py-16 md:py-40 px-5 md:px-6">
      <div className="max-w-2xl mx-auto">
        <SectionHeader enTitle="Love Letters" cnTitle="情书" />

        {/* Letter selector */}
        <div className="flex justify-center gap-6 mb-10 md:mb-20">
          {loveLetters.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveLetter(i)}
              className="relative py-3 px-2"
            >
              <span
                className="text-xs tracking-[0.2em] uppercase transition-colors duration-500"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  color: activeLetter === i ? "var(--c-warm)" : "var(--c-text-muted)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {activeLetter === i && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "var(--c-gold)" }}
                  layoutId="letter-underline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Letter content */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLetter}
              initial={{ opacity: 0, y: 15, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h4 className="text-lg md:text-2xl mb-6 md:mb-12" style={{
                fontFamily: "var(--font-cn)",
                fontWeight: 500,
                color: "var(--c-warm)",
                letterSpacing: "0.05em",
              }}>
                {loveLetters[activeLetter].title}
              </h4>
              <p
                className="text-base md:text-lg whitespace-pre-line"
                style={{
                  fontFamily: "var(--font-cn)",
                  color: "var(--c-text-secondary)",
                  lineHeight: 2.2,
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                {loveLetters[activeLetter].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom decorative line */}
        <div className="mx-auto mt-12 md:mt-20" style={{ width: "40px", height: "1px", background: "var(--c-divider)" }} />
      </div>
    </section>
  );
}
