"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Menu, MessageCircle } from "lucide-react";

/* ── Data ── */
import {
  FALLBACK_START, FALLBACK_DIARY,
  FALLBACK_GALLERY, FALLBACK_LETTERS,
} from "@/lib/data";

/* ── UI primitives ── */
import { Ripple, SectionDivider, DarkToggle, MusicToggle, MessageBoard, AmbientOrbs, Petals, SparkleField } from "@/components/ui";

/* ── Sections ── */
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import DiarySection from "@/components/sections/DiarySection";
import GallerySection from "@/components/sections/GallerySection";
import LettersSection from "@/components/sections/LettersSection";

export default function CoupleSite() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dark, setDark] = useState(false);
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

  /* click ripple */
  const addRipple = (e) => {
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
      className="min-h-screen transition-colors duration-700"
      style={{
        fontFamily: "'Inter', 'Noto Serif SC', sans-serif",
        background: dark ? "var(--c-dark-bg)" : "var(--c-cream)",
        color: dark ? "#E8D5C4" : "var(--c-text)",
      }}
    >
      {/* ═══════════ GLOBAL BACKGROUND EFFECTS ═══════════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Flowing gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(135deg, #1A1218 0%, #1E1520 25%, #1A1218 50%, #1E1520 75%, #1A1218 100%)"
              : "linear-gradient(135deg, #FFFAF5 0%, #FFF5F0 25%, #FFFAF5 50%, #F5E6E0 75%, #FFFAF5 100%)",
            backgroundSize: "400% 400%",
            animation: "gradientFlow 20s ease infinite",
          }}
        />
        {/* Aurora layer */}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(160deg, rgba(194,146,138,0.04) 0%, rgba(201,169,110,0.03) 30%, rgba(139,94,86,0.04) 60%, rgba(194,146,138,0.02) 100%)"
              : "linear-gradient(160deg, rgba(194,146,138,0.06) 0%, rgba(201,169,110,0.05) 30%, rgba(232,196,188,0.06) 60%, rgba(194,146,138,0.04) 100%)",
            backgroundSize: "200% 200%",
            animation: "auroraShift 25s ease-in-out infinite",
          }}
        />
        {/* Ambient orbs */}
        <AmbientOrbs dark={dark} count={8} />
        {/* Sparkle field */}
        <SparkleField dark={dark} count={35} />
        {/* Petals */}
        <Petals dark={dark} count={18} />
      </div>

      {/* click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <Ripple key={r.id} {...r} onDone={() => removeRipple(r.id)} />
        ))}
      </AnimatePresence>

      {/* ═══════════ NAVIGATION ═══════════ */}
      <motion.nav
        className="fixed top-0 w-full z-50 px-6 py-4"
        style={{
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "blur(8px)",
          background: scrolled
            ? (dark ? "rgba(26,18,24,0.85)" : "rgba(255,250,245,0.85)")
            : "transparent",
          borderBottom: scrolled
            ? `1px solid ${dark ? "rgba(194,146,138,0.06)" : "rgba(194,146,138,0.06)"}`
            : "1px solid transparent",
          transition: "background 0.4s, border-bottom 0.4s, backdrop-filter 0.4s",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="w-4 h-4 fill-current" style={{ color: "var(--c-rose)" }} />
            </motion.div>
            <span
              className="text-base tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: dark ? "#E8D5C4" : "var(--c-text)",
                letterSpacing: "0.2em",
              }}
            >
              Our Story
            </span>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(([id, label]) => (
              <motion.button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[11px] tracking-[0.2em] uppercase relative group py-1"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: dark ? "#8B7878" : "var(--c-text-muted)",
                  fontWeight: 500,
                }}
              >
                {label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px origin-left"
                  style={{ background: "var(--c-rose)" }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
            <DarkToggle dark={dark} setDark={setDark} />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <DarkToggle dark={dark} setDark={setDark} />
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-5 h-5" style={{ color: dark ? "#E8D5C4" : "var(--c-text)" }} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7"
            style={{
              background: dark ? "rgba(26,18,24,0.97)" : "rgba(255,250,245,0.97)",
              backdropFilter: "blur(30px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map(([id, label], i) => (
              <motion.button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-2xl tracking-wider"
                style={{
                  fontFamily: "var(--font-cn)",
                  color: dark ? "#E8D5C4" : "var(--c-text)",
                  fontWeight: 300,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SECTIONS ═══════════ */}
      <HeroSection dark={dark} scrollTo={scrollTo} heroY={heroY} heroOpacity={heroOpacity} />

      <CountdownSection dark={dark} startDate={startDate} time={time} />

      <SectionDivider dark={dark} />

      <DiarySection dark={dark} diaryEntries={diaryEntries} />

      <SectionDivider dark={dark} />

      <GallerySection dark={dark} galleryItems={galleryItems} />

      <SectionDivider dark={dark} />

      <LettersSection dark={dark} loveLetters={loveLetters} />

      <SectionDivider dark={dark} />

      {/* ═══════════ MESSAGE BOARD ═══════════ */}
      <section
        id="messages"
        className="relative py-28 md:py-40 px-6 overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(180deg, var(--c-dark-bg), #1E1520)"
            : "linear-gradient(180deg, var(--c-cream), #FFF5F0)",
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="text-center mb-16 md:mb-24"
          >
            <MessageCircle className="w-5 h-5 mx-auto mb-5" style={{ color: "var(--c-gold)" }} />
            <h3
              className="text-3xl md:text-5xl lg:text-6xl mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: dark ? "#E8D5C4" : "var(--c-text)",
                letterSpacing: "0.02em",
              }}
            >
              Message Board
            </h3>
            <p
              className="text-lg md:text-xl tracking-wider"
              style={{
                fontFamily: "var(--font-cn)",
                color: dark ? "#8B7878" : "var(--c-text-secondary)",
                fontWeight: 300,
              }}
            >
              留言板
            </p>
          </motion.div>
          <MessageBoard dark={dark} messages={messages} onAddMessage={handleAddMessage} />
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(180deg, #1E1520, #1A1218)"
            : "linear-gradient(180deg, #FFF5F0, #FFFAF5)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, var(--c-rose-light))" }} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 fill-current" style={{ color: "var(--c-rose)" }} />
            </motion.div>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, var(--c-rose-light))" }} />
          </div>
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: dark ? "#504040" : "var(--c-text-muted)",
              fontWeight: 500,
            }}
          >
            Made with Love
          </p>
          <p
            className="text-xs"
            style={{
              color: dark ? "#3A2E2E" : "var(--c-text-muted)",
              opacity: 0.6,
            }}
          >
            {new Date().getFullYear()} · Our Love Story
          </p>
        </motion.div>
      </footer>

      <MusicToggle dark={dark} />
    </div>
  );
}
