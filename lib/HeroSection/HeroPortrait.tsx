import Image from "next/image";
import React from "react";
import { profileImageUrl } from "../imageUtils";

type PortraitVariant = "recruiter" | "playful";

interface PortraitConfig {
  src: string;
  width: number;
  height: number;
  objectPosition: string;
  frameClass: string;
  tiltClass: string;
  shapeClass: string;
  glowClass: string;
  imageClass: string;
  overlayClass: string;
}

const PORTRAIT_ALT = "Vandit Kala";
const PORTRAIT_SIZES = "(max-width: 768px) 240px, 36vw";
const PLAYFUL_BADGE = "✨";
const MOBILE_FRAME_CLASS = "sm:static sm:mx-auto sm:mt-24 sm:aspect-[3/4] sm:w-[min(240px,70vw)] sm:max-w-none";

const PORTRAITS: Record<PortraitVariant, PortraitConfig> = {
  recruiter: {
    src: profileImageUrl("recruiter"),
    width: 900,
    height: 1252,
    objectPosition: "52% 30%",
    frameClass: `absolute bottom-0 right-[3%] top-24 z-[2] w-[38%] max-w-[560px] ${MOBILE_FRAME_CLASS}`,
    tiltClass: "",
    shapeClass: "rounded-t-[999px] rounded-b-2xl sm:rounded-2xl",
    glowClass: "shadow-[0_0_60px_-10px_rgba(26,152,255,0.45)] ring-prime/60",
    imageClass: "origin-[52%_45%] scale-[1.2] saturate-[0.8] sm:scale-100",
    overlayClass: "bg-gradient-to-t from-prime-navy/70 via-prime-navy/20 to-prime/20 mix-blend-multiply",
  },
  playful: {
    src: profileImageUrl("playful"),
    width: 900,
    height: 1126,
    objectPosition: "60% 30%",
    frameClass: `absolute bottom-0 right-[4%] top-24 z-[2] w-[34%] max-w-[480px] ${MOBILE_FRAME_CLASS}`,
    tiltClass: "rotate-2 sm:rotate-3",
    shapeClass: "rounded-2xl",
    glowClass: "shadow-[0_0_60px_-10px_rgba(167,139,250,0.55)] ring-[rgba(167,139,250,0.7)]",
    imageClass: "",
    overlayClass: "bg-gradient-to-tr from-[rgba(167,139,250,0.22)] via-transparent to-[rgba(244,114,182,0.18)] mix-blend-screen",
  },
};

/**
 * Photo of the site owner layered above the animated hero backdrop. On desktop it sits on the
 * right and fades into the hero; under 768px it becomes a small centred card above the text.
 */
const HeroPortrait = ({ variant }: { variant: PortraitVariant }) => {
  const photo = PORTRAITS[variant];
  return (
    <div className={`portrait-in pointer-events-none ${photo.frameClass}`}>
      <div className={`relative h-full w-full ${photo.tiltClass}`}>
        <div className="hero-portrait-fade h-full w-full">
          <div className={`relative h-full w-full overflow-hidden bg-prime-navy ring-1 ${photo.glowClass} ${photo.shapeClass}`}>
            <Image
              src={photo.src}
              alt={PORTRAIT_ALT}
              width={photo.width}
              height={photo.height}
              sizes={PORTRAIT_SIZES}
              priority
              className={`h-full w-full object-cover ${photo.imageClass}`}
              style={{ objectPosition: photo.objectPosition }}
            />
            <div aria-hidden="true" className={`absolute inset-0 ${photo.overlayClass}`} />
          </div>
        </div>
        {variant === "playful" && (
          <span aria-hidden="true" className="absolute -right-2 top-10 rounded-full bg-white px-3 py-2 text-2xl shadow-lg sm:top-3 sm:text-xl">
            {PLAYFUL_BADGE}
          </span>
        )}
      </div>
    </div>
  );
};

export default HeroPortrait;
