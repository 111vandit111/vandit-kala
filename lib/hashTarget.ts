export const HASH_WAIT_TIMEOUT_MS = 8000;
export const HASH_RECHECK_DELAY_MS = 300;
export const HASH_CORRECTION_THRESHOLD_PX = 24;

export const getHashTargetId = (hash: string): string | null => {
  if (hash.length < 2) return null;
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }
};

export const shouldCorrectScroll = (targetTopPx: number, scrollMarginPx: number): boolean =>
  Math.abs(targetTopPx - scrollMarginPx) > HASH_CORRECTION_THRESHOLD_PX;
