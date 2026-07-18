"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Music } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const autoplayAttempted = useRef(false);

  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/bgm.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Sync playing state → play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  // Autoplay on mount; if blocked, start on first user interaction
  useEffect(() => {
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;

    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play().then(() => {
        setPlaying(true);
        cleanup();
      }).catch(() => {
        // Autoplay blocked — wait for first user interaction
      });
    };

    const onInteract = () => {
      audio.play().then(() => {
        setPlaying(true);
      }).catch(() => {});
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("click", onInteract);
      document.removeEventListener("touchstart", onInteract);
      document.removeEventListener("keydown", onInteract);
    };

    // Try autoplay immediately
    tryPlay();

    // If autoplay was blocked, listen for first interaction
    document.addEventListener("click", onInteract, { once: true });
    document.addEventListener("touchstart", onInteract, { once: true });
    document.addEventListener("keydown", onInteract, { once: true });

    return cleanup;
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <motion.button
      className={`fixed z-50 flex items-center justify-center ${
        isMobile
          ? "bottom-4 right-4 w-11 h-11"
          : "bottom-6 right-6 w-11 h-11"
      }`}
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: isMobile ? "none" : "blur(12px)",
        border: "1px solid rgba(201,169,110,0.15)",
      }}
      whileHover={{ scale: 1.08, borderColor: "rgba(201,169,110,0.3)" }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setPlaying(!playing)}
      aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
      aria-pressed={playing}
    >
      <motion.div
        animate={{ rotate: playing && !shouldReduceMotion ? 360 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 4,
          repeat: playing && !shouldReduceMotion ? Infinity : 0,
          ease: "linear",
        }}
      >
        <Music className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} style={{ color: "var(--c-gold-dim)" }} />
      </motion.div>
      {playing && (
        <div className={`absolute ${isMobile ? "-bottom-1" : "-bottom-1.5"} flex gap-0.5`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: "var(--c-gold-dim)" }}
              animate={{
                height: shouldReduceMotion ? 2 : [2, 6, 2],
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                repeat: shouldReduceMotion ? 0 : Infinity,
                delay: shouldReduceMotion ? 0 : i * 0.15,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}
