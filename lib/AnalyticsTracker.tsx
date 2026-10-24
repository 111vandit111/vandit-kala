"use client";

import { useEffect } from "react";
import type { ProfileType } from "./server/limits";

const TRACK_URL = "/api/analytics/track";

const AnalyticsTracker = ({ profile }: { profile: ProfileType }) => {
  useEffect(() => {
    const storageKey = `track:${profile}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // storage unavailable (privacy mode): still track once per mount
    }
    fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: profile }),
      keepalive: true,
    }).catch(() => undefined);
  }, [profile]);

  return null;
};

export default AnalyticsTracker;
