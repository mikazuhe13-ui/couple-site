"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Menu, MessageCircle } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

/* ── Data ── */
import {
  FALLBACK_START, FALLBACK_DIARY,
  FALLBACK_GALLERY, FALLBACK_LETTERS,
} from "@/lib/data";

/* ── UI primitives ── */
import { Ripple, SectionDivider, MusicToggle, MessageBoard } from "@/components/ui";

/* ── Sections ── */
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import DiarySection from "@/components/sections/DiarySection";
import GallerySection from "@/components/sections/GallerySection";
import LettersSection from "@/components/sections/LettersSection";

export default function CoupleSite() {
  const isMobile = useIsMobile();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  /* ── API data state ── */
  const [startDate, setStartDate] = useState(FALLBACK_START);
  const [diaryEntries, setDiaryEntries] = useState(FALLBACK_DIARY);
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY);
  const [loveLetters, setLoveLetters] = useState(FALLBACK_LETTERS);
  const [messages, setMessages] = useState([]);

  /* ── Fetch data from Supabase ── */
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d.diary?.length) setDiaryEntries(d.diary);
        if (d.gallery?.length) setGalleryItems(d.gallery);
        if (d.letters?.length) setLoveLetters(d.letters);
        if (d.messages?.length) setMessages(d.messages);
        if (d.settings?.length) {
          const sd = d.settings.find((s) => s.key === "start_date");
          if (sd) setStartDate(new Date(sd.value));
        }
      })
      .catch(() => {});
  }, []);

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
      }
    } catch (e) {
      console.error("Message save error:", e);
    }
  };

  /* ── Scroll-based parallax (desktop only) ── */
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  /* scroll state for nav */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* countdown */
  useEffect(() => {
    const tick = () => {
      const diff = new Date() - startDate;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  /* click ripple (desktop only) */
  const addRipple = (e) => {
    if (isMobile) return;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
  };
  const removeRipple = (id) => setRipples((prev) => prev.filter((r) => r.id !== id));

  /* smooth scroll */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    ["timer", "计时"],
    ["diary", "日记"],
    ["gallery", "相册"],
    ["letters", "情书"],
    ["messages", "留言"],
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
      {/* Film grain overlay — reduced on mobile via CSS */}
      <div className="fixed inset-0 pointer-events-none z-0 grain-overlay" />

      {/* click ripples — desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {ripples.map((r) => (
            <Ripple key={r.id} {...r} onDone={() => removeRipple(r.id)} />
          ))}
        </AnimatePresence>
      )}

      {/* ═══════════ NAVIGATION ═══════════ */}
      <motion.nav
        className="fixed top-0 w-full z-50 px-5 py-3.5 md:px-6 md:py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: isMobile ? 0.5 : 1.5 }}
        style={{
          backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "blur(8px)",
          background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--c-divider)" : "1px solid transparent",
          transition: "background 0.5s, border-bottom 0.5s, backdrop-filter 0.5s",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
            <Heart className="w-3 h-3 fill-current" style={{ color: "var(--c-rose)" }} />
            <span
              className="text-xs md:text-sm tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--c-warm)",
              }}
            >
              Our Story
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(([id, label]) => (
              <motion.button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[10px] tracking-[0.25em] uppercase relative group py-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--c-warm-muted)",
                  fontWeight: 400,
                }}
              >
                {label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px origin-left"
                  style={{ background: "var(--c-gold)" }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          <div className="flex md:hidden items-center gap-3">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-5 h-5" style={{ color: "var(--c-warm)" }} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* mobile menu — chapter navigation only */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7"
            style={{ background: "rgba(8,8,8,0.97)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map(([id, label], i) => (
              <motion.button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-xl tracking-wider"
                style={{
                  fontFamily: "var(--font-cn)",
                  color: "var(--c-warm)",
                  fontWeight: 300,
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SECTIONS ═══════════ */}
      <HeroSection
        scrollTo={scrollTo}
        heroY={isMobile ? undefined : heroY}
        heroOpacity={isMobile ? undefined : heroOpacity}
        isMobile={isMobile}
      />

      <CountdownSection startDate={startDate} time={time} />

      <SectionDivider />

      <DiarySection diaryEntries={diaryEntries} />

      <SectionDivider />

      <GallerySection galleryItems={galleryItems} />

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
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
              opacity: 0.4,
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
