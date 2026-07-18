"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function HeroSection({ scrollTo }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const heroVisibleRef = useRef(false);
  const [canParallax, setCanParallax] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.88]);

  const [heroHeight, setHeroHeight] = useState(null);

  // Dynamically set hero height via JS — far more reliable than CSS
  // viewport units (vh/svh/dvh) on mobile browsers, especially Chinese
  // Android browsers and WeChat's X5 kernel.
  useEffect(() => {
    const update = () => setHeroHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    // Some mobile browsers change viewport after a short delay
    const t = setTimeout(update, 300);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 769px) and (hover: hover) and (pointer: fine)"
    );
    const connection = navigator.connection;
    const updateParallax = () => {
      setCanParallax(query.matches && !connection?.saveData);
    };
    updateParallax();
    query.addEventListener?.("change", updateParallax);
    connection?.addEventListener?.("change", updateParallax);

    return () => {
      query.removeEventListener?.("change", updateParallax);
      connection?.removeEventListener?.("change", updateParallax);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const connection = navigator.connection;
    const playbackAllowed = () =>
      !reducedMotionQuery.matches && !connection?.saveData;

    const syncPlayback = () => {
      const pageVisible = document.visibilityState === "visible";
      if (playbackAllowed() && heroVisibleRef.current && pageVisible) {
        video.play().catch(() => {
          video.pause();
        });
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisibleRef.current =
          entry.isIntersecting && entry.intersectionRatio >= 0.2;
        setHeroInView(heroVisibleRef.current);
        syncPlayback();
      },
      { threshold: [0, 0.2, 0.6] }
    );

    if (!playbackAllowed()) {
      video.pause();
    }

    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotionQuery.addEventListener?.("change", syncPlayback);
    connection?.addEventListener?.("change", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotionQuery.removeEventListener?.("change", syncPlayback);
      connection?.removeEventListener?.("change", syncPlayback);
      video.pause();
    };
  }, []);

  const motionEnabled = !reduceMotion;
  const parallaxActive = canParallax && motionEnabled && heroInView;
  const reveal = (delay) => ({
    initial: motionEnabled ? { opacity: 0, y: 18 } : false,
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: motionEnabled ? 0.9 : 0,
      delay: motionEnabled ? delay : 0,
      ease: EASE_OUT,
    },
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative overflow-hidden grain-overlay ${
        heroInView ? "hero-is-active" : ""
      }`}
      style={{
        minHeight: heroHeight ? `${heroHeight}px` : "100vh",
      }}
    >
      <motion.div
        className={`absolute -inset-y-12 inset-x-0 overflow-hidden ${
          parallaxActive ? "will-change-transform" : ""
        }`}
        style={parallaxActive ? { y: mediaY } : undefined}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/hero-poster.webp"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,245,0.18)_0%,rgba(255,245,235,0.04)_38%,rgba(255,248,240,0.08)_72%,rgba(255,251,245,0.28)_100%)]" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(255,240,225,0.22)_100%)]" />

      <motion.div
        className={`hero-content-grid relative z-10 px-5 text-center sm:px-8 ${
          parallaxActive ? "will-change-transform" : ""
        }`}
        style={
          parallaxActive ? { y: contentY, opacity: contentOpacity } : undefined
        }
      >
        <motion.div className="self-end" {...reveal(0.15)}>
          <div className="mx-auto h-px w-[clamp(3rem,10vw,8.75rem)] bg-[linear-gradient(90deg,transparent,var(--c-gold),transparent)] opacity-60" />
        </motion.div>

        <motion.h1 className="hero-title" {...reveal(0.28)}>
          杜明洋{" "}
          <motion.span
            className="hero-title-mark mx-1.5 inline-block font-normal text-[var(--c-gold)] sm:mx-4"
            initial={motionEnabled ? { opacity: 0, scale: 0.7 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: motionEnabled ? 0.65 : 0,
              delay: motionEnabled ? 0.65 : 0,
              ease: EASE_OUT,
            }}
          >
            ×
          </motion.span>{" "}
          陈柯嘉
        </motion.h1>

        <motion.p className="hero-tagline" {...reveal(0.48)}>
          Some stories are not meant to end.
        </motion.p>

        <motion.div {...reveal(0.68)}>
          <motion.button
            type="button"
            onClick={() => scrollTo("timer")}
            className="hero-cta group relative cursor-pointer px-7 py-3 sm:px-11 sm:py-3.5"
            whileHover={
              motionEnabled
                ? {
                    borderColor: "rgba(201, 169, 110, 0.78)",
                    backgroundColor: "rgba(255, 251, 245, 0.82)",
                    y: -2,
                  }
                : undefined
            }
            whileTap={motionEnabled ? { scale: 0.98 } : undefined}
          >
            <span className="font-[family-name:var(--font-cn)] text-[0.72rem] tracking-[0.28em] text-[var(--c-text-secondary)] sm:text-sm">
              进入我们的故事
            </span>
          </motion.button>
        </motion.div>

        <motion.div className="self-start pt-2 sm:pt-4" {...reveal(0.86)}>
          <div className="mx-auto mb-5 h-px w-[clamp(3rem,10vw,8.75rem)] bg-[linear-gradient(90deg,transparent,var(--c-gold),transparent)] opacity-60" />
          <motion.div
            animate={parallaxActive ? { y: [0, 7, 0] } : { y: 0 }}
            transition={
              parallaxActive
                ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          >
            <ChevronDown
              className="mx-auto h-4 w-4 text-[var(--c-gold-dim)] opacity-60"
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
