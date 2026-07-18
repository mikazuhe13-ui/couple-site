"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import Sakura from "@/components/effects/Sakura";

/* ── UI primitives ── */
import { Ripple, SectionDivider } from "@/components/ui";
import MessageBoard from "@/components/ui/MessageBoard";
import MusicToggle from "@/components/ui/MusicToggle";
import SiteNavigation from "@/components/navigation/SiteNavigation";

/* ── Sections ── */
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import DiarySection from "@/components/sections/DiarySection";
import GallerySection from "@/components/sections/GallerySection";
import LettersSection from "@/components/sections/LettersSection";
import VowsSection from "@/components/sections/VowsSection";

export default function CoupleSite({ initialContent }) {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState([]);

  const {
    startDate,
    diaryEntries,
    galleryItems,
    loveLetters,
    vowsItems,
    messages: initialMessages,
  } = initialContent;
  const [messages, setMessages] = useState(initialMessages);

  /* ── Add message ── */
  const handleAddMessage = async (msg) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "messages", data: msg }),
      });
      if (res.ok) {
        const saved = await res.json();
        setMessages((prev) => [saved, ...prev]);
        return { ok: true };
      }

      return { ok: false };
    } catch (e) {
      console.error("Message save error:", e);
      return { ok: false };
    }
  };

  /* click ripple (desktop only) */
  const addRipple = (e) => {
    if (isMobile) return;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
  };
  const removeRipple = (id) => setRipples((prev) => prev.filter((r) => r.id !== id));

  /* smooth scroll */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const navLinks = [
    { id: "timer", label: "计时" },
    { id: "diary", label: "日记" },
    { id: "gallery", label: "相册" },
    { id: "vows", label: "誓言" },
    { id: "letters", label: "情书" },
    { id: "messages", label: "留言" },
  ];

  return (
    <div
      onClick={addRipple}
      className={`min-h-screen ${isMobile ? "mobile-site" : ""}`}
      style={{
        fontFamily: "'Inter', 'Noto Serif SC', sans-serif",
        background: "var(--c-bg)",
        color: "var(--c-text)",
      }}
    >
      {/* Film grain overlay — very subtle warm texture */}
      <div className="fixed inset-0 pointer-events-none z-0 grain-overlay" />

      {/* Sakura petals — fades in after hero */}
      <Sakura />

      {/* click ripples — desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {ripples.map((r) => (
            <Ripple key={r.id} {...r} onDone={() => removeRipple(r.id)} />
          ))}
        </AnimatePresence>
      )}

      <SiteNavigation links={navLinks} />

      {/* ═══════════ SECTIONS ═══════════ */}
      <HeroSection scrollTo={scrollTo} />

      {/* ═══════════ SAKURA BG SECTIONS ═══════════ */}
      <div
        style={{
          backgroundImage: "url(/sakura-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <CountdownSection startDate={startDate} />

        <SectionDivider />

        <DiarySection diaryEntries={diaryEntries} />

        <SectionDivider />

        <GallerySection galleryItems={galleryItems} />

        <SectionDivider />

        <VowsSection vows={vowsItems} />

        <SectionDivider />

        <LettersSection loveLetters={loveLetters} />

        <SectionDivider />

        {/* ═══════════ MESSAGE BOARD ═══════════ */}
        <section
          id="messages"
          className="relative py-20 md:py-40 px-5 md:px-6"
        >
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
            className="text-center mb-12 md:mb-24"
          >
            <MessageCircle className="w-4 h-4 mx-auto mb-4" style={{ color: "var(--c-gold-dim)" }} />
            <h3
              className="text-2xl md:text-5xl lg:text-6xl mb-2 md:mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--c-warm)",
                letterSpacing: "0.02em",
              }}
            >
              Message Board
            </h3>
            <p
              className="text-base md:text-xl tracking-wider"
              style={{
                fontFamily: "var(--font-cn)",
                color: "var(--c-text-secondary)",
                fontWeight: 300,
              }}
            >
              留言板
            </p>
          </motion.div>
          <MessageBoard messages={messages} onAddMessage={handleAddMessage} />
        </div>
      </section>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative py-16 md:py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 md:w-16" style={{ background: "linear-gradient(to right, transparent, var(--c-divider))" }} />
            <motion.div
              animate={{
                scale: shouldReduceMotion ? 1 : [1, 1.15, 1],
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 3,
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-3 h-3 fill-current" style={{ color: "var(--c-rose)" }} />
            </motion.div>
            <div className="h-px w-12 md:w-16" style={{ background: "linear-gradient(to left, transparent, var(--c-divider))" }} />
          </div>
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--c-text-muted)",
              fontWeight: 400,
            }}
          >
            Made with Love
          </p>
          <p
            className="text-xs"
            style={{
              color: "var(--c-text-muted)",
              opacity: 0.5,
            }}
          >
            {new Date().getFullYear()} · Our Love Story
          </p>
        </motion.div>
      </footer>

      <MusicToggle />
    </div>
  );
}
