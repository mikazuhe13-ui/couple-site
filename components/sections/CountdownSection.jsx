"use client";

import { motion } from "framer-motion";

export default function CountdownSection({ startDate, time }) {
  return (
    <section id="timer" className="relative min-h-screen flex items-center justify-center py-24 md:py-40 px-5 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Date */}
        <motion.p
          className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase mb-12 md:mb-24"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--c-warm-muted)",
            fontWeight: 400,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          Since {startDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
        </motion.p>

        {/* Main count */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 md:mb-6" style={{
            fontFamily: "var(--font-sans)",
            color: "var(--c-gold-dim)",
            fontWeight: 400,
          }}>
            Days
          </p>
          <p
            className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] leading-none mb-4 md:mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "var(--c-warm)",
              letterSpacing: "-0.02em",
            }}
          >
            {time.days}
          </p>
          <p className="text-xs md:text-base tracking-[0.12em]" style={{
            fontFamily: "var(--font-cn)",
            color: "var(--c-text-secondary)",
            fontWeight: 300,
          }}>
            相识的第{" "}
            <span style={{ color: "var(--c-rose)" }}>{time.days}</span>
            {" "}天
          </p>
        </motion.div>

        {/* Thin separator */}
        <motion.div
          className="mx-auto my-10 md:my-20"
          style={{ width: "50px", height: "1px", background: "var(--c-divider)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Hours · Minutes · Seconds */}
        <motion.div
          className="flex items-center justify-center gap-6 sm:gap-16 md:gap-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
        >
          {[
            { value: time.hours, label: "Hours" },
            { value: time.minutes, label: "Minutes" },
            { value: time.seconds, label: "Seconds" },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p
                className="text-2xl sm:text-4xl md:text-5xl tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  color: "var(--c-warm)",
                  letterSpacing: "-0.02em",
                }}
              >
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase mt-2 md:mt-3" style={{
                fontFamily: "var(--font-sans)",
                color: "var(--c-warm-muted)",
                fontWeight: 400,
              }}>
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
