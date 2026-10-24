"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HOME_PATH = "/";
const SEEN_KEY = "introSeen";
const OVERLAY_ID = "intro-overlay";
const HIDE_IF_SEEN_SCRIPT = `try{if(window.sessionStorage.getItem("${SEEN_KEY}")!==null){document.getElementById("${OVERLAY_ID}").style.display="none"}}catch(e){}`;
const PLAY_MS = 2000;
const FADE_MS = 500;
const REDUCED_STATIC_MS = 250;
const REDUCED_FADE_MS = 300;
const HARD_UNMOUNT_MS = 4000;

type Phase = "play" | "fade" | "gone";

export default function IntroLoader() {
  const isHome = usePathname() === HOME_PATH;
  const [phase, setPhase] = useState<Phase>("play");

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SEEN_KEY) !== null;
      if (!alreadySeen) window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      alreadySeen = false;
    }
    if (!isHome || alreadySeen) {
      setPhase("gone");
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeAt = prefersReduced ? REDUCED_STATIC_MS : PLAY_MS;
    const fadeLength = prefersReduced ? REDUCED_FADE_MS : FADE_MS;
    const fadeTimer = window.setTimeout(() => setPhase("fade"), fadeAt);
    const goneTimer = window.setTimeout(() => setPhase("gone"), fadeAt + fadeLength);
    const hardTimer = window.setTimeout(() => setPhase("gone"), HARD_UNMOUNT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(goneTimer);
      window.clearTimeout(hardTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isHome]);

  useEffect(() => {
    if (phase === "gone") document.body.style.overflow = "";
  }, [phase]);

  if (!isHome || phase === "gone") return null;

  return (
    <>
    <div
      id={OVERLAY_ID}
      suppressHydrationWarning
      role="status"
      className={`intro-overlay ${phase === "fade" ? "intro-overlay-out" : ""} fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-prime-navy`}
    >
      <span className="sr-only">Loading</span>
      <div aria-hidden="true" className="flex flex-col items-center px-6">
        <Image
          src="/log-w.png"
          alt=""
          width={160}
          height={160}
          priority
          className="intro-logo h-32 w-32 object-contain sm:h-28 sm:w-28"
        />
        <svg
          viewBox="0 0 300 60"
          className="-mt-2 h-auto w-[min(70vw,300px)] overflow-visible"
          fill="none"
        >
          <path
            className="intro-arc"
            d="M10 12 Q150 78 290 12"
            pathLength={1}
            stroke="#1A98FF"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: HIDE_IF_SEEN_SCRIPT }} />
    </>
  );
}
