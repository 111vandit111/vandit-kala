export class AdminApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.details = details;
  }
}

const HTTP_UNAUTHORIZED = 401;
const GENERIC_ERROR = "Something went wrong. Please try again.";

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Calls an admin API route and returns the parsed JSON body (e.g. `{ data }` or `{ data, page, pageSize, total }`). */
export async function adminFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers, credentials: "same-origin" });
  } catch {
    throw new AdminApiError(0, "Network error. Check your connection and try again.");
  }

  if (response.status === HTTP_UNAUTHORIZED) {
    window.location.assign("/");
    throw new AdminApiError(HTTP_UNAUTHORIZED, "Session expired");
  }

  const body = await readJson(response);
  if (!response.ok) {
    const message = typeof body.error === "string" ? body.error : GENERIC_ERROR;
    throw new AdminApiError(response.status, message, body.details);
  }
  return body as T;
}
