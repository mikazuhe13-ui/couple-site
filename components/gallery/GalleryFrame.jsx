"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import styles from "./Gallery.module.css";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGM0U4Ii8+PC9zdmc+";

const SAKURA_BG = "/sakura-bg.png";

export default function GalleryFrame({ item, index, onOpen }) {
  const reducedMotion = useReducedMotion();
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const glareXPercent = useMotionTemplate`${glareX}%`;
  const glareYPercent = useMotionTemplate`${glareY}%`;

  const width = item.width || 900;
  const height = item.height || 1200;
  const aspectRatio = `${width} / ${height}`;
  const hasSakuraBg = index >= 2;

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glareX.set(((event.clientX - rect.left) / rect.width) * 100);
    glareY.set(((event.clientY - rect.top) / rect.height) * 100);
    glareOpacity.set(1);
  };

  return (
    <motion.button
      type="button"
      className={styles.card}
      onClick={onOpen}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => glareOpacity.set(0)}
      aria-label={`查看照片：${item.caption || `第 ${index + 1} 张照片`}`}
      whileHover={reducedMotion ? undefined : { y: -8, scale: 1.025, z: 34 }}
      whileFocus={reducedMotion ? undefined : { y: -5, scale: 1.015, z: 24 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 170, damping: 23, mass: 0.7 }}
      style={{
        "--glare-x": glareXPercent,
        "--glare-y": glareYPercent,
        "--glare-opacity": glareOpacity,
      }}
    >
      <span className={styles.frameOuter}>
        <span className={styles.frameBevel}>
          <span
            className={styles.frameMat}
            style={hasSakuraBg ? { position: "relative", overflow: "hidden" } : undefined}
          >
            {hasSakuraBg && (
              <Image
                src={SAKURA_BG}
                alt=""
                fill
                sizes="(max-width: 767px) 78vw, (max-width: 1199px) 30vw, 24vw"
                className="absolute inset-0"
                style={{ objectFit: "cover", zIndex: 0 }}
                aria-hidden="true"
              />
            )}
            <span className={styles.photo} style={{ position: "relative", zIndex: 1, aspectRatio }}>
              {item.image_url ? (
                <Image
                  className={styles.photoImage}
                  src={item.image_url}
                  alt={item.caption || "我们的纪念照片"}
                  fill
                  sizes="(max-width: 767px) 78vw, (max-width: 1199px) 30vw, 24vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: item.gradient || "var(--c-bg-warm)" }}
                />
              )}
            </span>
          </span>
        </span>
        <motion.span className={styles.glare} aria-hidden="true" />
      </span>
      {item.caption && <span className={styles.plaque}>{item.caption}</span>}
    </motion.button>
  );
}
