"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { TiltCard } from "@/components/ui";

export default function DiarySection({ dark, diaryEntries }) {
  return (
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
  );
}
