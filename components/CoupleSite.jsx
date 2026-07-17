"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BookOpen,
  Camera,
  Mail,
  ChevronDown,
  X,
  MapPin,
  Star,
  Music,
  Gift,
  Sparkles,
  Clock,
} from "lucide-react";

/* ──────────────────────────────────────────────
   DATA — 替换成你们自己的故事
   ────────────────────────────────────────────── */

const startDate = new Date("2024-02-14");

const milestones = [
  { date: "2024.02.14", title: "初次相遇", desc: "在朋友的聚会上，人潮中一眼就看到了你", icon: "star" },
  { date: "2024.03.08", title: "第一次约会", desc: "那家咖啡馆的拿铁很好喝，但你的笑容更好", icon: "heart" },
  { date: "2024.05.20", title: "在一起", desc: "你点头的那一刻，整个世界都亮了", icon: "sparkles" },
  { date: "2024.08.15", title: "第一次旅行", desc: "一起看了海，说了好多好多的话", icon: "map" },
  { date: "2024.12.25", title: "第一个圣诞节", desc: "最好的礼物不是树下的，是身边的", icon: "gift" },
  { date: "2025.02.14", title: "一周年", desc: "365天，每一天都比昨天更爱你", icon: "music" },
];

const diaryEntries = [
  { date: "2025.06.15", title: "今天的晚霞", text: "傍晚散步的时候，天边出现了很美的晚霞。第一反应是拍给你看，才发现你就在身边。原来最美的风景，一直就在身旁。", tag: "日常" },
  { date: "2025.06.10", title: "一起做晚饭", text: "你切菜我炒菜，厨房里弥漫着饭菜香和你身上的味道。这样平凡的日常，却是我最珍贵的幸福。", tag: "日常" },
  { date: "2025.05.28", title: "下雨天", text: "突然下起了大雨，你撑伞跑过来接我。伞不大，你半边肩膀都淋湿了，却笑着说没事。那一刻，心又动了一次。", tag: "心动" },
  { date: "2025.05.20", title: "一周年倒计时", text: "还有十个月就到一周年了。已经开始在想怎么庆祝，但其实和你在一起的每一天，都值得庆祝。", tag: "纪念" },
  { date: "2025.05.01", title: "逛宜家", text: "一起逛宜家，想象着未来家的样子。你坐在沙发上说'这个好舒服'，我在旁边偷偷笑了——因为我想的是'我们的家'。", tag: "日常" },
  { date: "2025.04.18", title: "深夜电话", text: "凌晨两点睡不着，打给你。你迷迷糊糊地接了，声音软软的。那一刻觉得，世界上最安心的声音就是你的声音。", tag: "心动" },
];

const galleryGradients = [
  "linear-gradient(135deg, #f8b4b4 0%, #fda4af 50%, #fb7185 100%)",
  "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)",
  "linear-gradient(135deg, #fcd6bb 0%, #fdba74 50%, #fb923c 100%)",
  "linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)",
  "linear-gradient(135deg, #f9a8d4 0%, #f472b6 50%, #ec4899 100%)",
  "linear-gradient(135deg, #bef264 0%, #a3e635 50%, #84cc16 100%)",
  "linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f59e0b 100%)",
  "linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%)",
];

const loveLetters = [
  {
    title: "给你的一封情书",
    text: "亲爱的，\n\n写这封信的时候，窗外正下着小雨。想起第一次见你的那天，也是这样的天气。你笑着跟我打招呼，我的心就那样不争气地跳快了。\n\n谢谢你出现在我的生命里，让每一个平凡的日子都变得闪闪发光。\n\n永远爱你的人",
  },
  {
    title: "谢谢你",
    text: "谢谢你，在我加班到很晚的时候给我送夜宵。谢谢你，记住我随口说的小事。谢谢你，在我心情不好的时候安静地陪着我。\n\n你做的每一件小事，我都记在心里。这些点点滴滴的温暖，汇聚成了我最珍贵的幸福。",
  },
  {
    title: "关于未来",
    text: "我想象的未来里，每一个画面都有你。\n\n早上一起喝咖啡，晚上一起散步。周末去没去过的地方逛逛，节假日回老家看爸妈。\n\n不需要轰轰烈烈，只要有你，平平淡淡就是最好的日子。",
  },
];

const iconMap = { star: Star, heart: Heart, sparkles: Sparkles, map: MapPin, gift: Gift, music: Music };

/* ──────────────────────────────────────────────
   ANIMATION
   ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */

export default function CoupleSite() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeLetter, setActiveLetter] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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
  }, []);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* helpers */
  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
        background: "#FFFBF7",
        color: "#3D2B2B",
      }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700&display=swap');`}</style>

      {/* ═══════════ NAVIGATION ═══════════ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{
          background: scrolled ? "rgba(255,251,247,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(196,129,129,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => smoothScroll("hero")} className="flex items-center gap-2 group">
            <Heart className="w-4 h-4 fill-current transition-transform group-hover:scale-110" style={{ color: "#C48181" }} />
            <span
              className="text-lg tracking-widest"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}
            >
              OUR STORY
            </span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase">
            {[
              ["timer", "计时"],
              ["timeline", "时间线"],
              ["diary", "日记"],
              ["gallery", "相册"],
              ["letters", "情书"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => smoothScroll(id)}
                className="transition-colors hover:opacity-70"
                style={{ color: "#9B7070" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #FFF5F5 0%, #FFE4E1 35%, #FDDCDC 65%, #FFF0F5 100%)" }}
      >
        {/* ambient glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "10%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(212,163,139,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "40vw",
            height: "40vw",
            bottom: "5%",
            left: "-8%",
            background: "radial-gradient(circle, rgba(196,129,129,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* floating hearts */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${8 + i * 9}%` }}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-15vh", opacity: [0, 0.35, 0.35, 0] }}
            transition={{
              duration: 10 + i * 2.5,
              repeat: Infinity,
              delay: i * 1.8,
              ease: "linear",
            }}
          >
            <Heart
              className="fill-current"
              style={{ width: 10 + i * 3, height: 10 + i * 3, color: `rgba(196,129,129,${0.15 + (i % 4) * 0.08})` }}
            />
          </motion.div>
        ))}

        {/* content */}
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            {/* decorative line */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #C48181)" }} />
              <Heart className="w-3.5 h-3.5 fill-current" style={{ color: "#C48181" }} />
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #C48181)" }} />
            </div>

            <h1
              className="text-6xl md:text-8xl lg:text-9xl leading-none mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}
            >
              Our Love
            </h1>
            <h2
              className="text-3xl md:text-5xl mb-8"
              style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "#5C4040" }}
            >
              我们的爱情故事
            </h2>

            <p className="text-base md:text-lg mb-14 max-w-md mx-auto leading-relaxed" style={{ color: "#9B7070" }}>
              记录属于我们的每一个瞬间
              <br />
              从相遇到相守，从此刻到永远
            </p>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer"
              onClick={() => smoothScroll("timer")}
            >
              <ChevronDown className="w-5 h-5 mx-auto" style={{ color: "#C48181" }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COUNTDOWN ═══════════ */}
      <section id="timer" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
            <Clock className="w-5 h-5 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "#9B7070" }}>
              Since {startDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </h3>
            <p className="text-2xl md:text-3xl mb-14" style={{ fontFamily: "'Noto Serif SC', serif", color: "#5C4040" }}>
              在一起的第 <span style={{ color: "#C48181", fontWeight: 600 }}>{time.days}</span> 天
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            {[
              { value: time.days, label: "天" },
              { value: time.hours, label: "时" },
              { value: time.minutes, label: "分" },
              { value: time.seconds, label: "秒" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-2xl py-6 md:py-8 px-2"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196,129,129,0.1)",
                  boxShadow: "0 4px 24px rgba(196,129,129,0.06)",
                }}
                whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(196,129,129,0.12)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className="text-3xl md:text-5xl mb-1 tabular-nums"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#3D2B2B" }}
                >
                  {item.value}
                </div>
                <div className="text-xs tracking-widest" style={{ color: "#9B7070" }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TIMELINE ═══════════ */}
      <section id="timeline" className="py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <Heart className="w-4 h-4 mx-auto mb-4 fill-current" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}>
              Our Timeline
            </h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: "#9B7070" }}>
              时间线
            </p>
          </motion.div>

          <div className="relative">
            {/* center line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
              style={{ background: "linear-gradient(180deg, transparent, #C48181 10%, #C48181 90%, transparent)" }}
            />
            {/* mobile line */}
            <div
              className="absolute left-5 top-0 bottom-0 w-px md:hidden"
              style={{ background: "linear-gradient(180deg, transparent, #C48181 5%, #C48181 95%, transparent)" }}
            />

            {milestones.map((m, i) => {
              const Icon = iconMap[m.icon] || Heart;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative mb-12 md:mb-16 flex items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* desktop card */}
                  <div className={`hidden md:block w-5/12 ${isLeft ? "pr-10 text-right" : "pl-10 text-left"}`}>
                    <motion.div
                      className="rounded-2xl p-6 inline-block"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(196,129,129,0.08)",
                        boxShadow: "0 4px 20px rgba(196,129,129,0.05)",
                      }}
                      whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(196,129,129,0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "#D4A38B" }}>
                        {m.date}
                      </div>
                      <h4 className="text-xl mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "#3D2B2B" }}>
                        {m.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: "#9B7070" }}>
                        {m.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                    style={{ background: "#FFFBF7", border: "2px solid #C48181" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#C48181" }} />
                  </div>

                  {/* mobile card */}
                  <div className="md:hidden pl-14">
                    <div
                      className="rounded-xl p-5"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(196,129,129,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: "#C48181" }} />
                        <span className="text-xs tracking-widest" style={{ color: "#D4A38B" }}>
                          {m.date}
                        </span>
                      </div>
                      <h4 className="text-lg mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "#3D2B2B" }}>
                        {m.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: "#9B7070" }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ DIARY ═══════════ */}
      <section id="diary" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <BookOpen className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}>
              Love Diary
            </h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: "#9B7070" }}>
              恋爱日记
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diaryEntries.map((entry, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-7 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(196,129,129,0.08)",
                  boxShadow: "0 4px 20px rgba(196,129,129,0.05)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(196,129,129,0.12)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-widest" style={{ color: "#D4A38B" }}>
                    {entry.date}
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(196,129,129,0.1)", color: "#C48181" }}
                  >
                    {entry.tag}
                  </span>
                </div>
                <h4 className="text-lg mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "#3D2B2B" }}>
                  {entry.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#7A6060" }}>
                  {entry.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <section
        id="gallery"
        className="py-24 md:py-32 px-6"
        style={{ background: "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <Camera className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}>
              Our Gallery
            </h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: "#9B7070" }}>
              我们的相册
            </p>
          </motion.div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {galleryGradients.map((g, i) => (
              <motion.div
                key={i}
                className="mb-4 rounded-xl overflow-hidden cursor-pointer break-inside-avoid"
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
              >
                <div
                  style={{
                    background: g,
                    height: [180, 240, 200, 260, 190, 220, 250, 210][i],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera className="w-6 h-6" style={{ color: "rgba(255,255,255,0.35)" }} />
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: "#BFA0A0" }}>
            * 替换为你们的真实照片
          </p>
        </div>

        {/* lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: "rgba(61,43,43,0.85)", backdropFilter: "blur(16px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            >
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onClick={() => setLightbox(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <motion.div
                className="w-full max-w-2xl rounded-2xl overflow-hidden"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    background: galleryGradients[lightbox],
                    height: "55vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera className="w-10 h-10" style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════ LOVE LETTERS ═══════════ */}
      <section id="letters" className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Mail className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#3D2B2B" }}>
              Love Letters
            </h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: "#9B7070" }}>
              情书
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            {/* tabs */}
            <div className="flex justify-center gap-3 mb-10">
              {loveLetters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLetter(i)}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: activeLetter === i ? "#C48181" : "rgba(196,129,129,0.2)",
                    transform: activeLetter === i ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            {/* letter card */}
            <div
              className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFFDF9 0%, #FFF8F0 100%)",
                border: "1px solid rgba(196,129,129,0.1)",
                boxShadow: "0 8px 40px rgba(196,129,129,0.08)",
              }}
            >
              {/* decorative corner */}
              <div
                className="absolute top-0 right-0 w-20 h-20"
                style={{ background: "linear-gradient(135deg, rgba(196,129,129,0.06) 0%, transparent 60%)" }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLetter}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <h4
                    className="text-xl md:text-2xl mb-6"
                    style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: "#3D2B2B" }}
                  >
                    {loveLetters[activeLetter].title}
                  </h4>
                  <p
                    className="text-base md:text-lg leading-loose whitespace-pre-line"
                    style={{ fontFamily: "'Noto Serif SC', serif", color: "#5C4040", lineHeight: 2 }}
                  >
                    {loveLetters[activeLetter].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-16 px-6 text-center" style={{ background: "linear-gradient(180deg, #FFFBF7 0%, #FFF0ED 100%)" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C48181)" }} />
            <Heart className="w-4 h-4 fill-current" style={{ color: "#C48181" }} />
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C48181)" }} />
          </div>
          <p className="text-xs tracking-widest" style={{ color: "#BFA0A0" }}>
            MADE WITH LOVE
          </p>
          <p className="text-xs mt-2" style={{ color: "#D4C0C0" }}>
            {new Date().getFullYear()} · Our Love Story
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
