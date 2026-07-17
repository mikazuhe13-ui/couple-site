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
          filter: "brightness(1.05) saturate(1.1) contrast(1.02)",
          objectPosition: isMobile ? "center center" : undefined,
        }}
      >
        <source
          src={isMobile ? "/hero-bg-mobile.mp4" : "/hero-bg.mp4"}
          type="video/mp4"
        />
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Warm dreamy overlay — bright & romantic */}
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? "linear-gradient(180deg, rgba(255,251,245,0.12) 0%, rgba(255,245,235,0.04) 40%, rgba(255,248,240,0.06) 75%, rgba(255,251,245,0.18) 100%)"
            : "linear-gradient(180deg, rgba(255,251,245,0.08) 0%, rgba(255,245,235,0.02) 40%, rgba(255,248,240,0.04) 80%, rgba(255,251,245,0.12) 100%)",
        }}
      />
    </div>
  );

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden grain-overlay">
      {/* Video background */}
      {VideoLayer}

      {/* Soft warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(255,240,225,0.15) 100%)",
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
              background: "linear-gradient(90deg, transparent, #C4827A, transparent)",
              opacity: 0.4,
            }} />
          </motion.div>

          {/* Names — main title, elegant romantic serif */}
          <motion.h1
            className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 sm:mb-6"
            style={{
              fontFamily: "'Playfair Display', 'Noto Serif SC', serif",
              fontWeight: 500,
              color: "#C4827A",
              letterSpacing: "0.15em",
              textShadow: "0 2px 30px rgba(196,130,122,0.3), 0 0 60px rgba(255,220,200,0.15)",
              marginTop: "-63vh",
            }}
            initial={{ opacity: 0, filter: "blur(12px)", letterSpacing: "0.4em" }}
            animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "0.12em" }}
            transition={{ duration: 2.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            杜明洋{" "}
            <motion.span
              className="inline-block mx-1.5 sm:mx-4"
              style={{ color: "#D4A0A0", fontWeight: 300 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.2, type: "spring", stiffness: 100 }}
            >
              ×
            </motion.span>
            {" "}陈柯嘉
          </motion.h1>

          {/* Tagline — romantic italic */}
          <motion.p
            className="text-xs sm:text-base md:text-lg mb-10 sm:mb-16"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#B8897E",
              letterSpacing: "0.15em",
              textShadow: "0 1px 15px rgba(184,137,126,0.25)",
              marginTop: "19vh",
            }}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Some stories are not meant to end.
          </motion.p>

          {/* CTA button — romantic elegant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginTop: "16vh" }}
          >
            <motion.button
              onClick={() => scrollTo("timer")}
              className="group relative px-7 sm:px-12 py-3 sm:py-4 cursor-pointer"
              style={{
                border: "1px solid rgba(196, 130, 122, 0.35)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(10px)",
              }}
              whileHover={{
                borderColor: "rgba(196, 130, 122, 0.55)",
                background: "rgba(255,255,255,0.65)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="text-[11px] sm:text-sm tracking-[0.3em]"
                style={{
                  fontFamily: "'Playfair Display', 'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#B8897E",
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
              background: "linear-gradient(90deg, transparent, #C4827A, transparent)",
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
