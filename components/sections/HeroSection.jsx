"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { Petals, AmbientOrbs } from "@/components/ui";

export default function HeroSection({ dark, scrollTo, heroY, heroOpacity }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay">
      {/* layered background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: heroY,
          background: dark
            ? "linear-gradient(170deg, #1A1218 0%, #201520 30%, #1E1420 60%, #1A1218 100%)"
            : "linear-gradient(170deg, #FFF8F5 0%, #FDE8E0 25%, #F8DDD5 50%, #FDE8E0 75%, #FFF5F0 100%)",
        }}
      />

      {/* ambient orbs */}
      <AmbientOrbs dark={dark} count={5} />

      {/* petals */}
      <Petals dark={dark} count={dark ? 14 : 22} />

      {/* large decorative circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          top: "5%",
          right: "-15%",
          background: dark
            ? "radial-gradient(circle, rgba(194,146,138,0.04) 0%, transparent 60%)"
            : "radial-gradient(circle, rgba(201,169,110,0.08) 0%, rgba(194,146,138,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* secondary orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "5%",
          left: "-10%",
          background: dark
            ? "radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 60%)"
            : "radial-gradient(circle, rgba(232,196,188,0.1) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* content */}
      <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
          {/* decorative lines + heart */}
          <div className="flex items-center justify-center gap-5 mb-12">
            <motion.div
              className="h-px w-20"
              style={{ background: "linear-gradient(to right, transparent, var(--c-gold-light))" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 150 }}
            >
              <Heart className="w-5 h-5 fill-current" style={{ color: "var(--c-rose)" }} />
            </motion.div>
            <motion.div
              className="h-px w-20"
              style={{ background: "linear-gradient(to left, transparent, var(--c-gold-light))" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            />
          </div>

          {/* main title */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              color: dark ? "#E8D5C4" : "var(--c-text)",
              letterSpacing: "-0.02em",
              textShadow: dark ? "0 0 60px rgba(194,146,138,0.1)" : "none",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Our Love
          </motion.h1>

          {/* Chinese subtitle */}
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl mb-8"
            style={{
              fontFamily: "var(--font-art)",
              color: dark ? "#B0A0A0" : "var(--c-text-secondary)",
              fontWeight: 400,
              letterSpacing: "0.1em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            我们的爱情故事
          </motion.h2>

          {/* description */}
          <motion.p
            className="text-sm md:text-base mb-16 max-w-sm mx-auto leading-loose"
            style={{
              fontFamily: "var(--font-cn)",
              color: dark ? "#8B7878" : "var(--c-text-muted)",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            记录属于我们的每一个瞬间
            <br />
            从相遇到相守，从此刻到永远
          </motion.p>

          {/* scroll indicator */}
          <motion.div
            className="cursor-pointer"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => scrollTo("timer")}
          >
            <ChevronDown className="w-5 h-5 mx-auto" style={{ color: "var(--c-rose)" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
