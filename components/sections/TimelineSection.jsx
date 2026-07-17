"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { iconMap } from "@/lib/data";
import { SectionHeader, SectionDivider } from "@/components/ui";

export default function TimelineSection({ dark, milestones }) {
  return (
    <section id="timeline" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{
      background: dark
        ? "linear-gradient(180deg, var(--c-dark-bg), #1E1520, var(--c-dark-bg))"
        : "linear-gradient(180deg, #FFF5F0, #FFFAF5, #FFF5F0)",
    }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader icon={Heart} enTitle="Our Timeline" cnTitle="时间线" dark={dark} />

        <div className="relative">
          {/* center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{
            background: "linear-gradient(180deg, transparent 0%, var(--c-rose-light) 8%, var(--c-rose-light) 92%, transparent 100%)",
            opacity: dark ? 0.15 : 0.3,
          }} />
          {/* mobile line */}
          <div className="absolute left-6 top-0 bottom-0 w-px md:hidden" style={{
            background: "linear-gradient(180deg, transparent 0%, var(--c-rose-light) 5%, var(--c-rose-light) 95%, transparent 100%)",
            opacity: dark ? 0.15 : 0.3,
          }} />

          {milestones.map((m, i) => {
            const Icon = iconMap[m.icon] || Heart;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className={`relative mb-14 md:mb-20 flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Desktop card */}
                <div className={`hidden md:block w-5/12 ${isLeft ? "pr-12 text-right" : "pl-12 text-left"}`}>
                  <motion.div
                    className="rounded-3xl p-7 inline-block relative overflow-hidden"
                    style={{
                      background: dark
                        ? "linear-gradient(145deg, rgba(30,22,28,0.7), rgba(25,18,24,0.5))"
                        : "linear-gradient(145deg, rgba(255,255,255,0.75), rgba(255,250,245,0.55))",
                      backdropFilter: "blur(16px) saturate(1.3)",
                      border: `1px solid ${dark ? "rgba(194,146,138,0.08)" : "rgba(255,255,255,0.6)"}`,
                      boxShadow: dark
                        ? "0 8px 32px rgba(0,0,0,0.2)"
                        : "0 8px 32px rgba(194,146,138,0.06)",
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.3)" : "0 16px 48px rgba(194,146,138,0.12)",
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  >
                    {/* decorative corner glow */}
                    <div className="absolute top-0 right-0 w-16 h-16" style={{
                      background: "radial-gradient(circle at 100% 0%, rgba(201,169,110,0.06) 0%, transparent 60%)",
                    }} />
                    <div className="text-xs tracking-[0.2em] uppercase mb-3 relative z-10" style={{
                      color: "var(--c-gold)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}>
                      {m.date}
                    </div>
                    <h4 className="text-xl mb-3 relative z-10" style={{
                      fontFamily: "var(--font-cn)",
                      fontWeight: 600,
                      color: dark ? "#E8D5C4" : "var(--c-text)",
                      letterSpacing: "0.03em",
                    }}>
                      {m.title}
                    </h4>
                    <p className="text-sm leading-relaxed relative z-10" style={{
                      color: dark ? "#9B8080" : "var(--c-text-secondary)",
                      fontFamily: "var(--font-cn)",
                      fontWeight: 300,
                      lineHeight: 1.8,
                    }}>
                      {m.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Center node */}
                <motion.div
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-11 h-11 rounded-full items-center justify-center z-10"
                  style={{
                    background: dark
                      ? "linear-gradient(145deg, #1E1520, #1A1218)"
                      : "linear-gradient(145deg, #FFFAF5, #FFF5F0)",
                    border: `2px solid ${dark ? "rgba(194,146,138,0.2)" : "var(--c-rose-light)"}`,
                    boxShadow: dark
                      ? "0 0 20px rgba(194,146,138,0.1)"
                      : "0 0 20px rgba(194,146,138,0.08)",
                  }}
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--c-rose)" }} />
                </motion.div>

                {/* Mobile card */}
                <div className="md:hidden pl-10 sm:pl-14 w-full">
                  <motion.div
                    className="rounded-2xl p-5"
                    style={{
                      background: dark
                        ? "linear-gradient(145deg, rgba(30,22,28,0.7), rgba(25,18,24,0.5))"
                        : "linear-gradient(145deg, rgba(255,255,255,0.75), rgba(255,250,245,0.55))",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${dark ? "rgba(194,146,138,0.08)" : "rgba(255,255,255,0.6)"}`,
                      boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.15)" : "0 4px 20px rgba(194,146,138,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: "var(--c-rose)" }} />
                      <span className="text-xs tracking-[0.15em]" style={{ color: "var(--c-gold)" }}>{m.date}</span>
                    </div>
                    <h4 className="text-lg mb-1.5" style={{ fontFamily: "var(--font-cn)", fontWeight: 600, color: dark ? "#E8D5C4" : "var(--c-text)" }}>{m.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: dark ? "#9B8080" : "var(--c-text-secondary)", fontFamily: "var(--font-cn)", fontWeight: 300, lineHeight: 1.8 }}>{m.desc}</p>
                  </motion.div>
                </div>

                <div className="hidden md:block w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
