"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection({ scrollTo, heroY, heroOpacity, isMobile }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    const timer = setTimeout(tryPlay, 100);
    document.addEventListener("click", handleInteraction);
    document.addEventListener("scroll", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  /* ── Wrap content for optional parallax ── */
  const VideoLayer = (
    <div
      className="absolute inset-0 overflow-hidden"
      style={heroY ? { y: heroY } : undefined}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.3) saturate(0.7) contrast(1.1)",
          /* On mobile, use object-position to crop vertical video better */
          objectPosition: isMobile ? "center center" : undefined,
        }}
      >
        <source
          src={isMobile ? "/hero-bg-mobile.mp4" : "/hero-bg.mp4"}
          type="video/mp4"
        />
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? "linear-gradient(180deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.5) 75%, rgba(8,8,8,0.95) 100%)"
            : "linear-gradient(180deg, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.3) 40%, rgba(8,8,8,0.5) 80%, rgba(8,8,8,0.9) 100%)",
        }}
      />
    </div>
  );

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden grain-overlay">
      {/* Video background */}
      {VideoLayer}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
            : "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        style={heroOpacity ? { opacity: heroOpacity } : undefined}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.3 }}>
          {/* Top decorative line */}
          <motion.div
            className="mx-auto mb-8 sm:mb-14"
            style={{ width: "clamp(40px, 10vw, 140px)", height: "1px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-full h-full" style={{
              background: "linear-gradient(90deg, transparent, var(--c-gold), transparent)",
              opacity: 0.4,
            }} />
          </motion.div>

          {/* Names — main cinematic title */}
          <motion.h1
            className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 sm:mb-6"
            style={{
              fontFamily: "var(--font-cn)",
              fontWeight: 400,
              color: "var(--c-warm)",
              letterSpacing: "0.12em",
            }}
            initial={{ opacity: 0, filter: "blur(12px)", letterSpacing: "0.4em" }}
            animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "0.12em" }}
            transition={{ duration: 2.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            杜明洋{" "}
            <motion.span
              className="inline-block mx-1.5 sm:mx-4"
              style={{ color: "var(--c-rose)", fontWeight: 300 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.2, type: "spring", stiffness: 100 }}
            >
              ×
            </motion.span>
            {" "}陈柯嘉
          </motion.h1>

          {/* Tagline — movie subtitle */}
          <motion.p
            className="text-xs sm:text-base md:text-lg mb-10 sm:mb-16"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--c-warm-muted)",
              letterSpacing: "0.1em",
            }}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Some stories are not meant to end.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              onClick={() => scrollTo("timer")}
              className="group relative px-7 sm:px-12 py-3 sm:py-4 cursor-pointer"
              style={{
                border: "1px solid rgba(184, 162, 124, 0.2)",
                background: "rgba(184, 162, 124, 0.03)",
              }}
              whileHover={{
                borderColor: "rgba(184, 162, 124, 0.4)",
                background: "rgba(184, 162, 124, 0.06)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="text-[11px] sm:text-sm tracking-[0.25em]"
                style={{
                  fontFamily: "var(--font-cn)",
                  fontWeight: 300,
                  color: "var(--c-warm-dim)",
                }}
              >
                进入我们的故事
              </span>
            </motion.button>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            className="mx-auto mt-8 sm:mt-14"
            style={{ width: "clamp(40px, 10vw, 140px)", height: "1px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 4.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-full h-full" style={{
              background: "linear-gradient(90deg, transparent, var(--c-gold), transparent)",
              opacity: 0.4,
            }} />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-6 sm:mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 5.0 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 mx-auto" style={{ color: "var(--c-gold-dim)", opacity: 0.5 }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
