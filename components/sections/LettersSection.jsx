"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

export default function LettersSection({ dark, loveLetters }) {
  const [activeLetter, setActiveLetter] = useState(0);

  return (
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
  );
}
