"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * CanvasVideo — renders video frames on a <canvas> element.
 *
 * WHY: Chinese Android browsers (WeChat X5, QQ, UC) detect <video> tags in
 * the DOM and replace them with a native fullscreen player, destroying the
 * page layout. By loading the video data in JS and drawing frames onto a
 * <canvas>, there is no <video> element for these browsers to hijack.
 *
 * The visual result is identical to a CSS-styled <video> background.
 */
export default function CanvasVideo({
  src,
  poster,
  className = "",
  objectFit = "cover",
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const videoElRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoElRef.current;
    if (!canvas || !video || video.paused || video.ended) {
      if (video && !video.ended) {
        rafRef.current = requestAnimationFrame(draw);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (vw === 0 || vh === 0) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    // Emulate object-fit: cover
    let sx = 0,
      sy = 0,
      sw = vw,
      sh = vh;
    const canvasRatio = cw / ch;
    const videoRatio = vw / vh;

    if (videoRatio > canvasRatio) {
      // Video is wider — crop sides
      sw = vh * canvasRatio;
      sx = (vw - sw) / 2;
    } else {
      // Video is taller — crop top/bottom
      sh = vw / canvasRatio;
      sy = (vh - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Size canvas to container (respecting devicePixelRatio, capped at 2) ──
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // ── Draw poster as initial frame ──
    const ctx = canvas.getContext("2d");
    if (poster) {
      const posterImg = new Image();
      posterImg.crossOrigin = "anonymous";
      posterImg.onload = () => {
        // Draw poster with object-fit: cover
        const pw = posterImg.naturalWidth;
        const ph = posterImg.naturalHeight;
        const cw = canvas.width;
        const ch = canvas.height;
        const canvasRatio = cw / ch;
        const posterRatio = pw / ph;
        let sx = 0, sy = 0, sw = pw, sh = ph;
        if (posterRatio > canvasRatio) {
          sw = ph * canvasRatio;
          sx = (pw - sw) / 2;
        } else {
          sh = pw / canvasRatio;
          sy = (ph - sh) / 2;
        }
        ctx.drawImage(posterImg, sx, sy, sw, sh, 0, 0, cw, ch);
      };
      posterImg.src = poster;
    }

    // ── Create hidden video element (NOT added to DOM) ──
    const video = document.createElement("video");
    videoElRef.current = video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    // X5 attributes on a detached element — belt and suspendors
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("x5-video-player-type", "h5");
    video.setAttribute("x5-video-player-fullscreen", "false");

    // ── Load video via blob URL to avoid X5 network interception ──
    const loadVideo = async () => {
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        video.src = blobUrl;

        video.addEventListener("loadeddata", () => {
          video.play().catch(() => {
            // If play fails, poster stays visible
          });
        });

        video.addEventListener("play", () => {
          rafRef.current = requestAnimationFrame(draw);
        });

        video.addEventListener("ended", () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        });
      } catch {
        // Fetch failed — poster remains visible
      }
    };

    loadVideo();

    // ── Handle resize ──
    const handleResize = () => {
      const r = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * d;
      canvas.height = r.height * d;
    };
    window.addEventListener("resize", handleResize);

    // ── Visibility change: pause/resume ──
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.pause();
      video.removeAttribute("src");
      video.load(); // Release resources
      videoElRef.current = null;
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      // Revoke blob URL
      if (video.src && video.src.startsWith("blob:")) {
        URL.revokeObjectURL(video.src);
      }
    };
  }, [src, poster, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
