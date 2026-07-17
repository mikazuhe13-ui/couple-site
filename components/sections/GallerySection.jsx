"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Camera, X } from "lucide-react";
import { SectionHeader } from "@/components/ui";

/* ── Single gallery item with scroll parallax + 3D tilt ── */
function GalleryItem({ item, i, dark, onClick }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: each item moves at a slightly different rate
  const direction = i % 2 === 0 ? 1 : -1;
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60 * direction, -60 * direction]);
  const smoothParallax = useSpring(parallaxY, { stiffness: 80, damping: 20 });

  // Scale based on scroll position (grow as it enters viewport)
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.92]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  // 3D tilt on mouse move
  const tiltX = useSpring(0, { stiffness: 150, damping: 25 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 25 });
  const glareX = useSpring(50, { stiffness: 100, damping: 20 });
  const glareY = useSpring(50, { stiffness: 100, damping: 20 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(ny * -10);
    tiltY.set(nx * 10);
    glareX.set((nx + 0.5) * 100);
    glareY.set((ny + 0.5) * 100);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      className="mb-4 md:mb-5 break-inside-avoid"
      style={{ scale: smoothScale }}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="rounded-2xl overflow-hidden cursor-pointer group relative"
        style={{
          y: smoothParallax,
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 800,
          background: dark ? "#2A2025" : "#F5F0EB",
          border: dark ? "1px solid rgba(194,146,138,0.1)" : "1px solid rgba(194,146,138,0.15)",
          boxShadow: dark
            ? "0 8px 32px rgba(0,0,0,0.25)"
            : "0 8px 32px rgba(194,146,138,0.08)",
        }}
        onClick={onClick}
        onMouseMove={handleMouse}
        onMouseLeave={resetTilt}
        whileHover={{ boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(194,146,138,0.18)" }}
        transition={{ duration: 0.4 }}
      >
        {item.image_url ? (
          <div
            className="overflow-hidden transition-transform duration-700 group-hover:scale-110"
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

        {/* 3D glare overlay */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ background: glareBg }}
        />

        {/* hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
          <div
            className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.5))" }}
          >
            <p className="text-xs text-white/80 text-center" style={{ fontFamily: "var(--font-cn)" }}>
              {item.caption}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GallerySection({ dark, galleryItems }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section
      id="gallery"
      className="relative py-28 md:py-40 px-6 overflow-hidden"
      style={{
        background: dark
          ? "linear-gradient(180deg, var(--c-dark-bg), #1E1520, var(--c-dark-bg))"
          : "linear-gradient(180deg, #FFF5F0, #FFFAF5, #FFF5F0)",
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader icon={Camera} enTitle="Our Gallery" cnTitle="我们的相册" dark={dark} />

        {/* masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5">
          {galleryItems.map((item, i) => (
            <GalleryItem
              key={i}
              item={item}
              i={i}
              dark={dark}
              onClick={() => setLightbox(i)}
            />
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
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)" }}
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
              initial={{ scale: 0.7, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateX: -15 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              style={{ transformPerspective: 1200 }}
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
