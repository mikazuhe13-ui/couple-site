"use client";

import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";

export default function SectionHeader({ enTitle, cnTitle }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      className={`${isMobile ? "mb-10 px-5" : "mb-16 md:mb-24"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: isMobile ? "-30px" : "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: isMobile ? 0.05 : 0.1,
          },
        },
      }}
    >
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 20, filter: isMobile ? "blur(4px)" : "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: isMobile ? 0.5 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`${
          isMobile ? "text-2xl" : "text-3xl md:text-5xl lg:text-6xl"
        } text-center`}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          color: "var(--c-warm)",
          letterSpacing: "0.02em",
        }}
      >
        {enTitle}
      </motion.h3>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10, filter: isMobile ? "blur(2px)" : "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.1 }}
        className={`${
          isMobile ? "text-sm mt-2" : "text-base md:text-lg mt-4"
        } tracking-wider text-center`}
        style={{
          fontFamily: "var(--font-cn)",
          color: "var(--c-text-secondary)",
          fontWeight: 300,
        }}
      >
        {cnTitle}
      </motion.p>
    </motion.div>
  );
}
