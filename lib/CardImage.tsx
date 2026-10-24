"use client";

import Image from "next/image";
import React, { useState } from "react";
import { isLogoImage, isPlaceholderImage } from "./imageUtils";

const TILE_CLASS = "bg-prime-navy";

interface CardImageProps {
  src?: string;
  alt: string;
  sizes: string;
  fallback: React.ReactNode;
  logoClassName?: string;
  priority?: boolean;
  overlay?: React.ReactNode;
  onError?: () => void;
}

/** Fills its positioned parent, so the parent's size reserves the space (no layout shift). */
const CardImage = ({ src, alt, sizes, fallback, logoClassName = "p-4", priority = false, overlay, onError }: CardImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || isPlaceholderImage(src) || failedSrc === src) return <>{fallback}</>;

  const isLogo = isLogoImage(src);
  const handleError = () => {
    setFailedSrc(src);
    onError?.();
  };

  return (
    <div className={`absolute inset-0 ${isLogo ? TILE_CLASS : ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isLogo}
        onError={handleError}
        className={isLogo ? `object-contain ${logoClassName}` : "object-cover"}
      />
      {overlay}
    </div>
  );
};

export default CardImage;
