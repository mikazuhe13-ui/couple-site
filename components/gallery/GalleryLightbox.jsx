"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./Gallery.module.css";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGM0U4Ii8+PC9zdmc+";

export default function GalleryLightbox({
  items,
  activeIndex,
  onChange,
  onClose,
}) {
  const reducedMotion = useReducedMotion();
  const closeRef = useRef(null);
  const previousRef = useRef(null);
  const nextRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= items.length) {
      onClose();
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChange((activeIndex - 1 + items.length) % items.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChange((activeIndex + 1) % items.length);
      }
      if (event.key === "Tab") {
        const controls = [closeRef.current, previousRef.current, nextRef.current].filter(Boolean);
        const currentIndex = controls.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + direction + controls.length) % controls.length;
        event.preventDefault();
        controls[nextIndex].focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, items.length, onChange, onClose]);

  if (activeIndex >= items.length) return null;
  const item = items[activeIndex];
  const showPrevious = () =>
    onChange((activeIndex - 1 + items.length) % items.length);
  const showNext = () => onChange((activeIndex + 1) % items.length);

  const handleDragEnd = (_, info) => {
    if (items.length < 2) return;
    const projectedOffset = info.offset.x + info.velocity.x * 0.16;
    if (projectedOffset <= -80) showNext();
    if (projectedOffset >= 80) showPrevious();
  };

  return (
    <motion.div
      className={styles.lightboxBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="照片查看器"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className={`${styles.lightboxButton} ${styles.closeButton}`}
        onClick={onClose}
        aria-label="关闭照片查看器"
      >
        <X aria-hidden="true" size={19} />
      </button>

      {items.length > 1 && (
        <>
          <button
            ref={previousRef}
            type="button"
            className={`${styles.lightboxButton} ${styles.previousButton}`}
            onClick={showPrevious}
            aria-label="上一张照片"
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button
            ref={nextRef}
            type="button"
            className={`${styles.lightboxButton} ${styles.nextButton}`}
            onClick={showNext}
            aria-label="下一张照片"
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </>
      )}

      <motion.div
        className={styles.lightboxPanel}
        key={activeIndex}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.16}
        onDragEnd={handleDragEnd}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 190, damping: 24 }
        }
      >
        <div className={styles.lightboxMat}>
          <div className={styles.lightboxImage}>
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.caption || "我们的纪念照片"}
                fill
                sizes="90vw"
                draggable={false}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: item.gradient || "var(--c-bg-warm)" }}
              />
            )}
          </div>
          {item.caption && <p className={styles.lightboxCaption}>{item.caption}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}
