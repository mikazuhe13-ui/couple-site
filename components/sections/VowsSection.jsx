"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import useIsMobile from "@/hooks/useIsMobile";

/* ══════════════════════════════════════════
   VowCard — single vow card
   ══════════════════════════════════════════ */
function VowCard({ vow, i, isMobile }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), isMobile ? i * 60 : i * 100);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [i, isMobile]);

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Card with romantic border */}
      <div
        className="relative overflow-hidden h-full"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(196,130,122,0.2)",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(196,130,122,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top decorative line */}
        <div
          className="w-full h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #C4827A, transparent)",
            opacity: 0.4,
          }}
        />

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Vow number */}
          <div
            className="text-xs tracking-[0.3em] mb-4 md:mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#C4827A",
              opacity: 0.6,
            }}
          >
            No. {String(i + 1).padStart(2, "0")}
          </div>

          {/* Vow text */}
          <p
            className="text-sm md:text-base leading-relaxed md:leading-loose"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: "#5C4033",
              fontWeight: 400,
            }}
          >
            {vow.text}
          </p>

          {/* Date if available */}
          {vow.date && (
            <div
              className="mt-6 md:mt-8 text-xs tracking-wider"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#B8897E",
                opacity: 0.7,
              }}
            >
              {vow.date}
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div
          className="w-full h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #C4827A, transparent)",
            opacity: 0.4,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════
   VowsSection
   ══════════════════════════════════════════ */
export default function VowsSection({ vows }) {
  const isMobile = useIsMobile();

  if (!vows || vows.length === 0) return null;

  return (
    <section
      id="vows"
      className={`relative z-10 ${
        isMobile ? "py-16 px-5" : "py-28 md:py-40 px-6"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader enTitle="Our Vows" cnTitle="结契同心" />

        {/* Card grid */}
        <div
          className={`grid gap-5 md:gap-6 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {vows.map((vow, i) => (
            <VowCard key={i} vow={vow} i={i} isMobile={isMobile} />
          ))}
        </div>

        {/* Decorative heart */}
        <motion.div
          className="flex justify-center mt-12 md:mt-16"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 150 }}
        >
          <Heart
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ color: "#C4827A", opacity: 0.4 }}
            fill="#C4827A"
          />
        </motion.div>
      </div>
    </section>
  );
}
