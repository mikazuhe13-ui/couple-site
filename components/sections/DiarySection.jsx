"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DiarySection({ diaryEntries }) {
  if (!diaryEntries || diaryEntries.length === 0) {
    return (
      <section id="diary" className="relative py-16 md:py-28 px-5 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader enTitle="Love Diary" cnTitle="恋爱日记" />
        </div>
      </section>
    );
  }

  return (
    <section id="diary" className="relative py-16 md:py-28 px-5 md:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader enTitle="Love Diary" cnTitle="恋爱日记" />

        <div className="space-y-0">
          {diaryEntries.map((entry, i) => (
            <motion.article
              key={i}
              className="py-8 md:py-14 grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Date + Tag */}
              <div className="md:border-r md:border-[var(--c-divider)] md:pr-8">
                <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{
                  color: "var(--c-gold)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                }}>
                  {entry.date}
                </p>
                <p className="text-[10px] tracking-[0.15em] uppercase" style={{
                  color: "var(--c-warm-muted)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                }}>
                  {entry.tag}
                </p>
              </div>

              {/* Title + Text */}
              <div>
                <h4 className="text-xl md:text-2xl mb-5" style={{
                  fontFamily: "var(--font-cn)",
                  fontWeight: 500,
                  color: "var(--c-warm)",
                  letterSpacing: "0.03em",
                  lineHeight: 1.4,
                }}>
                  {entry.title}
                </h4>
                <p className="text-sm md:text-base leading-[2]" style={{
                  color: "var(--c-text-secondary)",
                  fontFamily: "var(--font-cn)",
                  fontWeight: 300,
                }}>
                  {entry.text}
                </p>
              </div>

              {/* Separator */}
              {i < diaryEntries.length - 1 && (
                <div className="col-span-1 md:col-span-2">
                  <div className="h-px w-full" style={{ background: "var(--c-divider)" }} />
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
