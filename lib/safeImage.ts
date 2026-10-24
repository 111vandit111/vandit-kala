import { safeHttpsUrl } from "./safeUrl";

/** Accepts a same-site path (single leading "/") or an https URL; everything else becomes "". */
export function safeImageSrc(value: string | undefined | null): string {
  if (!value) return "";
  const src = value.trim();
  if (src.startsWith("/")) {
    const unsafe = src.startsWith("//") || src.includes("\\") || /[\u0000-\u001f]/.test(src) || src.split(/[/?#]/).includes("..");
    return unsafe ? "" : src;
  }
  return safeHttpsUrl(src);
}
