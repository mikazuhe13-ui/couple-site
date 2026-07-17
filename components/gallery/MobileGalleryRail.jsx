"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GalleryFrame from "./GalleryFrame";
import styles from "./Gallery.module.css";

const getStep = () =>
  typeof window === "undefined" ? 320 : Math.min(window.innerWidth * 0.78, 336) + 16;

export default function MobileGalleryRail({ items, onOpen }) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(getStep);

  useEffect(() => {
    const handleResize = () => setStep(getStep());
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
  };

  const handleDragEnd = (_, info) => {
    const projected = info.offset.x + info.velocity.x * 0.12;
    const delta = Math.round(-projected / step);
    moveTo(activeIndex + delta);
  };

  return (
    <div>
      <div className={styles.railViewport}>
        <motion.div
          className={styles.rail}
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          animate={{ x: -(activeIndex * step) }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 180, damping: 24, mass: 0.85 }
          }
        >
          {items.map((item, index) => (
            <motion.div
              className={styles.railCard}
              key={item.id || item.image_url || index}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: index === activeIndex ? 1 : 0.92,
                      rotateY: index === activeIndex ? 0 : index < activeIndex ? 7 : -7,
                      opacity: Math.abs(index - activeIndex) > 1 ? 0.58 : 1,
                    }
              }
              transition={{ type: "spring", stiffness: 150, damping: 23 }}
              style={{ transformPerspective: 900 }}
            >
              <GalleryFrame
                item={item}
                index={index}
                onOpen={() => onOpen(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className={styles.railControls} aria-label="相册导航">
        <button
          type="button"
          className={styles.railButton}
          onClick={() => moveTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="上一张照片"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>
        <span className={styles.railStatus} aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className={styles.railButton}
          onClick={() => moveTo(activeIndex + 1)}
          disabled={activeIndex === items.length - 1}
          aria-label="下一张照片"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
