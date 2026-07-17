"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { getCardPose, mapPointerToStage } from "@/lib/gallery-motion.mjs";
import GalleryFrame from "./GalleryFrame";
import styles from "./Gallery.module.css";

const spring = { stiffness: 90, damping: 22, mass: 0.8 };

export default function SpatialGallery({ items, onOpen }) {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotateX = useSpring(rawRotateX, spring);
  const rotateY = useSpring(rawRotateY, spring);

  const resetStage = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pose = mapPointerToStage({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
    rawX.set(pose.x);
    rawY.set(pose.y);
    rawRotateX.set(pose.rotateX);
    rawRotateY.set(pose.rotateY);
  };

  return (
    <div
      className={styles.stageShell}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetStage}
    >
      <motion.div
        className={styles.stage}
        style={reducedMotion ? undefined : { x, y, rotateX, rotateY }}
      >
        {items.map((item, index) => {
          const pose = getCardPose(index, items.length);
          return (
            <motion.div
              className={styles.stageCard}
              key={item.id || item.image_url || index}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: pose.y + 26, z: pose.z - 18 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, ...pose }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.75,
                delay: index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GalleryFrame
                item={item}
                index={index}
                onOpen={() => onOpen(index)}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
