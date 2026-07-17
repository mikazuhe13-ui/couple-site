"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { FlipCard, AmbientOrbs } from "@/components/ui";

export default function CountdownSection({ dark, startDate, time }) {
  return (
    <section id="timer" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ background: dark ? "var(--c-dark-bg)" : "var(--c-cream)" }}>
      <AmbientOrbs dark={dark} count={3} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
          }}
        >
          {/* icon */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
          >
            <Clock className="w-5 h-5 mx-auto" style={{ color: "var(--c-gold)", filter: "drop-shadow(0 0 6px rgba(201,169,110,0.3))" }} />
          </motion.div>

          {/* date label */}
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{
            fontFamily: "'Inter', sans-serif",
            color: dark ? "#8B7878" : "var(--c-text-muted)",
            fontWeight: 500,
          }}>
            Since {startDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          {/* main count */}
          <p className="text-2xl md:text-3xl mb-16" style={{
            fontFamily: "var(--font-cn)",
            color: dark ? "#B0A0A0" : "var(--c-text-secondary)",
            fontWeight: 300,
            letterSpacing: "0.05em",
          }}>
            相识的第{" "}
            <span style={{
              color: "var(--c-rose)",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              fontSize: "1.3em",
              textShadow: dark ? "0 0 20px rgba(194,146,138,0.2)" : "none",
            }}>
              {time.days}
            </span>{" "}
            天
          </p>
        </motion.div>

        {/* countdown cards */}
        <motion.div
          className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          {[
            { value: time.days, label: "Days" },
            { value: time.hours, label: "Hours" },
            { value: time.minutes, label: "Minutes" },
            { value: time.seconds, label: "Seconds" },
          ].map((item, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 40, scale: 0.85, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
              <FlipCard value={item.value} label={item.label} dark={dark} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
