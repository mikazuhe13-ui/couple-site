"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Petals, AmbientOrbs } from "@/components/ui";

export default function HeroSection({ dark, scrollTo, heroY, heroOpacity }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to play immediately
    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Browser blocked autoplay, will retry on user interaction
        });
      }
    };

    // Retry on user interaction
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    // Try immediately
    const timer = setTimeout(tryPlay, 100);

    // Also retry on user interaction
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

      {/* video background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: heroY }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: dark ? "brightness(0.35) saturate(0.8)" : "brightness(0.75) saturate(1.1)" }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(170deg, rgba(26,18,24,0.7) 0%, rgba(32,21,32,0.6) 50%, rgba(26,18,24,0.75) 100%)"
              : "linear-gradient(170deg, rgba(255,248,245,0.55) 0%, rgba(253,232,224,0.45) 50%, rgba(255,245,240,0.6) 100%)",
          }}
        />
      </motion.div>

      {/* ambient orbs */}
      <AmbientOrbs dark={dark} count={5} />

      {/* petals */}
      <Petals dark={dark} count={dark ? 14 : 22} />

      {/* large decorative circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "clamp(200px, 60vw, 800px)",
          height: "clamp(200px, 60vw, 800px)",
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
          width: "clamp(150px, 40vw, 500px)",
          height: "clamp(150px, 40vw, 500px)",
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

      {/* cinematic vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: dark
            ? "radial-gradient(ellipse at center, transparent 40%, rgba(10,6,10,0.6) 100%)"
            : "radial-gradient(ellipse at center, transparent 50%, rgba(30,15,15,0.15) 100%)",
        }}
      />

      {/* content */}
      <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
        {/* cinematic letterbox bars */}
        <motion.div
          className="fixed left-0 right-0 h-[6vh] bg-black z-50"
          style={{ top: 0 }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.5, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="fixed left-0 right-0 h-[6vh] bg-black z-50"
          style={{ bottom: 0 }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.5, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}>
          {/* top decorative line */}
          <motion.div
            className="mx-auto mb-8 sm:mb-12"
            style={{ width: "clamp(60px, 15vw, 160px)", height: "1px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-full h-full" style={{
              background: "linear-gradient(90deg, transparent, var(--c-gold-light), transparent)",
            }} />
          </motion.div>

          {/* names - main cinematic title */}
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 sm:mb-5"
            style={{
              fontFamily: "var(--font-art)",
              fontWeight: 400,
              color: dark ? "#F0E0D6" : "#2C1810",
              letterSpacing: "0.15em",
              textShadow: dark
                ? "0 0 80px rgba(194,146,138,0.15), 0 2px 40px rgba(0,0,0,0.3)"
                : "0 0 60px rgba(194,146,138,0.1)",
            }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", letterSpacing: "0.5em" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.15em" }}
            transition={{ duration: 2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            杜明洋{" "}
            <motion.span
              className="inline-block mx-1 sm:mx-3"
              style={{ color: "var(--c-rose)", fontWeight: 300 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.0, type: "spring", stiffness: 100 }}
            >
              ×
            </motion.span>
            {" "}陈柯嘉
          </motion.h1>

          {/* tagline - movie subtitle */}
          <motion.p
            className="text-sm sm:text-base md:text-lg mb-10 sm:mb-14"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: dark ? "#A09088" : "var(--c-text-secondary)",
              letterSpacing: "0.12em",
              textShadow: dark ? "0 0 30px rgba(194,146,138,0.08)" : "none",
            }}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Some stories are not meant to end.
          </motion.p>

          {/* CTA button - enter our story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              onClick={() => scrollTo("timer")}
              className="group relative px-8 sm:px-12 py-3 sm:py-4 cursor-pointer"
              style={{
                border: `1px solid ${dark ? "rgba(194,146,138,0.25)" : "rgba(194,146,138,0.3)"}`,
                background: dark ? "rgba(194,146,138,0.04)" : "rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
              }}
              whileHover={{
                borderColor: dark ? "rgba(194,146,138,0.5)" : "rgba(194,146,138,0.5)",
                background: dark ? "rgba(194,146,138,0.1)" : "rgba(255,255,255,0.5)",
                scale: 1.03,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="text-xs sm:text-sm tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-cn)",
                  fontWeight: 300,
                  color: dark ? "#D4B8A8" : "var(--c-text)",
                  letterSpacing: "0.3em",
                }}
              >
                进入我们的故事
              </span>
              {/* button glow effect */}
              <motion.div
                className="absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: dark
                    ? "0 0 30px rgba(194,146,138,0.1), inset 0 0 30px rgba(194,146,138,0.05)"
                    : "0 0 30px rgba(194,146,138,0.08), inset 0 0 30px rgba(194,146,138,0.03)",
                }}
              />
            </motion.button>
          </motion.div>

          {/* bottom decorative line */}
          <motion.div
            className="mx-auto mt-10 sm:mt-14"
            style={{ width: "clamp(60px, 15vw, 160px)", height: "1px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 3.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-full h-full" style={{
              background: "linear-gradient(90deg, transparent, var(--c-gold-light), transparent)",
            }} />
          </motion.div>

          {/* scroll hint */}
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 mx-auto" style={{ color: dark ? "rgba(194,146,138,0.3)" : "rgba(194,146,138,0.4)" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
