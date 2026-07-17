"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "@/components/ui";

/* ── Gallery item with blur-to-clear reveal ── */
function GalleryItem({ item, i, onClick }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), i * 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [i]);

  return (
    <motion.div
      ref={ref}
      className="mb-3 md:mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: i * 0.05 }}
    >
      <div
        className="overflow-hidden transition-all duration-[1.5s] ease-out"
        style={{
          filter: revealed ? "blur(0px) brightness(1)" : "blur(20px) brightness(0.7)",
          transform: revealed ? "scale(1)" : "scale(1.03)",
          height: item.h || 240,
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.caption || ""}
            className="w-full h-full object-cover film-grade"
            style={{ display: "block" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--c-surface)" }}
          >
            <div
              className="w-full h-full"
              style={{
                background: item.gradient,
                opacity: 0.4,
                filter: "saturate(0.5) brightness(0.6)",
              }}
            />
          </div>
        )}
      </div>

      {/* Hover overlay with caption */}
      {item.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
        >
          <p className="text-xs text-white/70" style={{ fontFamily: "var(--font-cn)" }}>
            {item.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function GallerySection({ galleryItems }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="relative py-28 md:py-40 px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader enTitle="Our Gallery" cnTitle="我们的相册" />

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
          {galleryItems.map((item, i) => (
            <GalleryItem
              key={i}
              item={item}
              i={i}
              onClick={() => setLightbox(i)}
            />
          ))}
        </div>

        {!galleryItems.some((item) => item.image_url) && (
          <p className="text-center text-xs mt-12 tracking-wider" style={{ color: "var(--c-text-muted)" }}>
            * 替换为你们的真实照片
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
            <motion.div
              className="w-full max-w-3xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightbox].image_url ? (
                <img
                  src={galleryItems[lightbox].image_url}
                  alt={galleryItems[lightbox].caption || ""}
                  className="w-full"
                  style={{ display: "block", maxHeight: "70vh", objectFit: "contain", background: "#000" }}
                />
              ) : (
                <div
                  style={{
                    background: galleryItems[lightbox].gradient,
                    height: "60vh",
                    opacity: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              )}
              {galleryItems[lightbox].caption && (
                <div className="p-5 text-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <p className="text-sm text-white/60" style={{ fontFamily: "var(--font-cn)" }}>
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
