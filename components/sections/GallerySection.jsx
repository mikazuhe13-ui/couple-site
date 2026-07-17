"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";

export default function GallerySection({ dark, galleryItems }) {
  const [lightbox, setLightbox] = useState(null);

  return (
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
              <div style={{ background: item.image_url ? undefined : item.gradient, height: item.h, display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: item.image_url ? `url(${item.image_url})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!item.image_url && <Camera className="w-6 h-6" style={{ color: "rgba(255,255,255,0.3)" }} />}
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
              <div style={{ background: galleryItems[lightbox].image_url ? undefined : galleryItems[lightbox].gradient, height: "55vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: galleryItems[lightbox].image_url ? `url(${galleryItems[lightbox].image_url})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!galleryItems[lightbox].image_url && <Camera className="w-10 h-10" style={{ color: "rgba(255,255,255,0.3)" }} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
