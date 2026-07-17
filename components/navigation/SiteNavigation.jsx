"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";

export default function SiteNavigation({ links }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const triggerRef = useRef(null);
  const firstLinkRef = useRef(null);
  const dialogRef = useRef(null);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const scrollTo = useCallback(
    (id, restoreFocus = false) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      closeMenu(restoreFocus);
    },
    [closeMenu, shouldReduceMotion]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => firstLinkRef.current?.focus());
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!dialogRef.current.contains(document.activeElement)) {
          event.preventDefault();
          firstElement?.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <motion.nav
        aria-label="主导航"
        className="fixed top-0 z-50 w-full px-5 py-2.5 md:px-6 md:py-3"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.8, delay: 0.35 }
        }
        style={{
          backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "blur(8px)",
          background: scrolled ? "rgba(255,251,245,0.92)" : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--c-divider)"
            : "1px solid transparent",
          transition:
            "background 0.5s, border-bottom 0.5s, backdrop-filter 0.5s",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="group flex min-h-11 items-center gap-2 px-1"
            aria-label="返回页面顶部"
          >
            <Heart
              aria-hidden="true"
              className="h-3 w-3 fill-current"
              style={{ color: "var(--c-rose)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.2em] md:text-sm"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--c-warm)",
              }}
            >
              Our Story
            </span>
          </button>

          <div className="hidden items-center gap-4 md:flex">
            {links.map(({ id, label }) => (
              <motion.button
                type="button"
                key={id}
                onClick={() => scrollTo(id)}
                className="group relative min-h-11 px-2 text-[10px] uppercase tracking-[0.25em]"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--c-warm-muted)",
                  fontWeight: 400,
                }}
              >
                {label}
                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-2 right-2 h-px origin-left"
                  style={{ background: "var(--c-gold)" }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          <button
            ref={triggerRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
          >
            <Menu
              aria-hidden="true"
              className="h-5 w-5"
              style={{ color: "var(--c-warm)" }}
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={dialogRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="导航菜单"
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
            style={{
              background: "rgba(255,251,245,0.97)",
              backdropFilter: "blur(20px)",
            }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          >
            <button
              type="button"
              className="absolute right-5 top-2.5 flex h-11 w-11 items-center justify-center"
              onClick={() => closeMenu()}
              aria-label="关闭导航菜单"
            >
              <X
                aria-hidden="true"
                className="h-5 w-5"
                style={{ color: "var(--c-warm)" }}
              />
            </button>

            <nav
              className="flex w-full max-w-xs flex-col items-stretch gap-2"
              aria-label="章节导航"
            >
              {links.map(({ id, label }, index) => (
                <motion.button
                  ref={index === 0 ? firstLinkRef : undefined}
                  type="button"
                  key={id}
                  onClick={() => scrollTo(id, true)}
                  className="min-h-11 px-5 py-2 text-xl tracking-wider"
                  style={{
                    fontFamily: "var(--font-cn)",
                    color: "var(--c-warm)",
                    fontWeight: 300,
                  }}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 15 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { delay: index * 0.05 }
                  }
                >
                  {label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
