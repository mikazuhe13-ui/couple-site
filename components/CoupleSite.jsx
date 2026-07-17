"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  Heart, BookOpen, Camera, Mail, ChevronDown, X, MapPin, Star,
  Music, Gift, Sparkles, Clock, Send, Moon, Sun, Menu, MessageCircle,
} from "lucide-react";

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */

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

const galleryItems = [
  { gradient: "linear-gradient(135deg, #f8b4b4, #fb7185)", h: 220 },
  { gradient: "linear-gradient(135deg, #c4b5fd, #8b5cf6)", h: 280 },
  { gradient: "linear-gradient(135deg, #fcd6bb, #fb923c)", h: 200 },
  { gradient: "linear-gradient(135deg, #67e8f9, #06b6d4)", h: 300 },
  { gradient: "linear-gradient(135deg, #f9a8d4, #ec4899)", h: 240 },
  { gradient: "linear-gradient(135deg, #bef264, #84cc16)", h: 260 },
  { gradient: "linear-gradient(135deg, #fde68a, #f59e0b)", h: 210 },
  { gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)", h: 290 },
];

const loveLetters = [
  { title: "给你的一封情书", text: "亲爱的，\n\n写这封信的时候，窗外正下着小雨。想起第一次见你的那天，也是这样的天气。你笑着跟我打招呼，我的心就那样不争气地跳快了。\n\n谢谢你出现在我的生命里，让每一个平凡的日子都变得闪闪发光。\n\n永远爱你的人" },
  { title: "谢谢你", text: "谢谢你，在我加班到很晚的时候给我送夜宵。谢谢你，记住我随口说的小事。谢谢你，在我心情不好的时候安静地陪着我。\n\n你做的每一件小事，我都记在心里。这些点点滴滴的温暖，汇聚成了我最珍贵的幸福。" },
  { title: "关于未来", text: "我想象的未来里，每一个画面都有你。\n\n早上一起喝咖啡，晚上一起散步。周末去没去过的地方逛逛，节假日回老家看爸妈。\n\n不需要轰轰烈烈，只要有你，平平淡淡就是最好的日子。" },
];

const iconMap = { star: Star, heart: Heart, sparkles: Sparkles, map: MapPin, gift: Gift, music: Music };

/* ══════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Falling Petals ── */
function Petals({ dark, count = 18 }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 16,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 15,
    opacity: dark ? 0.08 + Math.random() * 0.12 : 0.15 + Math.random() * 0.25,
    sway: 40 + Math.random() * 80,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: dark
              ? `rgba(196,129,129,${p.opacity})`
              : `rgba(255,182,193,${p.opacity})`,
            borderRadius: "50% 0 50% 0",
          }}
          initial={{ y: "-5%", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "105vh",
            x: [0, p.sway, -p.sway * 0.5, p.sway * 0.3, 0],
            rotate: [0, 180, 360, 540, 720],
            opacity: [0, p.opacity, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ── Click Ripple ── */
function Ripple({ x, y, onDone }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x - 20, top: y - 20 }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <Heart className="w-10 h-10 fill-current" style={{ color: "#C48181" }} />
    </motion.div>
  );
}

/* ── Flip Countdown Card ── */
function FlipCard({ value, label, dark }) {
  const prev = useRef(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true);
      prev.current = value;
      const t = setTimeout(() => setFlipping(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <motion.div
      className="rounded-2xl py-6 md:py-8 px-2 relative overflow-hidden"
      style={{
        background: dark ? "rgba(30,25,35,0.7)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${dark ? "rgba(196,129,129,0.15)" : "rgba(196,129,129,0.1)"}`,
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(196,129,129,0.06)",
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        animate={flipping ? { rotateX: [0, -90, 0], scale: [1, 0.95, 1] } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="text-3xl md:text-5xl mb-1 tabular-nums text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: dark ? "#E8D5C4" : "#3D2B2B" }}
        >
          {value}
        </div>
      </motion.div>
      <div className="text-xs tracking-widest text-center" style={{ color: dark ? "#9B8080" : "#9B7070" }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({ children, className, style, dark, ...props }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Wave Divider ── */
function WaveDivider({ flip, dark }) {
  const fill = dark ? "#13101A" : "#FFF5F0";
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} style={{ height: 60 }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z"
          fill={fill}
          initial={{ d: "M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z" }}
          animate={{ d: "M0,30 C240,5 480,55 720,30 C960,5 1200,55 1440,30 L1440,60 L0,60 Z" }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ── Music Toggle ── */
function MusicToggle({ dark }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: dark ? "rgba(30,25,35,0.8)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${dark ? "rgba(196,129,129,0.2)" : "rgba(196,129,129,0.15)"}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setPlaying(!playing)}
    >
      <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }}>
        <Music className="w-5 h-5" style={{ color: "#C48181" }} />
      </motion.div>
      {playing && (
        <div className="absolute -bottom-1 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "#C48181" }}
              animate={{ height: [3, 8, 3] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

/* ── Dark Mode Toggle ── */
function DarkToggle({ dark, setDark }) {
  return (
    <motion.button
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(196,129,129,0.08)" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85, rotate: 180 }}
      onClick={() => setDark(!dark)}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
            <Sun className="w-4 h-4" style={{ color: "#D4A38B" }} />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
            <Moon className="w-4 h-4" style={{ color: "#9B7070" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Message Board ── */
function MessageBoard({ dark }) {
  const [messages, setMessages] = useState([
    { name: "他", text: "遇见你是我最幸运的事", time: "刚刚" },
    { name: "她", text: "每一天都想对你说晚安", time: "1分钟前" },
  ]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setMessages((prev) => [{ name: name.trim() || "匿名", text, time: "刚刚" }, ...prev]);
    setText("");
    setName("");
  };

  const inputBase = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors`;
  const inputStyle = dark
    ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(196,129,129,0.15)", color: "#E8D5C4" }
    : { background: "rgba(255,255,255,0.5)", border: "1px solid rgba(196,129,129,0.1)", color: "#3D2B2B" };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: dark ? "rgba(30,25,35,0.5)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${dark ? "rgba(196,129,129,0.12)" : "rgba(196,129,129,0.08)"}`,
        }}
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      >
        <div className="flex gap-3 mb-6">
          <input placeholder="你的名字" value={name} onChange={(e) => setName(e.target.value)} className={inputBase} style={{ ...inputStyle, maxWidth: 120 }} />
          <input placeholder="写下你想说的话..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} className={inputBase} style={inputStyle} />
          <motion.button
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center self-center"
            style={{ background: "#C48181" }}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
            onClick={add}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.time}-${i}`}
                className="rounded-xl p-4"
                style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "#C48181" }}>{m.name}</span>
                  <span className="text-xs" style={{ color: dark ? "#706060" : "#BFA0A0" }}>{m.time}</span>
                </div>
                <p className="text-sm" style={{ color: dark ? "#B0A0A0" : "#7A6060" }}>{m.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */

export default function CoupleSite() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeLetter, setActiveLetter] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ripples, setRipples] = useState([]);

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
  }, []);

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

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, background: dark ? "linear-gradient(160deg, #1A1520 0%, #201828 50%, #1A1520 100%)" : "linear-gradient(160deg, #FFF5F5 0%, #FFE4E1 35%, #FDDCDC 65%, #FFF0F5 100%)" }} />
        <Petals dark={dark} count={dark ? 12 : 18} />
        <div className="absolute rounded-full" style={{ width: "50vw", height: "50vw", top: "10%", right: "-10%", background: `radial-gradient(circle, ${dark ? "rgba(196,129,129,0.06)" : "rgba(212,163,139,0.12)"} 0%, transparent 70%)`, filter: "blur(40px)" }} />

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <div className="flex items-center justify-center gap-4 mb-10">
              <motion.div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #C48181)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} />
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.3, type: "spring" }}>
                <Heart className="w-4 h-4 fill-current" style={{ color: "#C48181" }} />
              </motion.div>
              <motion.div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #C48181)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} />
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>
              Our Love
            </h1>
            <h2 className="text-3xl md:text-5xl mb-8" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: dark ? "#B0A0A0" : "#5C4040" }}>
              我们的爱情故事
            </h2>
            <p className="text-base md:text-lg mb-14 max-w-md mx-auto leading-relaxed" style={{ color: dark ? "#807070" : "#9B7070" }}>
              记录属于我们的每一个瞬间<br />从相遇到相守，从此刻到永远
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="cursor-pointer" onClick={() => scrollTo("timer")}>
              <ChevronDown className="w-5 h-5 mx-auto" style={{ color: "#C48181" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ COUNTDOWN ═══════════ */}
      <section id="timer" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : undefined }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <Clock className="w-5 h-5 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: dark ? "#807070" : "#9B7070" }}>
              Since {startDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </h3>
            <p className="text-2xl md:text-3xl mb-14" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#B0A0A0" : "#5C4040" }}>
              在一起的第 <span style={{ color: "#C48181", fontWeight: 600 }}>{time.days}</span> 天
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[{ value: time.days, label: "天" }, { value: time.hours, label: "时" }, { value: time.minutes, label: "分" }, { value: time.seconds, label: "秒" }].map((item, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <FlipCard value={item.value} label={item.label} dark={dark} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider dark={dark} />

      {/* ═══════════ TIMELINE ═══════════ */}
      <section id="timeline" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-20">
            <Heart className="w-4 h-4 mx-auto mb-4 fill-current" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Our Timeline</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>时间线</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: "linear-gradient(180deg, transparent, #C48181 10%, #C48181 90%, transparent)" }} />
            <div className="absolute left-5 top-0 bottom-0 w-px md:hidden" style={{ background: "linear-gradient(180deg, transparent, #C48181 5%, #C48181 95%, transparent)" }} />

            {milestones.map((m, i) => {
              const Icon = iconMap[m.icon] || Heart;
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={i} className={`relative mb-12 md:mb-16 flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50, rotateY: isLeft ? -5 : 5 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className={`hidden md:block w-5/12 ${isLeft ? "pr-10 text-right" : "pl-10 text-left"}`}>
                    <motion.div className="rounded-2xl p-6 inline-block"
                      style={{ background: dark ? "rgba(30,25,35,0.6)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${dark ? "rgba(196,129,129,0.1)" : "rgba(196,129,129,0.08)"}` }}
                      whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(196,129,129,0.1)" }} transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "#D4A38B" }}>{m.date}</div>
                      <h4 className="text-xl mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>{m.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: dark ? "#9B8080" : "#9B7070" }}>{m.desc}</p>
                    </motion.div>
                  </div>
                  <motion.div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                    style={{ background: dark ? "#1A1520" : "#FFFBF7", border: "2px solid #C48181" }}
                    whileInView={{ scale: [0, 1.2, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#C48181" }} />
                  </motion.div>
                  <div className="md:hidden pl-14">
                    <div className="rounded-xl p-5" style={{ background: dark ? "rgba(30,25,35,0.6)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${dark ? "rgba(196,129,129,0.1)" : "rgba(196,129,129,0.08)"}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: "#C48181" }} />
                        <span className="text-xs tracking-widest" style={{ color: "#D4A38B" }}>{m.date}</span>
                      </div>
                      <h4 className="text-lg mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>{m.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: dark ? "#9B8080" : "#9B7070" }}>{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider flip dark={dark} />

      {/* ═══════════ DIARY ═══════════ */}
      <section id="diary" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : undefined }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-20">
            <BookOpen className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Love Diary</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>恋爱日记</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diaryEntries.map((entry, i) => (
              <TiltCard key={i} dark={dark}
                className="rounded-2xl p-7 cursor-default"
                style={{ background: dark ? "rgba(30,25,35,0.5)" : "rgba(255,255,255,0.6)", backdropFilter: "blur(10px)", border: `1px solid ${dark ? "rgba(196,129,129,0.1)" : "rgba(196,129,129,0.08)"}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.15)" : "0 4px 20px rgba(196,129,129,0.05)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-widest" style={{ color: "#D4A38B" }}>{entry.date}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: "rgba(196,129,129,0.12)", color: "#C48181" }}>{entry.tag}</span>
                </div>
                <h4 className="text-lg mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>{entry.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: dark ? "#9B8080" : "#7A6060" }}>{entry.text}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider dark={dark} />

      {/* ═══════════ GALLERY ═══════════ */}
      <section id="gallery" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-20">
            <Camera className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Our Gallery</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>我们的相册</p>
          </motion.div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {galleryItems.map((item, i) => (
              <motion.div key={i} className="mb-4 rounded-xl overflow-hidden cursor-pointer break-inside-avoid"
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.85, rotate: (i % 2 === 0 ? -2 : 2) }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? 1 : -1 }}
              >
                <div style={{ background: item.gradient, height: item.h, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera className="w-6 h-6" style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: dark ? "#504040" : "#BFA0A0" }}>* 替换为你们的真实照片</p>
        </div>
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}
            >
              <button className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }} onClick={() => setLightbox(null)}>
                <X className="w-5 h-5 text-white" />
              </button>
              <motion.div className="w-full max-w-2xl rounded-2xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0, rotate: -3 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }} onClick={(e) => e.stopPropagation()}
              >
                <div style={{ background: galleryItems[lightbox].gradient, height: "55vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera className="w-10 h-10" style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <WaveDivider flip dark={dark} />

      {/* ═══════════ LOVE LETTERS ═══════════ */}
      <section id="letters" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : undefined }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-16">
            <Mail className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Love Letters</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>情书</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}>
            <div className="flex justify-center gap-3 mb-10">
              {loveLetters.map((_, i) => (
                <motion.button key={i} onClick={() => setActiveLetter(i)} className="w-2.5 h-2.5 rounded-full"
                  animate={{ background: activeLetter === i ? "#C48181" : (dark ? "rgba(196,129,129,0.2)" : "rgba(196,129,129,0.2)"), scale: activeLetter === i ? 1.3 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
            <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
              style={{ background: dark ? "linear-gradient(145deg, #1E1925, #1A1520)" : "linear-gradient(145deg, #FFFDF9, #FFF8F0)", border: `1px solid ${dark ? "rgba(196,129,129,0.1)" : "rgba(196,129,129,0.1)"}`, boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.2)" : "0 8px 40px rgba(196,129,129,0.08)" }}
            >
              <div className="absolute top-0 right-0 w-20 h-20" style={{ background: "linear-gradient(135deg, rgba(196,129,129,0.06), transparent 60%)" }} />
              <AnimatePresence mode="wait">
                <motion.div key={activeLetter} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                  <h4 className="text-xl md:text-2xl mb-6" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>{loveLetters[activeLetter].title}</h4>
                  <p className="text-base md:text-lg whitespace-pre-line" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#B0A0A0" : "#5C4040", lineHeight: 2 }}
                  >{loveLetters[activeLetter].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider dark={dark} />

      {/* ═══════════ MESSAGE BOARD ═══════════ */}
      <section id="messages" className="py-24 md:py-32 px-6" style={{ background: dark ? "#13101A" : "linear-gradient(180deg, #FFF5F0 0%, #FFFBF7 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-center mb-16">
            <MessageCircle className="w-4 h-4 mx-auto mb-4" style={{ color: "#D4A38B" }} />
            <h3 className="text-3xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: dark ? "#E8D5C4" : "#3D2B2B" }}>Message Board</h3>
            <p className="text-xl" style={{ fontFamily: "'Noto Serif SC', serif", color: dark ? "#807070" : "#9B7070" }}>留言板</p>
          </motion.div>
          <MessageBoard dark={dark} />
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
