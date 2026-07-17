"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { SectionHeader } from "@/components/ui";

export default function LettersSection({ dark, loveLetters }) {
  const [activeLetter, setActiveLetter] = useState(0);

  return (
    <section id="letters" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ background: dark ? "var(--c-dark-bg)" : "var(--c-cream)" }}>
      <div className="max-w-3xl mx-auto relative z-10">
        <SectionHeader icon={Mail} enTitle="Love Letters" cnTitle="情书" dark={dark} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } },
          }}
        >
          {/* letter selector dots */}
          <div className="flex justify-center gap-3 mb-12">
            {loveLetters.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveLetter(i)}
                className="relative"
                whileHover={{ scale: 1.2 }}
              >
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  animate={{
                    background: activeLetter === i ? "var(--c-rose)" : (dark ? "rgba(194,146,138,0.2)" : "rgba(194,146,138,0.25)"),
                    scale: activeLetter === i ? 1.4 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {activeLetter === i && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid var(--c-rose)" }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* letter card */}
          <div
            className="rounded-3xl p-8 md:p-14 relative overflow-hidden"
            style={{
              background: dark
                ? "linear-gradient(145deg, rgba(30,22,28,0.7), rgba(25,18,24,0.5))"
                : "linear-gradient(145deg, #FFFDF9, #FFF8F0)",
              border: `1px solid ${dark ? "rgba(194,146,138,0.08)" : "rgba(194,146,138,0.08)"}`,
              boxShadow: dark
                ? "0 16px 60px rgba(0,0,0,0.25)"
                : "0 16px 60px rgba(194,146,138,0.08)",
            }}
          >
            {/* decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32" style={{
              background: "radial-gradient(circle at 100% 0%, rgba(201,169,110,0.06) 0%, transparent 50%)",
            }} />
            <div className="absolute bottom-0 left-0 w-24 h-24" style={{
              background: "radial-gradient(circle at 0% 100%, rgba(194,146,138,0.04) 0%, transparent 50%)",
            }} />

            {/* wax seal decoration */}
            <div className="absolute top-6 right-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-5 h-5 fill-current" style={{ color: dark ? "rgba(194,146,138,0.15)" : "rgba(194,146,138,0.12)" }} />
              </motion.div>
            </div>

            {/* top line */}
            <div className="absolute top-0 left-10 right-10 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.12), transparent)",
            }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeLetter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h4 className="text-xl md:text-2xl mb-8 relative z-10" style={{
                  fontFamily: "var(--font-cn)",
                  fontWeight: 600,
                  color: dark ? "#E8D5C4" : "var(--c-text)",
                  letterSpacing: "0.05em",
                }}>
                  {loveLetters[activeLetter].title}
                </h4>
                <p
                  className="text-base md:text-lg whitespace-pre-line relative z-10"
                  style={{
                    fontFamily: "var(--font-cn)",
                    color: dark ? "#B0A0A0" : "var(--c-text-secondary)",
                    lineHeight: 2.2,
                    fontWeight: 300,
                    letterSpacing: "0.02em",
                  }}
                >
                  {loveLetters[activeLetter].text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* bottom line */}
            <div className="absolute bottom-0 left-10 right-10 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.12), transparent)",
            }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
