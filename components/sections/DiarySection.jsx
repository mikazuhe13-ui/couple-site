"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { TiltCard, SectionHeader } from "@/components/ui";

export default function DiarySection({ dark, diaryEntries }) {
  return (
    <section id="diary" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ background: dark ? "var(--c-dark-bg)" : "var(--c-cream)" }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader icon={BookOpen} enTitle="Love Diary" cnTitle="恋爱日记" dark={dark} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {diaryEntries.map((entry, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 120 }}
            >
              <TiltCard dark={dark} className="h-full">
                <div
                  className="rounded-3xl p-7 md:p-8 h-full relative overflow-hidden"
                  style={{
                    background: dark
                      ? "linear-gradient(145deg, rgba(30,22,28,0.6), rgba(25,18,24,0.4))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,250,245,0.5))",
                    backdropFilter: "blur(16px) saturate(1.3)",
                    border: `1px solid ${dark ? "rgba(194,146,138,0.08)" : "rgba(255,255,255,0.5)"}`,
                    boxShadow: dark
                      ? "0 8px 32px rgba(0,0,0,0.15)"
                      : "0 8px 32px rgba(194,146,138,0.05)",
                  }}
                >
                  {/* top decorative line */}
                  <div className="absolute top-0 left-6 right-6 h-px" style={{
                    background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)",
                  }} />

                  {/* date + tag */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs tracking-[0.2em] uppercase" style={{
                      color: "var(--c-gold)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}>
                      {entry.date}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      background: dark ? "rgba(194,146,138,0.1)" : "rgba(194,146,138,0.08)",
                      color: "var(--c-rose)",
                      fontFamily: "var(--font-cn)",
                      fontWeight: 400,
                      letterSpacing: "0.05em",
                    }}>
                      {entry.tag}
                    </span>
                  </div>

                  {/* title */}
                  <h4 className="text-lg md:text-xl mb-4" style={{
                    fontFamily: "var(--font-cn)",
                    fontWeight: 600,
                    color: dark ? "#E8D5C4" : "var(--c-text)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.4,
                  }}>
                    {entry.title}
                  </h4>

                  {/* text */}
                  <p className="text-sm leading-[1.9]" style={{
                    color: dark ? "#9B8080" : "var(--c-text-secondary)",
                    fontFamily: "var(--font-cn)",
                    fontWeight: 300,
                  }}>
                    {entry.text}
                  </p>

                  {/* bottom decorative dot */}
                  <div className="mt-6 flex justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--c-rose-light)",
                        boxShadow: "0 0 6px rgba(194,146,138,0.3)",
                      }}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
