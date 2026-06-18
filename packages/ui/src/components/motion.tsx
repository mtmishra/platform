"use client";

import React from "react";

// ── Motion System (V3.0) ──────────────────────────────────────────────────────
// GPU-only primitives: animate transform / opacity only (never width/height/top/
// left/background). Respects prefers-reduced-motion. Shared across all surfaces.

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (): void => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// CountUp — animates a number from 0 → value via rAF (updates text, no layout).
export interface CountUpProps {
  value: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Group with the Indian numbering system (en-IN). */
  grouped?: boolean;
  className?: string;
}
export function CountUp({ value, durationMs = 1000, decimals = 0, prefix = "", suffix = "", grouped = true, className = "" }: CountUpProps) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = React.useState(reduced ? value : 0);

  React.useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(value * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduced]);

  const formatted = grouped
    ? display.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : display.toFixed(decimals);

  return <span className={`tabular-nums ${className}`}>{prefix}{formatted}{suffix}</span>;
}

// NumberTicker — alias-style ticker (same engine, snappier default) for KPI values.
export function NumberTicker(props: CountUpProps) {
  return <CountUp durationMs={1200} {...props} />;
}

// RevealOnScroll — fades + lifts content into view (opacity + translateY).
export interface RevealOnScrollProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}
export function RevealOnScroll({ children, delayMs = 0, className = "", as = "div" }: RevealOnScrollProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (reduced) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-normal ease-standard ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

// StaggerContainer — reveals children in sequence with an incremental delay.
export interface StaggerContainerProps {
  children: React.ReactNode;
  stepMs?: number;
  className?: string;
}
export function StaggerContainer({ children, stepMs = 70, className = "" }: StaggerContainerProps) {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <RevealOnScroll key={i} delayMs={i * stepMs}>{child}</RevealOnScroll>
      ))}
    </div>
  );
}

// AnimatedCard — reveal-on-mount + hover lift (transform + shadow only).
export interface AnimatedCardProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}
export function AnimatedCard({ children, delayMs = 0, className = "" }: AnimatedCardProps) {
  return (
    <RevealOnScroll delayMs={delayMs} className="block">
      <div className={`rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 transition-[transform,box-shadow] duration-normal ease-standard hover:-translate-y-0.5 hover:shadow-2 ${className}`}>
        {children}
      </div>
    </RevealOnScroll>
  );
}
