const HTTP_PROTOCOLS = ["http:", "https:"];

export function safeHttpUrl(value: string | undefined | null): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return HTTP_PROTOCOLS.includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}
