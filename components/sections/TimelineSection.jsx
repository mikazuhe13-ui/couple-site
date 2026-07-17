"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { iconMap } from "@/lib/data";

export default function TimelineSection({ dark, milestones }) {
  return (
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
  );
}
