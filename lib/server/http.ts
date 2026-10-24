import { NextResponse } from "next/server";
import { Types } from "mongoose";
import type { ZodType } from "zod";
import { MAX_BODY_BYTES, PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from "./limits";

export type FieldIssue = { field: string; message: string };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function okList<T>(data: T[], meta: { page: number; pageSize: number; total: number }) {
  return NextResponse.json({ data, ...meta });
}

export function fail(status: number, error: string, details?: FieldIssue[]) {
  return NextResponse.json(details ? { error, details } : { error }, { status });
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

export type ParseResult<T> = { ok: true; value: T } | { ok: false; response: NextResponse };

export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<ParseResult<T>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, response: fail(415, "Content-Type must be application/json") };
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, "Request body too large") };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, "Request body too large") };
  }
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, response: fail(400, "Invalid JSON") };
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { ok: false, response: fail(400, "Validation failed", details) };
  }
  return { ok: true, value: parsed.data };
}

export function handleError(route: string, err: unknown) {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error(`[${route}] ${message}`);
  return fail(500, "Internal server error");
}

function toPositiveInt(raw: string | null, fallback: number): number {
  const value = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(value) && value >= 1 ? value : fallback;
}

export function parsePagination(url: URL): { page: number; pageSize: number } {
  const page = toPositiveInt(url.searchParams.get("page"), 1);
  const pageSize = Math.min(toPositiveInt(url.searchParams.get("pageSize"), PAGE_SIZE_DEFAULT), PAGE_SIZE_MAX);
  return { page, pageSize };
}

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id.toLowerCase();
}
