export const LINK_TIMEOUT_MS = 8000;
const BROKEN_STATUS_MIN = 400;

export type FetchFn = (url: string, init: { method: string; redirect: "follow"; signal: AbortSignal }) => Promise<{ status: number }>;

export interface LinkResult {
  url: string;
  status?: number;
  error?: string;
  isBroken: boolean;
}

async function request(url: string, method: "HEAD" | "GET", fetchFn: FetchFn): Promise<number> {
  const response = await fetchFn(url, { method, redirect: "follow", signal: AbortSignal.timeout(LINK_TIMEOUT_MS) });
  return response.status;
}

// HEAD first; some hosts reject it, so a failing HEAD is retried once with GET before the link is called broken.
export async function probeUrl(url: string, fetchFn: FetchFn = fetch): Promise<LinkResult> {
  try {
    let status = await request(url, "HEAD", fetchFn);
    if (status >= BROKEN_STATUS_MIN) status = await request(url, "GET", fetchFn);
    return { url, status, isBroken: status >= BROKEN_STATUS_MIN };
  } catch (error) {
    return { url, error: error instanceof Error ? error.message : "request failed", isBroken: true };
  }
}
