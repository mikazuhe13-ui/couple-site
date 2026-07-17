"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Menu, MessageCircle } from "lucide-react";

/* ── Data ── */
import {
  FALLBACK_START, FALLBACK_MILESTONES, FALLBACK_DIARY,
  FALLBACK_GALLERY, FALLBACK_LETTERS,
} from "@/lib/data";

/* ── UI primitives ── */
import { Ripple, WaveDivider, DarkToggle, MusicToggle, MessageBoard } from "@/components/ui";

/* ── Sections ── */
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import TimelineSection from "@/components/sections/TimelineSection";
import DiarySection from "@/components/sections/DiarySection";
import GallerySection from "@/components/sections/GallerySection";
import LettersSection from "@/components/sections/LettersSection";

export default function CoupleSite() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ripples, setRipples] = useState([]);

  /* ── API data state ── */
  const [startDate, setStartDate] = useState(FALLBACK_START);
  const [milestones, setMilestones] = useState(FALLBACK_MILESTONES);
  const [diaryEntries, setDiaryEntries] = useState(FALLBACK_DIARY);
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY);
  const [loveLetters, setLoveLetters] = useState(FALLBACK_LETTERS);
  const [messages, setMessages] = useState([]);

  /* ── Fetch data from Supabase ── */
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d.milestones?.length) setMilestones(d.milestones);
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
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

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

  const navLinks = [["timer", "计时"], ["timeline", "时间线"], ["diary", "日记"], ["gallery", "相册"], ["letters", "情书"], ["messages", "留言"]];

  return (
    <div
      onClick={addRipple}
      className="min-h-screen transition-colors duration-700"
      style={{
        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
        background: dark ? "#13101A" : "#FFFBF7",
        color: dark ? "#E8D5C4" : "#3D2B2B",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700&display=swap'); html { scroll-behavior: smooth; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${dark ? "#13101A" : "#FFFBF7"}; } ::-webkit-scrollbar-thumb { background: #D4A38B; border-radius: 3px; } ::selection { background: rgba(196,129,129,0.2); }`}</style>

      {/* click ripples */}
      <AnimatePresence>
        {ripples.map((r) => <Ripple key={r.id} {...r} onDone={() => removeRipple(r.id)} />)}
      </AnimatePresence>

      {/* ═══════════ NAVIGATION ═══════════ */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4" style={{ backdropFilter: "blur(20px)", borderBottom: `1px solid ${dark ? "rgba(196,129,129,0.06)" : "rgba(196,129,129,0.06)"}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
              <Heart className="w-4 h-4 fill-current" style={{ color: "#C48181" }} />
            </motion.div>
            <span className="text-lg tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>
              OUR STORY
            </span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(([id, label]) => (
              <motion.button key={id} onClick={() => scrollTo(id)} className="text-xs tracking-widest uppercase relative group py-1" style={{ color: dark ? "#9B8080" : "#9B7070" }}>
                {label}
                <motion.div className="absolute bottom-0 left-0 right-0 h-px origin-left" style={{ background: "#C48181" }} initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
              </motion.button>
            ))}
            <DarkToggle dark={dark} setDark={setDark} />
          </div>
          <div className="flex md:hidden items-center gap-3">
            <DarkToggle dark={dark} setDark={setDark} />
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-5 h-5" style={{ color: dark ? "#E8D5C4" : "#3D2B2B" }} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: dark ? "rgba(19,16,26,0.96)" : "rgba(255,251,247,0.96)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map(([id, label], i) => (
              <motion.button key={id} onClick={() => scrollTo(id)} className="text-2xl tracking-widest" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#E8D5C4" : "#3D2B2B" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
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

      <WaveDivider dark={dark} />

      <TimelineSection dark={dark} milestones={milestones} />

      <WaveDivider flip dark={dark} />

      <DiarySection dark={dark} diaryEntries={diaryEntries} />

      <WaveDivider dark={dark} />

      <GallerySection dark={dark} galleryItems={galleryItems} />

      <WaveDivider flip dark={dark} />

      <LettersSection dark={dark} loveLetters={loveLetters} />

      <WaveDivider dark={dark} />

      {/* ═══════════ MESSAGE BOARD ═══════════ */}
      <section id="messages" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-16">
            <MessageCircle className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Message Board</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>留言板</p>
          </motion.div>
          <MessageBoard dark={dark} messages={messages} onAddMessage={handleAddMessage} />
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-16 px-6 text-center" style={{ background: dark ? "linear-gradient(180deg, #13101A, #1A1520)" : "linear-gradient(180deg, #FFFBF7, #FFF0ED)" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C48181)" }} />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Heart className="w-4 h-4 fill-current" style={{ color: "#C48181" }} />
            </motion.div>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C48181)" }} />
          </div>
          <p className="text-xs tracking-widest" style={{ color: dark ? "#504040" : "#BFA0A0" }}>MADE WITH LOVE</p>
          <p className="text-xs mt-2" style={{ color: dark ? "#403535" : "#D4C0C0" }}>{new Date().getFullYear()} · Our Love Story</p>
        </motion.div>
      </footer>

      <MusicToggle dark={dark} />
    </div>
  );
}
