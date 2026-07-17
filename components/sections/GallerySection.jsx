"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import useIsMobile from "@/hooks/useIsMobile";

/* ══════════════════════════════════════════
   GalleryItem — 3D tilt on mouse + elegant frame
   ══════════════════════════════════════════ */
function GalleryItem({ item, i, onClick, isMobile }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  /* Reveal on scroll */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), isMobile ? i * 40 : i * 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [i, isMobile]);

  /* 3D tilt on mouse move (desktop only) */
  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxTilt = 8;
      const ry = ((x - cx) / cx) * maxTilt;
      const rx = -((y - cy) / cy) * maxTilt;
      setTilt({ rx, ry, scale: 1.03 });
      setGlare({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.15,
      });
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
    setGlare((g) => ({ ...g, opacity: 0 }));
  }, []);

  /* Mobile: full-width edge-to-edge, taller */
  const mobileHeight = i % 3 === 0 ? 280 : i % 3 === 1 ? 220 : 260;

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${
        isMobile
          ? "w-full mb-2 rounded-none"
          : "mb-5 md:mb-6 break-inside-avoid"
      }`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isMobile ? 0.4 : 0.6, delay: i * 0.03 }}
      style={
        !isMobile
          ? {
              perspective: "800px",
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      {/* ─ Elegant gold frame wrapper ── */}
      <div
        className="relative"
        style={
          !isMobile
            ? {
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
              }
            : undefined
        }
      >
        {/* Outer gold border */}
        <div
          className="overflow-hidden"
          style={{
            padding: isMobile ? 0 : "6px",
            background: "linear-gradient(145deg, #D4AF6E, #C9A050, #E8D5A3, #B8963E)",
            borderRadius: isMobile ? 0 : "3px",
            boxShadow: isMobile
              ? "none"
              : "0 8px 32px rgba(180,150,100,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Inner thin line */}
          <div
            style={{
              padding: isMobile ? 0 : "2px",
              background: "linear-gradient(145deg, #F5E6C8, #E8D5A3)",
              borderRadius: isMobile ? 0 : "2px",
            }}
          >
            {/* Image container */}
            <div
              className="overflow-hidden transition-all ease-out"
              style={{
                filter: revealed
                  ? "blur(0px) brightness(1)"
                  : isMobile
                    ? "blur(10px) brightness(1.1)"
                    : "blur(20px) brightness(1.15)",
                transform: revealed ? "scale(1)" : "scale(1.02)",
                height: isMobile ? mobileHeight : item.h || 240,
                transitionDuration: isMobile ? "800ms" : "1500ms",
                borderRadius: isMobile ? 0 : "1px",
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.caption || ""}
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                  loading="lazy"
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
                      filter: "saturate(0.8) brightness(0.95)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Glare overlay — follows mouse */}
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
              transition: "opacity 0.3s",
              borderRadius: "3px",
              zIndex: 5,
            }}
          />
        )}
      </div>

      {/* Caption overlay */}
      {item.caption && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 ${
            isMobile
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          } transition-opacity duration-500`}
          style={{
            background: "linear-gradient(transparent, rgba(60,40,30,0.55))",
            zIndex: 6,
          }}
        >
          <p className="text-xs text-white/80" style={{ fontFamily: "var(--font-cn)" }}>
            {item.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   GallerySection
   ══════════════════════════════════════════ */
export default function GallerySection({ galleryItems }) {
  const [lightbox, setLightbox] = useState(null);
  const isMobile = useIsMobile();

  return (
    <section
      id="gallery"
      className={`relative z-10 ${
        isMobile ? "py-16 px-0" : "py-28 md:py-40 px-6"
      }`}
    >
      <div className={`${isMobile ? "px-5" : "max-w-6xl mx-auto"}`}>
        <SectionHeader enTitle="Our Gallery" cnTitle="我们的相册" />

        {isMobile ? (
          /* ── Mobile: single-column vertical scroll ── */
          <div className="flex flex-col">
            {galleryItems.map((item, i) => (
              <GalleryItem
                key={i}
                item={item}
                i={i}
                isMobile={isMobile}
                onClick={() => setLightbox(i)}
              />
            ))}
          </div>
        ) : (
          /* ── Desktop: masonry columns with 3D tilt ── */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5">
            {galleryItems.map((item, i) => (
              <GalleryItem
                key={i}
                item={item}
                i={i}
                isMobile={isMobile}
                onClick={() => setLightbox(i)}
              />
            ))}
          </div>
        )}

        {!galleryItems.some((item) => item.image_url) && (
          <p className="text-center text-xs mt-12 tracking-wider" style={{ color: "var(--c-text-muted)" }}>
            * 替换为你们的真实照片
          </p>
        )}
      </div>

      {/* ═══════════ Lightbox ═══════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center ${
              isMobile ? "p-0" : "p-6"
            }`}
            style={{
              background: "rgba(255,251,245,0.95)",
              backdropFilter: isMobile ? "none" : "blur(20px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className={`absolute z-10 flex items-center justify-center ${
                isMobile
                  ? "top-4 right-4 w-9 h-9"
                  : "top-6 right-6 w-10 h-10"
              }`}
              style={{ border: "1px solid rgba(61,43,43,0.15)" }}
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            >
              <X className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} style={{ color: "var(--c-warm-muted)" }} />
            </button>
            <motion.div
              className={`overflow-hidden ${
                isMobile ? "w-full h-full flex flex-col" : "w-full max-w-3xl"
              }`}
              initial={{ scale: isMobile ? 0.95 : 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: isMobile ? 0.95 : 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightbox].image_url ? (
                <img
                  src={galleryItems[lightbox].image_url}
                  alt={galleryItems[lightbox].caption || ""}
                  className={`w-full ${isMobile ? "flex-1" : ""}`}
                  style={{
                    display: "block",
                    maxHeight: isMobile ? "none" : "70vh",
                    objectFit: isMobile ? "contain" : "contain",
                    background: "#FFFBF5",
                  }}
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
                <div
                  className={`text-center ${isMobile ? "px-5 py-4" : "p-5"}`}
                  style={{ background: "rgba(255,240,230,0.6)" }}
                >
                  <p className="text-sm" style={{ fontFamily: "var(--font-cn)", color: "var(--c-text-secondary)" }}>
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
