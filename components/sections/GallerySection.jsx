"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import useIsMobile from "@/hooks/useIsMobile";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import MobileGalleryRail from "@/components/gallery/MobileGalleryRail";
import SpatialGallery from "@/components/gallery/SpatialGallery";

export default function GallerySection({ galleryItems = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => setMounted(true), []);

  if (!galleryItems.length) return null;

  return (
    <section id="gallery" className="relative z-10 overflow-hidden px-5 py-20 md:px-6 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader enTitle="Our Gallery" cnTitle="我们的相册" />

        <motion.p
          className="mx-auto -mt-5 mb-10 max-w-xl text-center text-xs leading-7 tracking-[0.16em] md:-mt-12 md:mb-16 md:text-sm"
          style={{ color: "var(--c-text-secondary)", fontFamily: "var(--font-cn)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          每一帧时光，都被温柔珍藏
        </motion.p>

        {!mounted ? (
          <div
            className="min-h-[620px] rounded-[2.25rem] border md:min-h-[880px]"
            style={{
              borderColor: "var(--c-divider)",
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--c-bg-warm) 72%, transparent), color-mix(in srgb, var(--c-bg) 46%, transparent))",
            }}
            aria-hidden="true"
          />
        ) : isMobile ? (
          <MobileGalleryRail items={galleryItems} onOpen={setLightboxIndex} />
        ) : (
          <SpatialGallery items={galleryItems} onOpen={setLightboxIndex} />
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            items={galleryItems}
            activeIndex={lightboxIndex}
            onChange={setLightboxIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
