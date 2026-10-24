"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getHashTargetId,
  HASH_RECHECK_DELAY_MS,
  HASH_WAIT_TIMEOUT_MS,
  shouldCorrectScroll,
} from "./hashTarget";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const scrollToTarget = (element: HTMLElement, isHistoryNavigation: boolean) => {
  const isInstant = isHistoryNavigation || window.matchMedia(REDUCED_MOTION_QUERY).matches;
  element.scrollIntoView({ behavior: isInstant ? "auto" : "smooth", block: "start" });
};

const getScrollMarginTop = (element: HTMLElement): number =>
  parseFloat(getComputedStyle(element).scrollMarginTop) || 0;

/** Scrolls to the URL hash target, waiting for streamed content to render it. */
const HashScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    let observer: MutationObserver | null = null;
    let giveUpTimer: number | undefined;
    let recheckTimer: number | undefined;
    let isHistoryNavigation = false;

    const stopWaiting = () => {
      observer?.disconnect();
      observer = null;
      window.clearTimeout(giveUpTimer);
    };

    const recheck = (id: string) => {
      const element = document.getElementById(id);
      if (!element) return;
      if (shouldCorrectScroll(element.getBoundingClientRect().top, getScrollMarginTop(element))) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
      }
    };

    const tryScroll = (id: string): boolean => {
      const element = document.getElementById(id);
      if (!element) return false;
      stopWaiting();
      scrollToTarget(element, isHistoryNavigation);
      recheckTimer = window.setTimeout(() => recheck(id), HASH_RECHECK_DELAY_MS);
      return true;
    };

    const run = () => {
      stopWaiting();
      window.clearTimeout(recheckTimer);
      const id = getHashTargetId(window.location.hash);
      if (!id || tryScroll(id)) return;
      observer = new MutationObserver(() => {
        tryScroll(id);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      giveUpTimer = window.setTimeout(stopWaiting, HASH_WAIT_TIMEOUT_MS);
    };

    const handlePopState = () => {
      isHistoryNavigation = true;
    };

    run();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", run);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", run);
      stopWaiting();
      window.clearTimeout(recheckTimer);
    };
  }, [pathname]);

  return null;
};

export default HashScroll;
