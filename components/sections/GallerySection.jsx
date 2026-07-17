"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import { SectionHeader } from "@/components/ui";

export default function GallerySection({ dark, galleryItems }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="relative py-28 md:py-40 px-6 overflow-hidden" style={{
      background: dark
        ? "linear-gradient(180deg, var(--c-dark-bg), #1E1520, var(--c-dark-bg))"
        : "linear-gradient(180deg, #FFF5F0, #FFFAF5, #FFF5F0)",
    }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader icon={Camera} enTitle="Our Gallery" cnTitle="我们的相册" dark={dark} />

        {/* masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              className="mb-4 md:mb-5 rounded-2xl overflow-hidden cursor-pointer break-inside-avoid group"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden rounded-2xl" style={{ background: dark ? "#2A2025" : "#F5F0EB", border: dark ? "1px solid rgba(194,146,138,0.1)" : "1px solid rgba(194,146,138,0.15)" }}>
                {item.image_url ? (
                  <div
                    className="transition-transform duration-700 group-hover:scale-110 overflow-hidden"
                    style={{ height: item.h || 240 }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.caption || ""}
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    className="transition-transform duration-700 group-hover:scale-110"
                    style={{
                      background: item.gradient,
                      height: item.h || 240,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera className="w-6 h-6" style={{ color: "rgba(255,255,255,0.25)" }} />
                  </div>
                )}
                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "rgba(45,36,36,0.3)", backdropFilter: "blur(4px)" }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
                {/* caption */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.5))" }}
                  >
                    <p className="text-xs text-white/80 text-center" style={{ fontFamily: "var(--font-cn)" }}>
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {!galleryItems.some((item) => item.image_url) && (
          <p className="text-center text-xs mt-10 tracking-wider" style={{ color: "var(--c-text-muted)" }}>
            * 替换为你们的真实照片
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
            <motion.div
              className="w-full max-w-3xl rounded-3xl overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightbox].image_url ? (
                <img
                  src={galleryItems[lightbox].image_url}
                  alt={galleryItems[lightbox].caption || ""}
                  className="w-full"
                  style={{ display: "block", maxHeight: "60vh", objectFit: "contain", background: dark ? "#1A1218" : "#000" }}
                />
              ) : (
                <div
                  style={{
                    background: galleryItems[lightbox].gradient,
                    height: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera className="w-10 h-10" style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              )}
              {galleryItems[lightbox].caption && (
                <div className="p-5 text-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-cn)" }}>
                    {galleryItems[lightbox].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
