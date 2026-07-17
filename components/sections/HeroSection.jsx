"use client";

import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { Petals } from "@/components/ui";

export default function HeroSection({ dark, scrollTo, heroY, heroOpacity }) {
  return (
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
  );
}
