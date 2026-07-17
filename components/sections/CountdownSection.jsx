"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { FlipCard } from "@/components/ui";

export default function CountdownSection({ dark, startDate, time }) {
  return (
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
  );
}
