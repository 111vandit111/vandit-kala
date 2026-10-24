"use client";

import React, { useEffect, useRef } from "react";
import { startHeroBackdrop } from "./heroBackdropController";
import { flatMask, maskGradient, VARIANTS, type HeroBackdropVariant } from "./heroBackdropScene";

export type { HeroBackdropVariant };

interface HeroBackdropProps {
  variant: HeroBackdropVariant;
  className?: string;
}

/**
 * Original hero artwork: a drifting network graph that now and then runs a breadth-first
 * path search. Fills its positioned parent; decorative only.
 */
const HeroBackdrop = ({ variant, className = "" }: HeroBackdropProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = VARIANTS[variant];

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    return startHeroBackdrop(canvas, host, variant);
  }, [variant]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ background: config.fallbackBackground }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 sm:hidden" style={{ background: maskGradient(config.maskRgb) }} />
      <div className="absolute inset-0 hidden sm:block" style={{ background: flatMask(config.maskRgb) }} />
    </div>
  );
};

export default HeroBackdrop;
