"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* ── Petal factory ── */
function createPetal(W, H, startAbove = false) {
  return {
    x: Math.random() * W,
    y: startAbove ? -(Math.random() * H * 0.5 + 30) : Math.random() * H,
    size: 10 + Math.random() * 18,
    speedY: 0.35 + Math.random() * 0.65,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.018,
    phase: Math.random() * Math.PI * 2,
    swayAmp: 0.4 + Math.random() * 0.7,
    opacity: 0.25 + Math.random() * 0.35,
    hue: 340 + Math.random() * 20,
  };
}

/* ── Draw one petal ── */
function drawPetal(ctx, p) {
  const len = p.size;
  const w = p.size * 0.55;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = `hsl(${p.hue}, 70%, 78%)`;
  ctx.shadowColor = "rgba(242,165,176,0.3)";
  ctx.shadowBlur = p.size * 0.4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(w * 0.6, -len * 0.25, w, -len * 0.55, w * 0.3, -len);
  ctx.bezierCurveTo(0, -len * 0.72, 0, -len * 0.72, -w * 0.3, -len);
  ctx.bezierCurveTo(-w, -len * 0.55, -w * 0.6, -len * 0.25, 0, 0);
  ctx.fill();
  ctx.restore();
}

/* ══════════════════════════════════════════
   Sakura — falling cherry-blossom petals
   ══════════════════════════════════════════ */
export default function Sakura() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  /* Canvas animation loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const saveData = navigator.connection?.saveData;
    if (shouldReduceMotion || saveData) {
      setVisible(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    let raf;
    let petals = [];
    let W, H;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      const n = Math.min(Math.floor(W / 20), 55);
      petals = Array.from({ length: n }, () => createPetal(W, H, true));
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;
      const wind = Math.sin(t * 0.25) * 0.35;

      for (const p of petals) {
        p.y += p.speedY;
        p.x += Math.sin(t * 0.4 + p.phase) * p.swayAmp + wind;
        p.rot += p.rotSpeed;

        if (p.y > H + 30) Object.assign(p, createPetal(W, H, true));
        if (p.x > W + 40) p.x = -40;
        if (p.x < -40) p.x = W + 40;

        drawPetal(ctx, p);
      }
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!raf && document.visibilityState === "visible") {
        raf = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = undefined;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stop();
      } else {
        start();
      }
    };

    init();
    setVisible(true);
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
      }}
    />
  );
}
